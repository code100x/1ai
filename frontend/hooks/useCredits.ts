import { useCreditsContext } from "@/contexts/credits-context";

export const useCredits = () => {
  return useCreditsContext();
};
