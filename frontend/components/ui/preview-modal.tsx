"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodePreview } from "./code-preview";
import { Play, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewModalProps {
  html?: string;
  css?: string;
  js?: string;
  trigger?: React.ReactNode;
  className?: string;
}

export function PreviewModal({ 
  html = "", 
  css = "", 
  js = "", 
  trigger,
  className 
}: PreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  
  const hasCode = !!(html.trim() || css.trim() || js.trim());

  if (!hasCode) {
    return null;
  }

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1.5"
    >
      <Play className="h-3 w-3" />
      Preview
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className={cn("max-w-6xl h-[80vh] p-0", className)}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Code Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 grid w-fit grid-cols-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              {html.trim() && <TabsTrigger value="html">HTML</TabsTrigger>}
              {css.trim() && <TabsTrigger value="css">CSS</TabsTrigger>}
              {js.trim() && <TabsTrigger value="js">JavaScript</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="preview" className="flex-1 m-6 mt-4">
              <div className="h-full border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Live Preview</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Sandboxed Environment</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <CodePreview 
                  html={html} 
                  css={css} 
                  js={js} 
                  height="calc(100% - 49px)"
                  className="border-0 rounded-none"
                />
              </div>
            </TabsContent>
            
            {html.trim() && (
              <TabsContent value="html" className="flex-1 m-6 mt-4">
                <CodeBlock content={html} language="html" />
              </TabsContent>
            )}
            
            {css.trim() && (
              <TabsContent value="css" className="flex-1 m-6 mt-4">
                <CodeBlock content={css} language="css" />
              </TabsContent>
            )}
            
            {js.trim() && (
              <TabsContent value="js" className="flex-1 m-6 mt-4">
                <CodeBlock content={js} language="javascript" />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reusable code block display component
function CodeBlock({ content, language }: { content: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="h-full border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 capitalize">{language}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="h-7 px-2"
        >
          {copied ? (
            <span className="text-green-600 text-xs">Copied!</span>
          ) : (
            <span className="text-xs">Copy</span>
          )}
        </Button>
      </div>
      <div className="h-full overflow-auto p-4 bg-gray-900 text-gray-100">
        <pre className="text-sm font-mono whitespace-pre-wrap">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
}