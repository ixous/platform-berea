import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AdminNotFound() {
  return (
    <EmptyState
      title="Página no encontrada"
      description="La página que buscas no existe o fue movida."
      action={
        <Link
          href="/admin"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Volver al Dashboard
        </Link>
      }
    />
  );
}
