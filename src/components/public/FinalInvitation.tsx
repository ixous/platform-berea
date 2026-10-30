import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

interface FinalInvitationProps {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
}

export function FinalInvitation({ title, description, cta }: FinalInvitationProps) {
  return (
    <section className="relative overflow-hidden bg-site-ink text-white">
      <div className="site-aurora-ink" aria-hidden="true" />
      <div className="site-orb left-[-120px] top-[-100px]" aria-hidden="true" />
      <div className="site-orb site-orb-blue bottom-[-140px] right-[-120px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[68rem] px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <Reveal>
          <span className="site-gold-pulse mx-auto block h-px w-12 bg-site-gold" aria-hidden="true" />
          <h2 className="mx-auto mt-8 max-w-2xl font-display text-balance text-[clamp(2rem,5vw,3.6rem)] font-medium leading-tight tracking-[-0.02em]">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70">
              {description}
            </p>
          )}
          {cta && (
            <Link
              href={cta.href}
              className="relative mt-10 inline-flex items-center gap-2 overflow-hidden rounded-full bg-site-gold px-8 py-4 text-base font-bold text-site-ink transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold focus-visible:ring-offset-2 focus-visible:ring-offset-site-ink"
            >
              <span className="site-sheen" aria-hidden="true" />
              <span className="relative z-10 inline-flex items-center gap-2">
                {cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
