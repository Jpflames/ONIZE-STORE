import CompareClient from "@/components/new/CompareClient";
import { getAllProducts } from "@/sanity/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Products | ONIZE",
  description: "Compare your selected products side by side.",
};

export default async function ComparePage() {
  const products = await getAllProducts();
  return <CompareClient allProducts={products as any[]} />;
}
