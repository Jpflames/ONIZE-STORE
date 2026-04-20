import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/helpers";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ShoppingBag, Heart, Settings, Package } from "lucide-react";

export const metadata = { title: "Dashboard | ONIZE" };

export default async function UserDashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
  const orders = email ? await getMyOrders(email) : [];

  const stats = [
    {
      label: "Total Orders",
      value: orders?.length ?? 0,
      icon: ShoppingBag,
      href: "/user/orders",
    },
    {
      label: "Wishlist Items",
      value: 0,
      icon: Heart,
      href: "/user/wishlist",
    },
    {
      label: "Active Orders",
      value:
        (orders as any[])?.filter((o: any) => o.status === "paid")?.length ?? 0,
      icon: Package,
      href: "/user/orders",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">
        Welcome back, {user?.firstName ?? "there"} 👋
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Here&apos;s an overview of your account.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-border p-5 hover:border-primary/50 hoverEffect group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
              <stat.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary hoverEffect" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "View all orders",
              href: "/user/orders",
              icon: ShoppingBag,
            },
            { label: "My wishlist", href: "/user/wishlist", icon: Heart },
            {
              label: "Account settings",
              href: "/user/settings",
              icon: Settings,
            },
            { label: "Browse products", href: "/shop", icon: Package },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 border border-border text-sm font-medium hover:border-primary/50 hover:text-primary hoverEffect"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
