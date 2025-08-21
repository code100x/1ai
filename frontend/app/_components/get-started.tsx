import { Button } from "@/components/ui/button";
import Link from "next/link";

export const GetStarted = () => {
  return (
    <>
      <div className="relative mb-20 h-[25rem] w-full overflow-hidden rounded-3xl">
        <div
          className="from-accent/20 absolute inset-0 z-0 w-full overflow-hidden rounded-3xl bg-gradient-to-b p-3 opacity-75"
          style={{
            backgroundImage: "url('/grain2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div className="from-background via-background/50 to-background/40 absolute inset-0 bg-gradient-to-b"></div>
        <div className="from-background via-background/30 to-background/30 absolute inset-0 bg-gradient-to-t"></div>
        {/* Your actual content here */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8">
          {/* Content */}
          <h1 className="max-w-md text-center text-4xl font-bold text-balance">
            Just Signup and write your first question to T3 :)
          </h1>
          <span className="text-muted-foreground">
            We promise , we dont spam with useless mails
          </span>
          <Button className="h-12 w-40 rounded-xl">
            <Link href="/ask">Chat with T3</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
