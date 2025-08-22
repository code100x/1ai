"use client";
import React, { useEffect, useState } from "react";
import UIInput from "@/components/ui/ui-input";

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
        <UIInput />
      </div>
    </div>
  );
};

export default AskPage;
