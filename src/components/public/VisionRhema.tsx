import { BereaImage } from "./BereaImage";
import { Reveal } from "./Reveal";

interface VisionRhemaProps {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  tagline?: string;
  description?: string;
}

export function VisionRhema({
  imageSrc = "/images/vision-rhema.png",
  imageAlt = "Visión 2026: RHEMA - Centro Cristiano Berea",
  title = "RHEMA",
  tagline = "Visión 2026",
  description = "Una palabra viva, revelada y eficaz de Dios para nuestra congregación en este nuevo tiempo.",
}: VisionRhemaProps) {
  return (
    <section
      id="vision"
      className="relative scroll-mt-24 overflow-hidden bg-site-paper py-20 sm:py-24 lg:py-28"
    >
      <div className="site-aurora" aria-hidden="true" />
      <div className="site-orb left-[-120px] top-[-80px]" aria-hidden="true" />
      <div className="site-orb site-orb-blue right-[-100px] bottom-[-100px]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-site-gold/40 bg-site-gold/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-site-gold animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                {tagline}
              </p>
            </div>
            <h2 className="mt-5 font-display text-balance text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-site-ink">
              {title}
            </h2>
            {description && (
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-site-muted">
                {description}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="group relative mx-auto mt-12 aspect-[1169/776] w-full max-w-4xl overflow-hidden rounded-3xl border border-site-line bg-site-ink shadow-xl">
            <BereaImage
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
            />
            <div className="site-sheen" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
