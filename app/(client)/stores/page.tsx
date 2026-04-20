import Container from "@/components/Container";
import StoreCard from "@/components/new/StoreCard";
import { client } from "@/sanity/lib/client";
import { Store } from "@/sanity.types";

export const dynamic = "force-dynamic";

const StoresPage = async () => {
  const query = `*[_type == "store" && isActive == true] | order(name asc)`;
  const stores: Store[] = await client.fetch(query);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Our Stores
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Visit us at one of our store locations. Find the nearest outlet to
            you.
          </p>
        </div>

        {stores.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] flex items-center justify-center bg-muted rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground font-medium">
              No store locations found.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default StoresPage;
