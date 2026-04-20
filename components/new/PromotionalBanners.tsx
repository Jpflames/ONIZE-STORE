import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { bannerImageOne, bannerImageTwo } from "@/images";
import { StaticImageData } from "next/image";

interface Banner {
  href: string;
  badge: string;
  BadgeIcon: LucideIcon;
  badgeBg: string;
  badgeText: string;
  title: string;
  titleAccent?: string;
  cta: string;
  ctaBg: string;
  ctaText: string;
  containerBg: string;
  containerText: string;
  image: StaticImageData;
  imageAlt: string;
  fadeFrom: string;
}

const banners: Banner[] = [
  {
    href: "/offers",
    badge: "New Arrivals",
    BadgeIcon: Sparkles,
    badgeBg: "bg-primary-foreground/15",
    badgeText: "text-primary-foreground",
    title: "Elevate Your\nDigital Lifestyle",
    cta: "Shop Now",
    ctaBg: "bg-primary-foreground",
    ctaText: "text-primary",
    containerBg: "bg-primary",
    containerText: "text-primary-foreground",
    image: bannerImageOne,
    imageAlt: "New Arrivals",
    fadeFrom: "from-primary",
  },
  {
    href: "/deals",
    badge: "Seasonal Sale",
    BadgeIcon: TrendingUp,
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
    title: "Premium Tech\n",
    titleAccent: "Up to 40% Off",
    cta: "Grab the Deal",
    ctaBg: "bg-primary",
    ctaText: "text-primary-foreground",
    containerBg: "bg-card",
    containerText: "text-foreground",
    image: bannerImageTwo,
    imageAlt: "Seasonal Sale",
    fadeFrom: "from-card",
  },
];

export default function PromotionalBanners() {
  return (
    <section className="py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      {banners.map((banner) => {
        const { BadgeIcon } = banner;
        const [line1, line2] = banner.title.split("\n");

        return (
          <Link
            key={banner.href}
            href={banner.href}
            className={`group flex flex-row overflow-hidden rounded-2xl border border-border shadow-lg hover:shadow-xl hoverEffect ${banner.containerBg} ${banner.containerText}`}
          >
            {/* Left: Text */}
            <div className="flex flex-col justify-between p-8 flex-1 min-w-0 z-10 py-12 space-y-8">
              {/* Badge */}
              <span
                className={`inline-flex items-center gap-1.5 w-fit text-[11px] font-bold uppercase tracking-widest ${banner.badgeBg} ${banner.badgeText} rounded-full px-3 py-1 border border-current/20`}
              >
                <BadgeIcon className="w-3.5 h-3.5" />
                {banner.badge}
              </span>

              {/* Heading + CTA */}
              <div>
                <h2 className="text-2xl md:text-3xl font-black leading-tight mb-8 tracking-tight whitespace-pre-line">
                  {line1}
                  {line2 && (
                    <>
                      <br />
                      {banner.titleAccent ? (
                        <span className="text-primary">
                          {banner.titleAccent}
                        </span>
                      ) : (
                        line2
                      )}
                    </>
                  )}
                </h2>
                <span
                  className={`inline-flex items-center gap-2 text-sm font-bold ${banner.ctaBg} ${banner.ctaText} px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-md group-hover:gap-3`}
                >
                  {banner.cta} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Right: Image (full height) */}
            <div className="relative w-1/2 shrink-0 self-stretch overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.imageAlt}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              {/* Fade overlay from left */}
              <div
                className={`absolute inset-0 bg-linear-to-r ${banner.fadeFrom} via-transparent to-transparent opacity-60`}
              />
            </div>
          </Link>
        );
      })}
    </section>
  );
}
