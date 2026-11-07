"use client";

import { useActionState, useEffect } from "react";
import { submitCellRequest, type SubmitCellState } from "@/actions/cells";
import {
  Users,
  MapPin,
  Phone,
  User,
  HeartHandshake,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: SubmitCellState = { success: false };

export function CellConnectionFunnel() {
  const [state, formAction, isPending] = useActionState(
    submitCellRequest,
    initialState
  );

  useEffect(() => {
    if (state.success && state.whatsappUrl) {
      // Intento de redirección automática suave a WhatsApp
      const timer = setTimeout(() => {
        window.open(state.whatsappUrl, "_blank", "noopener,noreferrer");
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.whatsappUrl]);

  return (
    <div
      id="conectar-celula"
      className="relative overflow-hidden rounded-3xl border border-site-gold/30 bg-gradient-to-br from-white via-site-paper to-site-gold/10 p-6 sm:p-10 shadow-lg"
    >
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-site-gold/10 blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-site-gold/30 bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B38728] shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Embudo de Conexión Berea</span>
        </div>

        <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-site-ink">
          Encuentra tu Célula cerca de ti
        </h2>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-site-muted">
          No camines solo. Déjanos tu WhatsApp y la colonia donde vives en Mexicali;
          guardaremos tu contacto para darte seguimiento y te conectaremos al
          instante con nuestro coordinador de grupos.
        </p>
      </div>

      <div className="mt-8 max-w-xl mx-auto">
        {state.success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
            <h3 className="mt-4 text-xl font-bold text-emerald-900">
              ¡Tu contacto ha sido guardado con éxito!
            </h3>
            <p className="mt-2 text-sm text-emerald-800 leading-relaxed">
              Tus datos ya están registrados en el sistema de Berea. A continuación se abrirá WhatsApp para enlazar tu mensaje directamente con el coordinador.
            </p>

            {state.whatsappUrl && (
              <div className="mt-6 space-y-3">
                <a
                  href={state.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#20ba59] active:scale-[0.98] transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Abrir WhatsApp Ahora</span>
                </a>
                <p className="text-xs text-emerald-700">
                  (Si no se abrió automáticamente, presiona el botón verde de arriba)
                </p>
              </div>
            )}
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <p>{state.error}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cell-name"
                  className="block text-xs font-bold uppercase tracking-wider text-site-ink"
                >
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-site-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="cell-name"
                    name="name"
                    type="text"
                    required
                    defaultValue={state.fields?.name || ""}
                    placeholder="Ej. Carlos Mendoza"
                    className="block w-full rounded-xl border border-site-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-site-ink outline-none transition-colors placeholder:text-site-muted/60 focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cell-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-site-ink"
                >
                  WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-site-muted">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="cell-phone"
                    name="phone"
                    type="tel"
                    required
                    defaultValue={state.fields?.phone || ""}
                    placeholder="686 123 4567"
                    className="block w-full rounded-xl border border-site-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-site-ink outline-none transition-colors placeholder:text-site-muted/60 focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="cell-neighborhood"
                className="block text-xs font-bold uppercase tracking-wider text-site-ink"
              >
                Colonia o Zona de Mexicali <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-site-muted">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  id="cell-neighborhood"
                  name="neighborhood"
                  type="text"
                  required
                  defaultValue={state.fields?.neighborhood || ""}
                  placeholder="Ej. Palaco, Villanova, González Ortega, San Pedro, Valle del Puebla..."
                  className="block w-full rounded-xl border border-site-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-site-ink outline-none transition-colors placeholder:text-site-muted/60 focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cell-type"
                  className="block text-xs font-bold uppercase tracking-wider text-site-ink"
                >
                  Tipo de grupo que buscas
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-site-muted">
                    <Users className="h-4 w-4" />
                  </div>
                  <select
                    id="cell-type"
                    name="cellType"
                    defaultValue={state.fields?.cellType || "Familiar"}
                    className="block w-full rounded-xl border border-site-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-site-ink outline-none transition-colors focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20"
                  >
                    <option value="Familiar">Familiar (Abierto a todos)</option>
                    <option value="Matrimonios">Matrimonios y Parejas</option>
                    <option value="Jóvenes">Jóvenes (Prepas / Universidad)</option>
                    <option value="Mujeres">Mujeres</option>
                    <option value="Hombres">Hombres</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cell-schedule"
                  className="block text-xs font-bold uppercase tracking-wider text-site-ink"
                >
                  Horario preferido (Opcional)
                </label>
                <input
                  id="cell-schedule"
                  name="preferredSchedule"
                  type="text"
                  defaultValue={state.fields?.preferredSchedule || ""}
                  placeholder="Ej. Miércoles por la tarde, Jueves 7pm..."
                  className="mt-1 block w-full rounded-xl border border-site-line bg-white px-3.5 py-2.5 text-sm text-site-ink outline-none transition-colors placeholder:text-site-muted/60 focus:border-[#B38728] focus:ring-2 focus:ring-[#B38728]/20"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0F172A] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all",
                  "hover:bg-[#1E293B] active:scale-[0.99] cursor-pointer",
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#D4AF37]" />
                    <span>Guardando y conectando con WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="h-4 w-4 text-[#D4AF37]" />
                    <span>Conectar con mi Célula por WhatsApp</span>
                    <MessageCircle className="h-4 w-4 text-[#25D366] ml-1" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-[11px] text-site-muted pt-1">
              🔒 Tus datos son confidenciales y se utilizarán únicamente para coordinar tu integración a una célula de Centro Cristiano Berea.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
