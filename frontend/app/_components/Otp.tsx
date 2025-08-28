"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { HtmlHTMLAttributes, useRef, useState } from "react";
import { BACKEND_URL, cn } from "@/lib/utils";
import { toast } from "sonner";

export function Otp({ email }: { email: string }) {
  // const [otp, setOtp] = useState("");
  const otp = useRef<string[]> (["", "", "", "", "", ""]);
  const handleLogin = async () => {
    try {
      const Otp = otp.current.join("");
      if(Otp.length !== 6) {
        toast("Invalid OTP")
        return;
      }
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        body: JSON.stringify({ email, otp  :Otp }),
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
      <div className="flex h-full flex-col items-center justify-center gap-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-20">
        <div className="flex flex-col items-center gap-2 mb-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter">
            Welcome to <span className="text-primary">1ai</span>
          </h1>
            <span>Enter the verification code sent to your email</span>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="bg-muted/20 p-2 rounded-lg flex items-center">{email} </div>

          <span>Enter Your OTP</span>
          <div className="flex items-center">
            {([...Array(6).keys()]).map((_, index) => (

              <Input
                key={index}
                inputMode="numeric"
                maxLength={1}
                pattern="[0-9]"
                className={cn(
                  "w-[40px] rounded-none text-center mb-2",
                  index === 0 && "rounded-l-xl",
                  index === 5 && "rounded-r-xl"
                )}
                
                onInput={(e : React.ChangeEvent<HTMLInputElement>) => {
                  const input =  e.target
                  input.value = input.value.replace(/[^0-9]/g, "");
                  const nextSibling = input.nextSibling as HTMLInputElement
                  otp.current[index] = input.value;
                  console.log(otp.current)
                  if(nextSibling && input.value.match("[0-9]")){
                    nextSibling.focus()
                  }
                }}

                onKeyDown={(e : React.KeyboardEvent<HTMLInputElement>) => {
                  const input = e.currentTarget;
                  if (e.key === "Backspace") {
                    if (!input.value && input.previousElementSibling) {
                      (input.previousElementSibling as HTMLInputElement).focus();
                    }
                  }
                }}
              />
            ))}
          </div>

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
          <Link href="/terms" className="text-primary  font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary font-medium">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
