import { Router } from "express";
import { sendEmail } from "../postmark";
import { CreateUser, SignIn } from "../types";
import jwt from "jsonwebtoken";
import { TOTP } from "totp-generator"
import base32 from "hi-base32";
import { PrismaClient } from "../generated/prisma";

const prismaClient = new PrismaClient();

const router = Router();

// TODO: Rate limit this
router.post("/initiate_signin", async (req, res) => {
    try {
        return res.status(403).json({
            message: "Not implemented",
        })
        const { success, data } = CreateUser.safeParse(req.body);

        if (!success) {
            res.status(411).send("Invalid input");
            return
        }

        // Generate TOTP using email and secret`
        const { otp, expires } = TOTP.generate(base32.encode(data.email + process.env.JWT_SECRET!));
        if (process.env.NODE_ENV !== "development") {
            await sendEmail(data.email, "Login to 1ai", `Log into 1ai your otp is ${otp}`);
        } else {
            console.log(`Log into your 1ai `, otp);
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

router.post("/signin", async (req, res) => {
    const { success, data } = SignIn.safeParse(req.body);

    if (!success) {
        res.status(411).send("Invalid input");
        return;
    }

    // Verify TOTP by checking 3 iterations (current, previous, and next)
    const secret = base32.encode(data.email + process.env.JWT_SECRET!);
    
    // Standard TOTP verification with tolerance
    // Check current time window and adjacent windows (±1 window)
    const timeStep = 30; // 30 seconds per TOTP window
    const currentTime = Math.floor(Date.now() / 1000);
    const currentWindow = Math.floor(currentTime / timeStep);
    
    let otpValid = false;
    
    // Check current window
    const currentOtp = TOTP.generate(secret);
    if (currentOtp.otp === data.otp) {
        otpValid = true;
    }
    
    // Check previous window (30 seconds ago)
    if (!otpValid) {
        const previousWindow = currentWindow - 1;
        const previousTime = previousWindow * timeStep;
        const previousOtp = TOTP.generate(secret, { time: previousTime * 1000 });
        if (previousOtp.otp === data.otp) {
            otpValid = true;
        }
    }
    
    // Check next window (30 seconds ahead)
    if (!otpValid) {
        const nextWindow = currentWindow + 1;
        const nextTime = nextWindow * timeStep;
        const nextOtp = TOTP.generate(secret, { time: nextTime * 1000 });
        if (nextOtp.otp === data.otp) {
            otpValid = true;
        }
    }
    
    if (!otpValid) {
        res.json({
            message: "Invalid otp",
            success: false,
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

    res.json({
        token,
        success: true
    })
})

export default router;
