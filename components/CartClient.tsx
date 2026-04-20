"use client";
import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Heart, ShoppingBag, Trash, Trash2, HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyCart from "@/components/EmptyCart";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import { createPendingOrder } from "@/actions/createPendingOrder";
import paypalLogo from "@/images/paypalLogo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loading from "@/components/Loading";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import useLoginSidebar from "@/hooks/useLoginSidebar";
import AddressSelection from "@/components/new/AddressSelection";

export default function CartClient({
  initialAddress,
}: {
  initialAddress?: any;
}) {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    getTotalItems,
    resetCart,
  } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const groupedItems = useCartStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { open: openLoginSidebar } = useLoginSidebar();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }

  const handleResetCart = () => {
    resetCart();
    setResetDialogOpen(false);
    toast.success("Your cart has been reset!");
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      openLoginSidebar();
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setLoading(true);
    try {
      const orderNumber = crypto.randomUUID();
      const customerEmail = user?.emailAddresses[0]?.emailAddress ?? "Unknown";
      const metadata: Metadata = {
        orderNumber,
        customerName: selectedAddress.fullName,
        customerEmail,
        clerkUserId: user!.id,
      };

      // Create a pending order in Sanity immediately
      await createPendingOrder({
        orderNumber,
        customerName: metadata.customerName,
        customerEmail,
        clerkUserId: user!.id,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country,
        items: groupedItems,
      });

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteCartProduct(id);
    toast.success("Product deleted successfully!");
  };

  return (
    <div className="bg-muted/30 pb-52 md:pb-10 min-h-screen">
      <Container>
        {groupedItems?.length ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Shopping Cart
                </h1>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in
                your cart
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Product View start */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-card border border-border divide-y divide-border rounded-lg shadow-sm">
                  {groupedItems?.map(({ product }) => {
                    const itemCount = getItemCount(product?._id);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        key={product?._id}
                        className="p-4 md:p-6 flex flex-col md:flex-row items-start justify-between gap-6 hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex flex-1 items-start gap-6">
                          {product?.images && (
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              className="shrink-0 w-28 h-28 md:w-36 md:h-36 border border-border/50 rounded-xl overflow-hidden bg-muted group relative"
                            >
                              <Image
                                src={urlFor(product.images[0]).width(256).url()}
                                alt={product?.name || "Product Image"}
                                fill
                                loading="lazy"
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            </Link>
                          )}
                          <div className="flex-1 flex flex-col justify-between min-h-[112px] md:min-h-[144px]">
                            <div className="space-y-1">
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="group"
                              >
                                <h2 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                  {product?.name}
                                </h2>
                              </Link>
                              <p className="text-sm text-muted-foreground line-clamp-1 italic">
                                {product?.intro}
                              </p>
                              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-3">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md border border-border/50">
                                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                                    Color:
                                  </span>
                                  <span className="text-xs font-semibold">
                                    {product?.variant}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md border border-border/50">
                                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                                    Status:
                                  </span>
                                  <span className="text-xs font-semibold text-green-600">
                                    {product?.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 mt-4">
                              <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-tight">
                                <Heart className="w-3.5 h-3.5" />
                                <span>Save to wish</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProduct(product?._id)
                                }
                                className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-destructive transition-colors uppercase tracking-tight"
                              >
                                <Trash className="w-3.5 h-3.5" />
                                <span>Remove item</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 md:h-36">
                          <PriceFormatter
                            amount={(product?.price as number) * itemCount}
                            className="font-black text-xl md:text-2xl"
                          />
                          <div className="scale-90 md:scale-100 origin-right">
                            <QuantityButtons product={product} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  <div className="p-4 flex justify-end">
                    <Button
                      onClick={() => setResetDialogOpen(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Cart
                    </Button>
                  </div>

                  {/* Reset confirmation portal modal */}
                  {typeof window !== "undefined" &&
                    createPortal(
                      <AnimatePresence>
                        {resetDialogOpen && (
                          <>
                            {/* Backdrop */}
                            <motion.div
                              key="reset-backdrop"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                              }}
                              onClick={() => setResetDialogOpen(false)}
                              className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
                            />

                            {/* Dialog */}
                            <motion.div
                              key="reset-modal"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                              }}
                              className="fixed inset-0 z-101 flex items-center justify-center pointer-events-none px-4"
                            >
                              <div
                                className="pointer-events-auto w-full max-w-md bg-background rounded-lg p-6 shadow-xl border border-border"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <h2 className="text-lg font-bold tracking-tight mb-2">
                                  Clear your cart?
                                </h2>
                                <p className="text-sm text-muted-foreground mb-6">
                                  This will remove all items from your cart.
                                  This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => setResetDialogOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleResetCart();
                                      setResetDialogOpen(false);
                                    }}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Yes, clear cart
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>,
                      document.body,
                    )}
                </div>
              </div>

              {/* Product View end */}

              <div className="lg:col-span-1">
                <div className="sticky top-24 w-full">
                  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
                    <h2 className="text-xl font-bold tracking-tight">
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">
                          Subtotal
                        </span>
                        <PriceFormatter
                          amount={getSubTotalPrice()}
                          className="font-bold"
                        />
                      </div>

                      {getSubTotalPrice() - getTotalPrice() > 0 && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="font-medium">Discount</span>
                          <PriceFormatter
                            amount={getTotalPrice() - getSubTotalPrice()}
                            className="font-bold"
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">
                          Shipping
                        </span>
                        <span className="text-green-600 font-bold uppercase text-xs tracking-widest">
                          Free
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {isSignedIn && (
                        <AddressSelection
                          onSelect={setSelectedAddress}
                          selectedAddress={selectedAddress}
                        />
                      )}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-2xl font-black text-primary"
                        />
                      </div>

                      <Button
                        onClick={handleCheckout}
                        disabled={loading || (isSignedIn && !selectedAddress)}
                        className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : isSignedIn ? (
                          selectedAddress ? (
                            "Place Order"
                          ) : (
                            "Select Address to Continue"
                          )
                        ) : (
                          "Sign In to Checkout"
                        )}
                      </Button>
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="w-8 h-px bg-border"></span>
                        Secure Checkout
                        <span className="w-8 h-px bg-border"></span>
                      </div>
                      <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <Image
                          src={paypalLogo}
                          alt="PayPal"
                          height={16}
                          className="h-4 w-auto"
                        />
                        {/* Stripe logo or icon could go here too */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order summary mobile view */}
              <div className="md:hidden fixed bottom-16 left-0 w-full bg-background/80 backdrop-blur-lg pt-4 pb-6 px-4 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-border/50 z-40 rounded-t-[2.5rem]">
                <div className="max-w-md mx-auto space-y-4">
                  {initialAddress && (
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                      <div className="flex items-center gap-1.5">
                        <HomeIcon className="w-3 h-3" />
                        <span>
                          {initialAddress.city}, {initialAddress.country}
                        </span>
                      </div>
                      <Link href="/account" className="text-primary">
                        Edit
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Grand Total
                      </span>
                      <PriceFormatter
                        amount={getTotalPrice()}
                        className="text-2xl font-black text-primary"
                      />
                    </div>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading || (isSignedIn && !selectedAddress)}
                      className="h-14 px-8 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      {loading
                        ? "..."
                        : isSignedIn
                          ? selectedAddress
                            ? "Checkout"
                            : "Address"
                          : "Sign In"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
}
