"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/sanity.types";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useCartStore from "@/store";

export default function BuyNowModal({
  product,
  triggerVariant = "outline",
  triggerClassName,
}: {
  product: Product;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  triggerClassName?: string;
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [open, setOpen] = useState(false);
  const startCheckout = () => {
    if (!product?._id) {
      toast.error("Product is missing an id");
      return;
    }

    if (!product?.price) {
      toast.error("This product has no price");
      return;
    }

    addItem(product);
    setOpen(false);
    router.push("/cart");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          className={triggerClassName}
          onClick={(e) => {
            // Avoid bubbling to parent Links/cards
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          Buy Now
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Buy now</DialogTitle>
          <DialogDescription>
            We’ll add this item to your cart so you can checkout as a guest.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={startCheckout}
            className="gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Go to checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

