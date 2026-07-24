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
  "from-amber-900/50 via-amber-800/30 to-amber-950/50",
  "from-blue-900/50 via-blue-800/30 to-blue-950/50",
  "from-emerald-900/50 via-emerald-800/30 to-emerald-950/50",
  "from-rose-900/50 via-rose-800/30 to-rose-950/50",
  "from-violet-900/50 via-violet-800/30 to-violet-950/50",
  "from-teal-900/50 via-teal-800/30 to-teal-950/50",
  "from-orange-900/50 via-orange-800/30 to-orange-950/50",
  "from-indigo-900/50 via-indigo-800/30 to-indigo-950/50",
];

const baseColors = [
  "bg-amber-700",
  "bg-blue-700",
  "bg-emerald-700",
  "bg-rose-700",
  "bg-violet-700",
  "bg-teal-700",
  "bg-orange-700",
  "bg-indigo-700",
];

function PlaceholderGradient({ title }: { title: string }) {
  const idx = hashCode(title) % gradients.length;
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[idx]}`}
    >
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-2xl ${baseColors[idx]} bg-opacity-40 backdrop-blur-sm shadow-lg`}
      >
        <span className="text-3xl font-bold text-white/85">
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-berea-border/40 bg-white shadow-md transition-all duration-300 motion-reduce:transition-none hover:shadow-2xl hover:-translate-y-1.5 hover:border-berea-gold/20">
      <div className="relative h-56 shrink-0 overflow-hidden sm:h-60">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        ) : (
          <PlaceholderGradient title={title} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-7 transition-all duration-300 motion-reduce:transition-none group-hover:pb-9">
        {category && (
          <span className="mb-3 inline-block w-fit rounded-full bg-berea-gold/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-berea-gold ring-1 ring-berea-gold/10">
            {category}
          </span>
        )}

        <h3 className="text-lg font-bold leading-snug text-berea-navy transition-colors duration-200 motion-reduce:transition-none group-hover:text-berea-gold">
          {title}
        </h3>

        {description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-berea-muted transition-all duration-300 motion-reduce:transition-none group-hover:line-clamp-6">
            {description}
          </p>
        )}

        {meta && (
          <div className="mt-auto pt-5">{meta}</div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link prefetch href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
