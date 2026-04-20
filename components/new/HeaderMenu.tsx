"use client";
import { headerData } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex items-center gap-7 text-sm font-semibold tracking-wide uppercase">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`hover:text-primary hoverEffect relative group py-1 ${
            pathname === item?.href
              ? "text-primary px-0"
              : "text-muted-foreground"
          }`}
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
    </div>
  );
};

export default HeaderMenu;
