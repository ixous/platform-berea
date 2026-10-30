import { db } from "@/lib/db";
import { institutionalSections, historyMilestones, doctrines } from "@/lib/db/schema";
import { and, eq, isNull, asc } from "drizzle-orm";
import { PageIntro } from "@/components/public/PageIntro";
import { BereaImage } from "@/components/public/BereaImage";
import { Reveal } from "@/components/public/Reveal";
import { BookOpen } from "lucide-react";
import { KNOW_INTRO } from "@/lib/public/site-navigation";
import { SECTION_IMAGES } from "@/lib/public/symbolic-images";
import type { Metadata } from "next";

const PASTORAL_TEAM = [
  {
    name: "Julio Cesar Villanueva",
    role: "Pastor",
    initials: "JV",
    photo: "/images/pastoral-julio.png",
    description: "Liderando la iglesia con dedicación y amor desde su fundación.",
  },
  {
    name: "Claudia Davila",
    role: "Esposa del Pastor",
    initials: "CD",
    photo: "/images/pastoral-claudia.png",
    description: "Apoyando el crecimiento espiritual y la vida en comunidad de la congregación.",
  },
];

export const metadata: Metadata = {
  title: "Conócenos",
  description:
    "Conoce la identidad, creencias y pastoral de Centro Cristiano Berea en Mexicali, Baja California.",
  openGraph: {
    title: "Conócenos | Centro Cristiano Berea",
    description:
      "Conoce la identidad, creencias y pastoral de Centro Cristiano Berea en Mexicali, Baja California.",
  },
};

export default async function ConocenosPage() {
  const [sections, milestones, doctrinalPoints] = await Promise.all([
    db
      .select()
      .from(institutionalSections)
      .where(
        and(eq(institutionalSections.visible, true), eq(institutionalSections.status, "published"))
      )
      .orderBy(asc(institutionalSections.displayOrder)),
    db
      .select()
      .from(historyMilestones)
      .where(and(eq(historyMilestones.status, "published"), isNull(historyMilestones.deletedAt)))
      .orderBy(asc(historyMilestones.displayOrder)),
    db
      .select()
      .from(doctrines)
      .where(eq(doctrines.status, "published"))
      .orderBy(asc(doctrines.displayOrder)),
  ]);

  return (
    <>
      <PageIntro
        title={KNOW_INTRO.title}
        subtitle={KNOW_INTRO.subtitle}
        backgroundImage="/images/banner-quienes-somos.png"
      />

      {sections.length > 0 && (
        <section className="relative overflow-hidden bg-site-paper">
          <div className="site-aurora" aria-hidden="true" />
          <div className="site-orb site-orb-blue right-[-140px] top-[-120px]" aria-hidden="true" />

          <div className="relative mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8">
            {sections.map((section, i) => {
              const imageSrc = section.imageUrl || SECTION_IMAGES[section.title || ""];
              const reversed = i % 2 === 1;
              return (
                <div
                  key={section.id}
                  className="grid items-center gap-10 border-b border-site-line py-16 last:border-b-0 lg:grid-cols-2 lg:gap-20 lg:py-24"
                >
                  <Reveal className={reversed ? "lg:order-2" : ""}>
                    <div className="group relative aspect-[4/3] overflow-hidden bg-site-ink rounded-3xl">
                      {imageSrc ? (
                        <BereaImage
                          src={imageSrc}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative h-full w-full overflow-hidden bg-site-ink">
                          <div className="site-aurora-ink" aria-hidden="true" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-2xl font-bold tracking-[0.3em] text-site-gold/40">
                              CCB
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="site-sheen" aria-hidden="true" />
                    </div>
                  </Reveal>

                  <Reveal delay={140} className={reversed ? "lg:order-1" : ""}>
                    <p className="site-gold-pulse font-display text-sm font-medium tracking-[0.2em] text-site-gold">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-4 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-site-ink">
                      {section.title}
                    </h2>
                    <span className="mt-5 block h-px w-12 bg-site-gold" aria-hidden="true" />
                    {section.content && (
                      <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-site-muted">
                        {section.content}
                      </p>
                    )}
                  </Reveal>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {doctrinalPoints.length > 0 && (
        <section
          id="creencias"
          className="relative scroll-mt-24 overflow-hidden bg-site-ink text-white"
        >
          <div className="site-aurora-ink" aria-hidden="true" />
          <div className="site-orb left-[-140px] bottom-[-120px]" aria-hidden="true" />
          <div className="site-orb site-orb-blue right-[-120px] top-[-120px]" aria-hidden="true" />

          <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <Reveal>
              <div className="max-w-2xl">
                <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                  Lo que creemos
                </p>
                <h2 className="mt-4 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                  Nuestras creencias
                </h2>
                <p className="mt-5 max-w-xl text-pretty leading-relaxed text-white/65">
                  Nuestra fe está fundamentada en la Palabra de Dios. Estos son los pilares que nos
                  sostienen como iglesia.
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {doctrinalPoints.map((d, i) => (
                <Reveal key={d.id} delay={(i % 3) * 120}>
                  <article className="site-card-glow border-t border-white/15 pt-7">
                    <p className="font-display text-5xl font-medium leading-none text-site-gold">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div className="mt-5 flex items-start gap-3">
                      <BookOpen
                        className="mt-1 h-4 w-4 shrink-0 text-site-gold/70"
                        aria-hidden="true"
                      />
                      <h3 className="text-lg font-bold">{d.title}</h3>
                    </div>
                    {d.content && (
                      <p className="mt-3 text-sm leading-relaxed text-white/65">{d.content}</p>
                    )}
                    {d.bibleVerses && (
                      <p className="mt-4 text-xs italic leading-relaxed text-white/45">
                        {d.bibleVerses.split("\n").join(" · ")}
                      </p>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {milestones.length > 0 && (
        <section id="historia" className="relative scroll-mt-24 overflow-hidden bg-site-cream">
          <div className="site-aurora" aria-hidden="true" />
          <div className="site-orb right-[-130px] top-[-100px]" aria-hidden="true" />

          <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <Reveal>
              <div className="max-w-2xl">
                <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                  Nuestra historia
                </p>
                <h2 className="mt-4 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-site-ink">
                  Caminando con Dios
                </h2>
              </div>
            </Reveal>

            <ol className="mt-14 grid gap-10 md:grid-cols-3">
              {milestones.map((m, i) => (
                <Reveal key={m.id} delay={i * 130}>
                  <li className="site-card-glow border-t-2 border-site-gold/40 pt-6">
                    <p className="font-display text-6xl font-medium leading-none text-site-ink">
                      {m.year}
                    </p>
                    <h3 className="mt-4 text-lg font-bold text-site-ink">{m.title}</h3>
                    {m.description && (
                      <p className="mt-3 text-sm leading-relaxed text-site-muted">
                        {m.description}
                      </p>
                    )}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-site-ink text-white">
        <div className="site-aurora-ink" aria-hidden="true" />
        <div className="site-orb right-[-130px] top-[-120px]" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <div className="max-w-2xl">
              <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                Pastoral
              </p>
              <h2 className="mt-4 font-display text-balance text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                Nuestros pastores
              </h2>
              <p className="mt-5 max-w-xl text-pretty leading-relaxed text-white/65">
                La familia pastoral que Dios ha puesto para servir y pastorear su rebaño con amor y
                dedicación.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {PASTORAL_TEAM.map((pastor, i) => (
              <Reveal key={pastor.name} delay={i * 140}>
                <article className="site-card-glow rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                  <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border border-site-gold/30 bg-site-gold/10">
                    {pastor.photo ? (
                      <BereaImage src={pastor.photo} alt={pastor.name} fill sizes="144px" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-bold text-site-gold">
                        {pastor.initials}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-extrabold tracking-[-0.02em]">
                    {pastor.name}
                  </h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-site-gold">
                    {pastor.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-white/65">{pastor.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
