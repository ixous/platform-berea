import { pgTable, uuid, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const historyMilestones = pgTable(
  "history_milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    year: varchar("year", { length: 10 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    imageUrl: varchar("image_url", { length: 1000 }),
    displayOrder: integer("display_order").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_history_milestones_order").on(table.displayOrder),
    index("idx_history_milestones_status").on(table.status),
    index("idx_history_milestones_deleted_at").on(table.deletedAt),
  ]
);
