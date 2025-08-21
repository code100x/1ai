import React, { useState } from "react";
import { Sparkles, Search, Code, BookOpen } from "lucide-react";

const TabsSuggestion = ({
  suggestedInput,
  setSuggestedInput,
}: {
  suggestedInput: any;
  setSuggestedInput: any;
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
    <div className="text-foreground mt-7 h-fit min-w-lg">
      <div className="mx-auto max-w-4xl">
        {/* Tab Navigation */}
        <div className="mb-4 flex items-center justify-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-foreground"
              } `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mx-auto flex max-w-md flex-col items-center space-y-2">
          {activeTabData?.content.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (suggestedInput || suggestedInput === "") {
                  setSuggestedInput(item);
                }
              }}
              className="bg-muted/80 hover:bg-accent/80 group w-full cursor-pointer rounded-xl border py-2 text-center transition-all duration-200"
            >
              <p className="text-card-foreground text-sm leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* Optional: Add some visual feedback for the active tab */}
      </div>
    </div>
  );
};

export default TabsSuggestion;
