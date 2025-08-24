"use client";

import { BACKEND_URL } from "@/lib/utils";
import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";
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
    name: string;     // monthly or yearly
    price: number;
    currency: string;
    interval: string; // month or year
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

      // call the backend to create monthly subscription or yearly order
      const res = await axios.post(
        `${BACKEND_URL}/billing/init-subscribe`,
        {
          planType: plan.name.toLowerCase(), // monthly or yearly
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      toast.dismiss("payment-init");

      if (res.data?.orderId) {
        const isYearly = String(plan.name).toLowerCase() === "yearly";

        const options: any = {
          key: res.data.rzpKey || RZP_KEY,
          name: "1AI",
          description: isYearly ? `${plan.name} – One-time` : `${plan.name} Subscription`,
          prefill: {
            name: user.name || "User",
            email: user.email || "",
          },
          handler: async (response: any) => {
            // Payment successful
            try {
              const payload: any = {
                signature: response.razorpay_signature,
                razorpay_payment_id: response.razorpay_payment_id,
                orderId: res.data.orderId, // bankReference we stored
              };
              if (isYearly) {
                payload.razorpay_order_id = response.razorpay_order_id;
              }
              const response2 = await axios.post(
                `${BACKEND_URL}/billing/verify-payment`,
                payload,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );

              if (response2.data.success) {
                toast.success(
                  isYearly
                    ? "Payment successful! Premium activated."
                    : "Payment successful! Your subscription is being activated...",
                  { duration: 3000 },
                );
              } else {
                toast.error("Payment failed! Please try again.");
              }
            } catch (err: any) {
              console.error("Error verifying payment:", err);
              toast.error(
                err?.response?.data?.error ||
                  "Payment verification failed! Please contact support.",
              );
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              toast.info("Payment cancelled");
            },
          },
          theme: { 
            color: "#F37254",
          },
        };

        // subscription or order
        if (isYearly) {
          // One-time order
          options.order_id = res.data.orderId;
        } else {
          // Subscription
          options.subscription_id = res.data.orderId;
        }

        const rzp = new Razorpay(options as any);
        rzp.open();
      } else {
        throw new Error("No order/subscription ID received from server");
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
            "Failed to initialize payment. Please try again.",
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
