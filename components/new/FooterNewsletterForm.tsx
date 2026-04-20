"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/actions/newsletter.actions";
import toast from "react-hot-toast";

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(result.error || "Failed to subscribe.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
