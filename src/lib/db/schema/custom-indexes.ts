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
