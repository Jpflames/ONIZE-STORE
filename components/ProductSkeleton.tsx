"use client";

import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden group text-sm animate-pulse">
      <div className="h-72 bg-muted/60 rounded-lg" />
      <div className="py-3 px-2 flex flex-col gap-3 bg-card border border-border border-t-0 rounded-md rounded-tl-none rounded-tr-none">
        <div className="h-5 bg-muted/80 rounded w-3/4" />
        <div className="h-4 bg-muted/60 rounded w-full" />
        <div className="h-6 bg-muted/80 rounded w-1/4 mt-1" />
        <div className="h-10 bg-muted/60 rounded-md w-full mt-1" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
