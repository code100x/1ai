"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/utils";
import { toast } from "sonner";

export function Otp({ email }: { email: string }) {
  const [otp, setOtp] = useState("");

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
        <div className="flex flex-col gap-2 w-full">
          <Input disabled placeholder="Email" value={email} />

          <Input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
          <Button
            variant="accent"
            onClick={handleLogin}
            className="w-full h-12"
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
