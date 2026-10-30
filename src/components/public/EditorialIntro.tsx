import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BereaImage } from "./BereaImage";
import { Reveal } from "./Reveal";
import { EDITORIAL_IMAGE } from "@/lib/public/site-navigation";

interface EditorialIntroProps {
  title: string;
  description: string;
  cta?: { label: string; href: string };
}

export function EditorialIntro({ title, description, cta }: EditorialIntroProps) {
  return (
    <section className="relative overflow-hidden bg-site-paper">
      <div className="site-aurora" aria-hidden="true" />
      <div className="site-orb site-orb-blue right-[-140px] top-[-120px]" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-[76rem] items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
        <Reveal className="order-2 lg:order-1">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/5]">
            <BereaImage
              src={EDITORIAL_IMAGE.src}
              alt={EDITORIAL_IMAGE.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="site-sheen" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-site-ink/20 to-transparent" />
          </div>
        </Reveal>

        <Reveal delay={150} className="order-1 lg:order-2">
          <p className="site-gold-pulse text-xs font-semibold uppercase tracking-[0.22em] text-site-gold">
            Comunidad
          </p>
          <h2 className="mt-5 font-display text-balance text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-tight tracking-[-0.02em] text-site-ink">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-site-muted">
            {description}
          </p>
          {cta && (
            <Link
              href={cta.href}
              className="group mt-9 inline-flex items-center gap-2 text-base font-semibold text-site-ink underline decoration-site-gold/60 decoration-2 underline-offset-4 transition-colors hover:text-site-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
            >
              {cta.label}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
