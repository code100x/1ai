"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, RotateCcw, Code, Shield, Sparkles, MessageCircle, Cpu, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useRef } from 'react';
import type { Variants } from 'framer-motion';

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Enhanced animation variants with proper typing
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };

    const floatingVariants: Variants = {
        animate: {
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const pulseVariants: Variants = {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const features = [
        {
            icon: Zap,
            title: "Blazing Fast Responses",
            description: "Get instant replies with our optimized AI infrastructure and smart caching system.",
            gradient: "from-yellow-400 to-orange-500"
        },
        {
            icon: RotateCcw,
            title: "Switch Between Multiple Models",
            description: "Seamlessly switch between GPT-4, Claude, Gemini, and more with a single click.",
            gradient: "from-blue-400 to-purple-500"
        },
        {
            icon: Code,
            title: "Developer Friendly API",
            description: "Integrate with our RESTful API and comprehensive SDKs for all major languages.",
            gradient: "from-green-400 to-cyan-500"
        },
        {
            icon: Shield,
            title: "Secure & Private Conversations",
            description: "End-to-end encryption ensures your conversations remain private and secure.",
            gradient: "from-red-400 to-pink-500"
        }
    ];

    return (
        <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <motion.div
                    variants={pulseVariants}
                    animate="animate"
                    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
                />
                <motion.div
                    variants={pulseVariants}
                    animate="animate"
                    style={{ animationDelay: '1s' }}
                    className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                />
                <motion.div
                    variants={pulseVariants}
                    animate="animate"
                    style={{ animationDelay: '2s' }}
                    className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
                />

                {/* Floating Elements */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        variants={floatingVariants}
                        animate="animate"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-60"
                    />
                ))}

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {/* Main Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto text-center"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/50 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">
                            Introducing 1AI - The Future of AI Chat
                        </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                    >
                        <span className="block">Speed Chat from</span>
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                            Various Chat Models
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
                    >
                        Experience lightning-fast, unified, and seamless conversations with different AI models.
                        Switch between models instantly and get the perfect response for every task.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
                            >
                                Start Chatting Now
                                <motion.div
                                    className="ml-2"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                            >
                                Learn More
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto"
                    >
                        {[
                            { number: "10M+", label: "Messages Processed" },
                            { number: "50+", label: "AI Models" },
                            { number: "99.9%", label: "Uptime" },
                            { number: "<100ms", label: "Response Time" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                                className="text-center"
                            >
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                        >
                            Why Choose 1AI?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-lg text-gray-600 max-w-2xl mx-auto"
                        >
                            Powerful features designed to enhance your AI chat experience
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                viewport={{ once: true }}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <Card className="p-6 h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                                    <motion.div
                                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}