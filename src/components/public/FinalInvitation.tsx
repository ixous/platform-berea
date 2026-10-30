import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FinalInvitationProps {
  title: string;
  description?: string;
  cta?: { label: string; href: string };
}

export function FinalInvitation({ title, description, cta }: FinalInvitationProps) {
  return (
    <section className="bg-site-ink text-white">
      <div className="mx-auto w-full max-w-[68rem] px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <span className="mx-auto block h-px w-12 bg-site-gold" aria-hidden="true" />
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
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-site-gold px-8 py-4 text-base font-semibold text-site-ink transition-colors hover:bg-site-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold focus-visible:ring-offset-2 focus-visible:ring-offset-site-ink"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
