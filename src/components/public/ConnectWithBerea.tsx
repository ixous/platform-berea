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
            <h2 className="mt-5 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-site-ink">
              Conecta con Berea
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-site-muted">
              No tienes que caminar solo. Queremos conocerte, orar contigo y ayudarte a dar tu
              siguiente paso.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col gap-8 lg:gap-10">
          <Reveal>
            <div className="group relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-site-ink shadow-sm sm:aspect-[16/10] lg:aspect-[16/9]">
              <BereaImage
                src={CONNECT_IMAGE.src}
                alt={CONNECT_IMAGE.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="site-sheen" aria-hidden="true" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-site-ink/30 via-transparent to-transparent" />
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {CONNECT_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <Link
                  href={item.href}
                  className="site-card-glow group flex h-full flex-col justify-between gap-6 rounded-2xl border border-site-line bg-site-paper p-7 shadow-sm transition-colors hover:border-site-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold sm:p-8"
                >
                  <div>
                    <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-site-ink transition-colors group-hover:text-site-gold sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-pretty leading-relaxed text-site-muted">
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
