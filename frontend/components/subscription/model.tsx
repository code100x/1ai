import React from "react";
import { Eye, FileText, Search, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ModelCard = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-0">
        {/* Header with icon and toggle */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Gemini icon */}
            <div className="flex h-8 w-8 items-center justify-center">
              <div className="h-6 w-6 rotate-45 transform rounded bg-gradient-to-br from-blue-400 to-purple-600"></div>
            </div>
            <div>
              <h3 className="text-sm font-semibold md:text-lg">
                Gemini 2.0 Flash
              </h3>
            </div>
          </div>

          {/* Toggle switch */}
          <div className="flex items-center space-x-2">
            <Switch id="gemini-toggle" defaultChecked />
            <Label htmlFor="gemini-toggle" className="sr-only">
              Enable Gemini 2.0 Flash
            </Label>
          </div>
        </div>
        {/* Description */}
        <p className="text-muted-foreground mb-4 text-xs font-semibold">
          Google's flagship model, known for speed and accuracy (and also web
          search!).
        </p>

        {/* Feature badges and search URL */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Vision badge */}
            <Badge variant="secondary" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="text-xs">Vision</span>
            </Badge>

            {/* PDFs badge */}
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span className="text-xs">PDFs</span>
            </Badge>

            {/* Search badge */}
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              <span className="text-xs">Search</span>
            </Badge>
          </div>

          {/* Search URL */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hidden h-auto p-0 text-xs md:block"
          >
            <Link className="mr-1 h-3 w-3" />
            Search URL
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Models = () => {
  return (
    <div className="bg-background mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="my-8">
        <h1 className="text-xl font-bold">Available Models</h1>
        <p className="text-muted-foreground">
          Choose which models appear in your model selector. This won't affect
          existing conversations.
        </p>
      </div>

      {/* Action buttons */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
        <Button className="h-7 text-xs" variant="outline">
          Filter by features
        </Button>
        <div className="flex items-center gap-2">
          <Button className="hidden h-7 text-xs md:block" variant="outline">
            Select Recommended Models
          </Button>
          <Button className="h-7 text-xs" variant="outline">
            Unselect All
          </Button>
        </div>
      </div>

      {/* Model Card */}
      <ModelCard />
    </div>
  );
};

export default Models;
