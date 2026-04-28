"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function EmptyCart() {
  return (
    <div className="py-16 md:py-28 bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-sm w-full"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag
            className="w-9 h-9 text-muted-foreground"
            strokeWidth={1.5}
          />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-semibold tracking-tight mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs">
          Looks like you haven&apos;t added anything yet. Browse our collection
          and find something you&apos;ll love.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hoverEffect"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Subtle divider hint */}
        <p className="mt-6 text-xs text-muted-foreground/60">
          Free shipping on orders over $150
        </p>
      </motion.div>
    </div>
  );
}
