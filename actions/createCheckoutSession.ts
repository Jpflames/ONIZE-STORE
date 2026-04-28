"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { CartItem } from "@/store";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
) {
  const itemsWithoutPrice = items.filter((item) => !item.product.price);
  if (itemsWithoutPrice.length > 0) {
    throw new Error("Some items do not have a price");
  }

  if (!metadata.orderNumber) {
    throw new Error("Order number is required");
  }

  const txRef = `${metadata.orderNumber}-${crypto.randomUUID()}`;

  const existingOrder = await backendClient.fetch<{ _id: string } | null>(
    `*[_type == "order" && orderNumber == $orderNumber][0]{_id}`,
    { orderNumber: metadata.orderNumber },
  );

  if (!existingOrder?._id) {
    throw new Error("Pending order not found");
  }

  await backendClient.patch(existingOrder._id).set({
    flutterwaveTxRef: txRef,
    paymentStatus: "pending",
  }).commit();

  return txRef;
}
