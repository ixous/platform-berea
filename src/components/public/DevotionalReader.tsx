"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X, Sparkles, Share2, ExternalLink } from "lucide-react";
import type { DailyDevotional } from "@/lib/public/daily-devotional";

interface Props {
  devotional: DailyDevotional;
  fullContent?: string | null;
  verse?: string | null;
  isBerea?: boolean;
}

const emptySubscribe = () => () => {};

export function DevotionalReader({ devotional, fullContent, verse, isBerea = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const contentToDisplay = fullContent || devotional.description;

  const whatsappMessage = encodeURIComponent(
    `📖 *${devotional.title}*\n\n"${devotional.description}"\n\nLéelo completo aquí: https://www.centrocristianoberea.org`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappMessage}`;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Fondo oscuro con desenfoque de pantalla completa */}
      <div
        className="fixed inset-0 bg-site-ink/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Tarjeta de Lectura */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="devotional-modal-title"
        className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-site-line bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Cabecera del Modal */}
        <div className="flex shrink-0 items-center justify-between border-b border-site-line/80 bg-site-paper px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-site-gold/15 text-site-gold">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-site-gold">
              {isBerea ? "Devocional Berea" : "Devocional Diario · En Contacto"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar devocional"
            className="rounded-full p-2 text-site-muted transition-colors hover:bg-site-line hover:text-site-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido con scroll independiente */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 space-y-6">
          {devotional.formattedDate && (
            <p className="text-xs font-semibold uppercase tracking-wider text-site-muted">
              {devotional.formattedDate}
            </p>
          )}

          <h2
            id="devotional-modal-title"
            className="font-display text-2xl font-extrabold tracking-tight text-site-ink sm:text-3xl"
          >
            {devotional.title}
          </h2>

          {/* Versículo Bíblico */}
          {verse && (
            <div className="rounded-2xl border-l-4 border-site-gold bg-site-paper p-4 italic text-site-ink">
              <p className="text-sm sm:text-base leading-relaxed">&ldquo;{verse}&rdquo;</p>
            </div>
          )}

          {/* Texto Completo del Devocional */}
          <div className="text-site-ink text-base leading-relaxed sm:text-lg sm:leading-loose whitespace-pre-line space-y-4 font-sans">
            {contentToDisplay}
          </div>

          {/* Nota y Enlaces de Cortesía al final del scroll */}
          <div className="mt-8 rounded-2xl border border-site-line bg-site-paper/80 p-5 space-y-3">
            <p className="text-xs leading-relaxed text-site-muted">
              Contenido diario cortesía de{" "}
              <strong className="font-semibold text-site-ink">
                {devotional.author || "Ministerios En Contacto (Dr. Charles Stanley)"}
              </strong>
              .
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={devotional.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-site-ink px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-site-gold hover:text-site-ink"
              >
                <span>Leer devocional en En Contacto</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-site-line bg-white px-4 py-2 text-xs font-semibold text-site-ink transition-colors hover:border-site-gold/50"
              >
                <Share2 className="h-3.5 w-3.5 text-site-gold" />
                <span>Compartir</span>
              </a>
            </div>
          </div>
        </div>

        {/* Pie fijo del Modal */}
        <div className="shrink-0 border-t border-site-line bg-site-paper px-6 py-3.5 text-right sm:px-8">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-xl border border-site-line bg-white px-5 py-2 text-xs font-semibold text-site-ink transition-colors hover:bg-site-paper"
          >
            Cerrar lectura
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-site-gold px-5 py-3 text-sm font-bold text-site-paper shadow-md transition-all duration-200 hover:bg-site-gold/90 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-site-gold/50 active:scale-95"
      >
        <BookOpen className="h-4 w-4" />
        <span>Leer devocional completo</span>
      </button>

      {/* Renderizado mediante Portal en document.body para evitar cualquier conflicto de stacking context y transforms */}
      {isOpen && isClient && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
