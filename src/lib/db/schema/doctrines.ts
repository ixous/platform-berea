import { pgTable, uuid, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const doctrines = pgTable(
  "doctrines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    subtitle: text("subtitle"),
    content: text("content"),
    bibleVerses: text("bible_verses"),
    imageUrl: varchar("image_url", { length: 500 }),
    displayOrder: integer("display_order").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_doctrines_order").on(table.displayOrder),
    index("idx_doctrines_status").on(table.status),
  ]
);
