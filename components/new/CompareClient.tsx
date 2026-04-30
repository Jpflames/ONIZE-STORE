"use client";

import React, { useEffect, useState, useRef } from "react";
import Container from "../Container";
import useCompareStore from "@/compareStore";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { X, BarChart2, ArrowRight, Search, Plus } from "lucide-react";
import PriceView from "../PriceView";
import { Product } from "@/sanity.types";
import toast from "react-hot-toast";

/* ─── Row configuration ─────────────────────────────────── */
const ROW_LABELS = [
  { key: "image", label: "Product" },
  { key: "price", label: "Price" },
  { key: "discount", label: "Discount" },
  { key: "stock", label: "Availability" },
  { key: "status", label: "Status" },
  { key: "categories", label: "Category" },
  { key: "variant", label: "Type / Variant" },
  { key: "productBase", label: "Product Base" },
  { key: "intro", label: "Overview" },
  { key: "description", label: "Description" },
];

/* ─── Cell renderer ─────────────────────────────────────── */
function CellValue({ product, rowKey }: { product: Product; rowKey: string }) {
  switch (rowKey) {
    case "image":
      return (
        <div className="flex flex-col items-center gap-2">
          {product.images?.[0] && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
              <Image
                src={urlFor(product.images[0]).url()}
                alt={product.name ?? ""}
                fill
                className="object-contain"
              />
            </div>
          )}
          <Link
            href={`/product/${product.slug?.current}?id=${encodeURIComponent(
              product._id,
            )}`}
            className="text-sm font-semibold text-center hover:text-primary transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>
      );
    case "price":
      return (
        <PriceView
          price={product.price}
          discount={product.discount}
          className="text-base"
        />
      );
    case "discount": {
      if (!product.price || !product.discount)
        return <span className="text-muted-foreground">—</span>;
      const pct = Math.round(
        (product.discount / (product.price + product.discount)) * 100,
      );
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
          {pct}% Off
        </span>
      );
    }
    case "stock":
      return (
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            (product.stock ?? 0) > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {(product.stock ?? 0) > 0
            ? `In Stock (${product.stock})`
            : "Out of Stock"}
        </span>
      );
    case "status": {
      const statusConfig: Record<string, { label: string; className: string }> =
        {
          new: { label: "New", className: "bg-blue-100 text-blue-700" },
          hot: { label: "🔥 Hot", className: "bg-orange-100 text-orange-700" },
          sale: { label: "Sale", className: "bg-red-100 text-red-600" },
        };
      const cfg = product.status ? statusConfig[product.status] : null;
      return cfg ? (
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${cfg.className}`}
        >
          {cfg.label}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    }
    case "categories": {
      const cats = product.categories as any[];
      return (
        <p className="text-sm text-muted-foreground">
          {cats?.map((c: any) => c.name ?? c.title ?? c).join(", ") || "—"}
        </p>
      );
    }
    case "variant":
      return product.variant ? (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-foreground capitalize">
          {product.variant}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    case "productBase": {
      const bases = product.productBase as string[] | undefined;
      return bases && bases.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-1">
          {bases.map((b) => (
            <span
              key={b}
              className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize"
            >
              {b}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">—</span>
      );
    }
    case "intro":
      return (
        <p className="text-sm text-muted-foreground">{product.intro || "—"}</p>
      );
    case "description":
      return (
        <p className="text-sm text-muted-foreground line-clamp-4 text-left">
          {product.description || "—"}
        </p>
      );
    default:
      return <span className="text-muted-foreground">—</span>;
  }
}

/* ─── Inline Product Search ─────────────────────────────── */
function ProductSearch({
  allProducts,
  onAdd,
  excludeIds,
}: {
  allProducts: Product[];
  onAdd: (p: Product) => void;
  excludeIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = allProducts
    .filter(
      (p) =>
        !excludeIds.includes(p._id) &&
        p.name?.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 8);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 border border-border bg-card rounded-xl px-4 py-2.5 shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          placeholder="Search product to compare…"
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && query && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              No products found
            </p>
          ) : (
            filtered.map((p) => (
              <button
                key={p._id}
                onClick={() => {
                  onAdd(p);
                  setQuery("");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-b-0"
              >
                {p.images?.[0] && (
                  <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-border">
                    <Image
                      src={urlFor(p.images[0]).url()}
                      alt={p.name ?? ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(p.price ?? 0).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <Plus className="w-4 h-4 ml-auto shrink-0 text-primary" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
const CompareClient = ({ allProducts }: { allProducts: Product[] }) => {
  const [isClient, setIsClient] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { items, addToCompare, removeFromCompare, clearCompare } =
    useCompareStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleAdd = (p: Product) => {
    if (items.length >= 4) {
      toast.error("Max 4 products can be compared");
      return;
    }
    addToCompare(p);
    toast.success(`${p.name} added to compare!`);
  };

  const handleClearAll = () => {
    clearCompare();
    setShowConfirm(false);
    toast.success("Compare list cleared!");
  };

  /* ── Empty State ── */
  if (items.length === 0) {
    return (
      <Container className="py-20">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <BarChart2 className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Nothing to compare yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Search and add up to 4 products to compare them side by side.
          </p>
          <ProductSearch
            allProducts={allProducts}
            onAdd={handleAdd}
            excludeIds={items.map((i) => i._id)}
          />
          <Link
            href="/shop"
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    );
  }

  /* ── Compare Table ── */
  return (
    <Container className="py-12 md:py-20">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-black mb-1">Compare Products</h1>
          <p className="text-muted-foreground">
            {items.length} of 4 products selected
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Inline search to add more */}
          {items.length < 4 && (
            <ProductSearch
              allProducts={allProducts}
              onAdd={handleAdd}
              excludeIds={items.map((i) => i._id)}
            />
          )}
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 px-4 py-2.5 rounded-xl transition-all"
          >
            <X className="w-4 h-4" /> Clear All
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-100 animate-in fade-in duration-200"
            onClick={() => setShowConfirm(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-101 w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-7 animate-in zoom-in-95 fade-in duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="w-7 h-7 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Clear compare list?</h3>
                <p className="text-sm text-muted-foreground">
                  This will remove all {items.length} products from your
                  comparison. This action cannot be undone.
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
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {/* Attribute label column */}
              <th className="w-32 md:w-44 p-4 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground sticky left-0 bg-muted/30 z-10">
                Attribute
              </th>

              {/* Filled product columns */}
              {items.map((product) => (
                <th key={product._id} className="p-4 text-center min-w-[180px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold truncate text-foreground">
                      {product.name}
                    </span>
                    <button
                      onClick={() => removeFromCompare(product._id)}
                      className="shrink-0 p-1 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}

              {/* Empty slot columns */}
              {Array.from({ length: 4 - items.length }).map((_, i) => (
                <th
                  key={`empty-${i}`}
                  className="p-4 text-center min-w-[180px] border-l border-dashed border-border"
                >
                  <span className="text-xs text-muted-foreground">
                    Slot {items.length + i + 1} — use search above
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROW_LABELS.map((row, rowIdx) => (
              <tr
                key={row.key}
                className={`border-b border-border last:border-b-0 ${
                  rowIdx % 2 === 0 ? "bg-background" : "bg-muted/10"
                }`}
              >
                {/* Label */}
                <td className="p-4 font-semibold text-xs uppercase tracking-widest text-muted-foreground align-middle sticky left-0 bg-inherit z-10">
                  {row.label}
                </td>

                {/* Cells */}
                {items.map((product) => (
                  <td
                    key={product._id}
                    className="p-4 text-center align-middle border-l border-border"
                  >
                    <div className="flex justify-center">
                      <CellValue product={product} rowKey={row.key} />
                    </div>
                  </td>
                ))}

                {/* Empty cells */}
                {Array.from({ length: 4 - items.length }).map((_, i) => (
                  <td
                    key={`empty-cell-${i}`}
                    className="p-4 border-l border-dashed border-border"
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default CompareClient;
