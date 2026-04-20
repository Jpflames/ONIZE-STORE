"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/actions/newsletter.actions";

export default function NewsletterSection() {
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
    <section className="py-24 relative overflow-hidden rounded-3xl bg-primary text-primary-foreground mb-10">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-black/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <div className="w-16 h-16 bg-white/10 backdrop-blur-md flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-xl border border-white/20">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Never miss an update.
        </h2>
        <p className="text-primary-foreground/80 md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Get the latest products, exclusive offers, and inspiration delivered
          straight to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            placeholder="Enter your email address"
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white h-12 px-5 rounded-full"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={isPending}
            className="h-12 px-8 rounded-full font-semibold shrink-0 shadow-xl transition-transform hover:scale-105 disabled:opacity-50"
          >
            {isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-xs text-primary-foreground/60 mt-4">
          We care about your data. Read our{" "}
          <span className="underline cursor-pointer hover:text-white">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </section>
  );
}
