"use client";

import { create } from "zustand";
import { ConversationState, ConversationSummary } from "./types";

interface ConversationActions {
  setConversations: (conversations: ConversationSummary[]) => void;
  addConversation: (conversation: ConversationSummary) => void;
  updateConversation: (id: string, updates: Partial<ConversationSummary>) => void;
  removeConversation: (id: string) => void;
  setCurrentConversationId: (id: string | null) => void;
  reset: () => void;
}

export type ConversationStore = ConversationState & ConversationActions;

export const useConversationStore = create<ConversationStore>((set) => ({
  conversations: [],
  currentConversationId: null,
  
  setConversations: (conversations) => set({ conversations }),
  
  addConversation: (conversation) => 
    set((state) => ({ 
      conversations: [conversation, ...state.conversations] 
    })),
  
  updateConversation: (id, updates) => 
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
    })),
  
  removeConversation: (id) => 
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
    })),
  
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  
  reset: () => set({ conversations: [], currentConversationId: null }),
}));
