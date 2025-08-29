import { Router } from "express";
import { PrismaClient } from "../generated/prisma";
import crypto from "crypto";

const prisma = new PrismaClient();
const rzpWebhookRouter = Router();

// Webhook signature verification function
function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    const secret = process.env.RZP_WEBHOOK_SECRET!;
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return expectedHash === signature;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

rzpWebhookRouter.post("/", async (req, res) => {
  try {
    console.log("Webhook received:", req.body);
    console.log(req.body);
    console.log(req.headers);
    
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = req.body;
    
    // Verify webhook signature for security
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const { event, payload } = req.body;
    
    // Handle subscription.activated event
    if (event === "subscription.activated") {
      const subscription = payload.subscription.entity;
      const { notes, id: subscriptionId } = subscription;

      if (notes.app_name !== "1AI") {
        return res.status(200).json({ message: "Webhook processed successfully" });
      }
      
      // Extract user ID from notes
      let userId: string | null = null;
      if (notes && typeof notes === 'object') {
        userId = notes.customer_id || notes.userId;
      }
      
      if (!userId) {
        console.error("No user ID found in subscription notes");
        return res.status(400).json({ error: "User ID not found in notes" });
      }
      
      console.log(`Processing subscription activation for user: ${userId}`);
      
      // Atomically mark payment history SUCCESS only if it's still PENDING
      const updated = await prisma.paymentHistory.updateMany({
        where: {
          bankReference: subscriptionId,
          status: "PENDING"
        },
        data: {
          status: "SUCCESS",
          cfPaymentId: subscriptionId
        }
      });
      
      if (updated.count === 0) {
        // Already processed or nothing to do
        console.info(`Webhook: subscription ${subscriptionId} already processed`);
        return res.status(200).json({ message: "Already processed" });
      }
      
      // Only increment credits when we actually transitioned a PENDING payment to SUCCESS
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: { increment: 1000 }
        }
      });

      // Update or create subscription record
      const existingSubscription = await prisma.subscription.findFirst({
        where: { rzpSubscriptionId: subscriptionId }
      });
      
      if (existingSubscription) {
        // Update existing subscription
        await prisma.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            startDate: new Date(subscription.start_at * 1000),
            endDate: new Date(subscription.end_at * 1000),
            updatedAt: new Date()
          }
        });
      } else {
        // Create new subscription if it doesn't exist
        await prisma.subscription.create({
          data: {
            userId: userId,
            currency: "INR", // Default currency, could be extracted from subscription if available
            planId: subscription.plan_id,
            rzpSubscriptionId: subscriptionId,
            startDate: new Date(subscription.start_at * 1000),
            endDate: new Date(subscription.end_at * 1000)
          }
        });
      }
      
      console.log(`Successfully activated subscription for user ${userId}`);
    } else if (event === "payment.captured") {
      const payment = payload.payment.entity;
      const { notes, id: paymentId } = payment;

      if (notes.app_name !== "1AI") {
        return res.status(200).json({ message: "Webhook processed successfully" });
      }
      
      // Extract user ID from notes
      let userId: string | null = null;
      if (notes && typeof notes === 'object') {
        userId = notes.customer_id || notes.userId;
      }
      
      if (!userId) {
        console.error("No user ID found in payment notes");
        return res.status(400).json({ error: "User ID not found in notes" });
      }
      
      console.log(`Processing payment capture for user: ${userId}`);
      
      // Find the corresponding payment record
      const paymentRecord = await prisma.paymentHistory.findFirst({
        where: {
          paymentId: paymentId,
          status: "PENDING"
        }
      });
      
      if (!paymentRecord) {
        console.error("No pending payment record found for payment ID:", paymentId);
        return res.status(404).json({ error: "Payment record not found" });
      }
      
      // Replace the monthly-subscription success path that did unconditional updates
      const updated = await prisma.paymentHistory.updateMany({
        where: {
          paymentId: paymentRecord.paymentId,
          status: "PENDING"
        },
        data: {
          status: "SUCCESS",
          cfPaymentId: paymentId
        }
      });

      if (updated.count === 0) {
        return res.status(409).json({
          success: false,
          error: "Payment already processed or invalid payment state"
        });
      }

      // Safe to update user once
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: { increment: 1000 } // monthly credits
        }
      });

      return res.json({
        success: true,
        message: "Payment verified successfully"
      });
    }
    
    res.status(200).json({ message: "Webhook processed successfully" });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default rzpWebhookRouter;

