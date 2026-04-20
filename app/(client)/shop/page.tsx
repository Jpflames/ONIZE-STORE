import Container from "@/components/Container";
import ShopProducts from "@/components/new/ShopProducts";
import { getAllCategories } from "@/sanity/helpers";
import React from "react";

const ShopPage = async () => {
  const categories = await getAllCategories();

  return (
    <div>
      <Container className="py-10">
        <div className="rounded-2xl p-8 text-center md:p-12 w-full mb-8 border border-border">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 capitalize">
            Shop Everything
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-4xl mx-auto">
            Explore our entire collection of premium products. Use the filters
            and sorting options to find exactly what you&apos;re looking for.
          </p>
        </div>

        <ShopProducts categories={categories} />
      </Container>
    </div>
  );
};

export default ShopPage;
