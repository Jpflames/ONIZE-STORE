import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Logo from "@/components/new/Logo";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  // If user is already logged in, redirect to home
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary hoverEffect group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo>ONIZE</Logo>
        </div>
        <div className="w-24 px-4 hidden md:block" /> {/* Spacer for balance */}
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[450px]">{children}</div>
      </main>

      {/* Optional: Minimal Footer or background elements */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-muted/20 to-transparent -z-10 pointer-events-none" />
    </div>
  );
};

export default AuthLayout;
