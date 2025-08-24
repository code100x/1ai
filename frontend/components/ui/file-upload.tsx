"use client";

import { useState, useRef } from "react";
import { BACKEND_URL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  X,
  Upload,
  FileText,
  Paperclip,
  AlertCircle,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

export interface UploadedFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  extractedContent?: string;
}

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
  onFileRemove: (fileUrl: string) => void;
  uploadedFiles: UploadedFile[];
  disabled?: boolean;
  hideButton?: boolean;
}

const SUPPORTED_FILE_TYPES = {
  images: ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/markdown",
  ],
};

const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_FILE_TYPES.images,
  ...SUPPORTED_FILE_TYPES.documents,
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({
  onFileUpload,
  onFileRemove,
  uploadedFiles,
  disabled = false,
  hideButton = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        if (!ALL_SUPPORTED_TYPES.includes(file.type)) {
          setError(
            "Please select images (PNG, JPG, GIF, WebP) or documents (PDF, DOCX, XLS, XLSX, TXT, MD)"
          );
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          setError("File size must be less than 10MB");
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required. Please login again.");
          continue;
        }

        const response = await fetch(`${BACKEND_URL}/upload/upload`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          onFileUpload({
            url: result.url,
            fileName: result.fileName || file.name,
            fileType: result.fileType || file.type,
            fileSize: result.fileSize || file.size,
            extractedContent: result.extractedContent,
          });
          setError(null);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || "Failed to upload file. Please try again.");
          console.error("Upload failed:", errorData);
        }
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Error uploading files. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = (url: string) => {
    setPreviewImage(url);
  };

  const isImageFile = (fileType: string) => {
    return SUPPORTED_FILE_TYPES.images.includes(fileType);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFilePreview = (file: UploadedFile, index: number) => {
    const handleRemove = () => {
      onFileRemove(file.url);
      setError(null);
      if (previewImage === file.url) {
        setPreviewImage(null);
      }
    };

    if (isImageFile(file.fileType)) {
      return (
        <div
          key={index}
          className="group relative rounded-lg overflow-hidden border border-neutral-700/50 cursor-pointer hover:border-neutral-600/50 transition-colors"
          onClick={() => handleImageClick(file.url)}
        >
          <div className="relative w-[80px] h-[80px]">
            <Image
              src={file.url}
              alt={file.fileName}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="p-2 bg-neutral-800/80 backdrop-blur-sm">
            <p className="text-xs text-neutral-300 truncate" title={file.fileName}>
              {file.fileName}
            </p>
            <p className="text-xs text-neutral-500">
              {formatFileSize(file.fileSize)}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="group relative flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/50 hover:border-neutral-600/50 transition-colors min-w-0"
      >
        <FileText className="h-6 w-6 text-neutral-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate" title={file.fileName}>
            {file.fileName}
          </p>
          <p className="text-xs text-neutral-500">
            {formatFileSize(file.fileSize)}
          </p>
          {file.extractedContent && (
            <p className="text-xs text-neutral-400 truncate mt-1" title={file.extractedContent}>
              {file.extractedContent.slice(0, 150)}...
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="h-8 w-8 p-0 text-neutral-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {!hideButton && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={triggerFileSelect}
            disabled={disabled || isUploading}
            className="h-10 w-10 p-0 mt-4 hover:bg-neutral-700/50 transition-colors"
            title="Upload files (Images, PDF, DOCX, XLS, XLSX, TXT)"
          >
            {isUploading ? (
              <Upload className="h-5 w-5 animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ALL_SUPPORTED_TYPES.join(",")}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {uploadedFiles.map((file, index) => renderFilePreview(file, index))}
        </div>
      )}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] rounded-lg overflow-hidden">
            <Image
              src={previewImage}
              alt="Preview"
              width={1600}
              height={1200}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 h-10 w-10 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
