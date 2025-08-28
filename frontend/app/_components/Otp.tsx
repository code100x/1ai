"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { BACKEND_URL } from "@/lib/utils";
import { toast } from "sonner";

export function Otp({ email }: { email: string }) {
	const initialRef = useRef<HTMLInputElement>(null);
	const [otp, setOtp] = useState("");
	const [isResending, setIsResending] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleResend = async () => {
		setIsResending(true);
		try {
			const response = await fetch(`${BACKEND_URL}/auth/initiate_signin`, {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (response.ok) {
				toast("New verification code sent to your email");
			} else {
				toast(data.message || "Failed to resend code");
			}
		} catch (error) {
			toast("Failed to resend code. Please try again.");
		} finally {
			setIsResending(false);
		}
	};

	useEffect(() => {
		if (initialRef.current) {
			initialRef.current.focus();
		}
	}, []);

	const handleLogin = async () => {
		const currentOtp = otp;
		console.log("handleLogin called with:", { currentOtp, isSubmitting, length: currentOtp.length });
		if (currentOtp.length !== 6 || isSubmitting) return;

		setIsSubmitting(true);

		try {
			const response = await fetch(`${BACKEND_URL}/auth/signin`, {
				method: "POST",
				body: JSON.stringify({ email, otp: currentOtp }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (response.status === 401) {
				toast(data.message);
			}

			if (response.status === 429) {
				toast(data.message);
			}

			if (response.status === 200) {
				localStorage.setItem("token", data.token);
				window.location.href = "/";
			} else if (response.status !== 401 && response.status !== 429) {
				toast(data.message || "An unexpected error occurred");
			}
		} catch (error) {
			console.error("Some error occured ", error);
			toast("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto w-full max-h-screen max-w-sm px-2 sm:px-0">
			<div className="flex h-full flex-col items-center justify-center gap-8">
				<div className="flex flex-col items-center gap-2">
					<h1 className="text-3xl font-serif text-foreground">
						Welcome to 1<span className="text-orange-400">ai</span>
					</h1>
				</div>
				<form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
					<Input disabled placeholder="Email" value={email} />
					<InputOTP
						ref={initialRef}
						maxLength={6}
						value={otp}
						onChange={(value) => {
							setOtp(value);
							// Auto-submit when OTP is complete
							if (value.length === 6) {
								console.log("Auto-submitting OTP:", value);
								setTimeout(() => handleLogin(value), 50);
							}
						}}
					>
						<InputOTPGroup className="w-full flex items-center">
							<InputOTPSlot
								index={0}
								className="h-12 w-16 rounded-none rounded-tl-xl rounded-bl-xl border border-zinc-400/20"
							/>
							<InputOTPSlot
								index={1}
								className="h-12 w-16 rounded-none border border-zinc-400/20"
							/>
							<InputOTPSlot
								index={2}
								className="h-12 w-16 rounded-none border border-zinc-400/20"
							/>
							<InputOTPSlot
								index={3}
								className="h-12 w-16 rounded-none border border-zinc-400/20"
							/>
							<InputOTPSlot
								index={4}
								className="h-12 w-16 rounded-none border border-zinc-400/20"
							/>
							<InputOTPSlot
								index={5}
								className="h-12 w-16 rounded-none rounded-br-xl rounded-tr-xl border border-zinc-400/20"
							/>
						</InputOTPGroup>
					</InputOTP>
					<Button
						type="submit"
						variant="accent"
						className="w-full text-sm text-white bg-[#fa7319] hover:bg-[#fa7319]/90 h-10 px-3.5 rounded-xl inset-shadow-sm inset-shadow-white/60 font-medium border border-black/4 outline-0"
					>
						{isSubmitting ? "Verifying..." : "Verify Code"}
					</Button>
				</form>

				{/* Resend Link */}
				<div className="text-center">
					<p className="text-sm text-muted-foreground">
						Didn't get a code?{" "}
						<button
							onClick={handleResend}
							disabled={isResending}
							className="font-medium text-primary hover:text-primary/90 underline underline-offset-4 disabled:opacity-50"
						>
							{isResending ? "Sending..." : "resend"}
						</button>
					</p>
				</div>

				<div className="mt-2">
					<Tooltip>
						<TooltipTrigger>
							<div className="group text-muted-foreground text-sm font-serif">
								<Link
									href="/terms"
									className="text-muted-foreground group-hover:text-orange-400 hover:underline hover:underline-offset-3"
								>
									Terms
								</Link>{" "}
								<span className="group-hover:text-orange-400">and </span>
								<Link
									href="/privacy"
									className="text-muted-foreground group-hover:text-orange-400 hover:underline hover:underline-offset-3"
								>
									Privacy Policy
								</Link>
							</div>
						</TooltipTrigger>
						<TooltipContent sideOffset={1} className="bg-orange-400">
							<p>By continuing, you agree</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}
