import { backendClient } from "@/sanity/lib/backendClient";
import OrdersTable from "./OrdersTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const metadata = { title: "Admin — Orders | ONIZE" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  let fetchError = null;

  try {
    orders = await backendClient.fetch(
      `*[_type == "order"] | order(orderDate desc){
        _id, orderNumber, customerName, email, phone, orderDate,
        status, paymentStatus, totalPrice,
        "itemCount": count(products)
      }`,
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    fetchError =
      "There was an error connecting to Sanity. Ensure SANITY_API_TOKEN is set.";
  }

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {safeOrders.length} total
          </p>
        </div>
      </div>

      {fetchError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      <OrdersTable orders={safeOrders} />
    </div>
  );
}
