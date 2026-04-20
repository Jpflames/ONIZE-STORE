import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Mail, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export const metadata = { title: "Settings | ONIZE" };

export default async function UserSettingsPage() {
  const user = await currentUser();

  const fields = [
    {
      label: "Full Name",
      value: user?.fullName ?? "—",
      icon: User,
    },
    {
      label: "Email Address",
      value: user?.primaryEmailAddress?.emailAddress ?? "—",
      icon: Mail,
    },
    {
      label: "Member Since",
      value: user?.createdAt
        ? format(new Date(user.createdAt), "MMMM yyyy")
        : "—",
      icon: Calendar,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your personal information and account preferences.
      </p>

      {/* Profile info (read-only — managed by Clerk) */}
      <div className="border border-border mb-8">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Profile Information
          </h2>
        </div>
        <div className="divide-y divide-border">
          {fields.map((field) => (
            <div
              key={field.label}
              className="px-5 py-4 flex items-center gap-4"
            >
              <field.icon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {field.label}
                </p>
                <p className="text-sm font-medium truncate">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar */}
      {user?.imageUrl && (
        <div className="border border-border mb-8">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Avatar
            </h2>
          </div>
          <div className="px-5 py-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.imageUrl}
              alt="Your avatar"
              className="w-14 h-14 rounded-full object-cover border border-border"
            />
            <div>
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Profile photo is managed through Clerk
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        To update your name, email, or password, use the{" "}
        <span className="underline">Manage Account</span> option in the user
        menu.
      </p>
    </div>
  );
}
