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
      
      // Update user to premium and add 1000 credits
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: {
            increment: 1000
          }
        }
      });

      // Update payment history status to SUCCESS
      await prisma.paymentHistory.updateMany({
        where: { 
          bankReference: subscriptionId,
          status: "PENDING"
        },
        data: {
          status: "SUCCESS",
          updatedAt: new Date()
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
    }
    
    res.status(200).json({ message: "Webhook processed successfully" });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default rzpWebhookRouter;

