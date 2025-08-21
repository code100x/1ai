"use client";

import type { Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Github, Twitter } from 'lucide-react';
import { backOut, easeInOut } from 'framer-motion';
import { Button } from './ui/button';

export default function AnimatedHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const headerVariants: Variants = {
        initial: { y: -100, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };


    const logoVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.8,
                ease: backOut,
                delay: 0.2
            }
        },
        hover: {
            scale: 1.05,
            rotate: 5,
            transition: { duration: 0.2 }
        }
    };

    const navItemVariants: Variants = {
        initial: { y: -20, opacity: 0 },
        animate: (i: number = 0) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.4 + i * 0.1,
                duration: 0.5,
                ease: [0.42, 0, 0.58, 1] // cubic-bezier for easeOut
            }
        }),
        hover: {
            y: -2,
            transition: { duration: 0.2 }
        }
    };

    const mobileMenuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: easeInOut
            }
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: easeInOut
            }
        }
    };

    const navItems = ['Features', 'Pricing', 'Docs', 'About'];

    return (
        <motion.header
            variants={headerVariants}
            initial="initial"
            animate="animate"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <motion.div
                        variants={logoVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur-sm opacity-75"
                            />
                            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <motion.span
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                        >
                            1AI
                        </motion.span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, i) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                variants={navItemVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                                custom={i}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                            >
                                {item}
                                <motion.div
                                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-full transition-all duration-300"
                                />
                            </motion.a>
                        ))}
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                                Sign In
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                Get Started
                            </Button>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AnimatePresence mode="wait">
                            {isMobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X className="h-6 w-6 text-gray-700" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu className="h-6 w-6 text-gray-700" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50"
                        >
                            <div className="px-4 py-6 space-y-4">
                                {navItems.map((item, i) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                        className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                                <div className="pt-4 space-y-3">
                                    <Button variant="ghost" className="w-full justify-center text-gray-700 hover:text-blue-600">
                                        Sign In
                                    </Button>
                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                                        Get Started
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}