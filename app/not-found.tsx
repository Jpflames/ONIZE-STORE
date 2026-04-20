"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Mail, ChevronRight } from "lucide-react";
import Logo from "@/components/new/Logo";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl w-full"
      >
        {/* Logo Section */}
        <div className="mb-12 flex justify-center">
          <Logo>ONIZE</Logo>
        </div>

        {/* 404 Display */}
        <div className="relative inline-block mb-8">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-black to-black/10 select-none"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-linear-to-r from-transparent via-black/5 to-transparent" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Oops! Page not found
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-black/90 transition-all active:scale-95 hoverEffect"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <Link
              href="/shop"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-black font-semibold rounded-full border border-black/10 hover:bg-black/5 transition-all active:scale-95 hoverEffect"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Support Links */}
          <div className="mt-16 pt-8 border-t border-black/5 flex flex-wrap justify-center gap-8 text-sm">
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-black flex items-center gap-2 transition-colors group"
            >
              <Mail className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
              Contact Support
            </Link>
            <Link
              href="/help"
              className="text-muted-foreground hover:text-black flex items-center gap-2 transition-colors group"
            >
              <ChevronRight className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors" />
              Help center
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
