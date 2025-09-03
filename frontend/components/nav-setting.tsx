"use client"

import {
	Settings,
	LogOut,
} from "lucide-react"
import { ShieldSlashIcon, ScrollIcon, ArrowClockwiseIcon } from "@phosphor-icons/react"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavSetting() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="data-[state=open]:bg-popover data-[state=open]:text-foreground rounded-lg focus-visible:ring-0 bg-transparent hover:bg-transparent text-foreground/80 hover:text-orange-400 dark:hover:text-orange-100 cursor-pointer"
						>
							<div className="flex items-center gap-2">
								<Settings className="ml-auto size-4" />
								<span className="truncate">Settings</span>
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl bg-popover border-none"
						align="end"
						sideOffset={8}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Settings</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="bg-gray-800/6 dark:bg-zinc-200/6" />
						<DropdownMenuGroup>
							<DropdownMenuItem className="focus:bg-orange-300/20 focus:text-orange-400 dark:focus:text-orange-100 dark:focus:bg-orange-100/10 darK:focus:text-orange-200 rounded-lg" onClick={() => window.open("/terms", "_target")}>
								<ScrollIcon className="dark:focus:text-orange-100 focus:text-green-400" />
								Terms
							</DropdownMenuItem>
							<DropdownMenuItem className="focus:bg-orange-300/20 focus:text-orange-400 dark:focus:text-orange-100 dark:focus:bg-orange-100/10 darK:focus:text-orange-200 rounded-lg" onClick={() => window.open("/privacy", "_target")}>
								<ShieldSlashIcon className="dark:focus:text-orange-100" />
								Privacy
							</DropdownMenuItem>
							<DropdownMenuItem className="focus:bg-orange-300/20 focus:text-orange-400 dark:focus:text-orange-100 dark:focus:bg-orange-100/10 darK:focus:text-orange-200 rounded-lg" onClick={() => window.open("/refund", "_target")}>
								<ArrowClockwiseIcon className="dark:focus:text-orange-100 focus:text-orange-400" />
								<Link href="/refund" target="_target">
									Refund
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-gray-800/6 dark:bg-zinc-200/6" />
						<DropdownMenuItem
							className="focus:bg-orange-300/20 focus:text-orange-400 dark:focus:text-orange-100 dark:focus:bg-orange-100/10 darK:focus:text-orange-200 rounded-lg"
							onClick={(e) => {
								e.preventDefault();
								localStorage.removeItem("token");
								window.location.reload();
							}}>
							<LogOut className="dark:focus:text-orange-100 focus:text-orange-400" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

