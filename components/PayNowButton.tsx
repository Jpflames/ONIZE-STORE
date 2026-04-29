"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CreditCard } from "lucide-react";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import toast from "react-hot-toast";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";

const FLUTTERWAVE_PAYMENT_EMAIL = "onizecrochetspayment2@gmail.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PayNowButton({ order }: { order: any }) {
  const [isPending, setIsPending] = useState(false);
  const [checkoutContext, setCheckoutContext] = useState<{
    orderNumber: string;
    txRef: string;
    email: string;
    customerName: string;
    amount: number;
  } | null>(null);
  const handleFlutterPayment = useFlutterwave(
    checkoutContext
      ? {
          public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
          tx_ref: checkoutContext.txRef,
          amount: checkoutContext.amount,
          currency: "USD",
          payment_options: "card,banktransfer,ussd",
          customer: {
            email: FLUTTERWAVE_PAYMENT_EMAIL,
            name: checkoutContext.customerName,
            phone_number:
              order?.phone_number || order?.phoneNumber || order?.phone || "",
          },
          customizations: {
            title: "ONIZE Checkout",
            description: `Order ${checkoutContext.orderNumber}`,
            logo:
              process.env.NEXT_PUBLIC_FLUTTERWAVE_LOGO_URL ||
              "https://onize.reactbd.com/logo.png",
          },
        }
      : ({} as never),
  );

  useEffect(() => {
    if (!checkoutContext) return;

    handleFlutterPayment({
      callback: async (response) => {
        try {
          if (!response.transaction_id) {
            toast.error("Payment was cancelled");
            return;
          }

          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_id: response.transaction_id,
              tx_ref: checkoutContext.txRef,
              orderNumber: checkoutContext.orderNumber,
            }),
          });

          if (!verifyRes.ok) {
            toast.error("Payment verification failed");
            return;
          }

          toast.success("Payment successful");
          window.location.href = `/success?orderNumber=${checkoutContext.orderNumber}`;
        } catch {
          toast.error("Unable to verify payment");
        } finally {
          closePaymentModal();
          setCheckoutContext(null);
          setIsPending(false);
        }
      },
      onClose: () => {
        setCheckoutContext(null);
        setIsPending(false);
      },
    });
  }, [checkoutContext, handleFlutterPayment]);

  const handlePayNow = async () => {
    try {
      setIsPending(true);
      if (!process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY) {
        toast.error("Payment gateway is not configured.");
        setIsPending(false);
        return;
      }

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

      const txRef = await createCheckoutSession(items, metadata);
      setCheckoutContext({
        orderNumber: order.orderNumber,
        txRef,
        email: metadata.customerEmail,
        customerName: metadata.customerName,
        amount: Number(order.totalPrice ?? 0),
      });
    } catch {
      toast.error("Error initializing checkout. Please try again.");
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
