"use client"
import { Button } from "@/components/ui/button";

import { FetchUser } from "@/actions/fetchUser";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import SignOut from "@/components/ui/signout";
import { SelectTheme } from "@/components/ui/theme-toggler";

import { Profile } from "@/components/subscription/profile/profile";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
  const user = await FetchUser();
  if(!user){
    console.log("no user find");
  }
  return (
    <div className="bg-background text-foreground min-h-screen w-full border">
      <div className="mx-auto w-full max-w-6xl p-8">
        <div>
          <div className="mb-6 flex items-center justify-between text-2xl font-bold">
            <Button asChild variant="ghost" className="font-semibold">
              <Link className="flex items-center gap-2" href="/">
                <ArrowLeftIcon className="size-4" />
                Back to chat
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <SelectTheme />
              <SignOut />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-14">
          {/* Left Column - Profile and Shortcuts */}
          <div className="hidden space-y-8 lg:col-span-1 lg:block">
            {/* Profile Section */}
            <Profile
              image={user?.image as string}
              nickname={user?.nickname as string}
              name={user?.name as string}
              email={user?.email as string}
              whatDoYouDo={user?.whatDoYouDo as string}
              customTraits={user?.customTraits as string[]}
              about={user?.about as string}
              plan={user?.subscription?.plan as string}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
