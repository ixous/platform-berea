"use client";

import { useTransition } from "react";
import { updateRegistrationStatus } from "@/actions/events";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  registrationId: string;
  currentStatus: string;
}

export function RegistrationActions({ registrationId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      await updateRegistrationStatus(registrationId, newStatus);
      router.refresh();
    });
  };

  const actions: { status: string; label: string; variant: string }[] = [];

  if (currentStatus === "confirmed") {
    actions.push(
      {
        status: "attended",
        label: "Asistió",
        variant: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      {
        status: "no-show",
        label: "No Asistió",
        variant: "bg-amber-100 text-amber-700 hover:bg-amber-200",
      },
      {
        status: "cancelled",
        label: "Cancelar",
        variant: "bg-red-100 text-red-700 hover:bg-red-200",
      }
    );
  } else if (currentStatus === "cancelled") {
    actions.push({
      status: "confirmed",
      label: "Reconfirmar",
      variant: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    });
  } else if (currentStatus === "attended" || currentStatus === "no-show") {
    actions.push(
      {
        status: "confirmed",
        label: "Revertir",
        variant: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
      {
        status: "cancelled",
        label: "Cancelar",
        variant: "bg-red-100 text-red-700 hover:bg-red-200",
      }
    );
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-berea-muted" />}
      {actions.map((action) => (
        <button
          key={action.status}
          type="button"
          onClick={() => handleStatusChange(action.status)}
          disabled={isPending}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
            action.variant
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
