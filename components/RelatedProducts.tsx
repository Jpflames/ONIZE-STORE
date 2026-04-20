import React from "react";
import { getProductsByCategory } from "@/sanity/helpers";
import ProductCard from "./ProductCard";
import Title from "./Title";
import Container from "./Container";

interface Props {
  categorySlug: string;
  currentProductSlug: string;
}

const RelatedProducts = async ({ categorySlug, currentProductSlug }: Props) => {
  const products = await getProductsByCategory(categorySlug);

  // Filter out the current product and limit to 4 items
  const relatedProducts = products
    .filter((product: any) => product?.slug?.current !== currentProductSlug)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-10 border-t border-border mt-10">
      <Container>
        <Title className="mb-8">Related Products</Title>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product: any) => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default RelatedProducts;
