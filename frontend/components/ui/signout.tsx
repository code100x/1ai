"use client";
import { Button } from "./button";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <Button onClick={() => signOut()} variant="outline" className="">
      Sign Out
    </Button>
  );
}
