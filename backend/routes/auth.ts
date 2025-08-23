import { Router } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator"
import base32 from "hi-base32";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";
import { perMinuteLimiter, perMinuteLimiterRelaxed, apiLimiter } from "../ratelimitter";
import { OTPStore } from "../OTPStore";

const prismaClient = new PrismaClient();
const otpStore = OTPStore.getInstance();

const router = Router();

// TODO: Rate limit this
router.post("/initiate_signin", perMinuteLimiter, async (req, res) => {
    try {
        const { success, data } = CreateUser.safeParse(req.body);

        if (!success) {
            res.status(411).send("Invalid input");
            return
        }

        // Generate TOTP using email and secret
        console.log("Generating OTP for email:", data.email);
        const { otp } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!));
        
        // Store OTP with automatic expiration
        otpStore.setOTP(data.email, otp);
        
        // Send email (or log in development)
        if (process.env.NODE_ENV !== "development") {
            await sendEmail(data.email, "Login to 1ai", `Your login OTP for 1ai is: ${otp}\n\nThis OTP will expire in 5 minutes.`);
            console.log(`OTP email sent to ${data.email}`);
        } else {
            console.log(`🔐 Development OTP for ${data.email}: ${otp}`);
        }
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
        console.log(e);
        res.json({
            message: "Internal server error",
            success: false,
        });
    }
})

router.post("/signin", perMinuteLimiterRelaxed, async (req, res) => {
    const { success, data } = SignIn.safeParse(req.body);

    if (!success) {
        res.status(411).json({
            message: "Invalid input data",
            success: false
        });
        return;
    }

    console.log(`🔍 Sign-in attempt for: ${data.email} with OTP: '${data.otp}'`);

    // Verify OTP using the new OTP store
    const verification = otpStore.verifyOTP(data.email, data.otp);

    if (!verification.isValid) {
        console.log(`❌ OTP verification failed: ${verification.message}`);
        
        // Apply additional rate limiting if too many attempts
        if (verification.shouldRateLimit) {
            return res.status(429).json({
                message: verification.message,
                success: false
            });
        }

        return res.status(401).json({
            message: verification.message,
            success: false
        });
    }

    console.log(`✅ OTP verified successfully for ${data.email}`);

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

router.get("/me", apiLimiter, authMiddleware, async (req, res) => {
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

// Debug endpoint to check OTP store status (only in development)
if (process.env.NODE_ENV === "development") {
    router.get("/debug/otp-stats", apiLimiter, (req, res) => {
        const stats = otpStore.getStats();
        res.json({
            message: "OTP Store Statistics",
            ...stats,
            timestamp: new Date().toISOString()
        });
    });
}

export default router;
