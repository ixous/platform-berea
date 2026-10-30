interface PageIntroProps {
  title: string;
  subtitle?: string;
}

export function PageIntro({ title, subtitle }: PageIntroProps) {
  return (
    <section className="bg-site-ink text-white">
      <div className="mx-auto w-full max-w-[76rem] px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
        <div className="max-w-3xl">
          <span className="block h-px w-10 bg-site-gold" aria-hidden="true" />
          <h1 className="mt-7 font-display text-balance text-[clamp(2.3rem,5.5vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.02em]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
