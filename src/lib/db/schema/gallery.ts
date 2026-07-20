import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const gallery = pgTable(
  "gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    entityType: varchar("entity_type", { length: 50 }),
    entityId: uuid("entity_id"),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("idx_gallery_deleted_at").on(table.deletedAt)]
);
