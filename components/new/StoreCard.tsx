import { Store } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";

interface Props {
  store: Store;
}

const StoreCard = ({ store }: Props) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg hoverEffect bg-card flex flex-col sm:flex-row gap-5 p-4 sm:p-5">
      <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 rounded-md overflow-hidden bg-muted">
        {store?.image ? (
          <Image
            src={urlFor(store.image).url()}
            alt={store.name || "Store Image"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {store?.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {store?.description}
          </p>
        </div>

        <div className="space-y-2 mt-2">
          {store?.location && (
            <div className="flex items-start gap-2 text-sm text-foreground/80">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <span>{store.location}</span>
            </div>
          )}
          {store?.phoneNumber && (
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Phone className="w-4 h-4 shrink-0 text-primary" />
              <a
                href={`tel:${store.phoneNumber}`}
                className="hover:text-primary hoverEffect"
              >
                {store.phoneNumber}
              </a>
            </div>
          )}
          {store?.email && (
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Mail className="w-4 h-4 shrink-0 text-primary" />
              <a
                href={`mailto:${store.email}`}
                className="hover:text-primary hoverEffect"
              >
                {store.email}
              </a>
            </div>
          )}
        </div>

        {/* Simple map link if lat/lng are present */}
        {store?.lat && store?.lng && (
          <div className="mt-auto pt-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
            >
              View on Map
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
