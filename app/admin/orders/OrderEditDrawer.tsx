"use client";

import { useState, useTransition } from "react";
import { X, Package, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { updateOrderStatus, deleteOrder } from "@/actions/admin.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";

const ORDER_STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "packed",
  "delivering",
  "delivered",
  "complete",
];
const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "cancelled"];

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  packed: "bg-purple-50 text-purple-700 border-purple-200",
  delivering: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  complete: "bg-green-50 text-green-700 border-green-200",
};
const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props {
  order: any;
  onClose: () => void;
}

export default function OrderEditDrawer({ order, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [orderStatus, setOrderStatus] = useState(order.status ?? "pending");
  const [paymentStatus, setPaymentStatus] = useState(
    order.paymentStatus ?? "pending",
  );

  const handleUpdate = () => {
    startTransition(async () => {
      await updateOrderStatus(order._id, "status", orderStatus);
      await updateOrderStatus(order._id, "paymentStatus", paymentStatus);
      toast.success("Order updated");
      router.refresh();
      onClose();
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteOrder(order._id);
      toast.success("Order deleted");
      router.refresh();
      onClose();
    });
  };

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l border-border bg-background hide-close-button-optional z-50 shadow-xl overflow-hidden [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-muted-foreground" />
            <div>
              <SheetTitle className="text-sm font-semibold font-mono">
                #{order.orderNumber?.slice(-12)}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Order Details
              </SheetDescription>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors delay-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Customer info */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Customer
            </p>
            <div className="border border-border p-4 space-y-1.5">
              <p className="text-sm font-semibold">
                {order.customerName ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.email ?? "—"}
              </p>
              {order.phone && (
                <p className="text-xs text-muted-foreground">{order.phone}</p>
              )}
            </div>
          </div>

          {/* Order meta */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Order Info
            </p>
            <div className="border border-border p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {order.orderDate
                    ? format(new Date(order.orderDate), "dd MMM yyyy, HH:mm")
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{order.itemCount ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-base">
                  ${order.totalPrice?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Current status badges */}
          <div className="flex gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 border uppercase tracking-wide ${
                PAYMENT_STATUS_STYLES[order.paymentStatus] ??
                "bg-muted text-muted-foreground border-border"
              }`}
            >
              {order.paymentStatus ?? "—"}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 border uppercase tracking-wide ${
                ORDER_STATUS_STYLES[order.status] ??
                "bg-muted text-muted-foreground border-border"
              }`}
            >
              {order.status ?? "—"}
            </span>
          </div>

          {/* Editable fields */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Update Status
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">
                  Order Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  disabled={isPending}
                  className="w-full text-sm border border-border bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium block mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  disabled={isPending}
                  className="w-full text-sm border border-border bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3">
          <Button
            onClick={handleUpdate}
            disabled={isPending}
            className="flex-1 gap-2"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Saving…" : "Update Order"}
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2 text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
