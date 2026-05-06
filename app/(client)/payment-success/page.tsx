"use client";

import useCartStore from "@/store";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Home, ShoppingBag, XCircle } from "lucide-react";

type Order = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: "pending" | "paid" | "failed";
  tx_ref: string;
  createdAt: string;
  items: { quantity: number; product?: { name?: string } }[];
};

const orderQuery = defineQuery(`*[_type == "order" && id == $id][0]{
  id,fullName,email,phone,address,total,status,tx_ref,createdAt,
  items[]{quantity,product-> {name}}
}`);

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get("tx_ref") ?? "";
  const orderId = searchParams.get("orderId") ?? "";
  const resetCart = useCartStore((s) => s.resetCart);

  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "paid" | "failed"
  >("idle");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolvedOrderId = useMemo(() => orderId || tx_ref.split("-")[0] || "", [orderId, tx_ref]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setError(null);
        if (!tx_ref) {
          setVerificationStatus("failed");
          setError("Missing tx_ref. Payment may have been cancelled.");
          return;
        }

        setVerificationStatus("verifying");
        const verifyRes = await fetch(
          `/api/flutterwave/verify?tx_ref=${encodeURIComponent(tx_ref)}&orderId=${encodeURIComponent(
            resolvedOrderId,
          )}`,
          { method: "GET" },
        );

        const verifyJson = (await verifyRes.json()) as { status?: string; error?: string };
        if (!verifyRes.ok) {
          throw new Error(verifyJson.error || "Verification failed");
        }

        const paid = verifyJson.status === "successful";
        setVerificationStatus(paid ? "paid" : "failed");
        if (paid) resetCart();

        if (!resolvedOrderId) return;
        const orderData = await client.fetch<Order | null>(orderQuery, { id: resolvedOrderId });
        if (!cancelled) setOrder(orderData);
      } catch (e) {
        if (cancelled) return;
        setVerificationStatus("failed");
        setError(e instanceof Error ? e.message : "Verification failed");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [tx_ref, resolvedOrderId, resetCart]);

  const isPaid = verificationStatus === "paid";

  return (
    <div className="py-10 bg-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg ${
            isPaid ? "bg-primary" : "bg-destructive"
          }`}
        >
          {isPaid ? (
            <Check className="text-primary-foreground w-12 h-12" />
          ) : (
            <XCircle className="text-destructive-foreground w-12 h-12" />
          )}
        </motion.div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          {verificationStatus === "verifying"
            ? "Verifying Payment..."
            : isPaid
              ? "Payment Successful"
              : "Payment Failed or Cancelled"}
        </h1>

        <div className="space-y-3 mb-8 text-left">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-muted-foreground text-sm">
            Reference: <span className="text-foreground font-semibold">{tx_ref || "—"}</span>
          </p>
          {order?.id && (
            <p className="text-muted-foreground text-sm">
              Order ID: <span className="text-foreground font-semibold">{order.id}</span>
            </p>
          )}
        </div>

        {order && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-8 text-left space-y-3">
            <h2 className="font-semibold text-foreground">Order Summary</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-semibold text-foreground">Name:</span> {order.fullName}
              </p>
              <p>
                <span className="font-semibold text-foreground">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-semibold text-foreground">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="font-semibold text-foreground">Address:</span> {order.address}
              </p>
              <p>
                <span className="font-semibold text-foreground">Total:</span> {order.total}
              </p>
              <p>
                <span className="font-semibold text-foreground">Status:</span> {order.status}
              </p>
            </div>

            {order.items?.length ? (
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Items
                </p>
                <div className="space-y-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {it.product?.name ?? "Product"} × {it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-card text-foreground border border-foreground/10 rounded-lg hover:bg-muted transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

