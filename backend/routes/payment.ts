import { Router } from "express";
import Razorpay from "razorpay";
import { z } from "zod";
import { authMiddleware } from "../auth-middleware";
import { PrismaClient } from "../generated/prisma";
import {
  validateWebhookSignature,
  generateReceiptId,
} from "../utils/razorpay-utils";

const prismaClient = new PrismaClient();

const router = Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});

const createOrderSchema = z.object({
  amount: z.string(),
  currency: z.string(),
  description: z.string().optional(),
});

const webhookPayloadSchema = z.object({
  payment: z.object({
    entity: z.object({
      amount: z.number(),
      id: z.string(),
      notes: z.object({
        userId: z.string(),
        description: z.string().optional(),
      }),
      order_id: z.string(),
      status: z.string(),
    }),
  }),
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { success, data } = createOrderSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        error: "Invalid input",
        success: false,
      });
    }

    const { amount, currency, description } = data;
    const userId = req.userId;

    const options = {
      amount,
      currency,
      receipt: generateReceiptId(),
      notes: {
        userId,
        ...(description && { description }),
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      success: true,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      error: "Failed to create order",
      success: false,
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const jsonBody = req.body;
    const razorpaySignature = req.headers["x-razorpay-signature"] as string;

    if (!razorpaySignature) {
      return res.status(400).json({
        error: "Signature not found",
        success: false,
      });
    }

    // Validate webhook signature
    const isPaymentValid = validateWebhookSignature(
      JSON.stringify(jsonBody),
      razorpaySignature,
      process.env.RAZORPAY_WEBHOOK_SECRET!
    );

    if (!isPaymentValid) {
      return res.status(400).json({
        error: "Payment not verified. Payment signature invalid",
        success: false,
      });
    }

    const { success, data } = webhookPayloadSchema.safeParse(jsonBody);

    if (!success) {
      return res.status(400).json({
        error: "Invalid payload format",
        success: false,
      });
    }

    const {
      payment: {
        entity: {
          amount,
          id: paymentId,
          notes: { userId, description },
          order_id,
          status,
        },
      },
    } = data;

    if (status !== "authorized" && status !== "captured") {
      return res.status(400).json({
        error: "Payment not authorized",
        success: false,
      });
    }

    // Create payment record in database
    await prismaClient.payment.create({
      data: {
        id: paymentId,
        userId,
        amount,
        status,
        orderId: order_id,
        ...(description && { description }),
      },
    });

    res.json({
      message: "Payment verified successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      error: "Failed to verify payment",
      success: false,
    });
  }
});

export default router;
