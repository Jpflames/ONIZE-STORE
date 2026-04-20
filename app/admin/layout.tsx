import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { isAdminEmailServer } from "@/lib/admin";
import Container from "@/components/Container";
import { LayoutDashboard, ShoppingBag, Users, Mail } from "lucide-react";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Mail },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/signin");

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!isAdminEmailServer(email)) redirect("/");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Admin top bar */}
      <div className="border-b border-border bg-background sticky top-(--header-height,64px) z-20">
        <Container>
          <div className="flex flex-wrap items-center gap-4 py-3">
            {/* Admin badge */}
            <div className="flex items-center gap-2 shrink-0">
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Admin</span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-border" />

            {/* Nav links */}
            <nav className="flex items-center gap-1 overflow-x-auto">
              {adminLinks.map((item) => (
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

            <div className="ml-auto hidden sm:block">
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-10 w-full">
        <main>{children}</main>
      </Container>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#ffffff",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#000000",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#000000",
            },
          },
        }}
      />
    </div>
  );
}
