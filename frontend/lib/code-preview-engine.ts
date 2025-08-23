export interface CodeBlock {
  language: string;
  content: string;
  startIndex?: number;
  endIndex?: number;
}

export interface PreviewableCode {
  html: string;
  css: string;
  js: string;
  hasPreviewableContent: boolean;
}

// Languages that can be previewed
const PREVIEWABLE_LANGUAGES = [
  'html', 'htm',
  'css', 
  'javascript', 'js', 'jsx',
  'typescript', 'ts', 'tsx'
];

// Languages that typically contain HTML content
const HTML_LANGUAGES = ['html', 'htm', 'xml', 'jsx', 'tsx'];

// Languages that contain CSS
const CSS_LANGUAGES = ['css', 'scss', 'sass', 'less', 'stylus'];

// Languages that contain JavaScript
const JS_LANGUAGES = ['javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx'];

/**
 * Extracts code blocks from markdown content
 */
export function extractCodeBlocks(markdown: string): CodeBlock[] {
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  const blocks: CodeBlock[] = [];
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = (match[1] || 'text').toLowerCase();
    const content = match[2].trim();
    
    if (content) {
      blocks.push({
        language,
        content,
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
  }

  return blocks;
}

/**
 * Determines if code blocks contain previewable content
 */
export function hasPreviewableCode(blocks: CodeBlock[]): boolean {
  return blocks.some(block => PREVIEWABLE_LANGUAGES.includes(block.language));
}

/**
 * Combines code blocks into previewable HTML document structure
 */
export function combineCodeForPreview(blocks: CodeBlock[]): PreviewableCode {
  let html = '';
  let css = '';
  let js = '';

  for (const block of blocks) {
    const { language, content } = block;
    
    if (HTML_LANGUAGES.includes(language)) {
      // For HTML content, try to extract just the body content if it's a full document
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        html += bodyMatch[1] + '\n';
        
        // Also extract any CSS from style tags
        const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
        if (styleMatches) {
          styleMatches.forEach(styleTag => {
            const cssContent = styleTag.replace(/<\/?style[^>]*>/gi, '');
            css += cssContent + '\n';
          });
        }
        
        // Extract JavaScript from script tags
        const scriptMatches = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
        if (scriptMatches) {
          scriptMatches.forEach(scriptTag => {
            const jsContent = scriptTag.replace(/<\/?script[^>]*>/gi, '');
            if (!jsContent.includes('src=')) { // Skip external scripts
              js += jsContent + '\n';
            }
          });
        }
      } else {
        // Assume it's HTML fragment
        html += content + '\n';
      }
    } else if (CSS_LANGUAGES.includes(language)) {
      css += content + '\n';
    } else if (JS_LANGUAGES.includes(language)) {
      // Handle React/JSX components
      if (language === 'jsx' || language === 'tsx') {
        html += convertJSXToHTML(content) + '\n';
      } else {
        js += content + '\n';
      }
    }
  }

  const hasPreviewableContent = !!(html.trim() || css.trim() || js.trim());

  return {
    html: html.trim(),
    css: css.trim(), 
    js: js.trim(),
    hasPreviewableContent
  };
}

/**
 * Basic JSX to HTML conversion for simple components
 * Note: This is a simplified converter for basic JSX
 */
function convertJSXToHTML(jsx: string): string {
  try {
    // Remove import/export statements
    let html = jsx
      .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
      .replace(/export\s+(default\s+)?/g, '');
    
    // Convert JSX component to HTML
    if (html.includes('function') || html.includes('const') || html.includes('=>')) {
      // Extract JSX return statement
      const returnMatch = html.match(/return\s*\(\s*([\s\S]*?)\s*\);?/);
      if (returnMatch) {
        html = returnMatch[1];
      } else {
        // Try to find JSX without explicit return
        const jsxMatch = html.match(/<[\s\S]*>/);
        if (jsxMatch) {
          html = jsxMatch[0];
        }
      }
    }
    
    // Basic JSX to HTML conversions
    html = html
      .replace(/className=/g, 'class=')
      .replace(/htmlFor=/g, 'for=')
      .replace(/{\/\*[\s\S]*?\*\/}/g, '') // Remove comments
      .replace(/{\s*\/\*[\s\S]*?\*\/\s*}/g, '') // Remove JSX comments
      .replace(/\/>/g, '>') // Convert self-closing tags (simplified)
      .replace(/\s+/g, ' ') // Clean up whitespace
      .trim();
    
    return html;
  } catch (error) {
    console.warn('JSX conversion failed:', error);
    return '<!-- JSX conversion failed -->';
  }
}

/**
 * Validates and sanitizes code content for security
 */
export function sanitizeCode(code: string, language: string): string {
  // Remove potentially dangerous content
  const dangerous = [
    /document\.cookie/gi,
    /localStorage\./gi,
    /sessionStorage\./gi,
    /window\.location/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
  ];

  let sanitized = code;
  
  if (language === 'javascript' || language === 'js') {
    dangerous.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '/* REMOVED FOR SECURITY */');
    });
  }

  return sanitized;
}

/**
 * Detects if a message contains previewable code
 */
export function detectPreviewableCode(messageContent: string): {
  hasPreviewableCode: boolean;
  codeBlocks: CodeBlock[];
  previewableCode?: PreviewableCode;
} {
  const codeBlocks = extractCodeBlocks(messageContent);
  const hasPreviewable = hasPreviewableCode(codeBlocks);
  
  let previewableCode: PreviewableCode | undefined;
  
  if (hasPreviewable) {
    previewableCode = combineCodeForPreview(codeBlocks);
  }

  return {
    hasPreviewableCode: hasPreviewable && (previewableCode?.hasPreviewableContent ?? false),
    codeBlocks,
    previewableCode
  };
}