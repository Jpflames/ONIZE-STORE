"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");
    const resolvedOrderId = orderId || orderNumber || "";
    const resolvedTxRef = tx_ref || (orderNumber ? `${orderNumber}` : "");

    const qs = new URLSearchParams();
    if (resolvedTxRef) qs.set("tx_ref", resolvedTxRef);
    if (resolvedOrderId) qs.set("orderId", resolvedOrderId);
    router.replace(`/payment-success?${qs.toString()}`);
  }, [router, searchParams]);

  return null;
}
