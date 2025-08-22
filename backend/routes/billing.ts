import { Router } from "express";
import axios from "axios";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";
import crypto from "crypto";

const prisma = new PrismaClient();

export const billingRouter = Router();

function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  try {
      // Create the expected signature string
      const expectedSignature = orderId + "|" + paymentId;
      
      // Generate HMAC hash using your Razorpay key secret
      const expectedHash = crypto
          .createHmac('sha256', razorPayCredentials.secret)
          .update(expectedSignature)
          .digest('hex');
      
      // Compare the generated hash with received signature
      return expectedHash === signature;
  } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
  }
}

/**
* Verify webhook signature (for webhook events)
*/
function verifyWebhookSignature(payload: string, signature: string) {
  try {
      const expectedHash = crypto
          .createHmac('sha256', razorPayCredentials.secret)
          .update(payload)
          .digest('hex');
      
      return expectedHash === signature;
  } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
  }
}

const razorPayCredentials = {
  key: process.env.RZP_KEY,
  secret: process.env.RZP_SECRET!,
  environment: process.env.RZP_ENVIRONMENT!,
};

const createOrderUrl = razorPayCredentials.environment === "sandbox" ? 'https://api.razorpay.com/v1/orders' : 'https://api.razorpay.com/v1/orders';
const subscriptionUrl = razorPayCredentials.environment === "sandbox" ? "https://api.razorpay.com/v1/subscriptions" : "https://api.razorpay.com/v1/subscriptions";
const plans = [{
  name: "Premium",
  monthly_price: 499,
  plan_id: razorPayCredentials.environment === "sandbox" ? "plan_Q8YwsNrnTxQFNG" : "plan_Q8XbmKKHT2Yefe",
  annual_price: 4999,
  currency: "INR",
  symbol: "₹",
  pricing_currency: [
    {
      plan_id: razorPayCredentials.environment === "sandbox" ? "plan_Q8YwsNrnTxQFNG" : "plan_Q8XbmKKHT2Yefe",
      annual_price: 4999,
      monthly_price: 499,
      currency: "INR",
      symbol: "₹"
    },
  ]
}]


billingRouter.post("/init-subscribe", authMiddleware, async (req, res) => {
  const userId = req.userId;

  const authHeader = 'Basic ' + Buffer.from(razorPayCredentials.key + ':' + razorPayCredentials.secret).toString('base64');
  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/json'
  };

  let wp = plans[0]?.pricing_currency[0];

  const orderData = {
    plan_id: wp.plan_id,
    customer_notify: 1,
    total_count: 12,
    notes: {
      customer_id: userId,
      return_url: `${process.env.FRONTEND_URL}`
    }
  };

  try {
    
    const orderResponse = await axios.post(subscriptionUrl, orderData, {
      headers,
    });
    const { id } = orderResponse.data;

    if (!id) {
      return res.status(500).json({ error: "Missing payment session ID" });
    }

    // await prisma.paymentHistory.create({
    //   data: {
    //     status: "pending",
    //     paymentMethod: 'RAZORPAY',
    //     cfPaymentId: "",
    //     bankReference: id,
    //     amount: wp.monthly_price,
    //     userId: userId,
    //     currency: wp.currency
    //   },
    // });

    return res.json({ orderId: id, rzpKey: razorPayCredentials.key });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      error: "Internal server error during order creation",
      details: error.response?.data || error.message,
    });
  }
});

billingRouter.post("/subscribe", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { orderId, paymentId, signature } = req.body;

  const authHeader = 'Basic ' + Buffer.from(razorPayCredentials.key + ':' + razorPayCredentials.secret).toString('base64');
  const headers = {
    'Authorization': authHeader,
    'Content-Type': 'application/json'
  };

  const existingPayment = await prisma.paymentHistory.findFirst({
    where: {
      bankReference: orderId,
      userId: userId,
    },
  });

  if (!existingPayment) {
    return res.status(500).json({ error: "Invalid session ID" });
  }

  if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
    return res.status(500).json({ error: "Invalid signature" });
  }

  try {
    await prisma.paymentHistory.update({
      where: {
        paymentId: existingPayment.paymentId, // Use the ID of the found record
      },
      data: {
        cfPaymentId: paymentId,
        status: "success"
      },
    });

    // Grant 1000 credits for monthly subscription
    const creditsToGrant = 1000;
    
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isPremium: true,
        credits: {
          increment: creditsToGrant
        }
      },
    });

    const startDate = new Date(); // Current date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Add 1 month

    await prisma.subscription.create({
      data: {
        userId: userId,
        currency: existingPayment.currency ?? "",
        planId: existingPayment.bankReference ?? "",
        subscriptionId: existingPayment.cfPaymentId ?? "",
        startDate: startDate,
        endDate: endDate,
        creditsGranted: creditsToGrant
      },
    });

    return res.json({ status: true });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      error: "Internal server error during order creation",
      details: error.response?.data || error.message,
    });
  }
});

billingRouter.post("/redirect-home", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

billingRouter.get("/history/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const paymentHistory = await prisma.paymentHistory.findMany({
      where: {
        userId,
        status: "success"
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

billingRouter.post('/get-plans', async (req, res) => {
  return res.json(plans);
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
