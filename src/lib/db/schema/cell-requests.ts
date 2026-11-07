import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { cells } from "./cells";

export const cellRequests = pgTable(
  "cell_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }),
    neighborhood: varchar("neighborhood", { length: 255 }).notNull(),
    cellType: varchar("cell_type", { length: 100 }).default("familiar"),
    preferredSchedule: varchar("preferred_schedule", { length: 100 }),
    notes: text("notes"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    assignedCellId: uuid("assigned_cell_id").references(() => cells.id, {
      onDelete: "set null",
    }),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_cell_requests_status").on(table.status),
    index("idx_cell_requests_created_at").on(table.createdAt),
    index("idx_cell_requests_neighborhood").on(table.neighborhood),
  ]
);

export type CellRequest = typeof cellRequests.$inferSelect;
export type NewCellRequest = typeof cellRequests.$inferInsert;
