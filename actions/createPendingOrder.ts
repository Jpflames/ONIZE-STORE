"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { subscribeUser, addTag } from "@/lib/mailchimp";
import { CartItem } from "@/store";

interface PendingOrderPayload {
  id: string;
  tx_ref: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: { product: CartItem["product"]; quantity: number }[];
  total: number;
}

export async function createPendingOrder(payload: PendingOrderPayload) {
  const {
    id,
    tx_ref,
    fullName,
    email,
    phone,
    address,
    items,
    total,
  } = payload;

  const sanityItems = items.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: item.product._id,
    },
    quantity: item.quantity,
  }));

  await backendClient.create({
    _type: "order",
    id,
    fullName,
    email,
    phone,
    address,
    tx_ref,
    items: sanityItems,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // Subscribe user to Mailchimp and add new_customer tag
  try {
    await subscribeUser({ email, fullName, phone });
    await addTag(email, "new_customer");
  } catch (error) {
    console.error("Failed to subscribe user to Mailchimp:", error);
    // Don't fail the order creation if Mailchimp fails
  }
}
