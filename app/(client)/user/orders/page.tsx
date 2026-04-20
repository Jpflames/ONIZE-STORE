import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/helpers";
import Link from "next/link";
import { Package, Eye } from "lucide-react";
import { format } from "date-fns";
import PayNowButton from "@/components/PayNowButton";

export const metadata = { title: "My Orders | ONIZE" };

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  packed: "bg-purple-50 text-purple-700 border-purple-200",
  delivering: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  complete: "bg-green-50 text-green-700 border-green-200",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-50 text-gray-600 border-gray-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default async function UserOrdersPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders: any[] = email ? await getMyOrders(email) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders?.length ?? 0} order{(orders?.length ?? 0) !== 1 ? "s" : ""}{" "}
            total
          </p>
        </div>
        <Link
          href="/shop"
          className="text-sm font-medium hover:text-primary hoverEffect"
        >
          Continue Shopping →
        </Link>
      </div>

      {orders?.length ? (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-border p-5 hover:border-primary/40 hoverEffect group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      Order #{order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.orderDate
                        ? format(new Date(order.orderDate), "dd MMM yyyy")
                        : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.products?.length ?? 0} item
                      {(order.products?.length ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* Payment Status */}
                  {order.paymentStatus && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 border uppercase tracking-wider ${
                        PAYMENT_STATUS_STYLES[order.paymentStatus] ??
                        "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  )}
                  {/* Order Status */}
                  {order.status && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 border uppercase tracking-wider ${
                        ORDER_STATUS_STYLES[order.status] ??
                        "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {order.status}
                    </span>
                  )}
                  <p className="text-sm font-bold">
                    ${order.totalPrice?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Products preview */}
              {order.products && order.products.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {order.products
                      .slice(0, 4)
                      .map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="text-xs text-muted-foreground"
                        >
                          {item.product?.name ?? "Product"}{" "}
                          <span className="font-medium">×{item.quantity}</span>
                        </div>
                      ))}
                    {order.products.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{order.products.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* View button */}
                  <div className="flex items-center gap-3">
                    {order.paymentStatus === "pending" && (
                      <PayNowButton order={order} />
                    )}
                    <Link
                      href={`/user/orders/${order._id}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline hoverEffect shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Order
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-border text-center">
          <Package className="w-10 h-10 text-muted-foreground/30 mb-4" />
          <p className="text-base font-semibold">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Looks like you haven&apos;t placed any orders.
          </p>
          <Link
            href="/shop"
            className="text-sm font-semibold border border-primary px-5 py-2.5 hover:bg-primary hover:text-primary-foreground hoverEffect"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
