"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { Execution, useExecution } from '@/hooks/useExecution';

interface ExecutionContextType {
  executions: Execution[];
  loading: boolean;
  error: string | null;
  refreshExecutions: () => Promise<void>;
  createNewExecution: () => string;
}

const ExecutionContext = createContext<ExecutionContextType | undefined>(undefined);

export function ExecutionProvider({ children }: { children: ReactNode }) {
  const executionData = useExecution();

  return (
    <ExecutionContext.Provider value={executionData}>
      {children}
    </ExecutionContext.Provider>
  );
}

export function useExecutionContext() {
  const context = useContext(ExecutionContext);
  if (context === undefined) {
    throw new Error('useExecutionContext must be used within a ExecutionProvider');
  }
  return context;
}
