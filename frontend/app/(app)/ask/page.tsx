"use client";
import React, { useEffect, useState } from "react";
import UIInput from "@/components/ui/ui-input";
import Turnstile from "react-turnstile";
import { toast } from "sonner";

const AskPage = () => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const savedToken = localStorage.getItem("turnstileToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);
  return (
    <div className="flex w-full max-w-screen flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center gap-4">
        {!token && (
          <div className="flex h-screen w-full items-center justify-center">
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onVerify={(token) => {
                setToken(token);
                localStorage.setItem("turnstileToken", token);
                toast.success("Verification successful", {
                  description: "You can now ask a question",
                });
              }}
              theme="light"
              size="normal"
              className="mb-4"
            />
          </div>
        )}
        {token && <UIInput />}
      </div>
    </div>
  );
};

export default AskPage;
