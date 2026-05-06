import { createPendingOrder } from "@/actions/createPendingOrder";
import { initiateFlutterwavePayment } from "@/lib/flutterwave";
import { backendClient } from "@/sanity/lib/backendClient";
import { NextRequest, NextResponse } from "next/server";

type InitiateBody = {
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items?: { productId?: string; quantity?: number }[];
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InitiateBody;

    const fullName = body.customer?.fullName?.trim() ?? "";
    const email = body.customer?.email?.trim() ?? "";
    const phone = body.customer?.phone?.trim() ?? "";
    const address = body.customer?.address?.trim() ?? "";
    const items = (body.items ?? [])
      .map((i) => ({
        productId: String(i.productId ?? ""),
        quantity: Number(i.quantity ?? 0),
      }))
      .filter((i) => i.productId && Number.isFinite(i.quantity) && i.quantity > 0);

    if (!fullName) return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    if (!email || !isValidEmail(email))
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "phone is required" }, { status: 400 });
    if (!address) return NextResponse.json({ error: "address is required" }, { status: 400 });
    if (!items.length)
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 });

    const products = await backendClient.fetch<
      { _id: string; price?: number }[]
    >(`*[_type=="product" && _id in $ids]{_id,price}`, {
      ids: items.map((i) => i.productId),
    });

    const priceById = new Map(products.map((p) => [p._id, Number(p.price ?? 0)]));
    const total = items.reduce((sum, i) => sum + (priceById.get(i.productId) ?? 0) * i.quantity, 0);

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Invalid total" }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    const tx_ref = `${orderId}-${crypto.randomUUID()}`;

    await createPendingOrder({
      id: orderId,
      tx_ref,
      fullName,
      email,
      phone,
      address,
      total: Number(total.toFixed(2)),
      items: items.map((i) => ({
        product: { _id: i.productId } as never,
        quantity: i.quantity,
      })),
    });

    const origin = req.nextUrl.origin;
    const redirect_url = `${origin}/payment-success?tx_ref=${encodeURIComponent(
      tx_ref,
    )}&orderId=${encodeURIComponent(orderId)}`;

    const { link } = await initiateFlutterwavePayment({
      tx_ref,
      amount: Number(total.toFixed(2)),
      currency: "USD",
      redirect_url,
      customer: {
        email,
        name: fullName,
        phone_number: phone,
      },
      customization: {
        title: "ONIZE Checkout",
        description: `Order ${orderId}`,
        logo:
          process.env.NEXT_PUBLIC_FLW_LOGO_URL ||
          "https://onize.reactbd.com/logo.png",
      },
    });

    return NextResponse.json({ paymentLink: link, orderId, tx_ref });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initiate payment" },
      { status: 400 },
    );
  }
}

