import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    repliedAt: timestamp("replied_at", { withTimezone: true }),
    replyMessage: text("reply_message"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_contact_submissions_status").on(table.status),
    index("idx_contact_submissions_created_at").on(table.createdAt),
    index("idx_contact_submissions_assigned_to").on(table.assignedTo),
  ]
);
