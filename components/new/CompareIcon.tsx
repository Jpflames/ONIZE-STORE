"use client";

import Link from "next/link";
import { BarChart2 } from "lucide-react";
import useCompareStore from "@/compareStore";
import { useEffect, useState } from "react";

const CompareIcon = () => {
  const [isClient, setIsClient] = useState(false);
  const count = useCompareStore((state) => state.items.length);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link
      href="/compare"
      className="relative hover:text-primary transition-colors group"
      aria-label="Compare products"
    >
      <BarChart2 className="w-5 h-5 group-hover:text-primary hoverEffect" />
      {isClient && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
          {count}
        </span>
      )}
    </Link>
  );
};

export default CompareIcon;
