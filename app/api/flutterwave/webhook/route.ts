import { finalizePaidOrder, verifyFlutterwaveByReference } from "@/lib/flutterwave";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type FlutterwaveWebhookPayload = {
  event?: string;
  data?: {
    id?: number;
    tx_ref?: string;
    status?: string;
  };
};

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const signature = headersList.get("verif-hash");
  const secretHash = process.env.FLW_SECRET_HASH;

  if (!secretHash || !signature || signature !== secretHash) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const body = (await req.json()) as FlutterwaveWebhookPayload;
  const tx_ref = body.data?.tx_ref?.trim();

  // Acknowledge unsupported events quickly.
  if (body.event !== "charge.completed" || !tx_ref) {
    return NextResponse.json({ received: true });
  }

  try {
    const verification = await verifyFlutterwaveByReference(tx_ref);
    const orderId = verification.tx_ref.split("-")[0] || "";
    if (!orderId) return NextResponse.json({ error: "Invalid tx_ref" }, { status: 400 });

    // Idempotency: finalizePaidOrder is a no-op if already paid.
    await finalizePaidOrder({
      orderId,
      tx_ref: verification.tx_ref,
      transactionId: verification.id,
      amount: verification.amount,
      currency: verification.currency,
      transactionStatus: verification.status,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 400 },
    );
  }
}

