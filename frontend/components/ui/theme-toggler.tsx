"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useSidebar } from "./sidebar";
import { cn } from "@/lib/utils";

export function SelectTheme() {
  const { setTheme, theme } = useTheme();
  const { open } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-lg text-center",
          open && "flex-1 justify-end",
        )}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <div className="flex items-center justify-center h-8 w-8 border border-black/10 dark:border-zinc-400/8 rounded-lg bg-zinc-400/10 inset-shadow-sm">
          <SunIcon className="size-4 text-gray-500 scale-100 dark:scale-0" />
          <MoonIcon className="absolute size-4 text-gray-500 opacity scale-0 dark:scale-100" />
        </div>
      </div>
    </>
  );
}

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.75 1.5a.75.75 0 1 0-1.5 0v.75a.75.75 0 1 0 1.5 0zM9.75 15.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0zM14.833 3.167a.75.75 0 0 1 0 1.06l-.533.533a.75.75 0 0 1-1.06-1.06l.532-.533a.75.75 0 0 1 1.06 0ZM3.7 13.24a.75.75 0 0 1 1.06 1.06l-.532.533a.75.75 0 1 1-1.06-1.06zM15.75 8.25a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5zM.75 9a.75.75 0 0 1 .75-.75h.75a.75.75 0 1 1 0 1.5H1.5A.75.75 0 0 1 .75 9M14.3 13.24a.75.75 0 0 0-1.06 1.06l.532.533a.75.75 0 0 0 1.06-1.06zM4.228 3.167a.75.75 0 1 0-1.06 1.06l.532.533A.75.75 0 1 0 4.76 3.7zm1.59 2.651a4.5 4.5 0 1 1 6.364 6.364 4.5 4.5 0 0 1-6.364-6.364"
    />
  </svg>
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.039 2.7a.75.75 0 0 0-.681-1.173 7.5 7.5 0 1 0 8.112 8.112.75.75 0 0 0-1.173-.68A4.5 4.5 0 0 1 9.04 2.7Z"
    />
  </svg>
);
