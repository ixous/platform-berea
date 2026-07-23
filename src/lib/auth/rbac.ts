import { db } from "@/lib/db";
import { permissions, rolePermissions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function hasPermission(requiredPermission: string): Promise<boolean> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.roleId) return false;

  const userRoleId = session.user.roleId as string;

  const [perm] = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(eq(permissions.slug, requiredPermission))
    .limit(1);

  if (!perm) return false;

  const result = await db
    .select({ id: rolePermissions.roleId })
    .from(rolePermissions)
    .where(and(eq(rolePermissions.roleId, userRoleId), eq(rolePermissions.permissionId, perm.id)))
    .limit(1);

  return result.length > 0;
}
