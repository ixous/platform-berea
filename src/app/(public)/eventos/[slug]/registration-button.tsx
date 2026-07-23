"use client";

import { useState } from "react";
import { EventRegistrationForm } from "@/components/public/EventRegistrationForm";
import { CalendarCheck } from "lucide-react";

interface Props {
  eventId: string;
  eventTitle: string;
  capacity: number | null;
  isFull: boolean;
}

export function EventRegistrationButton({ eventId, eventTitle, capacity, isFull }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isFull}
        className="inline-flex items-center gap-2 rounded-xl bg-berea-gold px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CalendarCheck className="h-5 w-5" />
        {isFull ? "Cupo lleno" : "Registrarme"}
      </button>

      <EventRegistrationForm
        eventId={eventId}
        eventTitle={eventTitle}
        capacity={capacity}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
