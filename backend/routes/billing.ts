import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";
import crypto from "crypto";

const prisma = new PrismaClient();

export const billingRouter = Router();

const razorPayCredentials = {
  key: process.env.RZP_KEY,
  secret: process.env.RZP_SECRET!,
  environment: process.env.RZP_ENVIRONMENT!,
};

const createOrderUrl = razorPayCredentials.environment === "sandbox" ? 'https://api.razorpay.com/v1/orders' : 'https://api.razorpay.com/v1/orders';

const subscriptionUrl = razorPayCredentials.environment === "sandbox" ? "https://api.razorpay.com/v1/subscriptions" : "https://api.razorpay.com/v1/subscriptions";

// NOTE: added `yearly_price` for one-time annual payment
const plans = [
  {
    name: "Premium",
    monthly_price: 99,
    yearly_price: 999, // used for yearly one-time order
    plan_id: "plan_R8lQ4opIQbMwPK",
    currency: "INR",
    symbol: "₹",
    pricing_currency: [
      {
        plan_id: "plan_R8lQ4opIQbMwPK",
        monthly_price: 99,
        yearly_price: 999,
        currency: "INR",
        symbol: "₹",
      },
      {
        plan_id: "plan_R8lOdy52StfdXe",
        monthly_price: 1,
        yearly_price: 10,
        currency: "USD",
        symbol: "$",
      },
    ],
  },
];

// Create subscription (monthly) OR order (yearly)
billingRouter.post("/init-subscribe", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { planType = "monthly" } = req.body; // monthly or yearly

  const authHeader = 'Basic ' + Buffer.from(razorPayCredentials.key + ':' + razorPayCredentials.secret).toString('base64');
  const headers = {
    Authorization: authHeader,
    "Content-Type": 'application/json',
  };

  // default to INR plan entry
  let wp =
    plans[0]?.pricing_currency?.find((p) => p.currency === "INR") ??
    plans[0]?.pricing_currency?.[0];

  if (!wp) {
    return res.status(500).json({ error: "No plan configuration found" });
  }

  try {
    if (String(planType).toLowerCase() === "yearly") {
      // yearly one-time order
      const receipt = uuidv4();
      const amountPaise = Number((wp as any).yearly_price ?? 999) * 100;

      const orderPayload = {
        amount: amountPaise,
        currency: wp.currency,
        receipt,
        notes: {
          customer_id: userId,
          planType: "yearly",
          app_name: "1AI",
        },
      };

      const orderResponse = await axios.post(createOrderUrl, orderPayload, {
        headers,
      });

      const { id } = orderResponse.data;
      if (!id) {
        return res
          .status(500)
          .json({ error: "Missing order ID from Razorpay" });
      }

      await prisma.paymentHistory.create({
        data: {
          status: "PENDING",
          paymentMethod: "RAZORPAY",
          cfPaymentId: "",
          bankReference: id, // store order_id here
          amount: (wp as any).yearly_price ?? 999,
          userId: userId,
          currency: wp.currency,
        },
      });

      return res.json({
        orderId: id,
        mode: "order", // for frontend
        rzpKey: razorPayCredentials.key,
        currency: wp.currency,
      });
    }

    // monthly subcription like the way it is working right now
    const orderData = {
      plan_id: wp.plan_id,
      customer_notify: 1,
      total_count: 12,
      notes: {
        customer_id: userId,
        return_url: `${process.env.FRONTEND_URL}`,
        app_name: "1AI",
      },
    };

    const orderResponse = await axios.post(subscriptionUrl, orderData, {
      headers,
    });
    const { id } = orderResponse.data;

    if (!id) {
      return res.status(500).json({ error: "Missing subscription ID" });
    }

    await prisma.paymentHistory.create({
      data: {
        status: "PENDING",
        paymentMethod: 'RAZORPAY',
        cfPaymentId: "",
        bankReference: id,
        amount: wp.monthly_price,
        userId: userId,
        currency: wp.currency
      }
    });

    await prisma.subscription.create({
      data: {
        userId: userId,
        currency: wp.currency,
        planId: wp.plan_id,
        rzpSubscriptionId: id,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      }
    });

    return res.json({
      orderId: id,
      mode: "subscription", // for frontend 
      rzpKey: razorPayCredentials.key,
      currency: wp.currency,
    });
  } catch (error: any) {
    console.error("Error creating order/subscription:", error?.response?.data || error);
    return res.status(500).json({
      error: "Internal server error during order creation",
      details: error.response?.data || error.message,
    });
  }
});

billingRouter.get("/history/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const paymentHistory = await prisma.paymentHistory.findMany({
      where: {
        userId,
        status: "SUCCESS"
      },
      skip: skip,
      take: parseInt(limit as string),
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPayments = await prisma.paymentHistory.count({
      where: { userId },
    });

    const totalPages = Math.ceil(totalPayments / parseInt(limit as string));
    return res.json({
      data: paymentHistory,
      currentPage: parseInt(page as string),
      totalPages,
      totalPayments,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

billingRouter.get("/subscriptions/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

billingRouter.post('/get-plans', async (_req, res) => {
  return res.json(plans);
});

// Verify payment signature for both monthly and yearly
billingRouter.post("/verify-payment", authMiddleware, async (req, res) => {
  const userId = req.userId;

  const { signature, razorpay_payment_id, orderId, razorpay_order_id } = req.body;

  if (!signature || !razorpay_payment_id) {
    return res.status(400).json({
        success: false,
        error: "Missing signature or payment ID"
    });
  }

  try {
    // Find the pending payment record for this user
    const bankRef = orderId || razorpay_order_id;
    if (!bankRef) {
      return res.status(400).json({
        success: false,
        error: "Missing order/subscription reference",
      });
    }

    // Find the pending payment record for this user
    const paymentRecord = await prisma.paymentHistory.findFirst({
      where: {
        userId: userId,
        status: "PENDING",
        bankReference: bankRef
      },
      orderBy: {
        createdAt: "desc" 
      }
    });

    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        error: "No pending payment found"
      });
    }

    // Check whether this bankRef is a subscription or an order
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        rzpSubscriptionId: bankRef,
      }
    });

    let expectedSignature: string;

    if (subscription) {
      // subscription verification
      expectedSignature = crypto
        .createHmac("sha256", razorPayCredentials.secret)
        .update(razorpay_payment_id + "|" + subscription.rzpSubscriptionId)
        .digest("hex");
    } else {
      // order verification (yearly one-time)
      const ordId = razorpay_order_id || bankRef; // prefer explicit field if sent
      expectedSignature = crypto
        .createHmac("sha256", razorPayCredentials.secret)
        .update(ordId + "|" + razorpay_payment_id)
        .digest("hex");
    }

    // Verify signature
    if (expectedSignature === signature) {
      // Payment is authentic - update records
      await prisma.paymentHistory.update({
        where: { paymentId: paymentRecord.paymentId },
        data: {
          status: "SUCCESS",
          cfPaymentId: razorpay_payment_id
        }
      });

      // Update user to premium status and add credits (same as monthly flow)
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: { increment: 1000 } // Add 1000 credits for premium subscription
        }
      });

      // Subscription is already created and active based on endDate

      return res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      // Invalid signature
      await prisma.paymentHistory.update({
        where: { paymentId: paymentRecord.paymentId },
        data: { 
          status: "FAILED"
        }
      });

      return res.status(400).json({
        success: false,
        error: "Invalid payment signature"
      });
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during payment verification",
      details: error.message
    });
  }
});

// New endpoint to check user credits
billingRouter.get("/credits/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, isPremium: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ 
      credits: user.credits, 
      isPremium: user.isPremium 
    });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
