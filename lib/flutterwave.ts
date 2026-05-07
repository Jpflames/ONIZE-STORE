import { backendClient } from "@/sanity/lib/backendClient";
import { removeTag, addTag } from "@/lib/mailchimp";

type FlutterwaveVerifyByReferenceResponse = {
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

type FlutterwaveInitResponse = {
  status: string;
  message: string;
  data?: {
    link?: string;
  };
};

function getSecretKey() {
  const secretKey = process.env.FLW_SECRET_KEY;
  if (!secretKey) throw new Error("FLW_SECRET_KEY is not configured");
  return secretKey;
}

export async function initiateFlutterwavePayment(args: {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: { email: string; name: string; phone_number: string };
  customization?: { title?: string; description?: string; logo?: string };
}) {
  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: args.tx_ref,
      amount: args.amount,
      currency: args.currency,
      redirect_url: args.redirect_url,
      payment_options: "card,banktransfer,ussd",
      customer: args.customer,
      customizations: args.customization,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as FlutterwaveInitResponse;
  const link = payload.data?.link;
  if (!response.ok || payload.status !== "success" || !link) {
    throw new Error(payload.message || "Unable to initiate payment");
  }

  return { link };
}

export async function finalizePaidOrder(args: {
  orderId: string;
  tx_ref: string;
  transactionId: number;
  amount: number;
  currency: string;
  transactionStatus: string;
}) {
  const { orderId, tx_ref, transactionId, amount, currency, transactionStatus } =
    args;

  const order = await backendClient.fetch<{
    _id: string;
    total?: number;
    status?: string;
    tx_ref?: string;
  } | null>(
    `*[_type == "order" && id == $orderId][0]{
      _id,total,status,tx_ref
    }`,
    { orderId },
  );

  if (!order?._id) {
    throw new Error("Order not found");
  }

  if (order.status === "paid") {
    return { updated: false, reason: "already_paid" as const };
  }

  const expectedAmount = Number(order.total ?? 0);
  if (Math.abs(expectedAmount - Number(amount)) > 0.01) {
    throw new Error("Amount mismatch");
  }

  if (order.tx_ref && order.tx_ref !== tx_ref) {
    throw new Error("Transaction reference mismatch");
  }

  const nextStatus =
    transactionStatus === "successful" ? "paid" : ("failed" as const);

  await backendClient
    .patch(order._id)
    .set({
      status: nextStatus,
      tx_ref,
      transaction: {
        id: transactionId,
        amount,
        currency,
        status: transactionStatus,
      },
    })
    .commit();

  // Update Mailchimp tags for successful payments
  if (nextStatus === "paid" && order.email) {
    try {
      await removeTag(order.email, "abandoned_cart");
      await addTag(order.email, "purchased");
    } catch (error) {
      console.error("Failed to update Mailchimp tags for paid order:", error);
      // Don't fail the payment if Mailchimp update fails
    }
  }

  return { updated: true as const };
}

export async function verifyFlutterwaveByReference(tx_ref: string) {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(
      tx_ref,
    )}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${getSecretKey()}` },
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as FlutterwaveVerifyByReferenceResponse;
  if (!response.ok || payload.status !== "success" || !payload.data) {
    throw new Error(payload.message || "Transaction verification failed");
  }

  return payload.data;
}
