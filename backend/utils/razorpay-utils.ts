import crypto from "crypto";

export const validateWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch (error) {
    console.error("Error validating webhook signature:", error);
    return false;
  }
};

export const generateReceiptId = (): string => {
  return `rcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
