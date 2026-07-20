import { pgTable, uuid, varchar, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { gallery } from "./gallery";
import { media } from "./media";

export const galleryMedia = pgTable(
  "gallery_media",
  {
    galleryId: uuid("gallery_id")
      .notNull()
      .references(() => gallery.id),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => media.id),
    displayOrder: integer("display_order").default(0),
    caption: varchar("caption", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.galleryId, table.mediaId] })]
);
