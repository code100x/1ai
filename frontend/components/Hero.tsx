"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Users, Star, Sparkles, Brain, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function LandingPage() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    }

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const scaleOnHover = {
        whileHover: { scale: 1.05, transition: { duration: 0.2 } },
        whileTap: { scale: 0.95 },
    }

    return (
        <div className="min-h-screen bg-background overflow-x-hidden relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Floating AI nodes */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
                            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Neural network connections */}
                <motion.div
                    className="absolute inset-0 opacity-5"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                    style={{
                        backgroundImage: `
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(0deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Gradient orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-500/10 to-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 0.8, 1.2],
                        rotate: [360, 180, 0],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 5 }}
                />

                {/* Binary rain effect */}
                <motion.div
                    className="absolute inset-0 opacity-5"
                    animate={{
                        backgroundPosition: ["0% 0%", "0% 100%"],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                    style={{
                        backgroundImage:
                            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="100"><text x="0" y="20" fontFamily="monospace" fontSize="12" fill="%23hsl(var(--primary))">1</text><text x="0" y="40" fontFamily="monospace" fontSize="12" fill="%23hsl(var(--primary))">0</text><text x="0" y="60" fontFamily="monospace" fontSize="12" fill="%23hsl(var(--primary))">1</text><text x="0" y="80" fontFamily="monospace" fontSize="12" fill="%23hsl(var(--primary))">0</text></svg>\')',
                        backgroundSize: "20px 100px",
                    }}
                />
            </div>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
            >
                <div className="container flex h-16 items-center justify-between">
                    <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <Brain className="h-5 w-5 text-primary-foreground" />
                        </motion.div>
                        <span className="text-xl font-bold text-foreground bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
                            1AI
                        </span>
                    </motion.div>
                    <nav className="hidden md:flex items-center space-x-6">
                        <motion.a
                            href="#features"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors drop-shadow-sm"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            Features
                        </motion.a>
                        <motion.a
                            href="#testimonials"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors drop-shadow-sm"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            Testimonials
                        </motion.a>
                        <motion.a
                            href="#pricing"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors drop-shadow-sm"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            Pricing
                        </motion.a>
                        <motion.div {...scaleOnHover}>
                            <Button variant="outline" size="sm" className="shadow-md bg-transparent">
                                Sign In
                            </Button>
                        </motion.div>
                        <motion.div {...scaleOnHover}>
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    </nav>
                    <motion.div className="md:hidden" {...scaleOnHover}>
                        <Button variant="ghost" size="sm">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>
                    </motion.div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative py-12 sm:py-20 lg:py-32 z-10">
                <div className="container relative">
                    <motion.div
                        className="mx-auto max-w-4xl text-center"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge
                                variant="secondary"
                                className="mb-6 px-4 py-2 shadow-lg backdrop-blur-sm bg-slate-900/90 text-white border border-white/20"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                    className="inline-block mr-2"
                                >
                                    🚀
                                </motion.div>
                                Now with Advanced AI Models
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
                            style={{
                                textShadow: "0 4px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
                                filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
                            }}
                        >
                            The Future of
                            <motion.span
                                className="text-primary block sm:inline font-extrabold"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                style={{
                                    background:
                                        "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/0.9), hsl(var(--primary)))",
                                    backgroundSize: "200% 100%",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    textShadow: "0 4px 8px rgba(0,0,0,0.6), 0 0 30px hsl(var(--primary)/0.8)",
                                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4)) drop-shadow(0 0 20px hsl(var(--primary)/0.3))",
                                }}
                                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            >
                                {" "}
                                AI Conversations
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-white max-w-2xl mx-auto px-4 font-semibold relative overflow-hidden"
                            style={{
                                textShadow: "0 3px 6px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.6)",
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(255,107,0,0.15) 0%, rgba(255,140,0,0.25) 25%, rgba(0,150,255,0.15) 50%, rgba(138,43,226,0.2) 75%, rgba(255,20,147,0.15) 100%)",
                                    backdropFilter: "blur(20px)",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                }}
                                animate={{
                                    background: [
                                        "linear-gradient(135deg, rgba(255,107,0,0.15) 0%, rgba(255,140,0,0.25) 25%, rgba(0,150,255,0.15) 50%, rgba(138,43,226,0.2) 75%, rgba(255,20,147,0.15) 100%)",
                                        "linear-gradient(225deg, rgba(0,150,255,0.2) 0%, rgba(138,43,226,0.25) 25%, rgba(255,20,147,0.2) 50%, rgba(255,107,0,0.15) 75%, rgba(255,140,0,0.2) 100%)",
                                        "linear-gradient(315deg, rgba(138,43,226,0.15) 0%, rgba(255,20,147,0.2) 25%, rgba(255,107,0,0.25) 50%, rgba(0,150,255,0.15) 75%, rgba(255,140,0,0.2) 100%)",
                                        "linear-gradient(135deg, rgba(255,107,0,0.15) 0%, rgba(255,140,0,0.25) 25%, rgba(0,150,255,0.15) 50%, rgba(138,43,226,0.2) 75%, rgba(255,20,147,0.15) 100%)",
                                    ],
                                    borderColor: [
                                        "rgba(255,255,255,0.3)",
                                        "rgba(255,107,0,0.4)",
                                        "rgba(0,150,255,0.4)",
                                        "rgba(138,43,226,0.4)",
                                        "rgba(255,255,255,0.3)",
                                    ],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                            />

                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white/40 rounded-full"
                                    style={{
                                        left: `${10 + i * 10}%`,
                                        top: `${20 + (i % 3) * 20}%`,
                                    }}
                                    animate={{
                                        y: [-10, 10, -10],
                                        x: [-5, 5, -5],
                                        opacity: [0.2, 0.8, 0.2],
                                        scale: [0.5, 1.2, 0.5],
                                    }}
                                    transition={{
                                        duration: 3 + i * 0.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                        delay: i * 0.3,
                                    }}
                                />
                            ))}

                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    boxShadow: "0 0 40px rgba(255,107,0,0.3), inset 0 0 40px rgba(255,255,255,0.1)",
                                }}
                                animate={{
                                    boxShadow: [
                                        "0 0 40px rgba(255,107,0,0.3), inset 0 0 40px rgba(255,255,255,0.1)",
                                        "0 0 60px rgba(0,150,255,0.4), inset 0 0 60px rgba(255,255,255,0.15)",
                                        "0 0 50px rgba(138,43,226,0.35), inset 0 0 50px rgba(255,255,255,0.12)",
                                        "0 0 40px rgba(255,107,0,0.3), inset 0 0 40px rgba(255,255,255,0.1)",
                                    ],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                            />

                            <span className="relative z-10 block p-6 font-bold text-lg sm:text-xl">
                                <motion.span
                                    animate={{
                                        textShadow: [
                                            "0 3px 6px rgba(0,0,0,0.8), 0 0 20px rgba(255,107,0,0.5)",
                                            "0 3px 6px rgba(0,0,0,0.8), 0 0 25px rgba(0,150,255,0.6)",
                                            "0 3px 6px rgba(0,0,0,0.8), 0 0 22px rgba(138,43,226,0.5)",
                                            "0 3px 6px rgba(0,0,0,0.8), 0 0 20px rgba(255,107,0,0.5)",
                                        ],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                >
                                    Experience next-generation AI with 1AI. Intelligent, contextual, and lightning-fast responses that
                                    understand your needs better than ever before. One AI, infinite possibilities.
                                </motion.span>
                            </span>
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4"
                        >
                            <motion.div {...scaleOnHover}>
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl"
                                >
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                        className="flex items-center"
                                    >
                                        Start with 1AI Now
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                            <motion.div {...scaleOnHover}>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto text-base bg-background/80 backdrop-blur-sm shadow-lg"
                                >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Watch Demo
                                </Button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-8 text-sm text-white px-4"
                        >
                            <motion.div
                                className="flex items-center gap-x-2 bg-slate-900/90 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-white/20"
                                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    <Star className="h-4 w-4 fill-primary text-primary drop-shadow-sm" />
                                </motion.div>
                                <span className="font-bold text-white">4.9/5 Rating</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-x-2 bg-slate-900/90 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-white/20"
                                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Users className="h-4 w-4 text-white" />
                                <motion.span
                                    key={isVisible}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 2 }}
                                    className="font-bold text-white"
                                >
                                    100K+ Users
                                </motion.span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-x-2 bg-slate-900/90 backdrop-blur-md rounded-full px-4 py-2 shadow-xl border border-white/20"
                                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Shield className="h-4 w-4 text-white" />
                                <span className="font-bold text-white">Enterprise Ready</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-12 sm:py-20 bg-background/80 backdrop-blur-sm relative z-10">
                <div className="container px-4">
                    <motion.div
                        className="mx-auto max-w-2xl text-center"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                        >
                            Powerful Features for Next-Gen AI
                        </h2>
                        <p
                            className="mt-4 text-base sm:text-lg text-foreground font-medium"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                        >
                            Everything you need for intelligent, meaningful conversations with AI
                        </p>
                    </motion.div>

                    <motion.div
                        className="mx-auto mt-16 max-w-6xl"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    icon: Zap,
                                    title: "Lightning Fast",
                                    desc: "Get instant responses with our optimized AI infrastructure",
                                    delay: 0,
                                },
                                {
                                    icon: Brain,
                                    title: "Context Aware",
                                    desc: "AI that remembers your conversation history and preferences",
                                    delay: 0.1,
                                },
                                {
                                    icon: Shield,
                                    title: "Privacy First",
                                    desc: "Your conversations are encrypted and never stored permanently",
                                    delay: 0.2,
                                },
                                {
                                    icon: Users,
                                    title: "Team Collaboration",
                                    desc: "Share conversations and collaborate with your team seamlessly",
                                    delay: 0.3,
                                },
                                {
                                    icon: Sparkles,
                                    title: "Advanced Models",
                                    desc: "Access to the latest AI models and cutting-edge capabilities",
                                    delay: 0.4,
                                },
                                {
                                    icon: Rocket,
                                    title: "API Integration",
                                    desc: "Integrate 1AI into your existing workflows and applications",
                                    delay: 0.5,
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{
                                        y: -8,
                                        transition: { duration: 0.3 },
                                    }}
                                    className="group"
                                >
                                    <Card className="relative overflow-hidden h-full border-2 hover:border-primary/20 transition-all duration-300 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl">
                                        <CardHeader className="pb-4">
                                            <motion.div
                                                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 shadow-md"
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <feature.icon className="h-6 w-6 text-primary drop-shadow-sm" />
                                            </motion.div>
                                            <CardTitle
                                                className="group-hover:text-primary transition-colors duration-300 text-foreground font-semibold"
                                                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                                            >
                                                {feature.title}
                                            </CardTitle>
                                            <CardDescription
                                                className="text-sm sm:text-base text-foreground/80 font-medium"
                                                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                                            >
                                                {feature.desc}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-12 sm:py-20 relative z-10">
                <div className="container px-4">
                    <motion.div
                        className="mx-auto max-w-2xl text-center"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                        >
                            Loved by thousands of users
                        </h2>
                        <p
                            className="mt-4 text-base sm:text-lg text-foreground font-medium"
                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                        >
                            See what our community is saying about 1AI
                        </p>
                    </motion.div>

                    <motion.div
                        className="mx-auto mt-16 max-w-6xl"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[
                                {
                                    text: "1AI has revolutionized how our team collaborates. The intelligence and context awareness is incredible!",
                                    author: "Sarah Johnson",
                                    role: "Product Manager",
                                    initials: "SJ",
                                },
                                {
                                    text: "The speed and accuracy of responses is unmatched. It's like having a genius assistant 24/7.",
                                    author: "Mike Chen",
                                    role: "Software Engineer",
                                    initials: "MC",
                                },
                                {
                                    text: "Privacy-focused AI that actually works. Finally, an AI I can trust with sensitive information.",
                                    author: "Alex Rodriguez",
                                    role: "Security Analyst",
                                    initials: "AR",
                                },
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{
                                        y: -5,
                                        transition: { duration: 0.3 },
                                    }}
                                >
                                    <Card className="h-full hover:shadow-lg transition-all duration-300 bg-background/80 backdrop-blur-sm shadow-md">
                                        <CardContent className="pt-6">
                                            <motion.div
                                                className="flex items-center gap-1 mb-4"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                viewport={{ once: true }}
                                            >
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        whileInView={{ scale: 1 }}
                                                        transition={{ delay: 0.5 + i * 0.1 }}
                                                        viewport={{ once: true }}
                                                    >
                                                        <Star className="h-4 w-4 fill-primary text-primary drop-shadow-sm" />
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                            <p
                                                className="text-foreground/90 mb-4 text-sm sm:text-base font-medium"
                                                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                                            >
                                                "{testimonial.text}"
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shadow-md"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    <span className="text-sm font-medium text-primary drop-shadow-sm">
                                                        {testimonial.initials}
                                                    </span>
                                                </motion.div>
                                                <div>
                                                    <p
                                                        className="font-semibold text-foreground text-sm sm:text-base"
                                                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                                                    >
                                                        {testimonial.author}
                                                    </p>
                                                    <p
                                                        className="text-xs sm:text-sm text-foreground/70 font-medium"
                                                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                                                    >
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-20 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden z-10">
                <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />

                <div className="container relative px-4">
                    <motion.div
                        className="mx-auto max-w-2xl text-center"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className="text-2xl sm:text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}
                        >
                            Ready to experience the future?
                        </h2>
                        <p
                            className="mt-4 text-base sm:text-lg text-primary-foreground/90 font-medium"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                        >
                            Join thousands of users who are already experiencing smarter AI with 1AI
                        </p>
                        <motion.div
                            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                        >
                            <motion.div variants={fadeInUp} {...scaleOnHover}>
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base font-semibold shadow-xl">
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                        className="flex items-center"
                                    >
                                        Start Free Trial
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                            <motion.div variants={fadeInUp} {...scaleOnHover}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent shadow-lg backdrop-blur-sm"
                                >
                                    Contact Sales
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-background/90 backdrop-blur-sm relative z-10">
                <div className="container py-12 px-4">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                        <div className="space-y-4 sm:col-span-2 md:col-span-1">
                            <motion.div
                                className="flex items-center space-x-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    <Brain className="h-5 w-5 text-primary-foreground" />
                                </motion.div>
                                <span className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
                                    1AI
                                </span>
                            </motion.div>
                            <p className="text-sm text-foreground drop-shadow-sm">
                                The next generation of AI intelligence, built for the modern world. One AI, infinite possibilities.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-foreground" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                                Product
                            </h4>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Features
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Pricing
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        API
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Documentation
                                    </motion.a>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-foreground" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                                Company
                            </h4>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        About
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Blog
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Careers
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Contact
                                    </motion.a>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-foreground" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                                Legal
                            </h4>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Privacy
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Terms
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Security
                                    </motion.a>
                                </li>
                                <li>
                                    <motion.a
                                        href="#"
                                        className="hover:text-foreground transition-colors drop-shadow-sm"
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Cookies
                                    </motion.a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <motion.div
                        className="mt-8 border-t border-border pt-8 text-center text-sm text-foreground"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <p className="font-medium text-foreground" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                            &copy; 2024 1AI. All rights reserved.
                        </p>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}
