import { finalizePaidOrder, verifyFlutterwaveByReference } from "@/lib/flutterwave";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const tx_ref = req.nextUrl.searchParams.get("tx_ref")?.trim() ?? "";
    const orderId = req.nextUrl.searchParams.get("orderId")?.trim() ?? "";

    if (!tx_ref) {
      return NextResponse.json({ error: "tx_ref is required" }, { status: 400 });
    }

    const verification = await verifyFlutterwaveByReference(tx_ref);
    const resolvedOrderId = orderId || verification.tx_ref.split("-")[0] || "";
    if (!resolvedOrderId) {
      return NextResponse.json({ error: "Unable to resolve orderId" }, { status: 400 });
    }

    await finalizePaidOrder({
      orderId: resolvedOrderId,
      tx_ref: verification.tx_ref,
      transactionId: verification.id,
      amount: verification.amount,
      currency: verification.currency,
      transactionStatus: verification.status,
    });

    return NextResponse.json({
      ok: true,
      status: verification.status,
      tx_ref: verification.tx_ref,
      orderId: resolvedOrderId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 400 },
    );
  }
}

