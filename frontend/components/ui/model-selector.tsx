"use client";

import { useState, useEffect } from "react";
import { DEFAULT_MODEL_ID, MODELS, getModelById } from "@/models/constants";
import type { Model } from "@/models/types";
import { getModelProviderIcon } from "@/models/utils";
import { cn } from "@/lib/utils";
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
    value ?? DEFAULT_MODEL_ID,
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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <AlertCircleIcon className="h-4 w-4 text-red-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-red-400">
            <p>
              This model is not available in 1ai API and will fall back to
              GPT-3.5
            </p>
          </TooltipContent>
        </Tooltip>
      );
    } else if (model.name.includes("Experimental")) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <InfoIcon className="h-4 w-4 text-yellow-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This model is experimental and may not be reliable on 1ai</p>
          </TooltipContent>
        </Tooltip>
      );
    } else if (model.name.includes("Beta")) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This model is in beta and may not be fully reliable</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <CheckCircleIcon className="h-4 w-4 text-green-300 dark:text-green-300/50 cursor-pointer" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-lg mx-auto flex-wrap text-orange-100">
          <p>
            This model is not available in 1ai API and will fall back to GPT-3.5
          </p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <Select
      value={selectedModel}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="shadow-none bg-white/15 hover:bg-orange-100/20 dark:bg-zinc-400/5 text-orange-400 dark:text-orange-100 cursor-pointer max-h-8 ring-0 border-0 px-2 rounded-lg [&_svg:not([class*='text-'])]:text-orange-300 dark:[&_svg:not([class*='text-'])]:text-orange-100">
        <SelectValue className="h-5" placeholder="Select Model">
          {selectedModelObj && (
            <div className="flex items-center gap-2">
              {showIcons && getModelProviderIcon(selectedModelObj)}
              <span>{selectedModelObj.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="border-none p-3 m-0 rounded-xl text-orange-400 dark:text-orange-100">
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
              className={cn(
                `rounded-lg focus:bg-orange-300/20 focus:text-orange-400 dark:focus:text-orange-100 dark:focus:bg-orange-100/10 data-[state=checked]:bg-orange-300/20 dark:data-[state=checked]:bg-orange-100/10 [&_svg:not([class*='text-'])]:text-orange-400 dark:[&_svg:not([class*='text-'])]:text-orange-100`,
                {
                  "opacity-60": model.isAvailable === false,
                },
              )}
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
              <Crown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-orange-600 dark:text-orange-400 text-sm">
                Premium Models
              </span>
            </div>
            {!userCredits?.isPremium && (
              <Link href="/pricing">
                <Button
                  size="sm"
                  variant="default"
                  className="h-6 px-2 text-xs text-orange-400/80 bg-orange-100 dark:bg-orange-100/10 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-100/20"
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
                className={cn(
                  `rounded-lg focus:bg-orange-300/20 focus:text-orange-400 dark:focus:text-orange-100 dark:focus:bg-orange-100/10 data-[state=checked]:bg-orange-300/20 dark:data-[state=checked]:bg-orange-100/10 [&_svg:not([class*='text-'])]:text-orange-400 dark:[&_svg:not([class*='text-'])]:text-orange-100`,
                  {
                    "opacity-60": isDisabled,
                  },
                )}
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
