import { pgTable, uuid, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const cells = pgTable(
  "cells",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    type: varchar("type", { length: 50 }),
    leader: varchar("leader", { length: 255 }),
    coLeader: varchar("co_leader", { length: 255 }),
    meetingDay: varchar("meeting_day", { length: 20 }),
    meetingTime: varchar("meeting_time", { length: 50 }),
    address: varchar("address", { length: 500 }),
    city: varchar("city", { length: 100 }),
    locationMap: text("location_map"),
    description: text("description"),
    capacity: integer("capacity"),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    additionalInfo: text("additional_info"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_cells_status").on(table.status),
    index("idx_cells_city").on(table.city),
    index("idx_cells_meeting_day").on(table.meetingDay),
    index("idx_cells_deleted_at").on(table.deletedAt),
  ]
);
