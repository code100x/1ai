import { Router } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator";
import base32 from "hi-base32";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";
import { perMinuteLimiter, perMinuteLimiterRelaxed } from "../ratelimitter";

const prismaClient = new PrismaClient();

const router = Router();

// Temporarily adding local user otp cache
const otpCache = new Map<string, string>();

// TODO: Rate limit this
router.post("/initiate_signin", perMinuteLimiter, async (req, res) => {
  try {
    const { success, data } = CreateUser.safeParse(req.body);

    if (!success) {
      res.status(411).send("Invalid input");
      return;
    }

    // Generate TOTP using email and secret`
    console.log("before send email");
    const { otp, expires } = TOTP.generate(
      base32.encode(data.email + process.env.JWT_SECRET!)
    );
    console.log("email is", data.email);
    console.log("otp is", otp);
    if (process.env.NODE_ENV !== "development") {
      await sendEmail(
        data.email,
        "Your One-Time Password (OTP) for 1ai",
        `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #4CAF50;">Hello 👋</h2>
            <p>You requested to log into <strong>1ai</strong>.</p>
            <p>Your One-Time Password (OTP) is:</p>
            <div style="padding: 10px; background: #f4f4f4; border: 1px dashed #4CAF50; 
                        font-size: 20px; font-weight: bold; text-align: center; width: fit-content;">
            ${otp}
            </div>
            <p>This OTP will expire in <strong>5 minutes</strong>.</p>
            <p>If you didn’t request this, you can safely ignore this email.</p>
            <br>
            <p style="font-size: 12px; color: #888;">- The 1ai Team</p>
        </div>
        `
      );
    } else {
      console.log(`Log into your 1ai `, otp);
    }

    otpCache.set(data.email, otp);
    try {
      await prismaClient.user.create({
        data: {
          email: data.email,
        },
      });
    } catch (e) {
      console.log("User already exists");
    }

    res.json({
      message: "Check your email",
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Internal server error",
      success: false,
    });
  }
});

router.post("/signin", perMinuteLimiterRelaxed, async (req, res) => {
  const { success, data } = SignIn.safeParse(req.body);

  if (!success) {
    res.status(411).send("Invalid input");
    return;
  }

  console.log("data is");
  console.log(data);
  console.log("otpCache is", otpCache.get(data.email));

  if (otpCache.get(data.email) != data.otp) {
    console.log("invalid otp");
    res.status(401).json({
      message: "Invalid otp",
    });
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    res.json({
      message: "User not found",
      success: false,
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!
  );

  res.status(200).json({
    token,
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await prismaClient.user.findUnique({
    where: { id: req.userId },
  });

  if (!user) {
    res.status(401).send({
      message: "Unauthorized",
      success: false,
    });
    return;
  }

  res.json({
    user: {
      id: user?.id,
      email: user?.email,
    },
  });
});

export default router;
