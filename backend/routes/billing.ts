import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";
import { billingLimiter, apiLimiter } from "../ratelimitter";
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
const plans = [{
  name: "Premium",
  monthly: {
    price: 99,
    plan_id: "plan_R8lQ4opIQbMwPK",
    currency: "INR",
    symbol: "₹"
  },
  annual: {
    price: 999, // Annual price (e.g., 10 months price for 12 months)
    currency: "INR",
    symbol: "₹"
  },
  pricing_currency: [
    {
      plan_id: "plan_R8lQ4opIQbMwPK",
      monthly_price: 99,
      currency: "INR",
      symbol: "₹"
    },
    {
      plan_id: "plan_R8lOdy52StfdXe",
      monthly_price: 1,
      currency: "USD",
      symbol: "$"
    }
  ]
}]


billingRouter.post("/init-subscribe", billingLimiter, authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { planType = "monthly", currency = "INR" } = req.body; // Default to monthly plan

  const authHeader = 'Basic ' + Buffer.from(razorPayCredentials.key + ':' + razorPayCredentials.secret).toString('base64');
  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/json'
  };

  try {
    const plan = plans[0];
    
    if (planType === "annual" || planType === "yearly") {
      // Handle annual payment as one-time order
      const orderData = {
        amount: plan.annual.price * 100, // Razorpay expects amount in paise
        currency: plan.annual.currency,
        receipt: `annual_${userId}_${Date.now()}`,
        notes: {
          customer_id: userId,
          plan_type: "annual",
          app_name: "1AI",
        }
      };

      const orderResponse = await axios.post(createOrderUrl, orderData, { headers });
      const { id } = orderResponse.data;

      if (!id) {
        return res.status(500).json({ error: "Missing order ID" });
      }

      // Create payment history record
      await prisma.paymentHistory.create({
        data: {
          status: "PENDING",
          paymentMethod: 'RAZORPAY',
          cfPaymentId: "",
          bankReference: id,
          amount: plan.annual.price,
          userId: userId,
          currency: plan.annual.currency
        }
      });

      // Create subscription record with 1 year validity
      await prisma.subscription.create({
        data: {
          userId: userId,
          currency: plan.annual.currency,
          planId: "annual_plan", // Different plan ID for annual
          rzpSubscriptionId: id,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year from now
        }
      });

      return res.json({ 
        orderId: id, 
        rzpKey: razorPayCredentials.key, 
        currency: plan.annual.currency,
        amount: plan.annual.price * 100,
        planType: "annual"
      });

    } else {
      // Handle monthly subscription
      const wp = plan.pricing_currency[0]; // Default INR plan
      
      const orderData = {
        plan_id: wp.plan_id,
        customer_notify: 1,
        total_count: 12,
        notes: {
          customer_id: userId,
          return_url: `${process.env.FRONTEND_URL}`,
          app_name: "1AI",
        }
      };

      const orderResponse = await axios.post(subscriptionUrl, orderData, { headers });
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
        rzpKey: razorPayCredentials.key, 
        currency: wp.currency,
        planType: "monthly"
      });
    }
  } catch (error: any) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      error: "Internal server error during order creation",
      details: error.response?.data || error.message,
    });
  }
});

billingRouter.get("/history/:userId", apiLimiter, authMiddleware, async (req, res) => {
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

billingRouter.get("/subscriptions/:userId", apiLimiter, authMiddleware, async (req, res) => {
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

billingRouter.post('/get-plans', apiLimiter, async (req, res) => {
  // Return plans with both monthly and annual options
  const formattedPlans = plans.map(plan => ({
    name: plan.name,
    monthly: {
      price: plan.monthly.price,
      currency: plan.monthly.currency,
      symbol: plan.monthly.symbol,
      type: "subscription"
    },
    annual: {
      price: plan.annual.price,
      currency: plan.annual.currency,
      symbol: plan.annual.symbol,
      type: "one-time",
      savings: (plan.monthly.price * 12) - plan.annual.price // Show savings
    }
  }));
  return res.json(formattedPlans);
});

// Verify payment signature for both subscription and one-time payments
billingRouter.post("/verify-payment", billingLimiter, authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { signature, razorpay_payment_id, razorpay_order_id, razorpay_subscription_id, orderId } = req.body;

  if (!signature || !razorpay_payment_id) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing signature or payment ID" 
    });
  }

  try {
    // Find the pending payment record for this user
    const paymentRecord = await prisma.paymentHistory.findFirst({
      where: {
        userId: userId,
        status: "PENDING",
        bankReference: orderId || razorpay_order_id || razorpay_subscription_id
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

    // Find the subscription record
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        rzpSubscriptionId: orderId || razorpay_order_id || razorpay_subscription_id
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription/Order not found"
      });
    }

    let expectedSignature;
    
    // Check if this is an annual plan (one-time payment) or monthly subscription
    if (subscription.planId === "annual_plan") {
      // For one-time orders, signature format is: order_id|payment_id
      expectedSignature = crypto
        .createHmac("sha256", razorPayCredentials.secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
    } else {
      // For subscriptions, signature format is: payment_id|subscription_id
      expectedSignature = crypto
        .createHmac("sha256", razorPayCredentials.secret)
        .update(razorpay_payment_id + "|" + razorpay_subscription_id)
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

      // Determine credits based on plan type
      const creditsToAdd = subscription.planId === "annual_plan" ? 12000 : 1000; // More credits for annual

      // Update user to premium status and add credits
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: { increment: creditsToAdd }
        }
      });

      return res.json({
        success: true,
        message: "Payment verified successfully",
        planType: subscription.planId === "annual_plan" ? "annual" : "monthly",
        creditsAdded: creditsToAdd
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
billingRouter.get("/credits/:userId", apiLimiter, authMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, isPremium: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
``
    return res.json({ 
      credits: user.credits, 
      isPremium: user.isPremium 
    });
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
