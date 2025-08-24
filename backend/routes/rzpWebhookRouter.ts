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
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return expectedHash === signature;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return false;
  }
}

rzpWebhookRouter.post("/", async (req, res) => {
  try {
    console.log("Webhook received:", req.body);
    console.log(req.headers);

    const signature = req.headers["x-razorpay-signature"] as string;
    const rawBody = JSON.stringify(req.body); // FIX: stringify body before signature check

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const { event, payload } = req.body;

    /**
     * Case 1: Subscription activated (monthly plans only)
     */
    if (event === "subscription.activated") {
      const subscription = payload.subscription.entity;
      const { notes, id: subscriptionId } = subscription;

      if (notes.app_name !== "1AI") {
        return res.status(200).json({ message: "Ignored - not 1AI app" });
      }

      let userId: string | null = null;
      if (notes && typeof notes === "object") {
        userId = notes.customer_id || notes.userId;
      }

      if (!userId) {
        console.error("No user ID found in subscription notes");
        return res.status(400).json({ error: "User ID not found" });
      }

      console.log(`Processing subscription activation for user: ${userId}`);

      // Update user as premium and give credits
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: { increment: 1000 },
        },
      });

      // Mark related payment as SUCCESS
      await prisma.paymentHistory.updateMany({
        where: { bankReference: subscriptionId, status: "PENDING" },
        data: { status: "SUCCESS", updatedAt: new Date() },
      });

      // Handle subscription record (only for monthly)
      const existing = await prisma.subscription.findFirst({
        where: { rzpSubscriptionId: subscriptionId },
      });

      if (existing) {
        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            startDate: new Date(subscription.start_at * 1000),
            endDate: new Date(subscription.end_at * 1000),
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId,
            currency: "INR",
            planId: subscription.plan_id,
            rzpSubscriptionId: subscriptionId,
            startDate: new Date(subscription.start_at * 1000),
            endDate: new Date(subscription.end_at * 1000),
          },
        });
      }

      console.log(`✅ Subscription activated for user ${userId}`);
    }

    /**
     * Case 2: Annual plan → treat as one-time payment (no subscription table entry)
     */
    if (event === "payment.captured") {
      const payment = payload.payment.entity;
      const { notes, id: paymentId } = payment;

      if (notes?.app_name !== "1AI") {
        return res.status(200).json({ message: "Ignored - not 1AI app" });
      }

      let userId: string | null = null;
      if (notes && typeof notes === "object") {
        userId = notes.customer_id || notes.userId;
      }

      if (!userId) {
        console.error("No user ID in payment notes");
        return res.status(400).json({ error: "User ID not found" });
      }

      console.log(`Processing annual payment for user: ${userId}`);

      // Update user to premium and add more credits (annual benefit)
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPremium: true,
          credits: { increment: 12000 }, // e.g. annual = 1000*12
        },
      });

      // Mark payment as SUCCESS
      await prisma.paymentHistory.updateMany({
        where: { bankReference: paymentId, status: "PENDING" },
        data: { status: "SUCCESS", updatedAt: new Date() },
      });

      console.log(`✅ Annual payment processed for user ${userId}`);
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default rzpWebhookRouter;
