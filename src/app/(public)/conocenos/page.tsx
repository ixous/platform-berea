import { db } from "@/lib/db";
import {
  institutionalSections,
  historyMilestones,
  doctrines,
  ministries,
  serviceMinistries,
  cells,
  leaders,
} from "@/lib/db/schema";
import { eq, and, isNull, asc } from "drizzle-orm";
import { PageIntro } from "@/components/public/PageIntro";
import { BereaImage } from "@/components/public/BereaImage";
import { Reveal } from "@/components/public/Reveal";
import { BookOpen, Clock, MapPin, User } from "lucide-react";
import { KNOW_INTRO, PASTORS } from "@/lib/public/site-navigation";
import {
  SECTION_IMAGES,
  MINISTRY_IMAGES,
  SERVICE_MINISTRY_IMAGES,
  CELL_IMAGES,
} from "@/lib/public/symbolic-images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conócenos",
  description:
    "Conoce la identidad, creencias y comunidad de Centro Cristiano Berea en Mexicali, Baja California.",
  openGraph: {
    title: "Conócenos | Centro Cristiano Berea",
    description:
      "Conoce la identidad, creencias y comunidad de Centro Cristiano Berea en Mexicali, Baja California.",
  },
};

export default async function ConocenosPage() {
  const [
    sections,
    milestones,
    doctrinalPoints,
    activeMinistries,
    serviceAreas,
    cellGroups,
    leadersList,
  ] = await Promise.all([
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
    db
      .select()
      .from(ministries)
      .where(and(eq(ministries.status, "active"), isNull(ministries.deletedAt)))
      .orderBy(asc(ministries.displayOrder)),
    db
      .select()
      .from(serviceMinistries)
      .where(and(eq(serviceMinistries.status, "published"), isNull(serviceMinistries.deletedAt)))
      .orderBy(asc(serviceMinistries.displayOrder)),
    db
      .select()
      .from(cells)
      .where(and(eq(cells.status, "active"), isNull(cells.deletedAt)))
      .orderBy(asc(cells.name)),
    db
      .select()
      .from(leaders)
      .where(and(eq(leaders.status, "published"), isNull(leaders.deletedAt)))
      .orderBy(asc(leaders.displayOrder)),
  ]);

  const communityEmpty =
    activeMinistries.length === 0 && serviceAreas.length === 0 && cellGroups.length === 0;

  return (
    <>
      <PageIntro title={KNOW_INTRO.title} subtitle={KNOW_INTRO.subtitle} />

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
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl">
                      {imageSrc ? (
                        <BereaImage
                          src={imageSrc}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-site-cream" />
                      )}
                      <div className="site-sheen" aria-hidden="true" />
                    </div>
                  </Reveal>

                  <Reveal delay={140} className={reversed ? "lg:order-1" : ""}>
                    <p className="site-gold-pulse font-display text-sm font-medium tracking-[0.2em] text-site-gold">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-4 font-display text-balance text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-tight tracking-[-0.01em] text-site-ink">
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
                <h2 className="mt-4 font-display text-balance text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-tight tracking-[-0.01em]">
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
                <h2 className="mt-4 font-display text-balance text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-tight tracking-[-0.01em] text-site-ink">
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

      {!communityEmpty && (
        <section id="comunidad" className="relative scroll-mt-24 overflow-hidden bg-site-paper">
          <div className="site-aurora" aria-hidden="true" />
          <div className="site-orb site-orb-blue left-[-130px] top-[-120px]" aria-hidden="true" />

          <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <Reveal>
              <div className="max-w-2xl">
                <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                  Comunidad
                </p>
                <h2 className="mt-4 font-display text-balance text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-tight tracking-[-0.01em] text-site-ink">
                  Hay un lugar para ti
                </h2>
                <p className="mt-5 max-w-xl text-pretty leading-relaxed text-site-muted">
                  Descubre las áreas donde puedes crecer y servir con los dones que Dios te ha dado.
                </p>
              </div>
            </Reveal>

            {activeMinistries.length > 0 && (
              <div className="mt-16">
                <Reveal>
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-site-muted">
                    Ministerios
                  </h3>
                </Reveal>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {activeMinistries.map((m, i) => (
                    <Reveal key={m.id} delay={(i % 3) * 120}>
                      <article className="site-card-glow group overflow-hidden rounded-3xl border border-site-line bg-white">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {MINISTRY_IMAGES[m.slug] ? (
                            <BereaImage
                              src={MINISTRY_IMAGES[m.slug]}
                              alt=""
                              fill
                              className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-site-cream" />
                          )}
                          <div className="site-sheen" aria-hidden="true" />
                        </div>
                        <div className="p-7">
                          <h4 className="font-display text-2xl font-medium text-site-ink">
                            {m.name}
                          </h4>
                          {m.description && (
                            <p className="mt-2 text-sm leading-relaxed text-site-muted">
                              {m.description}
                            </p>
                          )}
                          {m.schedule && (
                            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-site-muted">
                              <Clock className="h-3.5 w-3.5 text-site-gold" aria-hidden="true" />
                              {m.schedule}
                            </p>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {serviceAreas.length > 0 && (
              <div className="mt-20">
                <Reveal>
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-site-muted">
                    Áreas de servicio
                  </h3>
                </Reveal>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {serviceAreas.map((m, i) => (
                    <Reveal key={m.id} delay={(i % 3) * 120}>
                      <article className="site-card-glow group overflow-hidden rounded-3xl border border-site-line bg-white">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {SERVICE_MINISTRY_IMAGES[m.slug] ? (
                            <BereaImage
                              src={SERVICE_MINISTRY_IMAGES[m.slug]}
                              alt=""
                              fill
                              className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-site-cream" />
                          )}
                          <div className="site-sheen" aria-hidden="true" />
                        </div>
                        <div className="p-7">
                          <h4 className="font-display text-2xl font-medium text-site-ink">
                            {m.name}
                          </h4>
                          {m.description && (
                            <p className="mt-2 text-sm leading-relaxed text-site-muted">
                              {m.description}
                            </p>
                          )}
                          {m.leader && (
                            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-site-muted">
                              <User className="h-3.5 w-3.5 text-site-gold" aria-hidden="true" />
                              {m.leader}
                            </p>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {cellGroups.length > 0 && (
              <div className="mt-20">
                <Reveal>
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-site-muted">
                    Células
                  </h3>
                </Reveal>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cellGroups.map((c, i) => (
                    <Reveal key={c.id} delay={(i % 3) * 120}>
                      <article className="site-card-glow group overflow-hidden rounded-3xl border border-site-line bg-white">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {CELL_IMAGES[c.slug] ? (
                            <BereaImage
                              src={CELL_IMAGES[c.slug]}
                              alt=""
                              fill
                              className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-site-cream" />
                          )}
                          <div className="site-sheen" aria-hidden="true" />
                        </div>
                        <div className="p-7">
                          <h4 className="font-display text-2xl font-medium text-site-ink">
                            {c.name}
                          </h4>
                          {c.description && (
                            <p className="mt-2 text-sm leading-relaxed text-site-muted">
                              {c.description}
                            </p>
                          )}
                          <div className="mt-4 space-y-1.5 text-xs font-medium text-site-muted">
                            {c.leader && (
                              <p className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-site-gold" aria-hidden="true" />
                                {c.leader}
                              </p>
                            )}
                            {c.meetingDay && c.meetingTime && (
                              <p className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-site-gold" aria-hidden="true" />
                                {c.meetingDay} · {c.meetingTime}
                              </p>
                            )}
                            {c.address && (
                              <p className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-site-gold" aria-hidden="true" />
                                {c.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-site-cream">
        <div className="site-aurora" aria-hidden="true" />
        <div className="site-orb right-[-130px] bottom-[-120px]" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[76rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
              Pastoral
            </p>
            {leadersList.length > 0 ? (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {leadersList.map((leader) => (
                  <article
                    key={leader.id}
                    className="site-card-glow rounded-3xl border border-site-line bg-site-paper p-8 text-center"
                  >
                    {leader.imageUrl && (
                      <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full">
                        <BereaImage src={leader.imageUrl} alt={leader.name} fill sizes="112px" />
                      </div>
                    )}
                    <h3 className="mt-5 font-display text-2xl font-medium text-site-ink">
                      {leader.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold uppercase tracking-wider text-site-gold">
                      {leader.position}
                    </p>
                    {leader.biography && (
                      <p className="mt-4 text-sm leading-relaxed text-site-muted">
                        {leader.biography}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <article className="relative mt-10 max-w-3xl overflow-hidden rounded-3xl bg-site-ink p-10 text-white">
                <div className="site-aurora-ink" aria-hidden="true" />
                <div className="relative">
                  <h3 className="font-display text-3xl font-medium">{PASTORS.name}</h3>
                  <p className="mt-4 leading-relaxed text-white/70">{PASTORS.verse}</p>
                </div>
              </article>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
