import { backendClient } from "@/sanity/lib/backendClient";
import { clerkClient } from "@clerk/nextjs/server";
import { format } from "date-fns";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle2,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata = { title: "Admin — Dashboard | ONIZE" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let orders: any[] = [];
  let userCount = 0;
  let fetchError = null;

  try {
    // Fetch all orders
    orders = await backendClient.fetch(
      `*[_type == "order"] | order(orderDate desc){
        _id, orderNumber, customerName, email, orderDate,
        status, paymentStatus, totalPrice,
        "itemCount": count(products)
      }`,
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    fetchError =
      "There was an error connecting to Sanity. Ensure SANITY_API_TOKEN is set.";
  }

  try {
    // Fetch user count
    const clerk = await clerkClient();
    const { totalCount } = await clerk.users.getUserList({ limit: 1 });
    userCount = totalCount;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // Ignore Clerk error but log it, it shouldn't crash the whole page.
  }

  // Ensure orders is an array to prevent crashes
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Compute stats
  const totalRevenue = safeOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);
  const paidOrders = safeOrders.filter(
    (o) => o.paymentStatus === "paid",
  ).length;
  const pendingOrders = safeOrders.filter(
    (o) => o.paymentStatus === "pending",
  ).length;
  const recentOrders = safeOrders.slice(0, 8);

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      sub: `from ${paidOrders} paid orders`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Orders",
      value: safeOrders.length,
      icon: ShoppingBag,
      sub: `${pendingOrders} pending`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Registered Users",
      value: userCount,
      icon: Users,
      sub: "all time",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Avg. Order Value",
      value:
        paidOrders > 0 ? `$${(totalRevenue / paidOrders).toFixed(2)}` : "—",
      icon: TrendingUp,
      sub: "per paid order",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const ORDER_STATUS_STYLES: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    packed: "bg-purple-50 text-purple-700",
    delivering: "bg-orange-50 text-orange-700",
    delivered: "bg-emerald-50 text-emerald-700",
    complete: "bg-green-50 text-green-700",
  };
  const PAYMENT_STATUS_STYLES: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    paid: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Overview of your store
        </p>
      </div>

      {fetchError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="border border-border p-5 flex items-start gap-4"
          >
            <div className={`p-2 rounded-md ${s.bg} shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                {s.label}
              </p>
              <p className="text-2xl font-bold tracking-tight mt-0.5">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/orders"
          className="border border-border p-5 flex items-center gap-3 hover:bg-muted/30 hoverEffect group"
        >
          <Package className="w-5 h-5 text-muted-foreground group-hover:text-primary hoverEffect" />
          <div>
            <p className="text-sm font-semibold">Manage Orders</p>
            <p className="text-xs text-muted-foreground">
              Update status, delete
            </p>
          </div>
        </Link>
        <Link
          href="/admin/users"
          className="border border-border p-5 flex items-center gap-3 hover:bg-muted/30 hoverEffect group"
        >
          <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary hoverEffect" />
          <div>
            <p className="text-sm font-semibold">Manage Users</p>
            <p className="text-xs text-muted-foreground">View, delete users</p>
          </div>
        </Link>
        <div className="border border-border p-5 flex items-center gap-3 bg-muted/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold">{paidOrders} Paid</p>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pending payments
            </p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-primary hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length ? (
          <div className="border border-border divide-y divide-border">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-muted/20 hoverEffect"
              >
                {/* Order info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-semibold truncate">
                      #{order.orderNumber?.slice(-10)}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.customerName} · {order.email}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {order.orderDate
                    ? format(new Date(order.orderDate), "dd MMM yyyy")
                    : "—"}
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${
                      PAYMENT_STATUS_STYLES[order.paymentStatus] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.paymentStatus ?? "—"}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${
                      ORDER_STATUS_STYLES[order.status] ??
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.status ?? "—"}
                  </span>
                </div>

                {/* Price */}
                <p className="text-sm font-bold shrink-0 tabular-nums">
                  ${order.totalPrice?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border py-16 text-center text-sm text-muted-foreground">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}
