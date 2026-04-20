import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
}

const Logo = ({ children, className }: Props) => {
  return (
    <Link href={"/"}>
      <h2
        className={cn(
          "text-3xl text-primary font-black tracking-[0.2em] uppercase font-mono",
          className,
        )}
      >
        {children}
      </h2>
    </Link>
  );
};

export default Logo;
