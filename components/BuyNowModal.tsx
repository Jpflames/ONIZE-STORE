"use client";

import { createPendingOrder } from "@/actions/createPendingOrder";
import AddressSelection from "@/components/new/AddressSelection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useLoginSidebar from "@/hooks/useLoginSidebar";
import { Product } from "@/sanity.types";
import { useAuth, useUser } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const SHIPPING_FEE_NIGERIA = 20;
const SHIPPING_FEE_INTERNATIONAL = 40;
const FLUTTERWAVE_PAYMENT_EMAIL = "onizecrochetspayment2@gmail.com";

function isNigeria(country?: string) {
  const c = (country ?? "").trim().toLowerCase();
  return c === "nigeria" || c === "ng";
}

export default function BuyNowModal({
  product,
  triggerVariant = "outline",
  triggerClassName,
}: {
  product: Product;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  triggerClassName?: string;
}) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { open: openLoginSidebar } = useLoginSidebar();

  const [open, setOpen] = useState(false);
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

  const orderTotal = Number(
    (Number(product.price ?? 0) + shippingCost).toFixed(2),
  );

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
          setOpen(false);
        }
      },
      onClose: () => {
        setFlutterwaveConfig(null);
        setPaymentOrderContext(null);
        setLoading(false);
      },
    });
  }, [flutterwaveConfig, paymentOrderContext, handleFlutterPayment]);

  const startCheckout = async () => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          className={triggerClassName}
          onClick={(e) => {
            // Avoid bubbling to parent Links/cards
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          Buy Now
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Buy now</DialogTitle>
          <DialogDescription>
            Select a shipping address, then pay securely via Flutterwave.
          </DialogDescription>
        </DialogHeader>

        {isSignedIn ? (
          <div className="space-y-3">
            <AddressSelection
              onSelect={setSelectedAddress}
              selectedAddress={selectedAddress}
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Please sign in to continue checkout.
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={startCheckout}
            disabled={loading || (isSignedIn && !selectedAddress)}
            className="gap-2"
          >
            <CreditCard className="w-4 h-4" />
            {loading
              ? "Processing..."
              : isSignedIn
                ? selectedAddress
                  ? "Pay now"
                  : "Select address"
                : "Sign in"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

