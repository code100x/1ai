"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/utils";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function Otp({ email }: { email: string }) {
  const [otp, setOtp] = useState("");
  // State to keep track of OTP expiration timer (starts at 30 seconds)
  const [timeLeft, setTimeLeft] = useState(30);

  // Countdown timer effect that decreases timeLeft every second until it reaches 0
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        toast(data.message);
      }

      if (response.status === 429) {
        toast(data.message);
      }

      if (response.status === 200) {
        localStorage.setItem("token", data.token);

        window.location.href = "/";
      } else if (response.status !== 401 && response.status !== 429) {
        toast(data.message || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Some error occured ", error);
    }
  };

  // Function to reset the auth flow by reloading the page when OTP expires
  const handleTryAgain = () => {
    window.location.reload();
  };

  return (
    <div className="mx-auto max-h-screen max-w-6xl">
      <div className="absolute top-4 left-4">
        {/* <Button asChild variant="ghost" className="font-semibold" onClick={() => router.push("/auth")}>
            <Link className="flex items-center gap-2" href="/">
              <ArrowLeft className="size-4" />
              Back to chat
            </Link>
          </Button> */}
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter">
            Welcome to <span className="text-primary">1ai</span>
          </h1>
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <Input disabled placeholder="Email" value={email} />
          <p className="text-sm text-muted-foreground">
            OTP has been sent to your email
          </p>

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-12 w-10 text-xl font-semibold rounded-xl border border-input bg-muted/50 shadow-sm flex items-center justify-center transition-all duration-200 
                   focus-within:ring-2 focus-within:ring-primary focus-within:border-primary
                   data-[active=true]:scale-105 data-[active=true]:border-primary"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          
          {/* Show timer countdown if OTP is still valid, else show expired text */}
          {timeLeft > 0 ? (
            <p className="text-sm text-muted-foreground">
              OTP expires in <span className="font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <p className="text-sm text-red-500 font-medium">OTP expired</p>
          )}

          {/* Show Login button if OTP still valid, else show Start Over button */}
          {timeLeft > 0 ? (
            <Button
              variant="accent"
              onClick={handleLogin}
              className="w-full h-12"
            >
              Login
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleTryAgain}
              className="w-full h-12"
            >
              Start Over
            </Button>
          )}
        </div>
        <div className="text-muted-foreground text-sm">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-muted-foreground font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-muted-foreground font-medium">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
