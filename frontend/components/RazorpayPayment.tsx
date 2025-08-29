"use client";

import { BACKEND_URL } from "@/lib/utils";
import React, { useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axios from "axios";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useCredits } from "@/hooks/useCredits";
import { useRouter } from "next/navigation";

const RZP_KEY = process.env.NEXT_PUBLIC_RZP_KEY ?? "rzp_live_haOcAMPhYa4O6r";

interface RazorpayPaymentProps {
  plan: {
    name: string;
    price: number;
    currency: string;
    interval: string;
  };
  className?: string;
  children?: React.ReactNode;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ 
  plan, 
  className,
  children 
}) => {
  const { error, isLoading: rzpLoading, Razorpay } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isLoading: userLoading } = useUser();
  const { userCredits } = useCredits();
  const router = useRouter();

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      router.push("/auth");
      return;
    }

    // Check if user is already premium
    if (userCredits?.isPremium) {
      toast.info("You're already subscribed to our premium plan!");
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading("Initializing payment...", { id: "payment-init" });
      
      // Call the backend to create subscription order
      const res = await axios.post(
        `${BACKEND_URL}/billing/init-subscribe`, 
        { 
          planType: plan.name.toLowerCase() 
        }, 
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      toast.dismiss("payment-init");

      if (res.data.orderId) {
        const isYearlyPlan = plan.name.toLowerCase() === "yearly";
        
        if (isYearlyPlan) {
          // Handle yearly plan as one-time payment
          const options = {
            key: res.data.rzpKey || RZP_KEY,
            amount: res.data.amount * 100,
            currency: res.data.currency,
            name: "1AI",
            description: `${plan.name} Plan - One-time Payment`,
            order_id: res.data.orderId,
            prefill: {
              name: user.name || "User",
              email: user.email || "",
            },
            handler: async (response: any) => {
              // Payment successful
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
                        orderId: res.data.orderId
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
        } else {
          // Handle monthly subscription
          const options = {
            key: res.data.rzpKey || RZP_KEY,
            subscription_id: res.data.orderId,
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
                        orderId: res.data.orderId
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
      console.error("Payment initialization error:", error);
      toast.dismiss("payment-init");
      
      if (error?.response?.status === 401) {
        toast.error("Please login again to continue");
        router.push("/auth");
      } else if (error?.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(
          error?.response?.data?.error || 
          error?.message ||
          "Failed to initialize payment. Please try again."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = rzpLoading || isProcessing || userLoading;

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !!error || userCredits?.isPremium}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : userCredits?.isPremium ? (
        "Already Subscribed ✓"
      ) : (
        children || `Subscribe for ${plan.currency}${plan.price}/${plan.interval}`
      )}
    </Button>
  );
};

export default RazorpayPayment;



