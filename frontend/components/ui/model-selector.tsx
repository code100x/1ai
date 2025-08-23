"use client";

import { useState, useEffect } from "react";
import { DEFAULT_MODEL_ID, MODELS, getModelById } from "@/models/constants";
import type { Model } from "@/models/types";
import { getModelProviderIcon } from "@/models/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  Crown,
} from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ModelSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  showIcons?: boolean;
}

export function ModelSelector({
  value,
  onValueChange,
  disabled = false,
  showIcons = true,
}: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>(
    value ?? DEFAULT_MODEL_ID
  );
  const { userCredits } = useCredits();

  useEffect(() => {
    if (value && value !== selectedModel) {
      setSelectedModel(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    setSelectedModel(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  const selectedModelObj = getModelById(selectedModel);

  const getModelStatusIcon = (model: Model) => {
    if (model.isAvailable === false) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircleIcon className="h-4 w-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                This model is not available in 1ai API and will fall back to
                GPT-3.5
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (model.name.includes("Experimental")) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>This model is experimental and may not be reliable on 1ai</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (model.name.includes("Beta")) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>This model is in beta and may not be fully reliable</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This model is fully supported by 1ai API</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Select
      value={selectedModel}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="bg-accent max-h-8 active:ring-0">
        <SelectValue className="h-5" placeholder="Select Model">
          {selectedModelObj && (
            <div className="flex items-center gap-2">
              {showIcons && getModelProviderIcon(selectedModelObj)}
              <span>{selectedModelObj.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {/* Free Models Section */}
        <SelectGroup>
          <SelectLabel className="flex items-center gap-2">
            <span>Free Models</span>
          </SelectLabel>
          {MODELS.filter((model) => !model.isPremium).map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              disabled={model.isAvailable === false}
              className={model.isAvailable === false ? "opacity-60" : ""}
            >
              <div className="flex items-center gap-2">
                {showIcons && getModelProviderIcon(model)}
                <span>{model.name}</span>
                {getModelStatusIcon(model)}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>

        {/* Premium Models Section */}
        <SelectGroup>
          <SelectLabel className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span>Premium Models</span>
            </div>
            {!userCredits?.isPremium && (
              <Link href="/pricing">
                <Button
                  size="sm"
                  variant="default"
                  className="h-6 px-2 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  Upgrade
                </Button>
              </Link>
            )}
          </SelectLabel>
          {MODELS.filter((model) => model.isPremium).map((model) => {
            const isPremiumLocked = !userCredits?.isPremium;
            const isDisabled = model.isAvailable === false || isPremiumLocked;

            return (
              <SelectItem
                key={model.id}
                value={model.id}
                disabled={isDisabled}
                className={isDisabled ? "opacity-60" : ""}
              >
                <div className="flex items-center gap-2">
                  {showIcons && getModelProviderIcon(model)}
                  <span>{model.name}</span>
                  {getModelStatusIcon(model)}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
