import React from "react";
import WishlistClient from "@/components/new/WishlistClient";
import Breadcrumb from "@/components/Breadcrumb";

const WishlistPage = () => {
  return (
    <div className="pb-10">
      <Breadcrumb />
      <WishlistClient />
    </div>
  );
};

export default WishlistPage;
