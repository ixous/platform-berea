import { pgTable, uuid, varchar, text, integer, date, timestamp, index } from "drizzle-orm/pg-core";

export const biblicalPrograms = pgTable(
  "biblical_programs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    instructor: varchar("instructor", { length: 255 }),
    duration: varchar("duration", { length: 100 }),
    modality: varchar("modality", { length: 100 }),
    schedule: varchar("schedule", { length: 255 }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    requirements: text("requirements"),
    materials: text("materials"),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    displayOrder: integer("display_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_biblical_programs_status").on(table.status),
    index("idx_biblical_programs_display_order").on(table.displayOrder),
    index("idx_biblical_programs_deleted_at").on(table.deletedAt),
  ]
);
