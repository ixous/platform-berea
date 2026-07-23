"use client";

import { useActionState } from "react";
import { replyToSubmission } from "@/actions/contact";
import { Send, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactReplyFormProps {
  id: string;
}

const initialState: { success: boolean; error?: string } = { success: false };

export function ContactReplyForm({ id }: ContactReplyFormProps) {
  const [state, formAction, isPending] = useActionState(
    (_prev: typeof initialState, formData: FormData) => replyToSubmission(id, formData),
    initialState
  );

  if (state.success) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
        <CheckCircle className="h-4 w-4 shrink-0" />
        Respuesta enviada correctamente.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {state.error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <textarea
        name="message"
        rows={4}
        required
        placeholder="Escribe tu respuesta..."
        className="block w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-y"
      />

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity",
          "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
            Enviar respuesta
          </>
        )}
      </button>
    </form>
  );
}
