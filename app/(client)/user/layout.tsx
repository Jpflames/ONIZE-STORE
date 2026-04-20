import React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
  User,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/user", icon: LayoutDashboard },
  { label: "My Orders", href: "/user/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/user/wishlist", icon: Heart },
  { label: "Settings", href: "/user/settings", icon: Settings },
];

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/signin");

  const user = await currentUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top user bar */}
      <div className="border-b border-border bg-background sticky top-(--header-height,64px) z-20">
        <Container>
          <div className="flex flex-wrap items-center gap-4 py-3">
            {/* User info */}
            <div className="flex items-center gap-2.5 shrink-0">
              {user?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-semibold leading-tight truncate max-w-[160px]">
                  {user?.fullName || "My Account"}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-border" />

            {/* Nav links */}
            <nav className="flex items-center gap-1 overflow-x-auto">
              {sidebarLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/40 hoverEffect whitespace-nowrap rounded-md",
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </div>

      {/* Main content */}
      <Container className="py-10 w-full">
        <main>{children}</main>
      </Container>
    </div>
  );
}
