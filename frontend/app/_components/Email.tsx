"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function Email({
  setEmail,
  setStep,
  email,
}: {
  setEmail: (email: string) => void;
  setStep: (step: string) => void;
  email: string;
}) {
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendingRequest(true);
    fetch(`${BACKEND_URL}/auth/initiate_signin`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setStep("otp");
          toast.success("OTP sent to email");
        } else {
          toast.error("Failed to send OTP, please retry after a few minutes");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send OTP, please retry after a few minutes");
      })
      .finally(() => {
        setSendingRequest(false);
      });
  };

  return (
    <div className="mx-auto w-full max-h-screen max-w-sm px-2 sm:px-0">
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <h1 className="text-3xl font-serif text-foreground">
          Welcome to 1<span className="text-orange-400">ai</span>
        </h1>
        <form onSubmit={handleAuth} className="w-full flex flex-col gap-3">
          <div className="border border-zinc-400/15 focus-within:border-transparent focus-within:ring-1 rounded-xl focus-within:ring-orange-400/80 dark:focus-within:ring-orange-400/60">
            <Input
              className="border-none dark:bg-transparent focus:border-none focus-visible:ring-0 outline-none focus:ring-0"
              spellCheck={false}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <Button
            type="submit"
            disabled={!isEmailValid(email) || sendingRequest}
            variant="accent"
            className="w-full text-sm text-white bg-[#fa7319] hover:bg-[#fa7319]/90 h-10 px-3.5 rounded-xl inset-shadow-sm inset-shadow-white/60 font-medium border border-black/4 outline-0"
          >
            Continue with Email
          </Button>
        </form>
        <div className="mt-2">
          <Tooltip>
            <TooltipTrigger>
              <div className="group text-muted-foreground text-sm font-serif">
                <Link
                  href="/terms"
                  className="text-muted-foreground group-hover:text-orange-400 hover:underline hover:underline-offset-3"
                >
                  Terms
                </Link>{" "}
                <span className="group-hover:text-orange-400">and </span>
                <Link
                  href="/privacy"
                  className="text-muted-foreground group-hover:text-orange-400 hover:underline hover:underline-offset-3"
                >
                  Privacy Policy
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={1} className="bg-orange-400">
              <p>By continuing, you agree</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
