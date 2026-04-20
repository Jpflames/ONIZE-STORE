"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useOutsideClick } from "@/hooks";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { cn } from "@/lib/utils";

const baseMenuItems = [
  {
    label: "Dashboard",
    href: "/user",
    icon: <User className="w-4 h-4" />,
  },
  {
    label: "My Orders",
    href: "/user/orders",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    label: "Wishlist",
    href: "/user/wishlist",
    icon: <Heart className="w-4 h-4" />,
  },
  {
    label: "Settings",
    href: "/user/settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

const UserMenu = ({ isAdmin }: { isAdmin?: boolean }) => {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick<HTMLDivElement>(() => setOpen(false));
  const { signOut, openUserProfile } = useClerk();
  const { user } = useUser();

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  const userMenuItems = isAdmin
    ? [
        {
          label: "Admin Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        ...baseMenuItems,
      ]
    : baseMenuItems;

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1.5 group hoverEffect cursor-pointer",
          open ? "text-primary" : "text-muted-foreground",
        )}
        aria-label="User menu"
      >
        <span className="relative w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-border group-hover:border-primary transition-colors">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.fullName || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-xs font-bold">{initials}</span>
          )}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2.5 w-56 bg-background border border-border shadow-lg z-50 overflow-hidden"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.fullName || "My Account"}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            {/* Navigation Items */}
            <nav className="py-1">
              {userMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/40 hoverEffect"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Account Actions */}
            <div className="border-t border-border py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  openUserProfile();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/40 hoverEffect"
              >
                <Settings className="w-4 h-4" />
                Manage Account
              </button>
              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 hoverEffect"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
