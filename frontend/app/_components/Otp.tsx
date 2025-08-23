"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Otp({email}: {email: string}) {
    const [otp, setOtp] = useState("");
    const router = useRouter();

    return (
        <div className="mx-auto max-h-screen max-w-6xl">
        <div className="absolute top-4 left-4">
          <Button asChild variant="ghost" className="font-semibold" onClick={() => router.push("/auth")}>
            <Link className="flex items-center gap-2" href="/">
              <ArrowLeft className="size-4" />
              Back to chat
            </Link>
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Welcome to</span>
              <span className="text-primary-foreground text-2xl font-bold">
                1ai
              </span>
            </div>
            <p className="text-foreground text-center">
              A livecoded chat app.
            </p>
          </div>
          <Input
            disabled
            placeholder="Email"
            className="h-14 w-[25rem] text-lg font-semibold text-white"
            value={email}
          />

        <Input
            placeholder="OTP"
            className="h-14 w-[25rem] text-lg font-semibold text-white"
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            variant="accent"
            onClick={() => {
                fetch(`${BACKEND_URL}/auth/signin`, {
                    method: "POST",
                    body: JSON.stringify({ email, otp }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((res) => {
                    if (!res.ok) {
                        return res.json().then((errorData) => {
                            toast.error(errorData.message || "Invalid OTP");
                            throw new Error(errorData.message || "Invalid OTP");
                        });
                    }
                    return res.json().then((data) => {
                        if (data.token) {
                            localStorage.setItem("token", data.token);
                            // hyderate user in the useUser hook
                            //@ts-ignore
                            window.location = "/"
                        } else {
                            toast.error("Login failed - no token received");
                        }
                    });
                }).catch((err) => {
                    toast.error("Invalid OTP");
                    console.error(err);
                });
            }}
            className="h-14 w-[25rem] text-lg font-semibold text-white"
          >
            Login
          </Button>
          <div className="text-muted-foreground/80 text-sm">
            By continuing, you agree to our{" "}
            <span className="text-muted-foreground font-medium">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-muted-foreground font-medium">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    )
}