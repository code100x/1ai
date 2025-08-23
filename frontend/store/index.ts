export { useAuthStore } from "./auth-store";
export { useUserStore } from "./user-store";
export { useConversationStore } from "./conversation-store";
export * from "./types";

export const useAppStores = () => {
  const auth = useAuthStore();
  const user = useUserStore();
  const conversations = useConversationStore();
  
  return {
    auth,
    user,
    conversations,
  };
};
