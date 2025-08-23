import React, { useState } from "react";
import { Sparkles, Search, Code, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const TabsSuggestion = ({
  suggestedInput,
  setSuggestedInput,
}: {
  suggestedInput: string;
  setSuggestedInput: (input: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState("create");

  const tabs = [
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

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="text-foreground max-w-xl w-full">
      <div className="flex flex-col gap-4">
        {/* Tab Navigation */}
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-300 cursor-pointer justify-center border ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              } `}
            >
              {tab.icon}
              {activeTab === tab.id && (
                <span
                  className={cn(
                    "text-sm whitespace-nowrap overflow-hidden transition-all duration-300"
                  )}
                >
                  {tab.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-col">
          {activeTabData?.content.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (suggestedInput || suggestedInput === "") {
                  setSuggestedInput(item);
                }
              }}
              className="flex items-start gap-2 border-t border-secondary/40 py-1 first:border-none cursor-pointer font-medium"
            >
              <button className="w-full rounded-md py-2 text-left hover:bg-secondary sm:px-3">
                {item}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabsSuggestion;
