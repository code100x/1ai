"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Image, FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  files: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  }>;
  className?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

export const FilePreview: React.FC<FilePreviewProps> = ({ files, className }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith("image/")) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const handleDownload = (file: FilePreviewProps["files"][0]) => {
    const url = `${BACKEND_URL}/upload/file/${file.filename}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (file: FilePreviewProps["files"][0]) => {
    const url = `${BACKEND_URL}/upload/file/${file.filename}`;
    window.open(url, "_blank");
  };

  if (files.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getFileIcon(file.mimetype)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.originalName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {file.mimetype.startsWith("image/") && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleView(file)}
                className="h-8 w-8"
                title="View image"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(file)}
              className="h-8 w-8"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
