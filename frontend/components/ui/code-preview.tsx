"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CodePreviewProps {
  html?: string;
  css?: string;
  js?: string;
  className?: string;
  height?: string;
}

// Sanitization functions for security
const sanitizeHtml = (html: string): string => {
  // Remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+='[^']*'/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:text\/html/gi, 'data:text/plain') // Prevent HTML data URLs
    .substring(0, 10000); // Limit size
};

const sanitizeCss = (css: string): string => {
  // Remove dangerous CSS properties and limit size
  return css
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .replace(/behavior\s*:/gi, '') // Remove CSS behaviors
    .replace(/javascript\s*:/gi, '') // Remove javascript URLs
    .replace(/@import/gi, '') // Remove imports
    .replace(/url\s*\(\s*javascript:/gi, 'url(data:text/plain,') // Replace javascript URLs
    .substring(0, 10000); // Limit size
};

const sanitizeJs = (js: string): string => {
  // Basic sanitization for JavaScript
  const dangerous = [
    /document\.cookie/gi,
    /localStorage\./gi,
    /sessionStorage\./gi,
    /window\.location/gi,
    /fetch\s*\(/gi,
    /XMLHttpRequest/gi,
    /import\s*\(/gi,
    /require\s*\(/gi,
    /module\./gi,
    /exports\./gi,
  ];

  let sanitized = js.substring(0, 20000); // Limit size
  
  dangerous.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '/* REMOVED FOR SECURITY */');
  });

  return sanitized;
};

export function CodePreview({ 
  html = "", 
  css = "", 
  js = "", 
  className,
  height = "300px" 
}: CodePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const createPreviewDocument = useCallback(() => {
    // Sanitize and validate input
    const sanitizedHtml = sanitizeHtml(html);
    const sanitizedCss = sanitizeCss(css);
    const sanitizedJs = sanitizeJs(js);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';">
  <title>Code Preview</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    /* Security: Limit viewport and prevent infinite loops */
    * {
      max-width: 100%;
      animation-iteration-count: 10 !important;
    }
    /* User CSS */
    ${sanitizedCss}
  </style>
</head>
<body>
  ${sanitizedHtml}
  <script>
    // Security: Set execution timeout
    const EXECUTION_TIMEOUT = 5000; // 5 seconds max
    let executionStartTime = Date.now();
    
    // Console override to capture logs
    const originalConsole = { ...console };
    const logs = [];
    let logCount = 0;
    const MAX_LOGS = 100; // Limit console logs
    
    ['log', 'error', 'warn', 'info'].forEach(method => {
      console[method] = (...args) => {
        if (logCount++ < MAX_LOGS) {
          originalConsole[method](...args);
          logs.push({ 
            type: method, 
            args: args.map(arg => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg, null, 2).substring(0, 500); // Limit size
                } catch {
                  return '[Object]';
                }
              }
              return String(arg).substring(0, 500); // Limit size
            }).join(' '),
            timestamp: Date.now() - executionStartTime
          });
          
          // Send logs to parent
          window.parent.postMessage({ type: 'console', logs }, '*');
        }
      };
    });

    // Enhanced error handling
    window.addEventListener('error', (e) => {
      console.error('Script error:', e.message);
      window.parent.postMessage({ 
        type: 'error', 
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        stack: e.error?.stack 
      }, '*');
    });

    // Unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      window.parent.postMessage({ 
        type: 'error', 
        message: 'Unhandled promise rejection: ' + e.reason 
      }, '*');
    });

    // Security: Override dangerous functions
    const blockedFunctions = ['eval', 'Function', 'setTimeout', 'setInterval'];
    blockedFunctions.forEach(funcName => {
      if (window[funcName]) {
        window[funcName] = () => {
          console.warn(\`\${funcName} has been disabled for security reasons\`);
        };
      }
    });

    // Execution timeout
    const timeoutId = setTimeout(() => {
      window.parent.postMessage({ 
        type: 'error', 
        message: 'Script execution timeout (5 seconds limit)' 
      }, '*');
    }, EXECUTION_TIMEOUT);

    // User JavaScript with timeout protection
    try {
      const startTime = Date.now();
      
      // Wrap user code in function to control execution
      (function() {
        ${sanitizedJs}
      })();
      
      clearTimeout(timeoutId);
      
      // Signal ready
      window.parent.postMessage({ type: 'ready' }, '*');
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('JavaScript execution error:', error.message);
      window.parent.postMessage({ 
        type: 'error', 
        message: error.message,
        stack: error.stack 
      }, '*');
    }
  </script>
</body>
</html>`;
  }, [html, css, js]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      
      switch (event.data.type) {
        case 'ready':
          setIsLoading(false);
          setError(null);
          break;
        case 'error':
          setError(event.data.message);
          setIsLoading(false);
          break;
        case 'console':
          // Handle console logs if needed
          console.group('Preview Console:');
          event.data.logs.forEach((log: { type: string; args: string }) => {
            const logMethod = console[log.type as keyof Console] as (...args: unknown[]) => void;
            if (typeof logMethod === 'function') {
              logMethod(log.args);
            }
          });
          console.groupEnd();
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Load content
    setIsLoading(true);
    setError(null);
    
    const doc = createPreviewDocument();
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => {
      window.removeEventListener('message', handleMessage);
      URL.revokeObjectURL(url);
    };
  }, [html, css, js, createPreviewDocument]);

  return (
    <div className={cn("relative border rounded-lg overflow-hidden bg-white", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            Loading preview...
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 border-red-200 z-10">
          <div className="text-center p-4">
            <div className="text-red-600 font-medium mb-2">Preview Error</div>
            <div className="text-sm text-red-500 font-mono">{error}</div>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        className={cn("w-full border-0", isLoading || error ? "opacity-0" : "opacity-100")}
        style={{ height }}
        sandbox="allow-scripts allow-forms"
        title="Code Preview"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}