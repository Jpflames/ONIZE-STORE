import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import ImageView from "@/components/new/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug } from "@/sanity/helpers";
import { Heart } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcrumb";
import WishlistButton from "@/components/new/WishlistButton";
import RelatedProducts from "@/components/RelatedProducts";

import { Suspense } from "react";
import ProductSkeleton from "@/components/ProductSkeleton";
import { urlFor } from "@/sanity/lib/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const mainImage = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(630).url()
    : "/og-image.jpg";

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ONIZE`,
      description: product.description,
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: product.name || "Product Image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ONIZE`,
      description: product.description,
      images: [mainImage],
    },
  };
}

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <Breadcrumb />
      <Container className="flex flex-col md:flex-row gap-10 py-10">
        {product?.images && <ImageView images={product?.images} />}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div>
            <p className="text-4xl font-bold mb-2">{product?.name}</p>
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-lg font-bold"
            />
          </div>
          {product?.stock && (
            <p className="bg-green-100 w-24 text-center text-green-600 text-sm py-2.5 font-semibold rounded-lg">
              In Stock
            </p>
          )}

          <p className="text-sm text-muted-foreground tracking-wide">
            {product?.description}
          </p>
          <div className="flex items-center gap-2.5 lg:gap-5">
            <AddToCartButton
              product={product}
              className="bg-primary/80 text-primary-foreground hover:bg-primary hoverEffect"
            />
            <WishlistButton product={product} />
          </div>
          <ProductCharacteristics product={product} />
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-b-border py-5 -mt-2">
            <div className="flex items-center gap-2 text-sm text-foreground hover:text-destructive hoverEffect">
              <RxBorderSplit className="text-lg" />
              <p>Compare color</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground hover:text-destructive hoverEffect">
              <FaRegQuestionCircle className="text-lg" />
              <p>Ask a question</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground hover:text-destructive hoverEffect">
              <TbTruckDelivery className="text-lg" />
              <p>Delivery & Return</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground hover:text-destructive hoverEffect">
              <FiShare2 className="text-lg" />
              <p>Share</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <div className="border border-primary/20 text-center p-3 hover:border-primary hoverEffect rounded-md">
              <p className="text-base font-semibold text-foreground">
                Free Shipping
              </p>
              <p className="text-sm text-muted-foreground">
                Free shipping over order $120
              </p>
            </div>
            <div className="border border-primary/20 text-center p-3 hover:border-primary hoverEffect rounded-md">
              <p className="text-base font-semibold text-foreground">
                Flexible Payment
              </p>
              <p className="text-sm text-muted-foreground">
                Pay with Multiple Credit Cards
              </p>
            </div>
          </div>
        </div>
      </Container>
      {product?.categories && product?.categories.length > 0 && (
        <Suspense
          fallback={
            <Container className="py-10 border-t border-border mt-10">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </Container>
          }
        >
          <RelatedProducts
            categorySlug={product?.categories[0]?.slug?.current}
            currentProductSlug={product?.slug?.current || ""}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ProductPage;
