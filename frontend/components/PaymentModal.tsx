"use client";

import { BACKEND_URL } from "@/lib/utils";
import React, { useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { CreditCard, Wallet, Building } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useCredits } from "@/hooks/useCredits";
import { useRouter } from "next/navigation";


const RZP_KEY = process.env.NEXT_PUBLIC_RZP_KEY ?? "rzp_test_5hzuC4lSlUBLqb";

type PaymentProvider = "razorpay" | "stripe" | "paddle";

interface PaymentModalProps {
  children: React.ReactNode;
  plan: {
    name: string;
    price: number;
    currency: string;
    interval: string;
  };
  className?: string;
}

const paymentProviders = [
  {
    id: "razorpay" as PaymentProvider,
    name: "Razorpay",
    description: "Pay with UPI, Cards, Net Banking",
    icon: Wallet,
    popular: true,
  },
  {
    id: "stripe" as PaymentProvider,
    name: "Stripe",
    description: "Pay with Credit/Debit Cards",
    icon: CreditCard,
    popular: false,
  },
  {
    id: "paddle" as PaymentProvider,
    name: "Paddle",
    description: "International Payments",
    icon: Building,
    popular: false,
  },
];

const PaymentModal = ({ children, plan, className }: PaymentModalProps) => {
  const { error , isLoading :rzpLoading , Razorpay } = useRazorpay();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading: userLoading } = useUser();
  const { userCredits } = useCredits();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("razorpay");
  

  const handleRazorpayPayment = async () => {
    console.log("Initiating Razorpay payment for plan:", plan);
    console.log("User provider:", user);
    console.log("Selected payment provider:", userCredits);

    console.log("Razorpay instance:", Razorpay);
    if (!user) {
          toast.error("Please login to subscribe");
          router.push("/auth");
          return;
        }
    if (userCredits?.isPremium) {
          toast.info("You're already subscribed to our premium plan!");
          return;
        }

    try {
      setIsProcessing(true);
      toast.loading("Initializing payment...", { id: "payment-init" });
      const response = await axios.post(`${BACKEND_URL}/billing/init-subscribe`, {
        planType: plan.name.toLowerCase() 
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log("Razorpay order creation response:", response.data);
      toast.dismiss("payment-init");
     if (response.data.orderId){
      const isYearlyPlan = plan.name.toLowerCase() === "yearly";
      if (isYearlyPlan) {
        const options: RazorpayOrderOptions = {
          key: response.data.rzpKey || RZP_KEY,
          amount: response.data.amount * 100,
          currency: response.data.currency,
          name: "1AI",
          description: `${plan.name} Plan - One-time Payment`,
          order_id: response.data.orderId,
          prefill: {
            name: user.name || "User",
            email: user.email || "",
          },
          handler: async (response: any) => {
              if (response.razorpay_payment_id) {
                toast.success("Payment successful! Your yearly plan is being activated...", {
                  duration: 3000
                });

                let signature = response.razorpay_signature;
                let razorpay_payment_id = response.razorpay_payment_id;

                try {
                  console.log(BACKEND_URL);
                  console.log(response);
                  const response2 = await axios.post(
                      `${BACKEND_URL}/billing/verify-payment`,
                      {
                        signature,
                        razorpay_payment_id,
                        orderId: response.razorpay_order_id
                      },
                      {
                        headers: {
                          "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                      }
                    );
      
                    if (response2.data.success) {
                      toast.success(response2.data.message || "Payment successful! Your yearly plan is now active!", {
                        duration: 5000
                      });
                      window.location.reload();
                    } else {
                      toast.error("Payment failed! Please try again.");
                    }
                } catch (error: any) {
                  console.error("Error verifying payment:", error);
                  toast.error(error?.response?.data?.error || "Payment failed! Please try again.");
                }
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                toast.info("Payment cancelled");
              }
            },
            theme: {
              color: "#F37254",
            },
          } ;
          const razorpayInstance = new Razorpay(options as any);
          razorpayInstance.open();


      }
      else{

        const options = {
            key: response.data.rzpKey || RZP_KEY,
            subscription_id: response.data.orderId,
            name: "1AI",
            description: `${plan.name} Subscription`,
            prefill: {
              name: user.name || "User",
              email: user.email || "",
            },
            handler: async (response: any) => {
              // Payment successful
              if (response.razorpay_payment_id) {
                toast.success("Payment successful! Your subscription is being activated...", {
                  duration: 3000
                });

                const signature = response.razorpay_signature;
                const razorpay_payment_id = response.razorpay_payment_id;

                try {
                  const response2 = await axios.post(
                      `${BACKEND_URL}/billing/verify-payment`,
                      {
                        signature,
                        razorpay_payment_id,
                        orderId: response.razorpay_order_id
                      },
                      {
                        headers: {
                          "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                      }
                    );
      
                    if (response2.data.success) {
                      toast.success("Payment successful! Your subscription is being activated...", {
                        duration: 3000
                      });
                      // Refresh user credits
                      window.location.reload();
                    } else {
                      toast.error("Payment failed! Please try again.");
                    }
                } catch (error: any) {
                  console.error("Error verifying payment:", error);
                  toast.error(error?.response?.data?.error || "Payment failed! Please try again.");
                }
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                toast.info("Payment cancelled");
              }
            },
            theme: {
              color: "#F37254",

            },
          };

          const razorpayInstance = new Razorpay(options as any);
          razorpayInstance.open();
      }
      } else {
        throw new Error("No subscription ID received from server");
      }
      
    } catch (error: any) {
      console.error("Razorpay payment initialization failed:", error);
      console.error("Error details:", error.response?.data);
      alert(`Payment initialization failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    // Placeholder for Stripe integration
    console.log("Stripe payment selected");
    alert("Stripe integration coming soon!");
  };

  const handlePaddlePayment = async () => {
    // Placeholder for Paddle integration
    console.log("Paddle payment selected");
    alert("Paddle integration coming soon!");
  };

  const handlePayment = async () => {
    switch (selectedProvider) {
      case "razorpay":
        await handleRazorpayPayment();
        break;
      case "stripe":
        await handleStripePayment();
        break;
      case "paddle":
        await handlePaddlePayment();
        break;
      default:
        console.error("Unknown payment provider:", selectedProvider);
    }
  };
  const isLoading = rzpLoading || isProcessing || userLoading;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You're about to purchase the {plan.name} plan for {plan.currency}{plan.price} {plan.interval}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold">{plan.name} Plan</h4>
            <p className="text-sm text-muted-foreground">
              {plan.currency}{plan.price} per {plan.interval}
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Payment Method</Label>
            <div className="space-y-2">
              {paymentProviders.map((provider) => {
                const Icon = provider.icon;
                return (
                  <div
                    key={provider.id}
                    className={`relative rounded-lg border p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                      selectedProvider === provider.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`size-4 rounded-full border-2 ${
                          selectedProvider === provider.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {selectedProvider === provider.id && (
                          <div className="size-2 rounded-full bg-white m-0.5" />
                        )}
                      </div>
                      <Icon className="size-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{provider.name}</p>
                          {provider.popular && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isLoading}>
            {isLoading 
              ? "Processing..." 
              : `Pay with ${paymentProviders.find(p => p.id === selectedProvider)?.name}`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;