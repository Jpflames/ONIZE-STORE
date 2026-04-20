import Link from "next/link";
import React from "react";
import { ClerkLoaded, SignedIn } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Container from "./Container";
import { getAllCategories, getMyOrders } from "@/sanity/helpers";
import HeaderMenu from "./new/HeaderMenu";
import Logo from "./new/Logo";
import CartIcon from "./new/CartIcon";
import MobileMenu from "./new/MobileMenu";
import SearchBar from "./new/SearchBar";
import TopBanner from "./new/TopBanner";
import UserMenu from "./new/UserMenu";
import LoginButton from "./new/LoginButton";
import WishlistIcon from "./new/WishlistIcon";
import CompareIcon from "./new/CompareIcon";
import { isAdminEmailServer } from "@/lib/admin";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (user) {
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (email) orders = await getMyOrders(email);
  }
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const isAdmin = isAdminEmailServer(email);
  const categories = await getAllCategories(3);

  return (
    <>
      <header className="bg-background sticky top-0 z-50 border-b border-border/50">
        <TopBanner />
        <Container className="flex items-center justify-between gap-4 text-muted-foreground py-4">
          {/* Left: Navigation Menu */}
          <div className="flex-1 flex items-center justify-start">
            <HeaderMenu />
            <div className="md:hidden flex items-center gap-2">
              <MobileMenu categories={categories} />
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex items-center justify-center">
            <Logo>ONIZE</Logo>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-3 md:gap-5">
            <SearchBar />
            <CompareIcon />
            <WishlistIcon />
            <CartIcon />
            <ClerkLoaded>
              <SignedIn>
                <UserMenu isAdmin={isAdmin} />
              </SignedIn>
              {!user && <LoginButton />}
            </ClerkLoaded>
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;
