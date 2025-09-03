"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SearchBox } from "@/components/searchBox";
import { PlusIcon } from "@phosphor-icons/react";
import { useExecution } from "@/hooks/useExecution";

export const SidebarToggle = () => {
  const { open } = useSidebar();
  const { executions } = useExecution();

  return (
    <>
      <div className={open ? "hidden lg:flex" : "hidden lg:hidden"} />
      <div
        className={`${open ? "lg:hidden" : ""} flex items-center gap-1 rounded-lg p-1`}
      >
        <SidebarTrigger />

        <SearchBox executions={executions} />

        <Link
          href={"/ask"}
          className="hover:bg-muted flex size-7 items-center justify-center rounded-lg"
        >
          <PlusIcon weight="bold" className={cn("size-4")} />
        </Link>
      </div>
    </>
  );
};
