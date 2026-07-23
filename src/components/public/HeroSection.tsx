import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BereaImage } from "./BereaImage";
import { ParallaxLayer } from "./ParallaxLayer";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  backgroundImage?: string | null;
}

export function HeroSection({
  title,
  subtitle,
  tagline,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[460px] items-center justify-center overflow-hidden bg-berea-navy sm:min-h-[560px] lg:min-h-[680px]">
      {backgroundImage ? (
        <>
          <ParallaxLayer speed={0.05} className="absolute inset-0">
            <BereaImage
              src={backgroundImage}
              alt="Centro Cristiano Berea"
              fill
              priority
            />
          </ParallaxLayer>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.08),transparent_50%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_50%)]" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {tagline && (
            <div className="mb-8 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-berea-gold/40" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-berea-gold">
                {tagline}
              </p>
              <span className="h-px w-8 bg-berea-gold/40" />
            </div>
          )}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-8 max-w-3xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        {(ctaText || secondaryCtaText) && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 mt-12 flex flex-wrap items-center justify-center gap-4">
            {ctaText && ctaHref && (
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 rounded-lg bg-berea-gold px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:shadow-xl hover:shadow-berea-gold/30 hover:-translate-y-0.5"
              >
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            )}
            {secondaryCtaText && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5"
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 to-transparent" />
    </section>
  );
}
