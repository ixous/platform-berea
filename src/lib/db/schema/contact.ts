import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const contact = pgTable("contact", {
  id: uuid("id").primaryKey().defaultRandom(),
  churchName: varchar("church_name", { length: 255 }),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  mapUrl: text("map_url"),
  coordinates: jsonb("coordinates"),
  schedules: jsonb("schedules"),
  scheduleNote: text("schedule_note"),
  socialMedia: jsonb("social_media"),
  ctaTitle: varchar("cta_title", { length: 255 }),
  ctaDescription: text("cta_description"),
  ctaButtonText: varchar("cta_button_text", { length: 255 }),
  ctaButtonHref: varchar("cta_button_href", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
