"use client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";

const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Email({setEmail, setStep, email}: {setEmail: (email: string) => void, setStep: (step: string) => void, email: string}) {   
    const router = useRouter();
    return (
        <div className="mx-auto max-h-screen max-w-6xl">
        <div className="absolute top-4 left-4">
          <Button asChild variant="ghost" className="font-semibold" onClick={() => router.push("/")}>
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-14 w-[25rem] text-lg font-semibold text-white"
          />
          <Button
            disabled={!isEmailValid(email)}
            variant="accent"
            onClick={() => {
                fetch(`${BACKEND_URL}/auth/initiate_signin`, {
                    method: "POST",
                    body: JSON.stringify({ email }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((res) => {
                    if (res.status === 200) {
                        setStep("otp");
                        toast.success("OTP sent to email");
                    } else {
                        toast.error("Failed to send OTP, please retry after a few minutes");
                    }
                }).catch((err) => {
                    console.error(err);
                    toast.error("Failed to send OTP, please retry after a few minutes");
                });
            }}
            className="h-14 w-[25rem] text-lg font-semibold text-white"
          >
            Continue with Email
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