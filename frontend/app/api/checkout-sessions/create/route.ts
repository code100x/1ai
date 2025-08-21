import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/server/auth"
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "30m"),
    analytics: true,
    prefix: "ratelimit:checkout-sessions",
});


const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    console.log("Request from IP:", ip);
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    const headers = {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
    };

    if (!success) {
        console.log(`Rate limit exceeded for IP ${ip}. Remaining: ${remaining}`);
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429, headers },
        );
    }

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, plan } = await req.json();
        if (!amount || !plan) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const price = amount * 100; // Convert to cents

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        recurring: {
                            interval: 'month',
                        },
                        product_data: {
                            name: plan,
                        },
                        unit_amount: price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/cancel`,
            metadata: {
                userId: session.user.id,
            },
            customer_email: session.user.email || undefined,
        });

        return NextResponse.json({ id: checkoutSession.id });
    } catch (error) {
        console.error('Checkout session creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
