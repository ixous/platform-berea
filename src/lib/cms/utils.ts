import * as schema from "@/lib/db/schema";
import type { PgTable } from "drizzle-orm/pg-core";

const tableMap: Record<string, PgTable> = {
  pages: schema.pages,
  devotionals: schema.devotionals,
  events: schema.events,
  ministries: schema.ministries,
  serviceMinistries: schema.serviceMinistries,
  biblicalPrograms: schema.biblicalPrograms,
  cells: schema.cells,
  annualVision: schema.annualVision,
  auditorium: schema.auditorium,
  donations: schema.donations,
  contact: schema.contact,
  leadership: schema.users,
};

export function getTable(entityType: string): PgTable {
  const table = tableMap[entityType];
  if (!table) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }
  return table;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 255);
}

export function generateSlug(title: string, existingSlugs: string[] = []): string {
  let slug = slugify(title);
  if (!slug) slug = "sin-titulo";
  let candidate = slug;
  let counter = 1;
  while (existingSlugs.includes(candidate)) {
    candidate = `${slug}-${counter}`;
    counter++;
  }
  return candidate;
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "");
}
