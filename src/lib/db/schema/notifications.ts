import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: varchar("type", { length: 50 }).notNull(),
    channel: varchar("channel", { length: 20 }).notNull().default("email"),
    recipient: varchar("recipient", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    body: text("body").notNull(),
    referenceType: varchar("reference_type", { length: 50 }),
    referenceId: uuid("reference_id"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_notifications_status").on(table.status),
    index("idx_notifications_type").on(table.type),
    index("idx_notifications_reference").on(table.referenceType, table.referenceId),
    index("idx_notifications_created_at").on(table.createdAt),
  ]
);
