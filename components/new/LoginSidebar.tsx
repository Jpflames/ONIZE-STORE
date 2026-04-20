"use client";
import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "@clerk/nextjs";
import useLoginSidebar from "@/hooks/useLoginSidebar";
import { useOutsideClick } from "@/hooks";
import { useEffect } from "react";
import Logo from "./Logo";
import SigninComponent from "./SigninComponent";

const LoginSidebar = () => {
  const { isOpen, close } = useLoginSidebar();
  const handleClose = () => {
    close();
    // Clear hash when closing
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const ref = useOutsideClick<HTMLDivElement>(handleClose);
  const { user } = useUser();

  useEffect(() => {
    if (user && isOpen) {
      handleClose();
    }
  }, [user, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] transition-all duration-300 ease-in-out">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            // Let useOutsideClick handle the closure to avoid double-triggering or propagation issues
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            ref={ref}
            className="absolute right-0 top-0 w-full max-w-md bg-background h-full text-foreground p-8 md:p-10 border-l border-border shadow-2xl flex flex-col gap-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <Logo>ONIZE</Logo>
              <button
                onClick={handleClose}
                className="p-2 -mr-2 hover:text-primary hoverEffect cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col flex-1 justify-center gap-6">
              <SigninComponent />
            </div>

            <div className="mt-auto pt-8 text-center text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">
              <p>Secure checkout powered by Clerk</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginSidebar;
