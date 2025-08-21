import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { DashboardImage } from "./dashboard-image";

export default function Hero() {
  return (
    <div className="flex h-fit flex-col items-center gap-4">
      <div className="mt-32 flex flex-col items-center gap-2">
        <Badge variant={"outline"} className="mb-4">
          <div className="bg-primary text-primary size-2 animate-pulse rounded-full" />
          Always up 24/7
        </Badge>
        <div className="max-w-xl text-center text-4xl font-bold text-balance md:text-5xl">
          Your Ordinary AI chat app but with better UI/UX
        </div>
        <p className="text-muted-foreground mt-4 max-w-xl text-center text-balance">
          T3 Chat is a fast , simple and secure AI chat app that is built to
          make AI accesible to everyone
        </p>
        <div className="mt-5 flex items-center gap-4">
          <Button className="h-10 w-40 rounded-xl">
            <Link href="/ask">Chat with T3</Link>
          </Button>
          <Button className="h-10 w-40 rounded-xl" variant="outline">
            <Link className="flex items-center gap-2" href="/login">
              Send Feedback
              <ArrowUpRightIcon weight="bold" />
            </Link>
          </Button>
        </div>

        <div className="text-muted-foreground mt-2 text-xs">
          No credit card required to get started
        </div>
      </div>
      <DashboardImage />
      <div className="drop-shadow-accent-primary to-primary absolute top-[35rem] left-1/2 z-[-1] h-40 w-[24rem] -translate-x-1/2 rounded-full border bg-gradient-to-br from-pink-700 blur-[4em] drop-shadow-2xl"></div>

      {/* <div className="from-primary/30 drop-shadow-primary relative z-[2] flex h-40 w-[24rem] translate-y-20 items-center justify-center rounded-full border-4 border-pink-300/20 bg-gradient-to-br text-5xl font-bold drop-shadow-2xl backdrop-blur-xl">
        T3 Chat
        <div className="drop-shadow-accent-primary absolute top-[0rem] left-1/2 z-[-1] h-40 w-[10rem] -translate-x-1/2 rounded-full border bg-gradient-to-br from-pink-700 to-pink-500 blur-[4em] drop-shadow-2xl"></div>
      </div> */}
    </div>
  );
}
