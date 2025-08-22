import { Router, type Request, type Response } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator";
import base32 from "hi-base32";
import { PrismaClient } from "../generated/prisma";
import { perHourLimiter, perMinuteLimiter } from "../rate-limiter";

const prismaClient = new PrismaClient();

const router = Router();

// TODO: Rate limit this
router.post(
  "/initiate_signin",
  [perMinuteLimiter, perHourLimiter],
  async (req: Request, res: Response) => {
    try {
      // return res.status(403).json({
      //     message: "Not implemented",
      // })
      const { success, data } = CreateUser.safeParse(req.body);

      if (!success) {
        res.status(411).send("Invalid input");
        return;
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("Secret not found");
      }

      // Generate TOTP using email and secret`
      const { otp, expires } = TOTP.generate(
        base32.encode(data.email + process.env.JWT_SECRET)
      );

      if (process.env.NODE_ENV !== "development") {
        const emailRes = await sendEmail(
          data.email,
          "Login to 1ai",
          `Log into 1ai your otp is ${otp}`
        );
        if (emailRes?.status) {
          if (!["200", "201", "204"].includes(emailRes?.status.toString())) {
            return res
              .status(400)
              .json({ message: "something went wrong while send email" });
          }
        }
      } else {
        console.log(`Log into your 1ai `, otp);
      }

      try {
        await prismaClient.user.create({
          data: {
            email: data.email,
          },
        });
      } catch (e) {
        console.log("User already exists");
      }

      return res.json({
        message: "Check your email",
        success: true,
      });
    } catch (e) {
      console.log(e);
      return res.json({
        message: "Internal server error",
        success: false,
      });
    }
  }
);

router.post("/signin", async (req, res) => {
  const { success, data } = SignIn.safeParse(req.body);

  if (!success) {
    res.status(411).send("Invalid input");
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("Secret not found");
  }

  // Verify with some totp lib
  const { otp } = TOTP.generate(
    base32.encode(data.email + process.env.JWT_SECRET)
  );

  if (otp !== data.otp) {
    res.json({
      message: "Invalid otp",
      success: false,
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
    process.env.JWT_SECRET
  );

  return res.json({
    token,
    success: true,
  });
});

export default router;
