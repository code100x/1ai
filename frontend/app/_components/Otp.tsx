"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/utils";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

export function Otp({
  email,
  setStep,
}: {
  email: string;
  setStep: (step: string) => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const stored = sessionStorage.getItem("timerSeconds");
    const parsed = stored !== null ? parseInt(stored, 10) : 0;
    return isNaN(parsed) ? 0 : parsed;
  });

  const form = useForm<{ otp: string }>({
    resolver: zodResolver(
      z.object({
        otp: z
          .string()
          .min(6, { message: "Please enter the 6-digit verification code" })
          .max(6, { message: "Please enter the 6-digit verification code" }),
      })
    ),
    defaultValues: { otp: "" },
  });

  const onResendOtp = async () => {
    setLoading(true);
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
        setLoading(false);
        setTimerSeconds(30);
        triggerTimer();
        toast("OTP resent successfully");
      } else {
        setLoading(false);
        toast(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setLoading(false);
      toast("Failed to resend OTP");
    }
  };

  const triggerTimer = () => {
    const interval = setInterval(function () {
      setTimerSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    triggerTimer();
    setOtp("");
  }, []);

  useEffect(() => {
    sessionStorage.setItem("timerSeconds", timerSeconds.toString());
  }, [timerSeconds]);

  const submitOtp = async (otpValue: string) => {
    if (!otpValue || !/^\d{6}$/.test(otpValue)) {
      toast("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        body: JSON.stringify({ email, otp: otpValue }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setLoading(false);
        toast(data.message || "Verification failed");
      }
    } catch (error) {
      setLoading(false);
      toast("An error occurred. Please try again.");
    }
  };

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return (
    <section className="mx-auto w-full p-4 h-full max-w-3xl flex flex-col">
      <div className="flex flex-col gap-4 relative overflow-hidden items-center justify-center min-h-dvh">
        <div className="w-full max-w-lg flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-center">
              Verify your email
            </h1>
          </div>

          <div className="rounded-3xl p-6 transition-all duration-300 flex flex-col bg-muted/50">
            <div className="flex flex-col gap-12">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    submitOtp(otp);
                  }}
                  className="flex flex-col gap-6"
                >
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter Verification Code</FormLabel>
                        <FormControl>
                          <InputOTP
                            {...field}
                            maxLength={6}
                            value={otp}
                            onChange={(value) => {
                              setOtp(value);
                              // Auto-submit when OTP is complete
                              if (value.length === 6) {
                                setTimeout(() => submitOtp(value), 50);
                              }
                            }}
                            autoFocus
                          >
                            <InputOTPGroup className="gap-2 w-full flex justify-center">
                              {[0, 1, 2, 3, 4, 5].map((index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="w-full h-12"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          We&apos;ve sent a 6-digit verification code to{" "}
                          <span className="font-medium">{email}</span>.{" "}
                          <span
                            onClick={() => {
                              setStep("email");
                            }}
                            className="text-primary cursor-pointer underline"
                          >
                            Change email
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      type="submit"
                      disabled={loading || otp.length !== 6}
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </Button>

                    {timerSeconds > 0 ? (
                      <Button variant="link" disabled size="lg">
                        <Clock className="h-4 w-4" />
                        <span>Resend code in {formatTime(timerSeconds)}</span>
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={onResendOtp}
                        disabled={loading}
                      >
                        Didn&apos;t receive the code? Resend
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <footer className="max-w-lg flex flex-col w-full">
          <div className="flex flex-col gap-4">
            <div className="text-sm text-center text-muted-foreground">
              By proceeding, you agree to our{" "}
              <a href="/terms" className="font-medium text-primary">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="font-medium text-primary">
                Privacy Policy
              </a>
              .
            </div>
            <p className="text-xs text-muted-foreground text-center">
              All Rights Reserved &copy; 2025{" "}
              <Link href="/" className="font-medium text-foreground">
                1<span className="text-yellow-500">ai</span>
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
