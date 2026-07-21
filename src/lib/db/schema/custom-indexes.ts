// ============================================================
// CUSTOM SQL INDEXES — Full Text Search (GIN + to_tsvector)
// ============================================================
//
// ATENCIÓN:
//   Estos índices NO son procesados automáticamente por Drizzle Kit.
//   Drizzle Kit genera migraciones basándose únicamente en las
//   definiciones de pgTable, no en exports raw de sql``.
//
//   Los índices GIN fueron incluidos manualmente en la migración:
//     drizzle/0000_regular_nehzno.sql
//
//   Este archivo existe únicamente como referencia documental.
//   Si en el futuro se regenera la migración desde cero, estos
//   índices deberán copiarse manualmente al SQL generado.
//
//   Este archivo NO se exporta desde el barrel index.ts del schema.
//
//   Ver DEC-017 en docs/06-development/DECISIONS.md para la política
//   oficial de SQL custom dentro de migraciones.
// ============================================================

import { sql } from "drizzle-orm";

export const ftsPagesIndex = sql`CREATE INDEX IF NOT EXISTS idx_pages_search ON pages USING gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, '')))`;

export const ftsDevotionalsIndex = sql`CREATE INDEX IF NOT EXISTS idx_devotionals_search ON devotionals USING gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(verse, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, '')))`;

export const ftsEventsIndex = sql`CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(additional_info, '')))`;

export const ftsMinistriesIndex = sql`CREATE INDEX IF NOT EXISTS idx_ministries_search ON ministries USING gin (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(leader, '')))`;

export const ftsBiblicalProgramsIndex = sql`CREATE INDEX IF NOT EXISTS idx_biblical_programs_search ON biblical_programs USING gin (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(instructor, '')))`;

export const ftsIndexes = [
  ftsPagesIndex,
  ftsDevotionalsIndex,
  ftsEventsIndex,
  ftsMinistriesIndex,
  ftsBiblicalProgramsIndex,
];
