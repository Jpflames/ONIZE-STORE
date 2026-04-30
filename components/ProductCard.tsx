"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";
import Title from "./Title";
import BuyNowModal from "@/components/BuyNowModal";
import useWishlistStore from "@/wishlistStore";
import useCompareStore from "@/compareStore";
import useShareSidebar from "@/store/useShareSidebar";
import { Heart, BarChart2, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const ProductCard = ({ product }: { product: Product }) => {
  const [isClient, setIsClient] = useState(false);
  const {
    items: wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useWishlistStore();
  const {
    addToCompare,
    removeFromCompare,
    isInCompare,
    items: compareItems,
  } = useCompareStore();
  const openShare = useShareSidebar((s) => s.open);

  const isWishlisted = wishlistItems.some((i) => i._id === product._id);
  const inCompare = isClient ? isInCompare(product._id) : false;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist!");
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product._id);
      toast("Removed from compare");
    } else {
      if (compareItems.length >= 4) {
        toast.error("Max 4 products can be compared");
        return;
      }
      addToCompare(product);
      toast.success("Added to compare!");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const image = product.images?.[0] ? urlFor(product.images[0]).url() : "";
    openShare(product.slug?.current ?? "", product.name ?? "", image);
  };

  const primaryImage = product.images?.[0];

  return (
    <div className="rounded-xl overflow-hidden group text-sm border border-border hover:border-primary/50 hoverEffect">
      <div className="overflow-hidden relative bg-secondary">
        {primaryImage ? (
          <Link
            href={`/product/${product?.slug?.current}?id=${encodeURIComponent(
              product._id,
            )}`}
          >
            <Image
              src={urlFor(primaryImage).width(800).height(800).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-72 object-contain overflow-hidden transition-transform duration-500 ${product?.stock !== 0 && "group-hover:scale-105"}`}
            />
          </Link>
        ) : null}

        {/* Discount badge */}
        {product?.price && product?.discount && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] md:text-xs font-bold px-2 py-1 rounded-md z-10 shadow-sm uppercase">
            {Math.round(
              (product.discount / (product.price + product.discount)) * 100,
            )}
            % Off
          </div>
        )}

        {/* Quick-action hover overlay */}
        {isClient && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 p-3 bg-background/90 backdrop-blur-sm border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
            <button
              onClick={handleWishlist}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 hover:scale-110",
                isWishlisted
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary hover:text-primary",
              )}
            >
              <Heart
                className={cn("w-4 h-4", isWishlisted && "fill-current")}
              />
            </button>
            <button
              onClick={handleCompare}
              title={inCompare ? "Remove from compare" : "Add to compare"}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 hover:scale-110",
                inCompare
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary hover:text-primary",
              )}
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              title="Share product"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-all duration-200 hover:scale-110"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="py-3 px-2 flex flex-col gap-1.5 bg-card rounded-md rounded-tl-none rounded-tr-none">
        <Title className="text-base line-clamp-1">{product?.name}</Title>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {product?.intro}
        </p>
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-lg"
        />
        <div className="flex flex-col gap-2">
          <AddToCartButton product={product} />
          <BuyNowModal product={product} triggerClassName="w-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
