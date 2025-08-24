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

const subscriptionUrl =
  razorPayCredentials.environment === "sandbox"
    ? "https://api.razorpay.com/v1/subscriptions"
    : "https://api.razorpay.com/v1/subscriptions";

const plans = [
  {
    name: "Premium",
    monthly_price: 99,
    yearly_price: 999,
    currency: "INR",
    symbol: "₹",
    pricing_currency: [
      {
        plan_id: "plan_R8lQ4opIQbMwPK", // monthly INR
        monthly_price: 99,
        yearly_price: 999,
        currency: "INR",
        symbol: "₹",
      },
      {
        plan_id: "plan_R8lOdy52StfdXe", // monthly USD
        monthly_price: 1,
        yearly_price: 10,
        currency: "USD",
        symbol: "$",
      },
    ],
  },
];

// ---------------- INIT SUBSCRIBE ----------------
billingRouter.post("/init-subscribe", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { planType = "monthly" } = req.body; // monthly or yearly

  const authHeader =
    "Basic " +
    Buffer.from(razorPayCredentials.key + ":" + razorPayCredentials.secret).toString("base64");
  const headers = {
    Authorization: authHeader,
    "Content-Type": "application/json",
  };

  // pick INR as default
  let wp = plans[0]?.pricing_currency[0];

  const orderData = {
    plan_id: wp.plan_id,
    customer_notify: 1,
    total_count: planType === "yearly" ? 1 : 12, // yearly = 1 charge, monthly = 12
    notes: {
      customer_id: userId,
      return_url: `${process.env.FRONTEND_URL}`,
      app_name: "1AI",
      planType,
    },
  };

  try {
    const orderResponse = await axios.post(subscriptionUrl, orderData, {
      headers,
    });
    const { id } = orderResponse.data;

    if (!id) {
      return res.status(500).json({ error: "Missing payment session ID" });
    }

    // record pending payment
    await prisma.paymentHistory.create({
      data: {
        status: "PENDING",
        paymentMethod: "RAZORPAY",
        cfPaymentId: "",
        bankReference: id,
        amount: planType === "yearly" ? wp.yearly_price : wp.monthly_price,
        userId: userId,
        currency: wp.currency,
      },
    });

    // create subscription with proper endDate
    await prisma.subscription.create({
      data: {
        userId: userId,
        currency: wp.currency,
        planId: wp.plan_id,
        rzpSubscriptionId: id,
        startDate: new Date(),
        endDate:
          planType === "yearly"
            ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            : new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    });

    return res.json({ orderId: id, rzpKey: razorPayCredentials.key, currency: wp.currency });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      error: "Internal server error during order creation",
      details: error.response?.data || error.message,
    });
  }
});

// ---------------- HISTORY ----------------
billingRouter.get("/history/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const paymentHistory = await prisma.paymentHistory.findMany({
      where: {
        userId,
        status: "SUCCESS",
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

// ---------------- ACTIVE SUBSCRIPTIONS ----------------
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

billingRouter.post("/get-plans", async (req, res) => {
  return res.json(plans);
});

// ---------------- VERIFY PAYMENT ----------------
billingRouter.post("/verify-payment", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { signature, razorpay_payment_id, orderId } = req.body;

  if (!signature || !razorpay_payment_id) {
    return res.status(400).json({
      success: false,
      error: "Missing signature or payment ID",
    });
  }

  try {
    const paymentRecord = await prisma.paymentHistory.findFirst({
      where: {
        userId: userId,
        status: "PENDING",
        bankReference: orderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        error: "No pending payment found",
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        rzpSubscriptionId: orderId,
      },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorPayCredentials.secret)
      .update(razorpay_payment_id + "|" + subscription.rzpSubscriptionId)
      .digest("hex");

    if (expectedSignature === signature) {
      // ✅ Payment authentic
      await prisma.paymentHistory.update({
        where: { paymentId: paymentRecord.paymentId },
        data: {
          status: "SUCCESS",
          cfPaymentId: razorpay_payment_id,
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: { increment: 1000 },
        },
      });

      // extend subscription if yearly
      if (subscription) {
        const updatedEndDate =
          paymentRecord.amount > 100 // crude check for yearly vs monthly
            ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            : new Date(new Date().setMonth(new Date().getMonth() + 1));

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { endDate: updatedEndDate },
        });
      }

      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      await prisma.paymentHistory.update({
        where: { paymentId: paymentRecord.paymentId },
        data: {
          status: "FAILED",
        },
      });

      return res.status(400).json({
        success: false,
        error: "Invalid payment signature",
      });
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error during payment verification",
      details: error.message,
    });
  }
});

// ---------------- USER CREDITS ----------------
billingRouter.get("/credits/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, isPremium: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      credits: user.credits,
      isPremium: user.isPremium,
    });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
