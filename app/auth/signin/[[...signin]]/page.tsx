import { SignIn } from "@clerk/nextjs";
import React from "react";
import Container from "@/components/Container";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = await currentUser();
  if (user) {
    redirect("/");
  }

  const appearance = {
    elements: {
      rootBox: "mx-auto w-full",
      card: "shadow-2xl border border-border/50 bg-card rounded-2xl overflow-hidden",
      headerTitle: "text-2xl font-bold tracking-tight text-foreground",
      headerSubtitle: "text-sm text-muted-foreground",
      formButtonPrimary:
        "bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold h-12 rounded-xl transition-all active:scale-[0.98] border-none",
      formFieldInput:
        "bg-muted/50 border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl h-11 transition-all",
      footerActionLink:
        "text-primary hover:text-primary/80 font-bold transition-colors",
      identityPreviewText: "text-foreground",
      formFieldLabel:
        "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1",
      dividerLine: "bg-border",
      dividerText:
        "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
      socialButtonsBlockButton:
        "bg-background border border-border hover:bg-muted/50 rounded-xl h-11 transition-all text-sm font-semibold",
      socialButtonsBlockButtonText: "font-semibold",
    },
  };

  return (
    <div className="bg-muted/30 min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <SignIn
          appearance={appearance}
          routing="path"
          path="/auth/signin"
          signUpUrl="/auth/signup"
        />

        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="w-8 h-px bg-border"></span>
            Secure checkout powered by Clerk
            <span className="w-8 h-px bg-border"></span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[280px] mx-auto">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default SignInPage;
