import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const contentVersions = pgTable(
  "content_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    versionNumber: integer("version_number").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    content: jsonb("content").notNull(),
    comment: text("comment"),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_content_versions_entity").on(table.entityType, table.entityId),
    index("idx_content_versions_user_id").on(table.userId),
    index("idx_content_versions_created_at").on(table.createdAt),
  ]
);
