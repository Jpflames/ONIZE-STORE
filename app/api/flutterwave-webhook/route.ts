import { finalizePaidOrder, verifyFlutterwaveTransaction } from "@/lib/flutterwave";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type FlutterwaveWebhook = {
  event?: string;
  data?: {
    id?: number;
    tx_ref?: string;
    status?: string;
  };
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as FlutterwaveWebhook;
  const headersList = await headers();
  const signature = headersList.get("verif-hash");
  const secretHash =
    process.env.FLUTTERWAVE_SECRET_HASH || process.env.FLUTTERWAVE_SECRET_KEY;

  if (!secretHash || !signature || signature !== secretHash) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  if (body.event !== "charge.completed" || !body.data?.id || !body.data?.tx_ref) {
    return NextResponse.json({ received: true });
  }

  try {
    const verification = await verifyFlutterwaveTransaction(body.data.id);
    if (verification.status !== "successful") {
      return NextResponse.json({ received: true });
    }

    const orderNumber = verification.tx_ref.split("-")[0];
    if (!orderNumber) {
      return NextResponse.json({ error: "Invalid tx_ref format" }, { status: 400 });
    }

    await finalizePaidOrder({
      orderNumber,
      txRef: verification.tx_ref,
      transactionId: verification.id,
      amount: verification.amount,
      currency: verification.currency,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 400 },
    );
  }
}
