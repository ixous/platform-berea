import { PageHeader } from "@/components/shared/PageHeader";
import { ContactList } from "./contact-list";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bandeja de Entrada",
  description: "Gestiona las solicitudes de contacto recibidas.",
};

interface ContactPageProps {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bandeja de Entrada"
        description="Solicitudes de contacto recibidas a través del formulario público."
      />
      <Suspense fallback={<LoadingSpinner />}>
        <ContactList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
