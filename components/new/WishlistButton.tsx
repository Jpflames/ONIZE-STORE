"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/sanity.types";
import useWishlistStore from "@/wishlistStore";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

const WishlistButton = ({ product, className }: WishlistButtonProps) => {
  const [isClient, setIsClient] = useState(false);
  const { items, addToWishlist, removeFromWishlist } = useWishlistStore();
  const isWishlisted = items.some((item) => item._id === product._id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  if (!isClient)
    return (
      <button
        className={cn(
          "border-2 border-primary/30 text-primary/60 px-2.5 py-1.5 rounded-md",
          className,
        )}
      >
        <Heart className="w-5 h-5 text-current shadow-sm" />
      </button>
    );

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "border-2 px-2.5 py-1.5 rounded-md hoverEffect transition-all",
        isWishlisted
          ? "border-primary bg-primary/5 text-primary"
          : "border-primary/30 text-primary/60 hover:text-primary hover:border-primary",
        className,
      )}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-transform duration-300 active:scale-125",
          isWishlisted && "fill-current",
        )}
      />
    </button>
  );
};

export default WishlistButton;
