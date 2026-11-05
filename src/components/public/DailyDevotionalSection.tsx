import Link from "next/link";
import { Sparkles, ExternalLink, Share2, BookOpen } from "lucide-react";
import { BereaImage } from "./BereaImage";
import { Reveal } from "./Reveal";
import { DevotionalAudioPlayer } from "./DevotionalAudioPlayer";
import { DevotionalReader } from "./DevotionalReader";
import type { DailyDevotional } from "@/lib/public/daily-devotional";

interface Props {
  devotional: DailyDevotional | null;
  verse?: string | null;
  fullContent?: string | null;
}

export function DailyDevotionalSection({ devotional, verse, fullContent }: Props) {
  if (!devotional) return null;

  const whatsappMessage = encodeURIComponent(
    `📖 *Devocional de Hoy: ${devotional.title}*\n\n"${devotional.description}"\n\n🎧 Escúchalo completo aquí: https://www.centrocristianoberea.org`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  return (
    <section className="relative overflow-hidden bg-site-paper py-20 sm:py-24">
      <div className="site-aurora" aria-hidden="true" />
      <div className="site-orb site-orb-gold right-[-100px] top-[10%]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-site-gold/15 text-site-gold">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                Palabra Para Hoy · Devocional Diario
              </p>
            </div>
            {devotional.formattedDate && (
              <span className="rounded-full border border-site-line bg-white/70 px-3.5 py-1 text-xs font-semibold text-site-muted backdrop-blur-sm">
                {devotional.formattedDate}
              </span>
            )}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Columna Principal de Contenido */}
          <div className="space-y-6 lg:col-span-7">
            <Reveal delay={100}>
              <h2 className="font-display text-balance text-[clamp(2rem,3.8vw,3.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-site-ink">
                {devotional.title}
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <div className="relative border-l-2 border-site-gold/40 pl-5 sm:pl-6">
                <p className="text-pretty text-lg leading-relaxed text-site-muted sm:text-xl sm:leading-relaxed">
                  &ldquo;{devotional.description}&rdquo;
                </p>
              </div>
            </Reveal>

            {devotional.audioUrl && (
              <Reveal delay={200}>
                <DevotionalAudioPlayer
                  audioUrl={devotional.audioUrl}
                  durationText={devotional.durationText}
                  title={devotional.title}
                />
              </Reveal>
            )}

            <Reveal delay={250}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <DevotionalReader
                  devotional={devotional}
                  verse={verse}
                  fullContent={fullContent}
                />

                <a
                  href={devotional.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-site-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-site-gold hover:text-site-ink"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Leer devocional en En Contacto</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Compartir devocional por WhatsApp"
                  className="inline-flex items-center gap-2 rounded-xl border border-site-line bg-white/80 px-4 py-3 text-sm font-semibold text-site-ink backdrop-blur-sm transition-colors hover:border-site-gold/50 hover:bg-white"
                >
                  <Share2 className="h-4 w-4 text-site-gold" />
                  <span>Compartir</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <p className="text-xs text-site-muted">
                Contenido diario cortesía de{" "}
                <strong className="font-semibold text-site-ink">
                  Ministerios En Contacto (Dr. Charles Stanley)
                </strong>
                .
              </p>
            </Reveal>
          </div>

          {/* Columna Visual / Imagen */}
          <div className="lg:col-span-5">
            <Reveal delay={180}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-site-line bg-site-ink shadow-xl sm:aspect-[16/10] lg:aspect-[4/3]">
                {devotional.imageUrl ? (
                  <BereaImage
                    src={devotional.imageUrl}
                    alt={devotional.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center text-white">
                    <BookOpen className="h-16 w-16 text-site-gold/60" />
                    <p className="mt-4 font-display text-xl font-bold">Meditaciones Diarias</p>
                    <p className="mt-1 text-xs text-white/70">Dr. Charles Stanley</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-site-ink/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-site-ink/80 p-3.5 backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-site-gold">
                    En Contacto Global
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs font-medium text-white/90">
                    {devotional.title}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
