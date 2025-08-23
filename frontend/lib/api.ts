"use client";

import { BACKEND_URL } from "./utils";

export type ApiConversation = {
  id: string;
  title: string;
  updatedAt: string;
  userId: string;
};

export type ApiUser = {
  id: string;
  email: string;
};

export type ApiCredits = {
  credits: number;
  isPremium: boolean;
};

export class ApiService {
  private static getAuthHeaders(token: string) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  static async getConversations(token: string): Promise<ApiConversation[]> {
    const response = await fetch(`${BACKEND_URL}/ai/conversations`, {
      headers: this.getAuthHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }
    
    const data = await response.json();
    return data.conversations || [];
  }

  static async getUser(token: string): Promise<ApiUser> {
    const response = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: this.getAuthHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    
    const data = await response.json();
    return data.user;
  }

  static async getCredits(token: string): Promise<ApiCredits> {
    const response = await fetch(`${BACKEND_URL}/ai/credits`, {
      headers: this.getAuthHeaders(token),
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch credits");
    }
    
    return response.json();
  }

  static async signIn(email: string, otp: string): Promise<{ token: string }> {
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to sign in");
    }
    
    return response.json();
  }

  static async initiateSignIn(email: string): Promise<{ message: string; success: boolean }> {
    const response = await fetch(`${BACKEND_URL}/auth/initiate_signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to initiate sign in");
    }
    
    return response.json();
  }
}
