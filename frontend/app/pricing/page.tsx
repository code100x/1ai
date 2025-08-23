import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CurrencyCircleDollarIcon, 
  CheckIcon,
  StarIcon,
  LightningIcon 
} from "@phosphor-icons/react/dist/ssr";

const pricingPlans = [
  {
    name: "Monthly",
    price: 99,
    currency: "₹",
    interval: "per month",
    description: "Perfect for individuals getting started with AI",
    highlight: false,
    popular: false,
    features: [
      "Unlimited AI conversations",
      "Access to all AI models",
      "Chat history & sync",
      "Web-based platform",
      "24/7 customer support",
      "Regular model updates",
      "Mobile responsive design"
    ],
    cta: {
      text: "Start Monthly Plan",
      href: "/auth"
    }
  },
  {
    name: "Yearly",
    price: 999,
    currency: "₹",
    interval: "per year",
    description: "Best value for committed users - Save ₹189 annually!",
    highlight: true,
    popular: true,
    savings: "Save ₹189",
    features: [
      "Everything in Monthly plan",
      "Priority customer support",
      "Early access to new features",
      "Advanced analytics dashboard",
      "Custom AI model preferences",
      "Export conversation history",
      "API access (coming soon)",
      "2 months free (₹198 value)"
    ],
    cta: {
      text: "Choose Yearly Plan",
      href: "/auth"
    }
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary drop-shadow-primary flex size-16 items-center justify-center rounded-2xl drop-shadow-lg">
              <CurrencyCircleDollarIcon
                className="size-8"
                weight="duotone"
                fill="var(--foreground)"
              />
            </div>
          </div>
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold text-primary mb-4 lg:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to our complete AI platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative border-muted/40 bg-muted/10 transition-all duration-300 hover:shadow-lg ${
                plan.highlight 
                  ? 'border-primary/50 bg-primary/5 scale-105' 
                  : 'hover:border-muted/60'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                    <StarIcon className="size-3" weight="fill" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {plan.currency}{plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {plan.interval}
                    </span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                        {plan.savings}
                      </Badge>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary/10">
                        <CheckIcon className="size-3 text-primary" weight="bold" />
                      </div>
                      <span className="text-foreground/90 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full h-12 font-semibold ${
                    plan.highlight 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                  asChild
                >
                  <a href={plan.cta.href}>
                    {plan.cta.text}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Why Choose 1AI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <LightningIcon className="size-6 text-primary" weight="duotone" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Get instant responses from multiple AI models in one platform
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <CheckIcon className="size-6 text-primary" weight="duotone" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">No Hidden Fees</h3>
                <p className="text-muted-foreground text-sm">
                  Transparent pricing with no surprise charges or limits
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <StarIcon className="size-6 text-primary" weight="duotone" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Premium Support</h3>
                <p className="text-muted-foreground text-sm">
                  24/7 customer support to help you succeed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border border-muted rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2">Questions about pricing?</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Our team is here to help you choose the right plan for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/refund">View Refund Policy</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
