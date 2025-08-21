import { useState, useCallback, useEffect } from "react";
import { DEFAULT_MODEL_ID, getModelById } from "@/models/constants";
import type { Model } from "@/models/types";

interface UseModelOptions {
  initialModel?: string;
  storageKey?: string;
  persistToLocalStorage?: boolean;
}

export function useModel({
  initialModel = DEFAULT_MODEL_ID,
  storageKey = "preferredModel",
  persistToLocalStorage = true,
}: UseModelOptions = {}) {

  const [modelId, setModelId] = useState<string>(() => {
    if (typeof window === "undefined" || !persistToLocalStorage) {
      return initialModel;
    }

    const storedModel = localStorage.getItem(storageKey);
    return storedModel ?? initialModel;
  });

  const [model, setModel] = useState<Model | undefined>(() =>
    getModelById(modelId),
  );


  useEffect(() => {
    setModel(getModelById(modelId));


    if (persistToLocalStorage && typeof window !== "undefined") {
      localStorage.setItem(storageKey, modelId);
    }
  }, [modelId, persistToLocalStorage, storageKey]);


  const setModelById = useCallback((id: string) => {
    setModelId(id);
  }, []);

  return {
    modelId,
    model,
    setModelId: setModelById,
  };
}
