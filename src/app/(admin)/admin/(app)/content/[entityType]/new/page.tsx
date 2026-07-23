import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntityConfig } from "@/lib/cms/config";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/rbac";
import { PageHeader } from "@/components/shared/PageHeader";
import { CmsForm } from "@/components/cms/CmsForm";
import { ArrowLeft } from "lucide-react";

interface CreatePageProps {
  params: Promise<{ entityType: string }>;
}

export default async function EntityCreatePage({ params }: CreatePageProps) {
  const { entityType } = await params;
  const config = getEntityConfig(entityType);

  if (!config) notFound();

  const session = await auth();
  if (!session?.user) notFound();
  const allowed = await hasPermission(config.permission);
  if (!allowed) notFound();

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/content/${entityType}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a {config.pluralName}
      </Link>
      <PageHeader
        title={`Crear ${config.displayName}`}
        description={`Completa la información para crear un nuevo registro de ${config.displayName.toLowerCase()}.`}
      />
      <CmsForm entityType={entityType} config={config} isEditing={false} />
    </div>
  );
}
