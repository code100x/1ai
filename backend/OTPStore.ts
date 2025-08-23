// OTP Management Store with automatic expiration
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL = 1 * 60 * 1000; // 1 minute cleanup

interface OTPEntry {
    otp: string;
    expiresAt: number;
    attempts: number; // Track failed attempts
}

export class OTPStore {
    private static instance: OTPStore;
    private store: Record<string, OTPEntry> = {};
    private cleanupTimer: NodeJS.Timeout;

    private constructor() {
        // Cleanup expired OTPs periodically
        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, CLEANUP_INTERVAL);
    }

    static getInstance(): OTPStore {
        if (!OTPStore.instance) {
            OTPStore.instance = new OTPStore();
        }
        return OTPStore.instance;
    }

    /**
     * Store an OTP for an email with expiration
     */
    setOTP(email: string, otp: string): void {
        this.store[email.toLowerCase()] = {
            otp,
            expiresAt: Date.now() + OTP_EXPIRATION_TIME,
            attempts: 0
        };
        console.log(`OTP stored for ${email}: ${otp} (expires in 5 minutes)`);
    }

    /**
     * Verify an OTP for an email
     */
    verifyOTP(email: string, inputOTP: string): {
        isValid: boolean;
        message: string;
        shouldRateLimit?: boolean;
    } {
        const normalizedEmail = email.toLowerCase();
        const entry = this.store[normalizedEmail];

        // Check if OTP exists
        if (!entry) {
            console.log(`No OTP found for ${email}`);
            return {
                isValid: false,
                message: "OTP not found. Please request a new one."
            };
        }

        // Check if OTP is expired
        if (Date.now() > entry.expiresAt) {
            console.log(`OTP expired for ${email}`);
            delete this.store[normalizedEmail];
            return {
                isValid: false,
                message: "OTP has expired. Please request a new one."
            };
        }

        // Increment attempt counter
        entry.attempts++;

        // Rate limiting: Max 3 attempts
        if (entry.attempts > 3) {
            console.log(`Too many failed attempts for ${email}`);
            delete this.store[normalizedEmail];
            return {
                isValid: false,
                message: "Too many failed attempts. Please request a new OTP.",
                shouldRateLimit: true
            };
        }

        // Verify OTP (convert both to string and trim)
        const normalizedInputOTP = String(inputOTP || '').trim();
        const normalizedStoredOTP = String(entry.otp || '').trim();

        if (normalizedInputOTP === normalizedStoredOTP) {
            console.log(`OTP verified successfully for ${email}`);
            delete this.store[normalizedEmail]; // Remove after successful verification
            return {
                isValid: true,
                message: "OTP verified successfully"
            };
        } else {
            console.log(`Invalid OTP for ${email}. Attempt ${entry.attempts}/3`);
            console.log(`Input: '${normalizedInputOTP}', Expected: '${normalizedStoredOTP}'`);
            
            return {
                isValid: false,
                message: `Invalid OTP. ${3 - entry.attempts} attempts remaining.`
            };
        }
    }

    /**
     * Check if an OTP exists and is valid for an email
     */
    hasValidOTP(email: string): boolean {
        const entry = this.store[email.toLowerCase()];
        return !!(entry && Date.now() <= entry.expiresAt);
    }

    /**
     * Remove OTP for an email
     */
    removeOTP(email: string): void {
        delete this.store[email.toLowerCase()];
    }

    /**
     * Clean up expired OTPs
     */
    private cleanup(): void {
        const now = Date.now();
        let cleanedCount = 0;

        Object.keys(this.store).forEach(email => {
            if (now > this.store[email].expiresAt) {
                delete this.store[email];
                cleanedCount++;
            }
        });

        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} expired OTPs`);
        }
    }

    /**
     * Get store stats for debugging
     */
    getStats(): { totalOTPs: number; validOTPs: number } {
        const now = Date.now();
        const total = Object.keys(this.store).length;
        const valid = Object.values(this.store).filter(entry => now <= entry.expiresAt).length;
        
        return { totalOTPs: total, validOTPs: valid };
    }

    /**
     * Cleanup on shutdown
     */
    destroy(): void {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        this.store = {};
    }
}