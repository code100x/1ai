"use client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const [sendingRequest, setSendingRequest] = useState(false);

  const handleSendOTP = async () => {
    setSendingRequest(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/auth/initiate_signin`, {
        method: "POST",
        body: JSON.stringify({ email }),
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
    <div className="mx-auto max-h-screen max-w-6xl">
      <div className="absolute top-4 left-4">
        {/* <Button asChild variant="ghost" className="font-semibold" onClick={() => router.push("/")}>
            <Link className="flex items-center gap-2" href="/">
              <ArrowLeft className="size-4" />
              Back to chat
            </Link>
          </Button> */}
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-8 max-w-xl ">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter text-center">
          Welcome to <span className="text-primary">1ai</span>
        </h1>
        <div className="w-full flex flex-col gap-2">
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isEmailValid(email) && !sendingRequest) {
                handleSendOTP();
              }
            }}
          />
          <Button
            disabled={!isEmailValid(email) || sendingRequest}
            variant="accent"
            onClick={() => {
              if (isEmailValid(email) && !sendingRequest) {
                handleSendOTP();
              }
            }}
            className="w-full h-12"
          >
            Continue with Email
          </Button>
        </div>
        <div className="text-muted-foreground text-sm">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-muted-foreground font-medium">
            Terms
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
