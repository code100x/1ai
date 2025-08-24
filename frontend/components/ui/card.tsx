import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`border-border bg-background rounded-xl border shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardProps) {
  return (
    <h3 className={`leading-none font-semibold tracking-tight ${className}`}>
      {children}
    </h3>
  );
}
