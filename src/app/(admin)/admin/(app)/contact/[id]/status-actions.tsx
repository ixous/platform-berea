"use client";

import { useActionState } from "react";
import { updateSubmissionStatus } from "@/actions/contact";
import { Loader2, AlertCircle, CheckCircle2, Eye, Archive, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusActionsProps {
  id: string;
  currentStatus: string;
}

const initialState: { success: boolean; error?: string } = { success: false };

export function StatusActions({ id, currentStatus }: StatusActionsProps) {
  return (
    <div className="space-y-2">
      {currentStatus === "pending" && (
        <StatusButton
          id={id}
          newStatus="read"
          icon={<Eye className="h-4 w-4" />}
          label="Marcar como leído"
        />
      )}
      {currentStatus === "archived" && (
        <StatusButton
          id={id}
          newStatus="pending"
          icon={<MessageSquare className="h-4 w-4" />}
          label="Restaurar"
        />
      )}
      {currentStatus !== "archived" && (
        <StatusButton
          id={id}
          newStatus="archived"
          icon={<Archive className="h-4 w-4" />}
          label="Archivar"
          variant="secondary"
        />
      )}
    </div>
  );
}

function StatusButton({
  id,
  newStatus,
  icon,
  label,
  variant = "default",
}: {
  id: string;
  newStatus: string;
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "secondary";
}) {
  const [state, formAction, isPending] = useActionState(
    () => updateSubmissionStatus(id, newStatus),
    initialState
  );

  if (state.success) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-2 text-sm text-emerald-700">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Actualizado
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state.error && (
        <div className="mb-2 flex items-start gap-2 rounded-md bg-red-50 p-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-opacity",
          "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
          variant === "default"
            ? "bg-primary text-primary-foreground"
            : "border bg-background text-foreground hover:bg-muted"
        )}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {label}
      </button>
    </form>
  );
}
