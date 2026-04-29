"use client";

import { Facebook, Github, Linkedin, Slack, Youtube, Instagram  } from "lucide-react";
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

const socialLink = [
  {
    title: "Youtube",
    href: "https://youtube.com/@onizecrochets?si=NMqp5J4wSB2YLkLf",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Github",
    href: "",
    icon: <Github className="w-5 h-5" />,
  },
  {
    title: "Linkedin",
    href: "",
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: "Slack",
    href: "",
    icon: <Slack className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com/onizecrochet?igsh=MzNveTNneTk2MXIw",
    icon: <Instagram className="w-5 h-5" />,
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