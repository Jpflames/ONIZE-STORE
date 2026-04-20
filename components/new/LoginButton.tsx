"use client";
import React from "react";
import useLoginSidebar from "@/hooks/useLoginSidebar";

const LoginButton = () => {
  const { open } = useLoginSidebar();

  return (
    <button
      onClick={open}
      className="text-sm font-semibold hover:text-primary hoverEffect cursor-pointer"
    >
      Login
    </button>
  );
};

export default LoginButton;
