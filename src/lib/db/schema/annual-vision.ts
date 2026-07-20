import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const annualVision = pgTable("annual_vision", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  verse: text("verse"),
  description: text("description"),
  year: integer("year").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
