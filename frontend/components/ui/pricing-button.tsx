import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export default function PricingButton({
  plan,
  amount,
}: {
  plan: string;
  amount: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      const response = await axios.post("/api/checkout-sessions/create", {
        plan,
        amount,
      });

      if(response.status === 429){
        toast.error("Too Many Request on checkout page, please try again after sometime!")
      }
      const session = response.data;
      if (!session?.id) throw new Error("No session ID received");

      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      
      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="bg-background hover:bg-accent w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : plan === "Enterprise" ? (
        "Contact Sales"
      ) : (
        "Get Started"
      )}
    </Button>
  );
}
