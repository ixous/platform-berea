import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { RegistrationList } from "./registration-list";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Registros — ${id.slice(0, 8)}...`,
    description: "Gestiona los registros de asistentes a este evento.",
  };
}

export default async function EventRegistrationsPage({ params, searchParams }: Props) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Registros del Evento"
        description="Listado de personas registradas para este evento."
      />
      <Suspense fallback={<LoadingSpinner />}>
        <RegistrationList params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
