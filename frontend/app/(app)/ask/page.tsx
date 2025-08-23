import React, { Suspense } from "react";
import UIInput from "@/components/ui/ui-input";

const AskPage = () => {

  return (
    <div className="flex w-full max-w-screen flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-col items-center gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <UIInput />
        </Suspense>
      </div>
    </div>
  );
};

export default AskPage;
