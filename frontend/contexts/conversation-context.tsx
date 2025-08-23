"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useConversation } from '@/hooks/useConversation';

interface ConversationContextType {
  conversations: any[];
  loading: boolean;
  error: string | null;
  createNewConversation: () => string;
  refreshConversations: () => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: ReactNode }) {
  const conversationData = useConversation();

  return (
    <ConversationContext.Provider value={conversationData}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversationContext must be used within a ConversationProvider');
  }
  return context;
}
