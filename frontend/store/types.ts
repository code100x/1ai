export type AppUser = {
  id: string;
  email: string;
};

export type ConversationSummary = {
  id: string;
  title?: string;
  updatedAt?: string;
};

export type AuthState = {
  token: string | null;
  user: AppUser | null;
  isAuthenticated: boolean;
};

export type UserState = {
  credits: number;
  isPremium: boolean;
};

export type ConversationState = {
  conversations: ConversationSummary[];
  currentConversationId: string | null;
};
