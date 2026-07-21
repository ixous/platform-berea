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
import { users } from "./users";

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    time: varchar("time", { length: 50 }),
    location: varchar("location", { length: 255 }),
    eventType: varchar("event_type", { length: 50 }),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    featured: boolean("featured").default(false),
    organizerId: uuid("organizer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    cost: varchar("cost", { length: 100 }),
    capacity: integer("capacity"),
    additionalInfo: text("additional_info"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_events_start_date").on(table.startDate),
    index("idx_events_end_date").on(table.endDate),
    index("idx_events_status").on(table.status),
    index("idx_events_featured").on(table.featured),
    index("idx_events_event_type").on(table.eventType),
    index("idx_events_deleted_at").on(table.deletedAt),
  ]
);
