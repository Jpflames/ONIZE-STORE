"use client";

import React, { useEffect, useState } from "react";
import Container from "../Container";
import useWishlistStore from "@/wishlistStore";
import Title from "../Title";
import ProductCard from "../ProductCard";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const WishlistClient = () => {
  const [isClient, setIsClient] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { items, resetWishlist } = useWishlistStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleReset = () => {
    resetWishlist();
    setShowConfirm(false);
    toast.success("Wishlist cleared!");
  };

  return (
    <Container className="py-12 md:py-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <Title className="text-4xl">My Wishlist</Title>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Keep track of the products you love. Your personal collection of
            premium finds, ready for when you&apos;re prepared to shop.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 shrink-0 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border border-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-200"
            onClick={() => setShowConfirm(false)}
          />
          {/* Dialog */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-7 animate-in zoom-in-95 fade-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Clear your wishlist?</h3>
                <p className="text-sm text-muted-foreground">
                  This will permanently remove all {items.length} items from
                  your wishlist. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Products Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            You haven&apos;t saved any products yet. Start exploring our
            collection to find your next favorite item.
          </p>
          <Link
            href="/shop"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg group"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      )}
    </Container>
  );
};

export default WishlistClient;
