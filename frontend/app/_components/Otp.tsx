"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/utils";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function Otp({ email }: { email: string }) {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/initiate_signin`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast("New verification code sent to your email");
      } else {
        toast(data.message || "Failed to resend code");
      }
    } catch (error) {
      toast("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleLogin = async (otpValue?: string) => {
    const currentOtp = otpValue || otp;
    console.log("handleLogin called with:", { currentOtp, isSubmitting, length: currentOtp.length });
    if (currentOtp.length !== 6 || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        body: JSON.stringify({ email, otp: currentOtp }),
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
      toast("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Email Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter the verification code sent to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="w-full flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                // Auto-submit when OTP is complete
                if (value.length === 6) {
                  console.log("Auto-submitting OTP:", value);
                  setTimeout(() => handleLogin(value), 50);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && otp.length === 6) {
                  handleLogin(otp);
                }
              }}
              className="flex justify-center"
            >
              <InputOTPGroup className="flex gap-2">
                <InputOTPSlot index={0} className="w-12 h-12 text-xl font-semibold rounded-lg" />
                <InputOTPSlot index={1} className="w-12 h-12 text-xl font-semibold rounded-lg" />
                <InputOTPSlot index={2} className="w-12 h-12 text-xl font-semibold rounded-lg" />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-3" />
              <InputOTPGroup className="flex gap-2">
                <InputOTPSlot index={3} className="w-12 h-12 text-xl font-semibold rounded-lg" />
                <InputOTPSlot index={4} className="w-12 h-12 text-xl font-semibold rounded-lg" />
                <InputOTPSlot index={5} className="w-12 h-12 text-xl font-semibold rounded-lg" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Resend Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't get a code?{" "}
              <button
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-primary hover:text-primary/90 underline underline-offset-4 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            </p>
          </div>

          {/* Verify Button - Always visible, disabled when incomplete */}
          <Button
            onClick={() => handleLogin()}
            disabled={otp.length !== 6 || isSubmitting}
            className="w-full h-11"
            variant="default"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}
