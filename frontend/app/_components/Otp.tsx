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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
      
      try {
        setIsSubmitting(true);
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
          toast("User Logged In");
          router.replace('ask');
        } else if (response.status !== 401 && response.status !== 429) {
          toast(data.message || "An unexpected error occurred");
        }
      } catch (error) {
        console.error("Some error occured ", error);
      } finally {
        setIsSubmitting(false);
      }
    }

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
            disabled={isSubmitting}
          />
          <Button
            variant="accent"
            onClick={handleLogin}
            className="h-14 w-[25rem] text-lg font-semibold text-white hover:bg-primary/90"
            disabled={isSubmitting || !otp}
          >
            { isSubmitting ? (
              <span className="text-muted-foreground">Please Wait...</span>
            ) : ("Login")}
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