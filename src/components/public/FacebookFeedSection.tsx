import { Reveal } from "./Reveal";
import { ExternalLink, Radio, MessageCircle, Heart, Bell } from "lucide-react";

export function FacebookFeedSection() {
  return (
    <section className="relative overflow-hidden bg-site-paper py-20 sm:py-24">
      <div className="site-aurora" aria-hidden="true" />
      <div className="site-orb site-orb-blue left-[-120px] top-[15%]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
                <Radio className="h-4 w-4 animate-pulse" />
              </span>
              <p className="site-gold-pulse text-xs font-bold uppercase tracking-[0.24em] text-site-gold">
                Comunidad en Vivo
              </p>
            </div>
            <h2 className="mt-4 font-display text-balance text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-site-ink">
              Lo que sucede en casa
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-site-muted">
              Sigue las publicaciones, fotos de eventos, avisos de actividades y transmisiones de cultos
              en vivo compartidas directamente por nuestro equipo de multimedia.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Columna Izquierda: Feed Oficial de Facebook Embebido */}
          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-3xl border border-site-line bg-white shadow-xl">
                <div className="border-b border-site-line bg-site-paper px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white font-bold text-sm shadow-sm">
                      f
                    </div>
                    <div>
                      <p className="text-sm font-bold text-site-ink">Centro Cristiano Berea</p>
                      <p className="text-xs text-site-muted">@centrocristianobereamxli · En vivo</p>
                    </div>
                  </div>

                  <a
                    href="https://www.facebook.com/centrocristianobereamxli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1877F2]/10 px-3.5 py-1 text-xs font-semibold text-[#1877F2] transition-colors hover:bg-[#1877F2] hover:text-white"
                  >
                    <span>Seguir página</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Contenedor del Plugin Oficial de Facebook */}
                <div className="relative min-h-[550px] w-full overflow-hidden bg-white p-2 sm:p-4">
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcentrocristianobereamxli&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                    width="100%"
                    height="600"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Muro en vivo de Facebook de Centro Cristiano Berea"
                    className="w-full rounded-2xl"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Columna Derecha: Tarjetas de Conexión Multimedia */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal delay={180}>
              <div className="rounded-3xl border border-site-line bg-white p-7 shadow-sm transition-colors hover:border-site-gold/50">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                  <Radio className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold text-site-ink">
                  Transmisiones de Cultos en Vivo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-site-muted">
                  Conéctate a nuestras reuniones en tiempo real cada semana:
                </p>
                <div className="mt-4 space-y-2 rounded-2xl bg-site-paper p-4 text-xs font-semibold text-site-ink">
                  <div className="flex items-center justify-between">
                    <span>Culto Dominical:</span>
                    <span className="text-site-gold">Domingos 11:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reunión de Oración y Doctrina:</span>
                    <span className="text-site-gold">Miércoles 7:00 PM</span>
                  </div>
                </div>
                <a
                  href="https://www.facebook.com/centrocristianobereamxli/live_videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700"
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span>Ver Transmisiones en Directo</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="rounded-3xl border border-site-line bg-white p-7 shadow-sm transition-colors hover:border-site-gold/50">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1877F2]/10 text-[#1877F2]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold text-site-ink">
                  Peticiones de Oración por Messenger
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-site-muted">
                  ¿Necesitas oración o tienes alguna duda? Escribe directamente al equipo pastoral y de
                  bienvenida en Facebook.
                </p>
                <a
                  href="https://m.me/centrocristianobereamxli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-site-line bg-site-paper px-4 py-2.5 text-xs font-bold text-site-ink transition-colors hover:border-[#1877F2] hover:text-[#1877F2]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Enviar Mensaje a Berea</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="rounded-3xl border border-site-gold/40 bg-gradient-to-br from-site-paper via-white to-site-gold/10 p-7">
                <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-site-gold">
                  <Bell className="h-4 w-4" />
                  <span>No te pierdas ninguna novedad</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-site-muted">
                  Activa las notificaciones en la página oficial para recibir recordatorios antes de cada
                  evento o transmisión.
                </p>
                <a
                  href="https://www.facebook.com/centrocristianobereamxli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-site-ink px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-site-gold hover:text-site-ink"
                >
                  <Heart className="h-3.5 w-3.5 text-site-gold" />
                  <span>Ir a Facebook @centrocristianobereamxli</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
