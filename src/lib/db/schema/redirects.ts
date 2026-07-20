import { pgTable, uuid, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";

export const redirects = pgTable(
  "redirects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: varchar("source", { length: 500 }).notNull().unique(),
    destination: varchar("destination", { length: 500 }).notNull(),
    type: integer("type").notNull().default(301),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("idx_redirects_deleted_at").on(table.deletedAt)]
);
