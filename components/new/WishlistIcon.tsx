"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import useWishlistStore from "@/wishlistStore";

const WishlistIcon = () => {
  const [isClient, setIsClient] = useState(false);
  const items = useWishlistStore((state) => state.items);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link
      href="/wishlist"
      className="relative hover:text-primary transition-colors group"
      aria-label="Wishlist"
    >
      <Heart className="w-5 h-5" />
      {isClient && items.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
          {items.length}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;
