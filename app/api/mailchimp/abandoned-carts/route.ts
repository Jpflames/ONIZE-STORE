import { backendClient } from "@/sanity/lib/backendClient";
import { addTag } from "@/lib/mailchimp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Find pending orders older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const abandonedOrders = await backendClient.fetch<
      { _id: string; email: string; status: string; createdAt: string }[]
    >(
      `*[_type == "order" && status == "pending" && createdAt < $oneHourAgo]{
        _id,
        email,
        status,
        createdAt
      }`,
      { oneHourAgo }
    );

    const results = [];

    for (const order of abandonedOrders) {
      try {
        await addTag(order.email, "abandoned_cart");
        results.push({
          orderId: order._id,
          email: order.email,
          status: "tagged",
        });
      } catch (error) {
        console.error(`Failed to tag abandoned cart for ${order.email}:`, error);
        results.push({
          orderId: order._id,
          email: order.email,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Abandoned carts processing error:", error);
    return NextResponse.json(
      { error: "Failed to process abandoned carts" },
      { status: 500 }
    );
  }
}