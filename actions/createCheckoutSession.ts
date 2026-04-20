"use server";

import { urlFor } from "@/sanity/lib/image";
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
  try {
    // Validate if any grouped items don't have a price
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    const orderMetadata = {
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,
      items: items.map((item) => ({
        id: item.product._id,
        name: item.product.name || "Unnamed Product",
        description: item.product.description,
        image:
          item.product.images && item.product.images.length > 0
            ? urlFor(item.product.images[0]).url()
            : undefined,
        quantity: item.quantity,
        unitAmount: Math.round(item.product.price! * 100),
      })),
    };

    const amount = items.reduce(
      (sum, item) => sum + Math.round(item.product.price! * 100) * item.quantity,
      0,
    );

    const paystackSecretKey =
      process.env.PAYSTACK_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    if (!paystackSecretKey) {
      throw new Error("PAYSTACK_SECRET_KEY is not set");
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: metadata.customerEmail,
        amount,
        currency: "NGN",
        callback_url: `${
          process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`
        }/success?orderNumber=${metadata.orderNumber}`,
        metadata: orderMetadata,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result?.status || !result?.data?.authorization_url) {
      throw new Error(result?.message || "Failed to initialize Paystack transaction");
    }

    return result.data.authorization_url as string;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
