import { BACKEND_URL } from "@/lib/utils";
import React from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axios from "axios";
import { Button } from "./ui/button";

const RZP_KEY = process.env.NEXT_PUBLIC_RZP_KEY ?? "rzp_live_haOcAMPhYa4O6r";

const PaymentComponent = () => {
  const { error, isLoading, Razorpay } = useRazorpay();

  const handlePayment = async () => {
    const response = await axios.post(`${BACKEND_URL}/billing/init-subscribe`, {}, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    console.log(response.data);
    alert(response.data.orderId)

    const options: RazorpayOrderOptions = {
      key: RZP_KEY,
      amount: 100 * 100,
      currency: "INR",
      name: "1AI",
      description: "Montly Subscription",
      order_id: response.data.orderId,
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "+919876543210",
      },
      handler: (response) => {
        if (response.razorpay_payment_id) {
            axios.post(`${BACKEND_URL}/billing/subscribe`, {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
        }
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      <Button onClick={handlePayment}>
        Upgrade
      </Button>
    </div>
  );
};

export default PaymentComponent;