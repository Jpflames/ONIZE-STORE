import Container from "@/components/Container";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const BestDealsPage = async () => {
  const productsQuery = `*[_type == "product" && "deals" in productBase] | order(name asc)`;
  const products: Product[] = await client.fetch(productsQuery);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl p-8 text-center md:p-12 w-full mb-8 border border-border">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Unbeatable Best Deals
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-4xl mx-auto">
            Welcome to our hand-picked selection of top-rated deals! We&apos;ve
            gathered our most popular and highly discounted items in one place.
            Whether you&apos;re upgrading your wardrobe or shopping for
            essentials, you&apos;ll find unbeatable prices here.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
              All Deals
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="min-h-[300px] flex items-center justify-center bg-muted rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground font-medium">
              No best deals available at the moment.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default BestDealsPage;
