import { finalizePaidOrder, verifyFlutterwaveTransaction } from "@/lib/flutterwave";
import { NextRequest, NextResponse } from "next/server";

type VerifyRequestBody = {
  transaction_id?: number | string;
  orderNumber?: string;
  tx_ref?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyRequestBody;
    const transactionId = Number(body.transaction_id);

    if (!Number.isFinite(transactionId)) {
      return NextResponse.json(
        { error: "transaction_id is required" },
        { status: 400 },
      );
    }

    const verification = await verifyFlutterwaveTransaction(transactionId);

    if (verification.status !== "successful") {
      return NextResponse.json(
        { error: "Payment was not successful" },
        { status: 400 },
      );
    }

    const orderNumber =
      body.orderNumber ?? verification.tx_ref.split("-")[0] ?? undefined;
    if (!orderNumber) {
      return NextResponse.json(
        { error: "Unable to resolve order number" },
        { status: 400 },
      );
    }

    const txRef = body.tx_ref ?? verification.tx_ref;
    await finalizePaidOrder({
      orderNumber,
      txRef,
      transactionId: verification.id,
      amount: verification.amount,
      currency: verification.currency,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 400 },
    );
  }
}
