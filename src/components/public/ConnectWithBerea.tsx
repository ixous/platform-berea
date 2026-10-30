import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BereaImage } from "./BereaImage";
import { Reveal } from "./Reveal";
import { CONNECT_IMAGE, CONNECT_ITEMS } from "@/lib/public/site-navigation";

export function ConnectWithBerea() {
  return (
    <section id="conecta" className="relative scroll-mt-24 overflow-hidden bg-site-cream">
      <div className="site-aurora" aria-hidden="true" />
      <div className="site-orb left-[-130px] bottom-[-100px]" aria-hidden="true" />
      <div className="site-orb site-orb-blue right-[-120px] top-[-120px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <p className="site-gold-pulse text-xs font-semibold uppercase tracking-[0.22em] text-site-gold">
              Siguientes pasos
            </p>
            <h2 className="mt-5 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-site-ink">
              Conecta con Berea
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-site-muted">
              No tienes que caminar solo. Queremos conocerte, orar contigo y ayudarte a dar tu
              siguiente paso.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-site-ink sm:aspect-[4/5] lg:aspect-auto lg:min-h-full">
              <BereaImage
                src={CONNECT_IMAGE.src}
                alt={CONNECT_IMAGE.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="site-sheen" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-site-ink/25 to-transparent" />
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {CONNECT_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <Link
                  href={item.href}
                  className="site-card-glow group flex flex-1 flex-col justify-between gap-6 rounded-2xl border border-site-line bg-site-paper p-7 shadow-sm transition-colors hover:border-site-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold sm:p-9"
                >
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-site-ink transition-colors group-hover:text-site-gold">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-pretty leading-relaxed text-site-muted">
                      {item.text}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-site-ink transition-colors group-hover:text-site-gold">
                    {item.action}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
