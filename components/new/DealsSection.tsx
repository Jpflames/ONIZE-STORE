import React from "react";
import Container from "../Container";
import Title from "../Title";
import ProductCard from "../ProductCard";
import { getProductsByBase } from "@/sanity/helpers";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const DealsSection = async () => {
  const products = await getProductsByBase("deals");
  const dealsProducts = products.slice(0, 4);

  if (dealsProducts.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -tr-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -bl-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative px-0">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
              <Sparkles className="w-4 h-4" />
              Limited Time Offers
            </div>
            <Title className="text-4xl font-black mb-6 leading-tight">
              Premium Deals,{" "}
              <span className="text-primary underline decoration-primary/20 underline-offset-8">
                Unbeatable Prices
              </span>
            </Title>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Experience luxury for less. Explore our exclusive collection of
              high-demand items with seasonal discounts designed for the
              discerning shopper.
            </p>
          </div>

          <div className="flex items-center">
            <Link
              href="/deals"
              className="group flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all duration-300 shadow-xl shadow-black/10"
            >
              Explore All Deals
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dealsProducts.map((product: any) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default DealsSection;
