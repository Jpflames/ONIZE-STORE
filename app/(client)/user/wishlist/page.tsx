import React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Wishlist | ONIZE" };

export default function UserWishlistPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Wishlist</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Items you&apos;ve saved for later.
      </p>

      <div className="flex flex-col items-center justify-center py-20 border border-border text-center">
        <Heart className="w-10 h-10 text-muted-foreground/30 mb-4" />
        <p className="text-base font-semibold">Your wishlist is empty</p>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Save items you love and come back to them later.
        </p>
        <Link
          href="/shop"
          className="text-sm font-semibold border border-primary px-5 py-2.5 hover:bg-primary hover:text-primary-foreground hoverEffect"
        >
          Explore Products
        </Link>
      </div>
    </div>
  );
}
