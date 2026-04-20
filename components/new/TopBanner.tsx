"use client";
import React, { useState, useEffect } from "react";
import Container from "../Container";

const TopBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 15,
    minutes: 45,
    seconds: 37,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-primary text-primary-foreground py-2 text-center text-xs md:text-sm font-semibold tracking-wide">
      <Container className="flex items-center justify-center gap-2 md:gap-4 uppercase">
        <span>Get 25% Off This Summer Sale. Grab It Fast!!</span>
        <div className="flex items-center gap-1 font-mono">
          <span>{String(timeLeft.hours).padStart(2, "0")}H</span>
          <span>:</span>
          <span>{String(timeLeft.minutes).padStart(2, "0")}M</span>
          <span>:</span>
          <span>{String(timeLeft.seconds).padStart(2, "0")}S</span>
        </div>
      </Container>
    </div>
  );
};

export default TopBanner;
