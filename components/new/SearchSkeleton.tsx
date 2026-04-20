"use client";

import React from "react";

const SearchSkeleton = () => {
  return (
    <div className="flex items-center gap-5 py-5 first:pt-0 animate-pulse">
      {/* Image Placeholder */}
      <div className="h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-lg bg-muted/60" />

      {/* Info Placeholder */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="h-5 bg-muted/80 rounded w-1/2" />
        <div className="h-4 bg-muted/60 rounded w-3/4" />
        <div className="h-4 bg-muted/80 rounded w-1/4 mt-2" />
      </div>

      {/* Button Placeholder */}
      <div className="shrink-0 w-36 hidden sm:block h-10 bg-muted/60 rounded-md" />
    </div>
  );
};

export default SearchSkeleton;
