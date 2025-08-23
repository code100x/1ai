import React, { Suspense } from "react";
import UIInput from "@/components/ui/ui-input";
import { ConversationProvider } from "@/contexts/conversation-context";

const HomePage = () => {

  return (
    <ConversationProvider>
      <div className="flex w-full max-w-screen flex-col items-center justify-center gap-4">
        <div className="flex w-full flex-col items-center gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            <UIInput />
          </Suspense>
        </div>
      </div>
    </ConversationProvider>
  );
};

export default HomePage;
