import { pgTable, uuid, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const homepageServices = pgTable(
  "homepage_services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    day: varchar("day", { length: 50 }),
    time: varchar("time", { length: 50 }),
    description: text("description"),
    icon: varchar("icon", { length: 50 }),
    link: varchar("link", { length: 255 }),
    displayOrder: integer("display_order").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_homepage_services_status").on(table.status),
    index("idx_homepage_services_display_order").on(table.displayOrder),
    index("idx_homepage_services_deleted_at").on(table.deletedAt),
  ]
);
