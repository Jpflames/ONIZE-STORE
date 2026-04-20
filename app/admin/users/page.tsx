import { clerkClient } from "@clerk/nextjs/server";
import { format } from "date-fns";
import ExportUsersDialog from "./ExportUsersDialog";
import UsersTable from "./UsersTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const metadata = { title: "Admin — Users | ONIZE" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let users: any[] = [];
  let fetchError = null;

  try {
    const clerk = await clerkClient();
    const response = await clerk.users.getUserList({ limit: 500 });
    users = response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    fetchError =
      "There was an error connecting to Clerk. Please check your CLERK_SECRET_KEY.";
  }

  const adminEmails = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const safeUsers = Array.isArray(users) ? users : [];

  const serializedUsers = safeUsers.map((user) => {
    const email = user.emailAddresses[0]?.emailAddress;
    const isAdmin = adminEmails.includes((email ?? "").toLowerCase());
    const joined = format(new Date(user.createdAt), "dd MMM yyyy");

    return {
      id: user.id,
      imageUrl: user.imageUrl,
      fullName: user.fullName,
      email,
      isAdmin,
      joined,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {serializedUsers.length} registered
          </p>
        </div>
        <ExportUsersDialog users={serializedUsers} />
      </div>

      {fetchError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      <UsersTable users={serializedUsers} />
    </div>
  );
}
