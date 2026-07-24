"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface MediaCardProps {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  href?: string;
  category?: string | null;
  meta?: ReactNode;
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const gradients = [
  "from-amber-900/40 via-amber-800/20 to-amber-950/40",
  "from-blue-900/40 via-blue-800/20 to-blue-950/40",
  "from-emerald-900/40 via-emerald-800/20 to-emerald-950/40",
  "from-rose-900/40 via-rose-800/20 to-rose-950/40",
  "from-violet-900/40 via-violet-800/20 to-violet-950/40",
  "from-teal-900/40 via-teal-800/20 to-teal-950/40",
  "from-orange-900/40 via-orange-800/20 to-orange-950/40",
  "from-indigo-900/40 via-indigo-800/20 to-indigo-950/40",
];

const baseColors = [
  "bg-amber-800",
  "bg-blue-800",
  "bg-emerald-800",
  "bg-rose-800",
  "bg-violet-800",
  "bg-teal-800",
  "bg-orange-800",
  "bg-indigo-800",
];

function PlaceholderGradient({ title }: { title: string }) {
  const idx = hashCode(title) % gradients.length;
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[idx]}`}
    >
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${baseColors[idx]} bg-opacity-30 backdrop-blur-sm`}>
        <span className="text-2xl font-bold text-white/80">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export function MediaCard({
  title,
  description,
  imageUrl,
  href,
  category,
  meta,
}: MediaCardProps) {
  const content = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-berea-border/50 bg-white shadow-sm transition-all duration-300 motion-reduce:transition-none hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-52 shrink-0 overflow-hidden sm:h-56">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none"
            loading="lazy"
          />
        ) : (
          <PlaceholderGradient title={title} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 transition-all duration-300 motion-reduce:transition-none group-hover:pb-8">
        {category && (
          <span className="mb-2 inline-block w-fit rounded-full bg-berea-gold/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-berea-gold">
            {category}
          </span>
        )}

        <h3 className="text-lg font-bold leading-snug text-berea-navy transition-colors duration-200 motion-reduce:transition-none group-hover:text-berea-gold">
          {title}
        </h3>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-berea-muted transition-all duration-300 motion-reduce:transition-none group-hover:line-clamp-4">
            {description}
          </p>
        )}

        {meta && (
          <div className="mt-auto pt-4">{meta}</div>
        )}


      </div>
    </div>
  );

  if (href) {
    return (
      <Link prefetch href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
