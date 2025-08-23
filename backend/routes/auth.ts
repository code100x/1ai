import { Router } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator"
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
            return
        }

        // Generate TOTP using email and secret`
        console.log("before send email")
        const { otp, expires } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!));
        console.log("email is", data.email);
        console.log("otp is", otp);
        if (process.env.NODE_ENV !== "development") {
            try {
                await sendEmail(data.email, "Login to 1ai", `Log into 1ai your otp is ${otp}`);
            } catch (emailError) {
                console.error("Email sending failed:", emailError);
                res.status(500).json({
                    message: "Failed to send OTP, please retry after a few minutes",
                    success: false,
                });
                return;
            }
        } else {
            // In development mode, just log the OTP and continue
            console.log(`[DEV MODE] OTP for ${data.email}: ${otp}`);
        }

        otpCache.set(data.email, otp);
        try {
            await prismaClient.user.create({
                data: {
                    email: data.email,
                }
            });
        } catch (e) {
            console.log("User already exists");
        }

        res.json({
            message: "Check your email",
            success: true,
        });
    } catch (e) {
        console.error("Error in initiate_signin:", e);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
})

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
            message: "Invalid otp"
        })
        return
    }

    const user = await prismaClient.user.findUnique({
        where: {
            email: data.email
        }
    });

    if (!user) {
        res.json({
            message: "User not found",
            success: false,
        })
        return
    }

    const token = jwt.sign({
        userId: user.id
    }, process.env.JWT_SECRET!);

    res.status(200).json({
        token
    })
})

router.get("/me", authMiddleware, async (req, res) => {
    const user = await prismaClient.user.findUnique({
        where: { id: req.userId }
    })

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
        }
    })
})

export default router;
