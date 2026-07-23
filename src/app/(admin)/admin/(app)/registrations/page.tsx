import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EventRegistrationList } from "./event-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registros a Eventos",
  description: "Gestiona los registros de los asistentes a eventos.",
};

export default function RegistrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Registros a Eventos"
        description="Listado de eventos con registros de asistentes."
      />
      <Suspense fallback={<LoadingSpinner />}>
        <EventRegistrationList />
      </Suspense>
    </div>
  );
}
