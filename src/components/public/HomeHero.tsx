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
}

export function HomeHero({
  tagline,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  clips,
  poster,
}: HomeHeroProps) {
  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-site-ink text-white md:min-h-[500px] lg:aspect-[1297/456]">
      <HeroBackdrop clips={clips} poster={poster} />
      <div className="site-aurora-ink" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[76rem] px-4 pb-12 pt-32 sm:px-6 md:pb-16 lg:px-8">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {tagline && (
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-site-gold" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-site-gold">
                {tagline}
              </p>
            </div>
          )}
          <h1 className="text-balance text-[clamp(2.6rem,6.5vw,5.8rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/85 sm:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
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
