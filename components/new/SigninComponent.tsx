"use client";
import { SignIn, SignUp } from "@clerk/nextjs";
import React, { useState } from "react";

const SigninComponent = () => {
  const appearance = {
    elements: {
      formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm normal-case",
      card: "shadow-none border-none p-0 w-full",
      headerTitle: "text-2xl font-bold tracking-tight",
      headerSubtitle: "text-sm text-muted-foreground",
      footerActionLink: "text-primary hover:text-primary/90 font-bold",
    },
  };

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div className="flex items-center justify-center w-full">
      <SignIn
        appearance={appearance}
        routing="hash"
        signUpUrl="/auth/signup"
        fallbackRedirectUrl={currentPath}
        forceRedirectUrl={currentPath}
      />
    </div>
  );
};

export default SigninComponent;
