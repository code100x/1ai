// In your TypeWriter component file (e.g., ./typewritter.tsx)

import { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface TypewriterProps {
  text: string;
  speed?: number;
  components: React.ComponentProps<typeof ReactMarkdown>["components"];
}

export const TypeWriter: React.FC<TypewriterProps> = ({
  text,
  speed = 400,
  components,
}) => {
  const [currentText, setCurrentText] = useState("");
  const animationFrameId = useRef<number | undefined>(undefined);
  const startTime = useRef<number | undefined>(0);

  const animate = useCallback((timestamp: number) => {
    if (startTime.current === undefined) {
      startTime.current = timestamp;
    }
    const elapsed = timestamp - startTime.current;
    const charsToShow = Math.floor((elapsed / 1000) * speed);
    const newText = text.slice(0, charsToShow);
    console.log("newText: ", newText)
    setCurrentText(newText);

    if (newText.length < text.length) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [text, speed]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    startTime.current = undefined;
    setCurrentText("");
  }, [text]);


  const displayText =
    currentText +
    (currentText.length < text.length ? '<span class="blinking-cursor">▍</span>' : '');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {displayText}
    </ReactMarkdown>
  );
};