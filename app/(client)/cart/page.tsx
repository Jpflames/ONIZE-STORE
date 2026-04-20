import Container from "@/components/Container";
import CartClient from "@/components/CartClient";
import { currentUser } from "@clerk/nextjs/server";
import { ShoppingBag } from "lucide-react";
import React from "react";
import { getUserAddress } from "@/sanity/helpers";

export const metadata = { title: "Shopping Cart | ONIZE" };

export default async function CartPage() {
  return (
    <div>
      <CartClient />
    </div>
  );
}
