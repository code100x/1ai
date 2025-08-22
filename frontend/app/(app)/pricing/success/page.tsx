// app/success/page.tsx

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";

export default async function Success() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth");
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full items-center justify-center px-4">
      <div className="border-muted/40 bg-muted/10 flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-2xl border p-8 text-center shadow-sm">
        <div className="bg-primary drop-shadow-primary flex size-32 items-center justify-center rounded-[2rem] drop-shadow-2xl">
          <ShieldCheckIcon
            className="size-20"
            weight="duotone"
            fill="var(--foreground)"
          />
        </div>
        <div className="mt-6 space-y-2">
          <h1 className="text-primary text-3xl font-semibold">
            Payment Successful
          </h1>
          <p className="text-muted-foreground">Thank you for your purchase!</p>
        </div>

        <Button variant="outline" className="h-12 w-40" asChild>
          <a href="/">Go to Home</a>
        </Button>
      </div>
    </div>
  );
}
