import Container from "@/components/Container";
import CategoryProducts from "@/components/new/CategoryProducts";
import { getAllCategories } from "@/sanity/helpers";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${categoryName} Collection`,
    description: `Explore our curated selection of top-quality products in the ${categoryName} category. Shop the latest ${categoryName} at ONIZE.`,
    openGraph: {
      title: `${categoryName} Collection | ONIZE`,
      description: `Explore our curated selection of top-quality products in the ${categoryName} category.`,
    },
  };
}

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const categories = await getAllCategories();

  return (
    <div>
      <Container className="py-10">
        <div className="p-8 text-center md:p-12 w-full mb-2 rounded-2xl border border-border">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 capitalize">
            {slug?.split("-").join(" ")} Collection
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Explore our curated selection of top-quality products in the{" "}
            <span className="capitalize font-medium text-foreground">
              {slug?.split("-").join(" ")}
            </span>{" "}
            category.
          </p>
        </div>

        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
