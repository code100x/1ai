"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/utils";
import { useState } from "react";
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

  const form = useForm<{ email: string }>({
    resolver: zodResolver(
      z.object({
        email: z
          .string()
          .min(1, { message: "Email is required" })
          .email({ message: "Please enter a valid email address" }),
      })
    ),
    defaultValues: { email },
  });

  const handleSendOTP = async (emailValue: string) => {
    setSendingRequest(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/initiate_signin`, {
        method: "POST",
        body: JSON.stringify({ email: emailValue }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setStep("otp");
        toast.success("OTP sent to email");
      } else {
        toast.error("Failed to send OTP, please retry after a few minutes");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP, please retry after a few minutes");
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <section className="mx-auto w-full p-4 h-full max-w-3xl flex flex-col">
      <div className="flex flex-col gap-4 relative overflow-hidden items-center justify-center min-h-dvh">
        <div className="w-full max-w-lg flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter text-center">
              Welcome to 1<span className="text-yellow-500">ai</span>
            </h1>
          </div>
          <div className="rounded-3xl p-6 transition-all duration-300 flex flex-col bg-muted/50">
            <div className="flex flex-col gap-12">
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const emailValue = form.getValues("email");
                    setEmail(emailValue);
                    handleSendOTP(emailValue);
                  }}
                  className="flex flex-col gap-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter your email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="email@example.com"
                            autoFocus
                            onChange={(e) => {
                              field.onChange(e);
                              setEmail(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          We&apos;ll send you a verification code to sign in.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-3">
                    <Button
                      size="lg"
                      type="submit"
                      disabled={sendingRequest || !form.formState.isValid}
                    >
                      {sendingRequest ? "Sending..." : "Continue"}
                    </Button>
                    <Link href="/" className="w-full">
                      <Button variant="link" size="lg" className="w-full">
                        Back to chat
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        <footer className="max-w-lg flex flex-col w-full">
          <div className="flex flex-col gap-4">
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="font-medium text-primary">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-primary">
                Privacy Policy
              </Link>
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
