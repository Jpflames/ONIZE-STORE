"use client";

import { Product } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { CreditCard } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";

export default function BuyNowSection({ product }: { product: Product }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    // If the URL contains buyNow=1 (from ProductCard), bring the Buy Now block into view.
    const buyNow =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("buyNow") === "1";
    if (buyNow) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleBuyNow = async () => {
    if (!product?._id) {
      toast.error("Product is missing an id");
      return;
    }

    if (!product?.price) {
      toast.error("This product has no price");
      return;
    }

    addItem(product);
    router.push("/cart");
  };

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <Button
        onClick={handleBuyNow}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <CreditCard className="w-4 h-4" />
        Buy Now
      </Button>
    </div>
  );
}

