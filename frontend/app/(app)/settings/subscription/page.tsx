import type { ReactNode } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FetchUser } from "@/actions/fetchUser";
import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import SignOut from "@/components/ui/signout";
import { SelectTheme } from "@/components/ui/theme-toggler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account } from "@/components/subscription/account";
import { Customisation } from "@/components/subscription/customisation";
import { Profile } from "@/components/subscription/profile/profile";
import Models from "@/components/subscription/model";
import APIKeysPage from "@/components/subscription/api-key";
import { AttachmentsPage } from "@/components/subscription/attachments";
import { ContactUsPage } from "@/components/subscription/contact-us";
import { History } from "@/components/subscription/history";

export default async function SubscriptionPage() {
  const user = await FetchUser();
  console.log(user);
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
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-3">
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

            {/* Message Usage */}
            <div className="bg-accent space-y-4 rounded-xl p-4 dark:bg-black">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-medium">
                  Message Usage
                </span>
                <span className="text-muted-foreground text-sm">
                  Resets today at 5:30 AM
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Standard</span>
                  <span className="text-foreground font-mono">0/20</span>
                </div>
                <div className="bg-muted h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <p className="text-muted-foreground text-sm">
                  20 messages remaining
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="account" className="max-w-full overflow-x-auto">
              <div className="no-scrollbar overflow-x-auto">
                <TabsList className="h-[34px] rounded-lg">
                  <TabsTrigger className="rounded-md text-xs" value="account">
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded-lg text-xs"
                    value="customisation"
                  >
                    Customisation
                  </TabsTrigger>
                  <TabsTrigger className="rounded-lg text-xs" value="history">
                    History & Sync
                  </TabsTrigger>
                  <TabsTrigger className="rounded-lg text-xs" value="models">
                    Models
                  </TabsTrigger>
                  <TabsTrigger className="rounded-lg text-xs" value="api-keys">
                    API Keys
                  </TabsTrigger>
                  <TabsTrigger
                    className="rounded-lg text-xs"
                    value="attachments"
                  >
                    Attachments
                  </TabsTrigger>
                  <TabsTrigger className="rounded-lg text-xs" value="contact">
                    Contact
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="account" className="mt-6">
                <Account />
              </TabsContent>
              <TabsContent value="customisation">
                <Customisation />
              </TabsContent>
              <TabsContent value="history">
                <History />
              </TabsContent>
              <TabsContent value="models">
                <Models />
              </TabsContent>
              <TabsContent value="api-keys">
                <APIKeysPage />
              </TabsContent>
              <TabsContent value="attachments">
                <AttachmentsPage />
              </TabsContent>
              <TabsContent value="contact">
                <ContactUsPage />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
