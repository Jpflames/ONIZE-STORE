"use client";

import React, { useEffect } from "react";
import useShareSidebar from "@/store/useShareSidebar";
import Image from "next/image";
import { X, Copy, Check } from "lucide-react";
import {
  FaTwitter,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaReddit,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ShareSidebar = () => {
  const { isOpen, close, productSlug, productName, productImage } =
    useShareSidebar();
  const [copied, setCopied] = React.useState(false);
  const [productUrl, setProductUrl] = React.useState(`/product/${productSlug}`);

  // Resolve the full absolute URL only on the client to avoid hydration mismatch
  React.useEffect(() => {
    setProductUrl(`${window.location.origin}/product/${productSlug}`);
  }, [productSlug]);

  const encodedUrl = encodeURIComponent(productUrl);
  const encodedName = encodeURIComponent(productName);

  const platforms = [
    {
      name: "Twitter / X",
      icon: <FaTwitter className="w-5 h-5" />,
      color: "bg-black hover:bg-zinc-800",
      url: `https://twitter.com/intent/tweet?text=${encodedName}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="w-5 h-5" />,
      color: "bg-[#1877F2] hover:bg-[#1564d3]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="w-5 h-5" />,
      color: "bg-[#25D366] hover:bg-[#1fb855]",
      url: `https://wa.me/?text=${encodedName}%20${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-5 h-5" />,
      color: "bg-[#0077B5] hover:bg-[#006097]",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedName}`,
    },
    {
      name: "Reddit",
      icon: <FaReddit className="w-5 h-5" />,
      color: "bg-[#FF4500] hover:bg-[#e03d00]",
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedName}`,
    },
    {
      name: "Email",
      icon: <MdEmail className="w-5 h-5" />,
      color: "bg-muted hover:bg-muted/80 text-foreground",
      url: `mailto:?subject=${encodedName}&body=Check%20out%20this%20product%3A%20${encodedUrl}`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [close]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-100 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl z-101 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold">Share Product</h2>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product preview */}
        {productImage && (
          <div className="flex items-center gap-4 p-5 border-b border-border bg-muted/30">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm line-clamp-2">
                {productName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {productUrl}
              </p>
            </div>
          </div>
        )}

        {/* Platform buttons */}
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Share via
          </p>
          <div className="flex flex-col gap-2">
            {platforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() =>
                  window.open(platform.url, "_blank", "noopener,noreferrer")
                }
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all ${platform.color}`}
              >
                {platform.icon}
                {platform.name}
              </button>
            ))}
          </div>

          {/* Copy link */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Or copy link
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
              <p className="flex-1 text-xs text-muted-foreground truncate">
                {productUrl}
              </p>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareSidebar;
