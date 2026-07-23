import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";

interface EmptySectionProps {
  title: string;
  message: string;
  icon?: LucideIcon;
  variant?: "default" | "navy";
}

export function EmptySection({
  title,
  message,
  icon: Icon = FolderOpen,
  variant = "default",
}: EmptySectionProps) {
  const isNavy = variant === "navy";

  return (
    <section
      className={`relative px-4 py-28 sm:px-6 lg:px-8 ${
        isNavy
          ? "bg-section-navy"
          : "bg-section-warm"
      }`}
    >
      <div className="relative mx-auto max-w-lg text-center">
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${
            isNavy
              ? "border border-white/10 bg-white/5"
              : "border border-berea-border/40 bg-white shadow-sm"
          }`}
        >
          <Icon
            className={`h-10 w-10 ${
              isNavy ? "text-berea-gold/50" : "text-berea-gold/40"
            }`}
          />
        </div>
        <h2
          className={`mt-6 text-2xl font-bold tracking-tight ${
            isNavy ? "text-white" : "text-berea-navy"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mx-auto mt-4 max-w-sm text-sm leading-relaxed ${
            isNavy ? "text-white/60" : "text-berea-muted"
          }`}
        >
          {message}
        </p>
      </div>
    </section>
  );
}
