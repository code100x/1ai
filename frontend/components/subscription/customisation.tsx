"use client";
import React, { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFont } from "@/contexts/font-context";
import { useBlur } from "@/contexts/blur-context";
import { api } from "@/trpc/react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { FetchUser } from "@/actions/fetchUser";
export const Customisation = () => {
  const router = useRouter();
  const [userPreferences, setUserPreferences] = useState<{
    nickname: string | null;
    whatDoYouDo: string | null;
    customTraits: string[] | null;
    about: string | null;
  }>({
    nickname: null,
    whatDoYouDo: null,
    customTraits: null,
    about: null,
  });

  const [isBoringTheme, setIsBoringTheme] = useState<boolean>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("boringTheme");
      return saved === "true";
    }
    return false;
  });
  const { selectedFont, setSelectedFont } = useFont();
  const { isBlurred, setIsBlurred } = useBlur();

  const { mutate: updateUser } = api.user.updateUser.useMutation({
    onSuccess: async () => {
      toast.success("Preferences saved successfully");
      // Fetch updated user data
      const updatedUser = await FetchUser();
      setUserPreferences({
        nickname: updatedUser?.nickname || null,
        whatDoYouDo: updatedUser?.whatDoYouDo || null,
        customTraits: updatedUser?.customTraits || null,
        about: updatedUser?.about || null,
      });
      router.refresh();
    },
    onError: (error) => {
      console.error(`Error saving preferences: ${error}`);
      toast.error("Failed to save preferences");
    },
  });

  useEffect(() => {
    (async () => {
      const user = await FetchUser();
      setUserPreferences({
        nickname: user?.nickname || null,
        whatDoYouDo: user?.whatDoYouDo || null,
        customTraits: user?.customTraits || null,
        about: user?.about || null,
      });
    })();
  }, []);
  // Debug log when component mounts
  useEffect(() => {
    console.log("Customisation mounted, blur state:", isBlurred);
  }, [isBlurred]);

  // Apply theme on mount and when isBoringTheme changes
  useEffect(() => {
    document.documentElement.classList.toggle("boring-theme", isBoringTheme);
    localStorage.setItem("boringTheme", isBoringTheme.toString());
  }, [isBoringTheme]);

  const predefinedTraits = [
    "friendly",
    "witty",
    "concise",
    "curious",
    "empathetic",
    "creative",
    "patient",
  ] as const;

  const fonts = [
    { value: "proxima", label: "Proxima Vara" },
    { value: "inter", label: "Inter" },
    { value: "geist", label: "Geist" },
    { value: "playfair", label: "Playfair Display" },
    { value: "roboto", label: "Roboto" },
  ] as const;

  const addTrait = (trait: string) => {
    if (!userPreferences.customTraits?.includes(trait)) {
      setUserPreferences({
        ...userPreferences,
        customTraits: [...(userPreferences.customTraits || []), trait],
      });
    }
  };

  const removeTrait = (trait: string) => {
    setUserPreferences({
      ...userPreferences,
      customTraits:
        userPreferences.customTraits?.filter((t) => t !== trait) || [],
    });
  };

  const addCustomTrait = () => {
    if (
      userPreferences.customTraits?.join(", ").trim() &&
      !userPreferences.customTraits?.includes(
        userPreferences.customTraits?.join(", ").trim() || ""
      )
    ) {
      setUserPreferences({
        ...userPreferences,
        customTraits: [
          ...(userPreferences.customTraits || []),
          userPreferences.customTraits?.join(", ").trim() || "",
        ],
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      addCustomTrait();
    }
  };

  const handleSavePreferences = () => {
    console.log("Saving preferences");
    try {
      updateUser({
        nickname: userPreferences.nickname || undefined,
        whatDoYouDo: userPreferences.whatDoYouDo || undefined,
        customTraits: userPreferences.customTraits || undefined,
        about: userPreferences.about || undefined,
      });
      toast.success("Preferences saved successfully");
      router.refresh();
    } catch (error) {
      console.error(`Error saving preferences: ${error}`);
      toast.error("Failed to save preferences");
    }
  };

  return (
    <div className="bg-background text-foreground">
      {/* Visual Options Section */}
      <div className="border-border mt-12">
        <h2 className="text-foreground text-xl font-semibold">
          Visual Options
        </h2>

        <div className="mt-6 flex flex-col gap-8">
          {/* Font Selection */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground text-base font-semibold">
                Font Family
              </div>
              <div className="text-muted-foreground text-sm">
                Choose your preferred font for the application.
              </div>
            </div>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select font">
                  <span className={`font-${selectedFont}`}>
                    {fonts.find((f) => f.value === selectedFont)?.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span className={`font-${font.value}`}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boring Theme Switch */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground text-base font-semibold">
                Boring Theme
              </div>
              <div className="text-muted-foreground text-sm">
                If you think the pink is too much, turn this on to tone it down.
              </div>
            </div>
            <Switch
              checked={isBoringTheme}
              onCheckedChange={setIsBoringTheme}
            />
          </div>
          {/* Hide Personal Information Switch */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground text-base font-semibold">
                Hide Personal Information
              </div>
              <div className="text-muted-foreground text-sm">
                Hides your name and email from the UI.
              </div>
            </div>
            <Switch
              checked={isBlurred}
              onCheckedChange={(checked) => {
                console.log("Switch changed to:", checked);
                setIsBlurred(checked);
              }}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
