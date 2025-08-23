import { Button } from "@/components/ui/button";
import { ChatCircleIcon, ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Logo/Icon */}
        <div className="from-primary drop-shadow-primary flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr to-pink-500 drop-shadow-md">
          <ChatCircleIcon weight="bold" className="size-8" />
        </div>
        
        {/* 404 Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-6xl font-bold text-foreground md:text-8xl">404</h1>
          <h2 className="text-xl font-semibold text-muted-foreground md:text-2xl">
            Page Not Found
          </h2>
        </div>
        
        {/* Description */}
        <p className="max-w-md text-center text-muted-foreground">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="default" size="lg" className="rounded-xl">
            <Link href="/">
              <ArrowLeftIcon weight="bold" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <Link href="/ask">
              <ChatCircleIcon weight="bold" />
              Start Chatting
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
