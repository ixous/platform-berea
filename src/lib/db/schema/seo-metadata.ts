import { pgTable, uuid, varchar, text, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    canonicalUrl: varchar("canonical_url", { length: 500 }),
    ogTitle: varchar("og_title", { length: 255 }),
    ogDescription: text("og_description"),
    ogImage: varchar("og_image", { length: 500 }),
    twitterCard: varchar("twitter_card", { length: 50 }),
    twitterTitle: varchar("twitter_title", { length: 255 }),
    twitterDescription: text("twitter_description"),
    twitterImage: varchar("twitter_image", { length: 500 }),
    robots: varchar("robots", { length: 100 }),
    structuredData: jsonb("structured_data"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("idx_seo_metadata_entity_unique").on(table.entityType, table.entityId)]
);
