import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyCircleDollarIcon } from "@phosphor-icons/react/dist/ssr";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-primary drop-shadow-primary flex size-16 items-center justify-center rounded-2xl drop-shadow-lg">
              <CurrencyCircleDollarIcon
                className="size-8"
                weight="duotone"
                fill="var(--foreground)"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Refund & Cancellation Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Please review our refund and cancellation terms
          </p>
        </div>

        <Card className="border-muted/40 bg-muted/10">
          <CardHeader>
            <CardTitle className="text-2xl">Policy Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 leading-relaxed">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
                Important Notice
              </h3>
              <p className="font-medium mb-4">
                Under any other circumstance, we will not consider any requests for refund as this is a digital product.
              </p>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-center font-semibold">
                  All digital course purchases are final and non-refundable except for the specific cases mentioned above.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="text-center mt-12 space-x-4">
          <Button variant="outline" className="h-12 px-8" asChild>
            <a href="/">Back to Home</a>
          </Button>
          <Button variant="outline" className="h-12 px-8" asChild>
            <a href="/terms">View Terms & Conditions</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
