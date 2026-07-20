import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { navigation } from "./navigation";

export const navigationItems = pgTable(
  "navigation_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    navigationId: uuid("navigation_id")
      .notNull()
      .references(() => navigation.id),
    parentId: uuid("parent_id").references((): AnyPgColumn => navigationItems.id),
    title: varchar("title", { length: 255 }).notNull(),
    url: varchar("url", { length: 500 }),
    linkType: varchar("link_type", { length: 50 }).notNull().default("internal"),
    icon: varchar("icon", { length: 100 }),
    displayOrder: integer("display_order").default(0),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_navigation_items_navigation_id").on(table.navigationId),
    index("idx_navigation_items_parent_id_order").on(table.parentId, table.displayOrder),
    index("idx_navigation_items_deleted_at").on(table.deletedAt),
  ]
);
