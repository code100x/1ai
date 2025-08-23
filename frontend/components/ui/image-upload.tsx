"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, XIcon } from "@phosphor-icons/react";
import { convertImageToBase64, isValidImage, createImagePreview, revokeImagePreview } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  disabled?: boolean;
  resetTrigger?: number; // Add reset trigger prop
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  disabled = false,
  resetTrigger = 0
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset component when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      if (previewUrl) {
        revokeImagePreview(previewUrl);
      }
      setImage(null);
      setPreviewUrl(null);
      onImagesChange([]);
    }
  }, [resetTrigger, previewUrl, onImagesChange]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!isValidImage(file)) {
      alert(`Invalid image: ${file.name}. Please use JPEG, PNG, WebP, or GIF files under 10MB.`);
      return;
    }
    
    try {
      const base64 = await convertImageToBase64(file);
      const preview = createImagePreview(file);
      
      setImage(base64);
      setPreviewUrl(preview);
      onImagesChange([base64]); // Send single image in array
    } catch (error) {
      console.error('Error converting image:', error);
      alert(`Failed to process image: ${file.name}`);
    }
  }, [onImagesChange]);

  const removeImage = useCallback(() => {
    if (previewUrl) {
      revokeImagePreview(previewUrl);
    }
    
    setImage(null);
    setPreviewUrl(null);
    onImagesChange([]); // Clear images
  }, [previewUrl, onImagesChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-3">
      {/* Image preview */}
      {image && previewUrl && (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Uploaded image"
            className="w-32 h-32 object-cover rounded-lg border border-border"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={disabled}
          >
            <XIcon className="w-3 w-3" />
          </button>
        </div>
      )}

      {/* Upload area */}
      {!image && (
        <div
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors",
            "hover:border-primary/50 hover:bg-accent/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          
          <p className="text-xs text-muted-foreground mt-2">
            Drag & drop an image here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPEG, PNG, WebP, GIF up to 10MB
          </p>
        </div>
      )}
    </div>
  );
};
