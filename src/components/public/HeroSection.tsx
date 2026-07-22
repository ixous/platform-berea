import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HeroSection({ title, subtitle, ctaText, ctaHref }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-berea-navy px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-berea-navy via-berea-navy/95 to-berea-navy/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.15),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {subtitle}
          </p>
        )}
        {ctaText && ctaHref && (
          <div className="mt-10">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-md bg-berea-gold px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
