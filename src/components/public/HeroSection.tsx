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
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-berea-navy sm:min-h-[520px] lg:min-h-[620px]">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {tagline && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-berea-gold">
              {tagline}
            </p>
          )}
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/80 sm:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        {(ctaText || secondaryCtaText) && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 mt-10 flex flex-wrap items-center justify-center gap-4">
            {ctaText && ctaHref && (
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-lg bg-berea-gold px-6 py-3 text-base font-semibold text-white shadow-lg shadow-berea-gold/25 transition-all duration-300 hover:bg-berea-gold/90 hover:shadow-xl hover:shadow-berea-gold/30 hover:-translate-y-0.5"
              >
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {secondaryCtaText && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5"
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
