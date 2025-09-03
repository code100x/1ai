import React, { useState } from "react";
import { Sparkles, Search, Code, BookOpen, Gimini } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface Tab {
	id: string;
	label: string;
	icon: React.ReactNode;
	content: string[];
}

const TabsSuggestion = ({
  suggestedInput,
  setSuggestedInput,
}: {
  suggestedInput: string;
  setSuggestedInput: (input: string) => void;
}) => {
	const [activePopover, setActivePopover] = useState<string | null>(null)

  const tabs: Tab[] = [
    {
      id: "create",
      label: "Create",
      icon: <Sparkles className="h-4 w-4" />,
      content: [
        "Write a short story about a robot discovering emotions",
        "Help me outline a sci-fi novel set in a post-apocalyptic world",
        "How many Rs are in the word 'strawberry'? ",
        "Give me 5 creative writing prompts for flash fiction",
      ],
    },
    {
      id: "explore",
      label: "Explore",
      icon: <Search className="h-4 w-4" />,
      content: [
        "Analyze the themes in contemporary dystopian literature",
        "Compare different narrative structures in modern novels",
        "Explore the evolution of science fiction from the 1950s to today",
        "Discuss the impact of AI on creative writing",
      ],
    },
    {
      id: "code",
      label: "Code",
      icon: <Code className="h-4 w-4" />,
      content: [
        "Build a React component for a text editor with syntax highlighting",
        "Create a Python script to analyze writing patterns in text files",
        "Develop a web app for collaborative story writing",
        "Write a function to generate random plot elements for writers",
      ],
    },
    {
      id: "learn",
      label: "Learn",
      icon: <BookOpen className="h-4 w-4" />,
      content: [
        "Teach me the fundamentals of narrative structure",
        "Explain different point-of-view techniques in storytelling",
        "Help me understand character development arcs",
        "Break down the elements of effective dialogue writing",
      ],
    },
  ];

  return (
		<div className="flex flex-col gap-4">
			{/* Tab Navigation */}
			<div className="mb-4 flex flex-wrap gap-2">
				{tabs.map((tab) => (
					<Popover 
						key={tab.id}
						onOpenChange={(open) => {
							setActivePopover(open ? tab.id : null)
						}}
					>
						<PopoverTrigger asChild>
							<button
								className={`flex items-center justify-center cursor-pointer px-4 py-2 gap-2 border font-medium border-black/10 dark:border-zinc-400/8 rounded-xl bg-zinc-400/5 inset-shadow-xs ${activePopover === tab.id
									? "bg-zinc-400/15"
									: "hover:bg-zinc-400/15"
									} `}
							>
								{tab.icon}
								<span
									className="text-sm whitespace-nowrap overflow-hidden transition-all duration-300"
								>
									{tab.label}
								</span>
							</button>
						</PopoverTrigger>

						<PopoverContent sideOffset={8} className="flex justify-center w-80 p-4 border-none rounded-xl">
							<div className="flex flex-col">
								<h3 className="mb-3 font-medium text-sm text-muted-foreground">{tab.label}</h3>
								{tab.content.map((item, index) => (
									<div
										key={index}
										onClick={() => {
											if (setSuggestedInput) {
												setSuggestedInput(item)
											}
										}}
										className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none"
									>
										<button className="w-full rounded-md text-[.80rem] text-left hover:bg-orange-100/30 dark:hover:bg-orange-100/5 cursor-pointer">{item}</button>
									</div>
								))}
							</div>
						</PopoverContent>
					</Popover>
				))}
			</div>
		</div>
  );
};

export default TabsSuggestion;
