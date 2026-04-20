"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { CreditCard } from "lucide-react";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import toast from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PayNowButton({ order }: { order: any }) {
  const [isPending, setIsPending] = useState(false);

  const handlePayNow = async () => {
    try {
      setIsPending(true);

      if (!order.products || order.products.length === 0) {
        toast.error("No products in this order to pay for.");
        setIsPending(false);
        return;
      }

      // Group products into CartItem-like structure required by action
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = order.products.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
      }));

      const metadata: Metadata = {
        orderNumber: order.orderNumber,
        customerName: order.customerName || "Unknown Customer",
        customerEmail: order.email || "",
        clerkUserId: order.clerkUserId || "",
      };

      const checkoutUrl = await createCheckoutSession(items, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("Failed to generate checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Error initializing checkout. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      onClick={handlePayNow}
      disabled={isPending}
      className="gap-2 shrink-0 bg-primary hover:bg-primary/90 min-w-[120px]"
    >
      <CreditCard className="w-4 h-4" />
      {isPending ? "Processing..." : "Pay Now"}
    </Button>
  );
}
