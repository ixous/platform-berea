import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntityConfig } from "@/lib/cms/config";
import { getEntity } from "@/lib/cms/actions";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { PageHeader } from "@/components/shared/PageHeader";
import { CmsForm } from "@/components/cms/CmsForm";
import { ArrowLeft } from "lucide-react";

interface EditPageProps {
  params: Promise<{ entityType: string; id: string }>;
}

export default async function EntityEditPage({ params }: EditPageProps) {
  const { entityType, id } = await params;
  const config = getEntityConfig(entityType);

  if (!config) notFound();

  const session = await auth();
  if (!session?.user) notFound();
  const allowed = await hasPermission(config.permission);
  if (!allowed) notFound();

  const record = await getEntity(entityType, id);
  if (!record) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/content/${entityType}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a {config.pluralName}
      </Link>
      <PageHeader title={`Editar ${config.displayName}`} description={`ID: ${id}`} />
      <CmsForm entityType={entityType} config={config} initialData={record} isEditing={true} />
    </div>
  );
}
