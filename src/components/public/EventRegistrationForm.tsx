"use client";

import { useActionState } from "react";
import { registerForEvent, type RegisterEventState } from "@/actions/events";
import { TurnstileWidget } from "@/components/public/turnstile";
import { Send, CheckCircle, AlertCircle, Loader2, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: RegisterEventState = { success: false };

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  capacity: number | null;
  open: boolean;
  onClose: () => void;
}

export function EventRegistrationForm({ eventId, eventTitle, capacity, open, onClose }: EventRegistrationFormProps) {
  const [state, formAction, isPending] = useActionState(registerForEvent, initialState);

  if (!open) return null;

  if (state.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div
          className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <CheckCircle className="mx-auto h-14 w-14 text-emerald-500" />
          <h3 className="mt-4 text-xl font-bold text-emerald-800">¡Registro confirmado!</h3>
          <p className="mt-2 text-sm text-emerald-700">{state.message}</p>
          <button
            onClick={onClose}
            className="mt-6 rounded-lg bg-berea-navy px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-berea-navy">Registrarse</h3>
            <p className="text-sm text-berea-muted">{eventTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-berea-muted transition-colors hover:bg-berea-light hover:text-berea-navy"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form action={formAction} className="space-y-5 px-6 py-6">
          <input type="hidden" name="eventId" value={eventId} />

          {state.error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{state.error}</p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="reg-name" className="block text-sm font-medium text-berea-navy">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                defaultValue={state.fields?.name || ""}
                className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-berea-navy">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                defaultValue={state.fields?.email || ""}
                className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label htmlFor="reg-phone" className="block text-sm font-medium text-berea-navy">
                Teléfono
              </label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                defaultValue={state.fields?.phone || ""}
                className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
                placeholder="+52 686 123 4567"
              />
            </div>
            <div>
              <label htmlFor="reg-guests" className="block text-sm font-medium text-berea-navy">
                Acompañantes
              </label>
              <div className="relative mt-1">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-berea-muted" />
                <input
                  id="reg-guests"
                  name="guests"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={state.fields?.guests || "1"}
                  className="block w-full rounded-lg border border-berea-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
                />
              </div>
              {capacity && (
                <p className="mt-1 text-xs text-berea-muted">
                  Capacidad disponible
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reg-notes" className="block text-sm font-medium text-berea-navy">
              Notas (opcional)
            </label>
            <textarea
              id="reg-notes"
              name="notes"
              rows={3}
              defaultValue={state.fields?.notes || ""}
              className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20 resize-y"
              placeholder="Alergias, necesidades especiales, etc."
            />
          </div>

          <TurnstileWidget />

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-berea-gold px-6 py-3 text-sm font-semibold text-white transition-all",
              "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berea-gold/50",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Confirmar registro
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
