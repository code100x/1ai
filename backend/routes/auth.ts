import { Router } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator"
import base32 from "hi-base32";
import { PrismaClient } from "../generated/prisma";
import { authMiddleware } from "../auth-middleware";
import { perMinuteLimiter, perMinuteLimiterRelaxed } from "../ratelimitter";
import { AuthTokenManager } from "../auth-refresh";

const prismaClient = new PrismaClient();

const router = Router();

// Temporarily adding local user otp cache with consumption tracking and mutex
const otpCache = new Map<string, { otp: string; consumed: boolean; timestamp: number }>();
const verificationMutex = new Map<string, boolean>();

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
            await sendEmail(data.email, "Login to 1ai", `Log into 1ai your otp is ${otp}`);
        }

        otpCache.set(data.email, { otp, consumed: false, timestamp: Date.now() });
        try {
            await prismaClient.user.create({
                data: {
                    email: data.email,
                }
            });
        } catch (e) {
            // User already exists; proceed to send OTP
        }

        res.json({
            message: "Check your email",
            success: true,
        });
    } catch (e) {
        console.error("initiate_signin error:", e);
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
    
    // Prevent race conditions with mutex
    if (verificationMutex.get(data.email)) {
        res.status(429).json({
            message: "Verification already in progress"
        });
        return;
    }
    
    verificationMutex.set(data.email, true);
    
    try {
        // Verify with some totp lib
        const { otp } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!));
        console.log("expected otp is", otp);
        
        const cachedOtpData = otpCache.get(data.email);
        console.log("otpCache is", cachedOtpData);
        
        // Check if OTP exists and hasn't been consumed
        if (!cachedOtpData || cachedOtpData.consumed) {
            console.log("OTP not found or already consumed");
            res.status(401).json({
                message: "Invalid or expired OTP"
            });
            return;
        }
        
        // Check if OTP is expired (5 minutes)
        const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
        if (Date.now() - cachedOtpData.timestamp > OTP_EXPIRY_TIME) {
            otpCache.delete(data.email);
            console.log("OTP expired");
            res.status(401).json({
                message: "OTP has expired"
            });
            return;
        }
        
        // Verify OTP
        if (otp !== data.otp && cachedOtpData.otp !== data.otp) {
            console.log("invalid otp");
            res.status(401).json({
                message: "Invalid OTP"
            });
            return;
        }
        
        // Mark OTP as consumed to prevent reuse
        cachedOtpData.consumed = true;

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

    const tokenManager = AuthTokenManager.getInstance();
    const { accessToken, refreshToken } = await tokenManager.generateTokenPair(user.id);

<<<<<<< HEAD
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                credits: user.credits,
                isPremium: user.isPremium
            }
        })
    } finally {
        // Always release the mutex
        verificationMutex.delete(data.email);
    }
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

router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    const tokenManager = AuthTokenManager.getInstance();
    const tokens = await tokenManager.refreshAccessToken(refreshToken);

    if (!tokens) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    res.json(tokens);
});

router.post("/logout", authMiddleware, async (req, res) => {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
        const tokenManager = AuthTokenManager.getInstance();
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
            await tokenManager.revokeRefreshToken(decoded.tokenId);
        } catch {}
    }

    res.json({ message: "Logged out successfully" });
});

export default router;
