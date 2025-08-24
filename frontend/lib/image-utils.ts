/**
 * Utility functions for handling images in the chat interface
 */

/**
 * Converts a File object to base64 string
 * @param file - The image file to convert
 * @returns Promise<string> - Base64 encoded image string
 */
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Validates if a file is a valid image
 * @param file - The file to validate
 * @returns boolean - True if file is a valid image
 */
export const isValidImage = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

/**
 * Creates a preview URL for an image file
 * @param file - The image file
 * @returns string - Object URL for preview
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Cleans up a preview URL to prevent memory leaks
 * @param url - The preview URL to revoke
 */
export const revokeImagePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
