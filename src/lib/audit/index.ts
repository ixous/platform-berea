import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";

interface AuditEntry {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: string | null;
}

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: entry.userId || null,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId || null,
      details: entry.details || null,
    });
  } catch {
    console.error("[Audit] Failed to write audit log:", entry.action);
  }
}
