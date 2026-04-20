"use client";
import { productType } from "@/constants";
import { Repeat } from "lucide-react";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center gap-1.5 text-sm font-semibold">
      <div className="flex items-center gap-1.5">
        {productType?.map((item) => (
          <button
            onClick={() => onTabSelect(item?.title)}
            key={item?.title}
            className={`border border-primary px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-primary hover:text-primary-foreground cursor-pointer hoverEffect ${selectedTab === item?.title && "bg-primary text-primary-foreground"}`}
          >
            {item?.title}
          </button>
        ))}
      </div>
      <button className="border border-primary px-2 py-2 rounded-full hover:bg-primary hover:text-primary-foreground hoverEffect">
        <Repeat className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HomeTabbar;
