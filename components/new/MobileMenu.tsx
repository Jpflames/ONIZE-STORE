"use client";

import { AlignLeft } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { CATEGORIES_QUERY_RESULT } from "@/sanity.types";

const MobileMenu = ({
  categories,
}: {
  categories: CATEGORIES_QUERY_RESULT;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-2 hover:text-primary cursor-pointer hoverEffect md:hidden"
      >
        <AlignLeft className="w-6 h-6" />
      </button>
      <div className="md:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          categories={categories}
        />
      </div>
    </>
  );
};

export default MobileMenu;
