"use client";
import { Search, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import { Input } from "../ui/input";
import AddToCartButton from "../AddToCartButton";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/sanity.types";
import PriceView from "../PriceView";
import Image from "next/image";
import Link from "next/link";

import SearchSkeleton from "./SearchSkeleton";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSearch]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch products from Sanity based on search input
  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    try {
      const query = `*[_type == "product" && name match $search] | order(name asc)`;
      const params = { search: `${search}*` };
      const response = await client.fetch(query, params);
      setProducts(response);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const query = `*[_type == "product" && status == "new"] | order(_createdAt desc) [0...5]`;
      const response = await client.fetch(query);
      setFeaturedProducts(response);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  }, []);

  useEffect(() => {
    if (showSearch) {
      fetchFeaturedProducts();
    }
  }, [showSearch, fetchFeaturedProducts]);

  useEffect(() => {
    if (search) {
      setLoading(true);
      setHasSearched(false);
    } else {
      setLoading(false);
      setHasSearched(false);
    }

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, fetchProducts]);

  const onClose = () => {
    setShowSearch(false);
    setSearch("");
    setProducts([]);
    setHasSearched(false);
    setLoading(false);
  };

  const modal = (
    <AnimatePresence>
      {showSearch && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            key="search-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-101 flex items-start justify-center pt-[10vh] pointer-events-none"
          >
            <div
              className="relative w-full max-w-4xl mx-4 bg-background flex flex-col max-h-[80vh] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-muted-foreground hover:text-primary hoverEffect z-10"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="px-8 pt-8 pb-4 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Search
                </p>
                <form
                  className="relative flex items-center"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Search className="absolute left-1 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Search for products..."
                    className="pl-8 pr-10 py-3 text-xl font-light border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/40"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-1 text-muted-foreground hover:text-destructive hoverEffect"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {loading ? (
                  <div className="flex flex-col divide-y divide-border">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SearchSkeleton key={i} />
                    ))}
                  </div>
                ) : products?.length ? (
                  <div className="flex flex-col divide-y divide-border pb-4">
                    {products.map((product: Product, idx) => (
                      <motion.div
                        key={product?._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: idx * 0.04,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                        className="group py-5 first:pt-0"
                      >
                        <div className="flex items-center gap-5">
                          {/* Image */}
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            onClick={onClose}
                            className="relative h-24 w-24 md:h-28 md:w-28 shrink-0 overflow-hidden bg-muted"
                          >
                            {product?.images && (
                              <Image
                                fill
                                src={urlFor(product?.images[0]).url()}
                                alt={product.name || "product"}
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              onClick={onClose}
                              className="block"
                            >
                              <h3 className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                {product?.intro}
                              </p>
                            </Link>
                            <PriceView
                              price={product?.price}
                              discount={product?.discount}
                              className="text-sm mt-1.5"
                            />
                          </div>

                          {/* Add to Cart */}
                          <div className="shrink-0 w-36 hidden sm:block">
                            <AddToCartButton product={product} />
                          </div>
                        </div>

                        {/* Mobile Add to Cart */}
                        <div className="mt-3 sm:hidden">
                          <AddToCartButton product={product} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : search ? (
                  hasSearched && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-base font-semibold">
                        No results found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        No products matched &quot;{search}&quot;. Try a
                        different keyword.
                      </p>
                    </div>
                  )
                ) : featuredProducts?.length ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                      Featured Products
                    </p>
                    <div className="flex flex-col divide-y divide-border pb-4">
                      {featuredProducts.map((product: Product, idx) => (
                        <motion.div
                          key={product?._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: idx * 0.04,
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                          className="group py-5 first:pt-0"
                        >
                          <div className="flex items-center gap-5">
                            {/* Image */}
                            <Link
                              href={`/product/${product?.slug?.current}`}
                              onClick={onClose}
                              className="relative h-20 w-20 shrink-0 overflow-hidden bg-muted rounded-lg"
                            >
                              {product?.images && (
                                <Image
                                  fill
                                  src={urlFor(product?.images[0]).url()}
                                  alt={product.name || "product"}
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              )}
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                onClick={onClose}
                                className="block"
                              >
                                <h3 className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                                  {product?.intro}
                                </p>
                              </Link>
                              <PriceView
                                price={product?.price}
                                discount={product?.discount}
                                className="text-sm mt-1.5"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <Search className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm font-medium">
                      Start typing to discover products
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setShowSearch(true)}
        className="flex items-center hover:cursor-pointer hover:text-primary hoverEffect"
        aria-label="Open search"
      >
        <Search className="w-5 h-5" />
      </button>

      {typeof window !== "undefined" && createPortal(modal, document.body)}
    </>
  );
};

export default SearchBar;
