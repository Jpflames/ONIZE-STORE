import { backendClient } from "@/sanity/lib/backendClient";

type FlutterwaveVerifyResponse = {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
    customer?: { email?: string; name?: string };
  };
};

export async function verifyFlutterwaveTransaction(transactionId: number) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
  }

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as FlutterwaveVerifyResponse;
  if (!response.ok || payload.status !== "success" || !payload.data) {
    throw new Error(payload.message || "Transaction verification failed");
  }

  return payload.data;
}

export async function finalizePaidOrder(args: {
  orderNumber: string;
  txRef: string;
  transactionId: number;
  amount: number;
  currency: string;
}) {
  const { orderNumber, txRef, transactionId, amount, currency } = args;

  const order = await backendClient.fetch<{
    _id: string;
    totalPrice?: number;
    currency?: string;
    paymentStatus?: string;
    flutterwaveTxRef?: string;
  } | null>(
    `*[_type == "order" && orderNumber == $orderNumber][0]{
      _id,totalPrice,currency,paymentStatus,flutterwaveTxRef
    }`,
    { orderNumber },
  );

  if (!order?._id) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "paid") {
    return { updated: false, reason: "already_paid" as const };
  }

  const expectedAmount = Number(order.totalPrice ?? 0);
  if (Math.abs(expectedAmount - Number(amount)) > 0.01) {
    throw new Error("Amount mismatch");
  }

  if ((order.currency ?? "usd").toUpperCase() !== currency.toUpperCase()) {
    throw new Error("Currency mismatch");
  }

  if (order.flutterwaveTxRef && order.flutterwaveTxRef !== txRef) {
    throw new Error("Transaction reference mismatch");
  }

  await backendClient
    .patch(order._id)
    .set({
      paymentStatus: "paid",
      flutterwaveTransactionId: String(transactionId),
      flutterwaveTxRef: txRef,
    })
    .commit();

  return { updated: true as const };
}
