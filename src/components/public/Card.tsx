import Link from "next/link";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  padded?: boolean;
}

export function Card({ children, href, className = "", padded = true }: CardProps) {
  const classes = `rounded-2xl border border-berea-border/60 bg-white shadow-sm transition-all duration-300 motion-reduce:transition-none hover:shadow-md hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${padded ? "p-6" : ""} ${className}`;

  if (href) {
    return (
      <Link prefetch href={href} className={`group block ${classes}`}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}

export function CardCategory({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-widest text-berea-gold ${className}`}>
      {children}
    </p>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`mt-3 text-lg font-bold text-berea-navy transition-colors duration-200 motion-reduce:transition-none group-hover:text-berea-gold ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`mt-2 text-sm leading-relaxed text-berea-muted ${className}`}>{children}</p>
  );
}

export function CardMeta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-berea-muted ${className}`}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-6 flex items-center gap-2 text-sm font-medium text-berea-navy transition-colors motion-reduce:transition-none group-hover:text-berea-gold ${className}`}
    >
      {children}
    </div>
  );
}
