import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { CmsStatusBadge } from "@/components/cms/CmsStatusBadge";
import { getSubmission } from "@/actions/contact";
import { ContactReplyForm } from "./reply-form";
import { StatusActions } from "./status-actions";

interface ContactDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const { id } = await params;

  let item;
  try {
    item = await getSubmission(id);
  } catch {
    redirect("/admin/login");
  }

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/contact"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Bandeja de Entrada
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <PageHeader
          title={`Solicitud de ${item.name}`}
          description={`Recibida el ${new Date(item.createdAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        />
        <CmsStatusBadge status={item.status} className="shrink-0" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Mensaje">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Asunto</dt>
                <dd className="font-medium text-right max-w-[70%]">{item.subject}</dd>
              </div>
              <div className="border-t pt-3">
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {item.message}
                </dd>
              </div>
            </dl>
          </SectionCard>

          {item.replyMessage && (
            <SectionCard title="Respuesta enviada">
              <div className="rounded-lg bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
                {item.replyMessage}
              </div>
              {item.repliedAt && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Respondido el{" "}
                  {new Date(item.repliedAt).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </SectionCard>
          )}

          {item.status !== "replied" && item.status !== "archived" && (
            <SectionCard title="Responder">
              <ContactReplyForm id={item.id} />
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <SectionCard title="Remitente">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Nombre</dt>
                <dd className="font-medium text-right">{item.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-right">
                  <a
                    href={`mailto:${item.email}`}
                    className="text-primary transition-colors hover:underline"
                  >
                    {item.email}
                  </a>
                </dd>
              </div>
              {item.phone && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Teléfono</dt>
                  <dd className="font-medium text-right">{item.phone}</dd>
                </div>
              )}
            </dl>
          </SectionCard>

          <SectionCard title="Acciones">
            <StatusActions id={item.id} currentStatus={item.status} />
          </SectionCard>

          <SectionCard title="Metadatos">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono text-xs text-right">{item.id.slice(0, 8)}...</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">IP</dt>
                <dd className="text-right">{item.ipAddress || "—"}</dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
