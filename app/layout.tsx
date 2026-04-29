import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://onize.reactbd.com"),
  title: {
    default: "ONIZE | Premium Ecommerce Experience",
    template: "%s | ONIZE",
  },
  description:
    "Experience the ultimate shopping journey with ONIZE. High-quality products, amazing deals, and a seamless checkout experience.",
  keywords: ["ecommerce", "shopping", "onize", "fashion", "deals"],
  authors: [{ name: "ReactBD" }],
  creator: "ReactBD",
  publisher: "ReactBD",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onize.reactbd.com",
    siteName: "ONIZE",
    title: "ONIZE | Premium Ecommerce Experience",
    description:
      "Experience the ultimate shopping journey with ONIZE. High-quality products, amazing deals, and a seamless checkout experience.",
    images: [
      {
        url: "/og-image.jpg", // Make sure this exists in public/
        width: 1200,
        height: 630,
        alt: "ONIZE - Ecommerce App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONIZE | Premium Ecommerce Experience",
    description:
      "Experience the ultimate shopping journey with ONIZE. High-quality products, amazing deals, and a seamless checkout experience.",
    images: ["/og-image.jpg"],
    creator: "@reactbd",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
