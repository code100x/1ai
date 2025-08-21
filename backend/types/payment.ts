export interface RazorpayOrder {
  id: string;
  currency: string;
  amount: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayPayment {
  entity: {
    amount: number;
    id: string;
    notes: {
      userId: string;
      description?: string;
    };
    order_id: string;
    status: string;
  };
}

export interface CreateOrderRequest {
  amount: string;
  currency: string;
  description?: string;
}

export interface PaymentWebhookPayload {
  payment: RazorpayPayment;
}
