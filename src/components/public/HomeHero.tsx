import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBackdrop } from "./HeroBackdrop";

interface HomeHeroProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  clips?: string[];
  poster: string;
  visionBadge?: string;
}

export function HomeHero({
  tagline,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  clips,
  poster,
  visionBadge = "Visión 2026 · RHEMA",
}: HomeHeroProps) {
  return (
    <section className="relative isolate flex min-h-[78svh] items-center justify-center overflow-hidden bg-site-ink text-white md:min-h-[500px] lg:aspect-[1297/456]">
      <HeroBackdrop clips={clips} poster={poster} />
      <div className="site-aurora-ink" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-col items-center px-4 pb-12 pt-28 text-center sm:px-6 md:pb-16 md:pt-32 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          {visionBadge && (
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-site-gold/40 bg-site-gold/15 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-site-gold animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-site-gold">
                {visionBadge}
              </span>
            </div>
          )}
          {tagline && (
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-site-gold" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-site-gold">
                {tagline}
              </p>
              <span className="h-px w-10 bg-site-gold" aria-hidden="true" />
            </div>
          )}
          <h1 className="font-display text-center text-[clamp(1.5rem,4.6vw,4.5rem)] font-black leading-[1.08] tracking-[-0.03em] whitespace-nowrap">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg leading-relaxed text-white/85 sm:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Link
            href={primaryCta.href}
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-site-gold px-7 py-3.5 text-base font-bold text-site-ink transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold focus-visible:ring-offset-2 focus-visible:ring-offset-site-ink"
          >
            <span className="site-sheen" aria-hidden="true" />
            <span className="relative z-10 inline-flex items-center gap-2">
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-base font-bold text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
