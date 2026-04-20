import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrderById } from "@/sanity/helpers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Circle,
  Truck,
  PackageCheck,
  ClipboardCheck,
  Star,
} from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PayNowButton from "@/components/PayNowButton";

export const metadata = { title: "Order Details | ONIZE" };

// ── Timeline config ───────────────────────────────────────────────────────────
const ORDER_STEPS = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: ClipboardCheck },
  { key: "packed", label: "Packed", icon: PackageCheck },
  { key: "delivering", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  { key: "complete", label: "Complete", icon: Star },
] as const;

const STEP_ORDER = ORDER_STEPS.map((s) => s.key);

const PAYMENT_BADGE: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  paid: "bg-green-50  text-green-700  border-green-200",
  cancelled: "bg-red-50    text-red-700    border-red-200",
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/signin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order: any = await getOrderById(id);
  if (!order) notFound();

  // Security: only the owning user can view their order
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (order.email && email && order.email !== email) notFound();

  const currentStepIdx = STEP_ORDER.indexOf(order.status ?? "pending");

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/user/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary hoverEffect mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="font-mono bg-muted px-2 py-0.5 rounded-sm">
              #{order.orderNumber}
            </span>
            {order.orderDate && (
              <span>
                Placed on{" "}
                {format(new Date(order.orderDate), "MMM dd, yyyy \u00B7 HH:mm")}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {order.paymentStatus && (
            <span
              className={`text-xs font-semibold px-3 py-1.5 border rounded-sm uppercase tracking-wider ${
                PAYMENT_BADGE[order.paymentStatus] ??
                "bg-muted text-muted-foreground border-border"
              }`}
            >
              Wait {order.paymentStatus}
            </span>
          )}
          {order.paymentStatus === "pending" && <PayNowButton order={order} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN - Order Items + Summary */}
        <div className="md:col-span-2 space-y-8">
          {/* ── Order Items ── */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Items Ordered
            </h2>
            <div className="bg-card border border-border divide-y divide-border">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(order.products ?? []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  {item.product?.images?.[0] ? (
                    <div className="w-16 h-16 shrink-0 rounded-sm overflow-hidden bg-muted border border-border/50">
                      <Image
                        src={urlFor(item.product.images[0]).width(128).url()}
                        alt={item.product.name ?? "Product"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 shrink-0 rounded-sm bg-muted border border-border/50 flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium truncate">
                      {item.product?.name ?? "Product"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold">
                      ${((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ${(item.product?.price ?? 0).toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Order Summary ── */}
          <section className="bg-card border border-border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Payment Summary
            </h2>
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  $
                  {(
                    (order.totalPrice ?? 0) + (order.amountDiscount ?? 0)
                  ).toFixed(2)}
                </span>
              </div>
              {order.amountDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>−${order.amountDiscount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 border-t border-border font-bold text-lg">
                <span>Total Amount</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - Timeline + Customer details */}
        <div className="space-y-8">
          {/* ── Status Timeline ── */}
          <section className="bg-card border border-border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Order Status
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-2 bottom-6 w-px bg-border z-0" />

              <ol className="flex flex-col gap-0">
                {ORDER_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <li
                      key={step.key}
                      className="relative flex gap-5 pb-7 last:pb-0"
                    >
                      {/* Icon */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 shrink-0 transition-colors ${
                          isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : isDone
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground/40"
                        }`}
                      >
                        {isDone && !isCurrent ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <Icon className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="mt-1.5 flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            isCurrent
                              ? "text-primary"
                              : isDone
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && order.orderDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(order.orderDate), "MMMM dd, yyyy")}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          {/* ── Customer Details ── */}
          <section className="bg-card border border-border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Customer Data
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Name
                </span>
                <span className="font-medium text-base">
                  {order.customerName ?? "—"}
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <span className="block text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Email
                </span>
                <span className="font-medium">{order.email ?? "—"}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
