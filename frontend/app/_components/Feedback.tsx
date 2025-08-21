"use client";

import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackFormData {
  name: string;
  message: string;
}

export const Feedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      name: "",
      message: "",
    },
  });

  const { mutate: createFeedback } = api.feedback.createFeedback.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      toast.success("Feedback submitted successfully");
      reset();
    },
    onError: () => {
      setIsSubmitting(false);
      toast.error("Failed to submit feedback");
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    setIsSubmitting(true);
    createFeedback({ name: data.name, message: data.message });
  };

  return (
    <>
      <Toaster />
      <div className="">
        <div className="container mx-auto px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              {/* Left Side - Heading and Description */}
              <div className="h-full space-y-6">
                <div className="space-y-4">
                  <h1 className="text-foreground text-4xl font-bold tracking-tight lg:text-5xl">
                    Share Your Feedback
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    We'd love to hear your thoughts and suggestions. Your
                    feedback helps us improve and create better experiences for
                    everyone.
                  </p>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="w-full">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-foreground text-sm font-medium"
                        >
                          Your Name
                        </Label>
                        <Input
                          {...register("name", {
                            required: "Name is required",
                          })}
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring"
                        />
                        {errors.name && (
                          <p className="text-destructive text-sm">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-foreground text-sm font-medium"
                        >
                          Your Message
                        </Label>
                        <Textarea
                          {...register("message", {
                            required: "Message is required",
                            minLength: {
                              value: 10,
                              message: "Message must be at least 10 characters",
                            },
                          })}
                          id="message"
                          rows={4}
                          placeholder="Share your thoughts with us..."
                          className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-ring resize-none"
                        />
                        {errors.message && (
                          <p className="text-destructive text-sm">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto w-full py-3 font-medium"
                        onClick={handleSubmit(onSubmit)}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg
                              className="mr-3 -ml-1 h-5 w-5 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "Submit Feedback"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
