"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { CartItem } from "@/store";

interface PendingOrderPayload {
  orderNumber: string;
  txRef: string;
  shippingAmount: number;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  items: { product: CartItem["product"]; quantity: number }[];
}

export async function createPendingOrder(payload: PendingOrderPayload) {
  const {
    orderNumber,
    txRef,
    shippingAmount,
    customerName,
    customerEmail,
    clerkUserId,
    items,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
  } = payload;

  const sanityProducts = items.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: item.product._id,
    },
    quantity: item.quantity,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0,
  );
  const totalPrice = subtotal + shippingAmount;

  await backendClient.create({
    _type: "order",
    orderNumber,
    customerName,
    email: customerEmail,
    clerkUserId,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    flutterwaveTxRef: txRef,
    flutterwaveCustomerEmail: customerEmail,
    flutterwaveTransactionId: "",
    currency: "usd",
    amountDiscount: 0,
    products: sanityProducts,
    totalPrice,
    status: "pending",
    paymentStatus: "pending",
    orderDate: new Date().toISOString(),
  });
}
