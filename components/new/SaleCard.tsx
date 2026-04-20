import { Sale } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Props {
  sale: Sale;
}

const SaleCard = ({ sale }: Props) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden group hover:shadow-lg hoverEffect bg-card flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        {sale?.image && (
          <Image
            src={urlFor(sale.image).url()}
            alt={sale.title || "Sale Image"}
            fill
            className="object-cover group-hover:scale-105 hoverEffect"
          />
        )}
        {sale?.badge && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            {sale.badge}
          </Badge>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <h3 className="tex-lg sm:text-xl font-bold text-foreground mb-2">
            {sale?.title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {sale?.description}
          </p>
        </div>

        {sale?.couponCode && (
          <div className="bg-secondary/50 p-2 rounded border border-border mt-2">
            <p className="text-xs text-muted-foreground mb-1">Coupon Code:</p>
            <p className="font-mono font-bold text-primary select-all">
              {sale.couponCode}
            </p>
          </div>
        )}

        {/* Placeholder for future detailed view or product list toggle */}
        {sale?.products && sale.products.length > 0 && (
          <div className="mt-auto pt-4">
            <Button variant="outline" className="w-full">
              View Eligible Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleCard;
