import { backendClient } from "@/sanity/lib/backendClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import SubscriptionsTable from "./SubscriptionsTable";

export const metadata = { title: "Admin — Subscriptions | ONIZE" };

export default async function AdminSubscriptionsPage() {
  let subscribers: any[] = [];
  let fetchError = null;

  try {
    subscribers = await backendClient.fetch(
      `*[_type == "subscriber"] | order(subscribedAt desc){
        _id, email, subscribedAt
      }`,
    );
  } catch (error) {
    console.error("Failed to fetch subscribers:", error);
    fetchError =
      "There was an error connecting to Sanity. Ensure SANITY_API_TOKEN is set.";
  }

  const safeSubscribers = Array.isArray(subscribers) ? subscribers : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {safeSubscribers.length} total subscribers
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

      <SubscriptionsTable subscribers={safeSubscribers} />
    </div>
  );
}
