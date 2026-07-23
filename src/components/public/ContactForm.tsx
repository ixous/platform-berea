"use client";

import { useActionState } from "react";
import { submitContact, type SubmitContactState } from "@/actions/contact";
import { TurnstileWidget } from "@/components/public/turnstile";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState: SubmitContactState = { success: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-xl font-bold text-emerald-800">¡Mensaje enviado!</h3>
        <p className="mt-2 text-sm text-emerald-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-berea-navy">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={state.fields?.name || ""}
            className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm text-berea-navy outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-berea-navy">
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={state.fields?.email || ""}
            className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm text-berea-navy outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
            placeholder="tu@correo.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-berea-navy">
          Teléfono
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={state.fields?.phone || ""}
          className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm text-berea-navy outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
          placeholder="+52 686 123 4567"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-berea-navy">
          Asunto <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          defaultValue={state.fields?.subject || ""}
          className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm text-berea-navy outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20"
          placeholder="¿Sobre qué deseas contactarnos?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-berea-navy">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={state.fields?.message || ""}
          className="mt-1 block w-full rounded-lg border border-berea-border bg-white px-4 py-2.5 text-sm text-berea-navy outline-none transition-colors placeholder:text-berea-muted focus:border-berea-gold focus:ring-2 focus:ring-berea-gold/20 resize-y"
          placeholder="Escribe tu mensaje aquí..."
        />
      </div>

      <TurnstileWidget />

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-berea-gold px-6 py-3 text-sm font-semibold text-white transition-all",
          "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berea-gold/50",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar mensaje
          </>
        )}
      </button>
    </form>
  );
}
