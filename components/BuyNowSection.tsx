"use client";

import { createPendingOrder } from "@/actions/createPendingOrder";
import useLoginSidebar from "@/hooks/useLoginSidebar";
import { Product } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import AddressSelection from "@/components/new/AddressSelection";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import { CreditCard } from "lucide-react";

const SHIPPING_FEE_NIGERIA = 20;
const SHIPPING_FEE_INTERNATIONAL = 40;
const FLUTTERWAVE_PAYMENT_EMAIL = "onizecrochetspayment2@gmail.com";

function isNigeria(country?: string) {
  const c = (country ?? "").trim().toLowerCase();
  return c === "nigeria" || c === "ng";
}

export default function BuyNowSection({ product }: { product: Product }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { open: openLoginSidebar } = useLoginSidebar();

  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [flutterwaveConfig, setFlutterwaveConfig] = useState<{
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: { email: string; name: string; phone_number: string };
    customizations: { title: string; description: string; logo: string };
  } | null>(null);
  const [paymentOrderContext, setPaymentOrderContext] = useState<{
    orderNumber: string;
    txRef: string;
  } | null>(null);

  const handleFlutterPayment = useFlutterwave(
    flutterwaveConfig ?? ({} as never),
  );

  const shippingCost = useMemo(() => {
    if (!selectedAddress) return 0;
    return isNigeria(selectedAddress.country)
      ? SHIPPING_FEE_NIGERIA
      : SHIPPING_FEE_INTERNATIONAL;
  }, [selectedAddress]);

  const orderTotal = Number((Number(product.price ?? 0) + shippingCost).toFixed(2));

  useEffect(() => {
    // If the URL contains buyNow=1 (from ProductCard), bring the Buy Now block into view.
    const buyNow =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("buyNow") === "1";
    if (buyNow) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    if (!flutterwaveConfig || !paymentOrderContext) return;

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
              tx_ref: paymentOrderContext.txRef,
              orderNumber: paymentOrderContext.orderNumber,
            }),
          });

          if (!verifyRes.ok) {
            toast.error("Payment verification failed");
            return;
          }

          toast.success("Payment successful");
          window.location.href = `/success?orderNumber=${paymentOrderContext.orderNumber}`;
        } catch {
          toast.error("Unable to verify payment");
        } finally {
          closePaymentModal();
          setFlutterwaveConfig(null);
          setPaymentOrderContext(null);
          setLoading(false);
        }
      },
      onClose: () => {
        setFlutterwaveConfig(null);
        setPaymentOrderContext(null);
        setLoading(false);
      },
    });
  }, [flutterwaveConfig, paymentOrderContext, handleFlutterPayment]);

  const handleBuyNow = async () => {
    if (!isSignedIn) {
      openLoginSidebar();
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY) {
      toast.error("Payment gateway is not configured");
      return;
    }

    if (!product?._id) {
      toast.error("Product is missing an id");
      return;
    }

    if (!product?.price) {
      toast.error("This product has no price");
      return;
    }

    setLoading(true);
    try {
      const orderNumber = crypto.randomUUID();
      const customerEmail = user?.emailAddresses[0]?.emailAddress ?? "Unknown";
      const txRef = `${orderNumber}-${crypto.randomUUID()}`;

      await createPendingOrder({
        orderNumber,
        txRef,
        shippingAmount: shippingCost,
        customerName: selectedAddress.fullName,
        customerEmail,
        clerkUserId: user!.id,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        items: [{ product, quantity: 1 }],
      });

      setFlutterwaveConfig({
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
        tx_ref: txRef,
        amount: Number(orderTotal.toFixed(2)),
        currency: "USD",
        payment_options: "card,banktransfer,ussd",
        customer: {
          email: FLUTTERWAVE_PAYMENT_EMAIL,
          name: selectedAddress.fullName,
          phone_number:
            selectedAddress.phone_number ||
            selectedAddress.phoneNumber ||
            selectedAddress.phone ||
            "",
        },
        customizations: {
          title: "ONIZE Checkout",
          description: `Order ${orderNumber}`,
          logo:
            process.env.NEXT_PUBLIC_FLUTTERWAVE_LOGO_URL ||
            "https://onize.reactbd.com/logo.png",
        },
      });
      setPaymentOrderContext({ orderNumber, txRef });
    } catch {
      toast.error("Could not start checkout");
      setLoading(false);
    }
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      {isSignedIn && (
        <div className="max-w-sm">
          <AddressSelection
            onSelect={setSelectedAddress}
            selectedAddress={selectedAddress}
          />
        </div>
      )}

      <Button
        onClick={handleBuyNow}
        disabled={loading || (isSignedIn && !selectedAddress)}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <CreditCard className="w-4 h-4" />
        {loading
          ? "Processing..."
          : isSignedIn
            ? selectedAddress
              ? "Buy Now"
              : "Select Address"
            : "Sign In to Buy"}
      </Button>
    </div>
  );
}

