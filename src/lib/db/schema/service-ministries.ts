import { pgTable, uuid, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const serviceMinistries = pgTable(
  "service_ministries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    leader: varchar("leader", { length: 255 }),
    schedule: text("schedule"),
    location: varchar("location", { length: 255 }),
    contactInfo: text("contact_info"),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    displayOrder: integer("display_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_service_ministries_status").on(table.status),
    index("idx_service_ministries_display_order").on(table.displayOrder),
    index("idx_service_ministries_deleted_at").on(table.deletedAt),
  ]
);
