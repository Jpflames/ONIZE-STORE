import React from "react";
import Container from "@/components/Container";
import Title from "@/components/Title";
import ProductCard from "@/components/ProductCard";
import { getProductsByBase } from "@/sanity/helpers";
import Breadcrumb from "@/components/Breadcrumb";

const DealsPage = async () => {
  const products = await getProductsByBase("deals");

  return (
    <div className="pb-20">
      <Breadcrumb />
      <Container>
        <div className="mt-10 mb-12">
          <Title className="text-4xl mb-4">Unbeatable Deals</Title>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Score big on your favorite styles. From seasonal clearances to
            exclusive discounts, find the best value on premium apparel and
            accessories.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border">
            <p className="text-xl font-medium text-muted-foreground">
              No deals available at the moment. Check back soon!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default DealsPage;
