"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import Container from "./Container";

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <div className="bg-muted/30 py-4 border-b border-border mb-6">
      <Container>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors hoverEffect"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {pathnames.length > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          )}

          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            // Clean up titles (e.g., product -> Product, slug -> capitalized)
            const title =
              value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

            return (
              <React.Fragment key={to}>
                {last ? (
                  <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
                    {title}
                  </span>
                ) : (
                  <>
                    <Link
                      href={to}
                      className="text-muted-foreground hover:text-primary transition-colors hoverEffect capitalize"
                    >
                      {title}
                    </Link>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumb;
