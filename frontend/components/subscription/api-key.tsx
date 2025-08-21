import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const APIKeysPage = () => {
  return (
    <div className="bg-background mx-auto w-full">
      {/* Header */}
      <div className="mt-5 mb-8">
        <h1 className="text-xl font-bold">API Keys</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Bring your own API keys for select models.
        </p>
      </div>

      {/* Pro Feature Card */}
      <Card className="from-muted/40 border-primary/30 h-fit border bg-gradient-to-br py-6">
        <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
          <h2 className="text-lg font-bold">Pro Feature</h2>
          <p className="text-muted-foreground text-sm">
            Upgrade to Pro to access this feature.
          </p>
          <Button variant="accent">Upgrade to Pro - $8/month</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeysPage;
