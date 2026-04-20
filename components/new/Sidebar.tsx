import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import Logo from "./Logo";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import SocialMedia from "./SocialMedia";
import { CATEGORIES_QUERY_RESULT } from "@/sanity.types";
import { cn } from "@/lib/utils";
import { headerData } from "@/constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CATEGORIES_QUERY_RESULT;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible",
      )}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        ref={sidebarRef}
        className="relative w-full max-w-sm bg-background h-full text-foreground p-8 md:p-10 border-r border-border shadow-2xl flex flex-col gap-8 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <Logo>ONIZE</Logo>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:text-primary hoverEffect cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-6 text-lg font-medium tracking-wide">
          {headerData?.map((item) => (
            <Link
              onClick={onClose}
              key={item?.title}
              href={item?.href}
              className={cn(
                "hover:text-primary hoverEffect relative group py-1 self-start",
                pathname === item?.href
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {item?.title}
              <span
                className={cn(
                  "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                  pathname === item?.href && "w-full",
                )}
              />
            </Link>
          ))}

          {categories?.length > 0 && (
            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-primary">
                Categories
              </p>
              <nav className="flex flex-col gap-4">
                {categories?.map((item) => {
                  const href = `/category/${item?.slug?.current}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      onClick={onClose}
                      key={item?._id}
                      href={href}
                      className={cn(
                        "hover:text-primary hoverEffect relative group py-1 self-start capitalize text-sm font-semibold",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item?.title}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                          isActive && "w-full",
                        )}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </nav>

        <div className="mt-auto pt-8 border-t border-border">
          <p className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest">
            Follow Us
          </p>
          <SocialMedia iconClassName="border-border hover:border-primary" />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
