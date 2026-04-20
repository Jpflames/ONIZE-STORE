import { Metadata } from "@/actions/createCheckoutSession";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("x-paystack-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret =
    process.env.PAYSTACK_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Paystack secret key is not set" },
      { status: 400 },
    );
  }

  const expectedSignature = crypto
    .createHmac("sha512", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== sig) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    event = JSON.parse(body);
  } catch (error) {
    console.error("Webhook payload parsing failed:", error);
    return NextResponse.json(
      { error: `Webhook Error: ${error}` },
      { status: 400 },
    );
  }

  if (event.event === "charge.success") {
    try {
      await updateOrderAfterPayment(event.data);
    } catch (error) {
      console.error("Error updating order in sanity:", error);
      return NextResponse.json(
        { error: `Error updating order: ${error}` },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateOrderAfterPayment(transaction: any) {
  const { id, reference, metadata } = transaction;

  const { orderNumber } = metadata as unknown as Metadata;

  // Try to find and update the existing pending order first
  const existingOrder = await backendClient.fetch(
    `*[_type == "order" && orderNumber == $orderNumber][0]`,
    { orderNumber },
  );

  if (existingOrder) {
    // Update the existing pending order with payment details
    await backendClient
      .patch(existingOrder._id)
      .set({
        stripeCheckoutSessionId: reference || String(id),
        stripePaymentIntentId: String(id),
        paymentStatus: "paid",
      })
      .commit();
  } else {
    // This case should theoretically not happen if the pending order was created successfully
    console.warn(`Pending order not found for orderNumber: ${orderNumber}`);
  }
}
