"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/utils";
import { toast } from "sonner";

export function Otp({ email }: { email: string }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; 
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {

      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    const pastedArray = pastedData.split("").slice(0, 6);
    
    const newOtp = [...otp];
    pastedArray.forEach((char, index) => {
      if (index < 6 && /^\d$/.test(char)) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    
    
    const nextEmptyIndex = newOtp.findIndex(char => char === "");
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const getOtpString = () => otp.join("");

  const handleLogin = async () => {
    const otpString = getOtpString();
    if (otpString.length !== 6) return;

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        body: JSON.stringify({ email, otp: otpString }),
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
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <Input disabled placeholder="Email" value={email} />

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {otp.map((digit, index) => (
                <React.Fragment key={index}>
                  <Input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-md"
                    placeholder=""
                  />
                  {index === 2 && (
                    <div className="mx-2 text-muted-foreground font-bold text-xl">-</div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>
          
          <Button
            variant="accent"
            onClick={handleLogin}
            className="w-full h-12"
            disabled={getOtpString().length !== 6}
          >
            Login
          </Button>
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
