import type { LucideIcon } from "lucide-react";
import { FolderOpen } from "lucide-react";

interface EmptySectionProps {
  title: string;
  message: string;
  icon?: LucideIcon;
}

export function EmptySection({ title, message, icon: Icon = FolderOpen }: EmptySectionProps) {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-berea-navy/5">
          <Icon className="h-8 w-8 text-berea-gold/40" />
        </div>
        <h2 className="mt-6 text-xl font-bold tracking-tight text-berea-navy">{title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-berea-muted">
          {message}
        </p>
      </div>
    </section>
  );
}
