import type { ReactNode } from "react";

interface ContentBlockProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "cream" | "gradient";
}

const variants = {
  default: "",
  cream:
    "bg-gradient-to-b from-white to-[#fafafa]",
  gradient:
    "bg-gradient-to-b from-[#fcfcfc] to-[#f5f5f5]",
};

export function ContentBlock({ children, className = "", variant = "default" }: ContentBlockProps) {
  return (
    <section className={`px-4 py-24 sm:px-6 lg:px-8 ${variants[variant]} ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function ContentNarrow({ children, className = "" }: ContentBlockProps) {
  return (
    <div className={`mx-auto max-w-3xl ${className}`}>{children}</div>
  );
}
