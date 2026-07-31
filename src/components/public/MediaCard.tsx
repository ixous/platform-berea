import Link from "next/link";
import { BereaImage } from "./BereaImage";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface MediaCardProps {
  title: string;
  description?: string | null;
  children?: ReactNode;
  imageUrl?: string | null;
  imageAlt?: string;
  imagePriority?: boolean;
  icon?: LucideIcon;
  category?: string | null;
  badge?: string | null;
  meta?: ReactNode;
  footer?: ReactNode;
  variant?: "default" | "icon" | "profile" | "minimal";
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "default" | "lg";
  href?: string;
  className?: string;
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

function ProfilePlaceholder({ title, size }: { title: string; size: "sm" | "default" | "lg" }) {
  const idx = hashCode(title) % gradients.length;
  const dimensions = size === "sm" ? "h-16 w-16" : size === "lg" ? "h-32 w-32" : "h-24 w-24";
  const fontSize = size === "sm" ? "text-xl" : size === "lg" ? "text-5xl" : "text-4xl";
  return (
    <div
      className={`mx-auto flex ${dimensions} items-center justify-center rounded-full bg-gradient-to-br ${gradients[idx]}`}
    >
      <span className={`${fontSize} font-bold text-white/85`}>
        {title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

const sizeStyles = {
  sm: {
    padding: "p-5",
    title: "text-base",
    description: "text-xs",
    meta: "text-[11px]",
    gap: "gap-3",
  },
  default: {
    padding: "p-7",
    title: "text-lg",
    description: "text-sm",
    meta: "text-xs",
    gap: "gap-4",
  },
  lg: {
    padding: "p-9",
    title: "text-xl",
    description: "text-base",
    meta: "text-sm",
    gap: "gap-5",
  },
};

function MediaCardContent({
  title,
  description,
  category,
  meta,
  footer,
  variant,
  size,
  children,
}: {
  title: string;
  description?: string | null;
  category?: string | null;
  meta?: ReactNode;
  footer?: ReactNode;
  variant: MediaCardProps["variant"];
  size: NonNullable<MediaCardProps["size"]>;
  children?: ReactNode;
}) {
  const styles = sizeStyles[size];
  const centered = variant === "profile";
  return (
    <>
      {category && (
        <span
          className={`mb-3 inline-block w-fit rounded-full bg-berea-gold/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-berea-gold ring-1 ring-berea-gold/10 ${centered ? "mx-auto" : ""}`}
        >
          {category}
        </span>
      )}

      <h3
        className={`${styles.title} font-bold leading-snug text-berea-navy transition-colors duration-200 motion-reduce:transition-none group-hover:text-berea-gold ${centered ? "text-center" : ""}`}
      >
        {title}
      </h3>

      {(children || description) && (
        <div className={`mt-3 ${centered ? "text-center" : ""}`}>
          {children || (
            <p
              className={`${styles.description} leading-relaxed text-berea-muted line-clamp-3 transition-all duration-300 motion-reduce:transition-none group-hover:line-clamp-6`}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {meta && (
        <div
          className={`mt-auto pt-5 ${styles.meta} text-berea-muted ${centered ? "text-center" : ""}`}
        >
          {meta}
        </div>
      )}

      {footer && (
        <div className={`mt-5 pt-4 border-t border-berea-border/40 ${centered ? "text-center" : ""}`}>
          {footer}
        </div>
      )}
    </>
  );
}

export function MediaCard({
  title,
  description,
  children,
  imageUrl,
  imageAlt,
  imagePriority,
  icon: Icon,
  category,
  badge,
  meta,
  footer,
  variant = "default",
  orientation = "vertical",
  size = "default",
  href,
  className = "",
}: MediaCardProps) {
  const isHorizontal = orientation === "horizontal";
  const isProfile = variant === "profile";
  const isMinimal = variant === "minimal";
  const isIcon = variant === "icon";
  const showImageSection = !isMinimal && !isProfile;
  const styles = sizeStyles[size];

  const content = (
    <div
      className={`group relative flex ${isHorizontal ? "flex-col sm:flex-row" : "flex-col"} h-full overflow-hidden rounded-2xl border border-berea-border/40 bg-white shadow-md transition-all duration-300 motion-reduce:transition-none hover:shadow-2xl hover:-translate-y-1.5 hover:border-berea-gold/20 ${isProfile ? "p-8 text-center" : ""} ${isMinimal ? styles.padding : ""} ${className}`}
    >
      {isProfile && (
        <div className="mb-5">
          {imageUrl ? (
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-berea-gold/10">
              <BereaImage
                src={imageUrl}
                alt={imageAlt || title}
                width={96}
                height={96}
                className="h-full w-full rounded-full object-cover"
                sizes="96px"
                priority={imagePriority}
              />
            </div>
          ) : (
            <ProfilePlaceholder title={title} size={size} />
          )}
        </div>
      )}

      {showImageSection && !isHorizontal && (
        <div className="relative h-56 shrink-0 overflow-hidden sm:h-60">
          {imageUrl ? (
            <>
              <BereaImage
                src={imageUrl}
                alt={imageAlt || title}
                fill
                className="transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={imagePriority}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {badge && (
                <span className="absolute left-3 top-3 rounded-full bg-berea-gold/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
                  {badge}
                </span>
              )}
            </>
          ) : isIcon && Icon ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-berea-gold/5 via-berea-navy/5 to-berea-gold/5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-berea-gold/10">
                <Icon className="h-10 w-10 text-berea-gold" />
              </div>
            </div>
          ) : (
            <PlaceholderGradient title={title} />
          )}
        </div>
      )}

      {showImageSection && isHorizontal && (
        <div className="relative h-48 shrink-0 sm:h-auto sm:w-56 lg:w-72">
          {imageUrl ? (
            <>
              <BereaImage
                src={imageUrl}
                alt={imageAlt || title}
                fill
                className="transition-transform duration-700 motion-reduce:transition-none group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 288px"
                priority={imagePriority}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </>
          ) : (
            <PlaceholderGradient title={title} />
          )}
        </div>
      )}

      {!isProfile && (
        <div className={`flex flex-1 flex-col ${isMinimal ? "" : styles.padding} transition-all duration-300 motion-reduce:transition-none group-hover:pb-9`}>
          <MediaCardContent
            title={title}
            description={description}
            category={category}
            meta={meta}
            footer={footer}
            variant={variant}
            size={size}
          >
            {children}
          </MediaCardContent>
        </div>
      )}

      {isProfile && (
        <MediaCardContent
          title={title}
          description={description}
          category={category}
          meta={meta}
          footer={footer}
          variant={variant}
          size={size}
        >
          {children}
        </MediaCardContent>
      )}
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
