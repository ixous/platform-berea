import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const institutionalSections = pgTable(
  "institutional_sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageSlug: varchar("page_slug", { length: 255 }).notNull(),
    sectionKey: varchar("section_key", { length: 100 }).notNull(),
    title: varchar("title", { length: 255 }),
    content: text("content"),
    imageUrl: varchar("image_url", { length: 500 }),
    buttonText: varchar("button_text", { length: 255 }),
    buttonHref: varchar("button_href", { length: 500 }),
    displayOrder: integer("display_order").notNull().default(0),
    visible: boolean("visible").notNull().default(true),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_inst_sections_page_slug").on(table.pageSlug),
    index("idx_inst_sections_order").on(table.pageSlug, table.displayOrder),
  ]
);
