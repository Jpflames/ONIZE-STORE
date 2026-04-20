"use client";
import { CATEGORIES_QUERY_RESULT, Product } from "@/sanity.types";
import { Button } from "../ui/button";
import { useEffect, useState, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import ProductCard from "../ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

interface Props {
  categories: CATEGORIES_QUERY_RESULT;
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("name-asc");
  const router = useRouter();

  const fetchProducts = async (categorySlug: string) => {
    try {
      setLoading(true);
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)
      `;

      const data = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(slug);
  }, [slug]);

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const sorted = [...products];
    switch (sortOption) {
      case "price-asc":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        );
      case "name-desc":
        return sorted.sort((a, b) =>
          (b.name || "").localeCompare(a.name || ""),
        );
      default:
        return sorted;
    }
  }, [products, sortOption]);

  const currentCategoryName = useMemo(() => {
    const active = categories.find((c) => c.slug?.current === slug);
    return active?.title || "Products";
  }, [categories, slug]);

  return (
    <div className="py-8 flex flex-col sm:flex-row items-start gap-8">
      {/* Sidebar Filters */}
      <div className="flex flex-col w-full sm:w-64 shrink-0 bg-card border border-border rounded-xl p-4 shadow-sm sticky top-24">
        <h3 className="font-semibold text-lg mb-4 text-foreground/90">
          Categories
        </h3>
        <div className="flex flex-col gap-2">
          {categories?.map((item) => (
            <Button
              key={item?._id}
              variant="ghost"
              onClick={() => {
                setLoading(true);
                router.push(`/category/${item?.slug?.current}`);
              }}
              className={`justify-start text-left font-medium w-full rounded-lg transition-all ${
                item?.slug?.current === slug
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:text-primary-foreground"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              }`}
            >
              {item?.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-border gap-4">
          <div className="text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">
              {sortedProducts.length}
            </span>{" "}
            products for{" "}
            <span className="font-semibold text-foreground">
              {currentCategoryName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground shrink-0">
              Sort by:
            </span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-80 space-y-4 text-center bg-muted/50 rounded-2xl w-full border border-dashed border-border/50">
            <motion.div className="flex items-center space-x-3 text-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium text-lg">Loading products...</span>
            </motion.div>
          </div>
        ) : sortedProducts?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <AnimatePresence>
              {sortedProducts.map((product: Product) => (
                <motion.div
                  layout
                  key={product?._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <NoProductAvailable selectedTab={slug} className="mt-0 w-full" />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
