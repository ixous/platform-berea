import { pgTable, uuid, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const leaders = pgTable(
  "leaders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    position: varchar("position", { length: 255 }).notNull(),
    biography: text("biography"),
    imageUrl: varchar("image_url", { length: 500 }),
    displayOrder: integer("display_order").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_leaders_status").on(table.status),
    index("idx_leaders_display_order").on(table.displayOrder),
    index("idx_leaders_deleted_at").on(table.deletedAt),
  ]
);
