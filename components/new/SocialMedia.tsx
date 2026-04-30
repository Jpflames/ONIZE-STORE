"use client";

import { Instagram, Youtube } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="currentColor"
  >
    <path d="M9 7.1h2.2v6.5c0 1.8 1.1 3.4 2.8 4.1 1 .4 2.2.4 3.3.1v2c-1.5.4-3 .2-4.4-.6A5.9 5.9 0 0 1 10 13.4V7.1ZM17.2 6.1V3.5h2.3v2.6a4.4 4.4 0 0 0 3.2 1.3v2.3c-1.3 0-2.5-.3-3.6-1A6.6 6.6 0 0 1 17.2 6.1Z" />
  </svg>
);

const socialLink = [
  {
    title: "Youtube",
    href: "https://youtube.com/@onizecrochets?si=NMqp5J4wSB2YLkLf",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/onizecrochet?igsh=MzNveTNneTk2MXIw",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    title: "TikTok",
    href: "https://www.tiktok.com/@onize_crochets?_r=1&_t=ZS-95wxLmtjCL6",
    icon: <TikTokIcon />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex items-center gap-3.5 text-muted-foreground",
          className
        )}
      >
        {socialLink.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 border border-border rounded-full hover:text-primary hover:border-primary hoverEffect transition-colors",
                  iconClassName
                )}
              >
                {item.icon}
              </a>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-popover text-popover-foreground font-semibold",
                tooltipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;