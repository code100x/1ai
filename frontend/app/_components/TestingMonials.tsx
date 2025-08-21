"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import ScrollReveal from "../components/ScrollReveal";
import { Badge } from "@/components/ui/badge";

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Researcher at Meta",
      content:
        "T3Dotgg revolutionized how I interact with multiple AI models. The unified interface saves me hours every day.",
      result: "85% faster research iterations",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "Senior Developer at Stripe",
      content:
        "The ability to compare responses from different models side-by-side is game-changing for our development workflow.",
      result: "40% improvement in code quality",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Emily Watson",
      role: "Product Manager at Notion",
      content:
        "Finally, an AI tool that understands enterprise needs. The reliability and speed are unmatched.",
      result: "60% reduction in response time",
      rating: 5,
      avatar: "EW",
    },
    {
      name: "David Kim",
      role: "CTO at StartupXYZ",
      content:
        "T3Dotgg became essential to our product development. The insights from multiple models are invaluable.",
      result: "3x faster product iterations",
      rating: 5,
      avatar: "DK",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section id="testimonials" className="px-4 py-20">
      <div className="mx-auto h-full max-w-6xl">
        <ScrollReveal className="mb-20 flex flex-col items-center">
          <Badge>Testimonials</Badge>
          <div className="mt-4 text-center">
            <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
              Trusted by Innovators
            </h2>
            <p className="mt-2">
              See how leading companies and researchers are accelerating their
              work with t3Dotgg
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="relative p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Stars */}
                {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                <div className="mb-6 flex justify-center">
                  {[...Array(testimonials[currentIndex]?.rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        size={24}
                        weight="fill"
                        className="text-primary mx-1"
                      />
                    ),
                  )}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-xxl mx-auto mb-8 max-w-xl leading-relaxed font-light md:text-2xl">
                  {testimonials[currentIndex]?.content}
                </blockquote>

                {/* Result Badge */}
                <div className="glass-card mb-8 inline-block px-6 py-3">
                  <p className="font-semibold text-purple-300">
                    {testimonials[currentIndex]?.result}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <span className="text-sm font-semibold text-white">
                      {testimonials[currentIndex]?.avatar}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white">
                      {testimonials[currentIndex]?.name}
                    </p>
                    <p className="text-muted text-sm">
                      {testimonials[currentIndex]?.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-12 flex items-center justify-center">
              {/* <button
                onClick={prevTestimonial}
                className="glass-card group rounded-full p-3 transition-colors hover:bg-white/10"
              >
                <ArrowLeft
                  size={20}
                  weight="light"
                  className="text-white/70 group-hover:text-white"
                />
              </button> */}

              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-accent hover:bg-accent/80"
                    }`}
                  />
                ))}
              </div>

              {/* <button
                onClick={nextTestimonial}
                className="glass-card group rounded-full p-3 transition-colors hover:bg-white/10"
              >
                <ArrowRight
                  size={20}
                  weight="light"
                  className="text-white/70 group-hover:text-white"
                />
              </button> */}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
