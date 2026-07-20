import { pgTable, uuid, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const media = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: varchar("filename", { length: 500 }).notNull(),
    originalName: varchar("original_name", { length: 500 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(),
    url: varchar("url", { length: 1000 }).notNull(),
    thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
    width: integer("width"),
    height: integer("height"),
    altText: varchar("alt_text", { length: 500 }),
    mediaType: varchar("media_type", { length: 50 }).notNull().default("image"),
    uploadedBy: uuid("uploaded_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_media_media_type").on(table.mediaType),
    index("idx_media_uploaded_by").on(table.uploadedBy),
    index("idx_media_deleted_at").on(table.deletedAt),
  ]
);
