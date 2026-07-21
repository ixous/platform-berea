import { pgTable, uuid, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";
import { media } from "./media";

export const mediaAttachments = pgTable(
  "media_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    relationType: varchar("relation_type", { length: 50 }).notNull().default("gallery"),
    displayOrder: integer("display_order").default(0),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_media_attachments_media_id").on(table.mediaId),
    index("idx_media_attachments_entity").on(table.entityType, table.entityId),
    index("idx_media_attachments_relation_type").on(table.relationType),
    index("idx_media_attachments_display_order").on(table.displayOrder),
  ]
);
