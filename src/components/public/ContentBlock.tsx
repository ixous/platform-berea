import type { ReactNode } from "react";

interface ContentBlockProps {
  children: ReactNode;
  className?: string;
}

export function ContentBlock({ children, className = "" }: ContentBlockProps) {
  return (
    <section className={`px-4 py-20 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function ContentNarrow({ children, className = "" }: ContentBlockProps) {
  return (
    <div className={`mx-auto max-w-3xl ${className}`}>{children}</div>
  );
}
