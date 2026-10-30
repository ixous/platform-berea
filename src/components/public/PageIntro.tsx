import { Reveal } from "./Reveal";

interface PageIntroProps {
  title: string;
  subtitle?: string;
}

export function PageIntro({ title, subtitle }: PageIntroProps) {
  return (
    <section className="relative overflow-hidden bg-site-ink text-white">
      <div className="site-aurora-ink" aria-hidden="true" />
      <div className="site-orb right-[-140px] top-[-120px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[76rem] px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
        <Reveal>
          <div className="max-w-3xl">
            <span className="site-gold-pulse block h-px w-10 bg-site-gold" aria-hidden="true" />
            <h1 className="mt-7 font-display text-balance text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1.04] tracking-[-0.03em]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-white/75 sm:text-xl">
                {subtitle}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
