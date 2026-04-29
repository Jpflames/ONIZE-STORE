import React from "react";
import Image from "next/image";
import Title from "../Title";
import bannerImage from "@/images/banners/3.jpg";

const HomeBanner = () => {
  return (
    <section className="relative overflow-hidden p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            New Season Collection
          </span>
          <Title className="uppercase text-3xl md:text-5xl font-extrabold leading-tight">
            Quality Bags Collection
          </Title>
          <p className="text-sm md:text-base text-muted-foreground/90 font-medium max-w-[520px]">
            Discover premium craftsmanship, timeless design, and everyday
            elegance. Shop our latest women&apos;s fashion and lifestyle essentials.
          </p>
        </div>

        <div className="relative h-[260px] md:h-[340px] w-full overflow-hidden rounded-2xl border border-border/70 bg-muted/30 shadow-xl">
          <Image
            src={bannerImage}
            alt="Professional fashion bag collection showcase"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
