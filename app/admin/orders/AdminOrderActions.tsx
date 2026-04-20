"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateOrderStatus, deleteOrder } from "@/actions/admin.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  orderStatusOptions: string[];
  paymentStatusOptions: string[];
}

export default function AdminOrderActions({
  orderId,
  currentStatus,
  currentPaymentStatus,
  orderStatusOptions,
  paymentStatusOptions,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orderStatus, setOrderStatus] = useState(currentStatus ?? "pending");
  const [paymentStatus, setPaymentStatus] = useState(
    currentPaymentStatus ?? "pending",
  );

  const handleOrderStatus = (val: string) => {
    setOrderStatus(val);
    startTransition(async () => {
      await updateOrderStatus(orderId, "status", val);
      toast.success("Order status updated");
    });
  };

  const handlePaymentStatus = (val: string) => {
    setPaymentStatus(val);
    startTransition(async () => {
      await updateOrderStatus(orderId, "paymentStatus", val);
      toast.success("Payment status updated");
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteOrder(orderId);
      toast.success("Order deleted");
      router.refresh();
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-3">
      {/* Order status */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground font-medium">
          Order:
        </label>
        <select
          value={orderStatus}
          onChange={(e) => handleOrderStatus(e.target.value)}
          disabled={isPending}
          className="text-xs border border-border bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {orderStatusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Payment status */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground font-medium">
          Payment:
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => handlePaymentStatus(e.target.value)}
          disabled={isPending}
          className="text-xs border border-border bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {paymentStatusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="ml-auto gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </Button>
    </div>
  );
}
