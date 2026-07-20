import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const contact = pgTable("contact", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  mapUrl: text("map_url"),
  schedules: jsonb("schedules"),
  socialMedia: jsonb("social_media"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
