"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUpRightIcon,
  ChatCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <div
      className={cn(
        "fixed top-3 left-1/2 z-[40] w-full -translate-x-1/2 px-4 transition-all duration-500 ease-in-out md:top-4",
        scrolled ? "top-3 max-w-4xl pt-0 md:top-8" : "max-w-5xl pt-4",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between rounded-2xl p-2 transition-all duration-500 ease-in-out",
          scrolled ? "bg-muted/80 backdrop-blur-md" : "",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="from-primary drop-shadow-primary flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr to-pink-500 drop-shadow-md">
            <ChatCircleIcon weight="bold" className="size-5" />
          </div>
          <h1 className="font-semibold">1AI</h1>
        </div>
        <div className="flex items-center gap-5 font-semibold">
          <Link href="/">Pricing</Link>
          <Link href="/">Testimonials</Link>
          <Button className="rounded-xl" asChild>
            <Link href="/ask">
              Chat with T3 <ArrowUpRightIcon weight="bold" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
