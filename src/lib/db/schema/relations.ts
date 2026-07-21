import { relations } from "drizzle-orm";
import { users } from "./users";
import { roles } from "./roles";
import { permissions } from "./permissions";
import { rolePermissions } from "./role-permissions";
import { auditLogs } from "./audit-logs";
import { devotionals } from "./devotionals";
import { events } from "./events";
import { media } from "./media";
import { mediaAttachments } from "./media-attachments";
import { gallery } from "./gallery";
import { navigation } from "./navigation";
import { navigationItems } from "./navigation-items";
import { contentVersions } from "./content-versions";
import { redirects } from "./redirects";
import { pages } from "./pages";

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  devotionals: many(devotionals),
  events: many(events),
  auditLogs: many(auditLogs),
  uploadedMedia: many(media),
  contentVersions: many(contentVersions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const devotionalsRelations = relations(devotionals, ({ one }) => ({
  author: one(users, {
    fields: [devotionals.authorId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
  uploadedByUser: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
  attachments: many(mediaAttachments),
}));

export const mediaAttachmentsRelations = relations(mediaAttachments, ({ one }) => ({
  media: one(media, {
    fields: [mediaAttachments.mediaId],
    references: [media.id],
  }),
}));

export const galleryRelations = relations(gallery, ({ many }) => ({
  media: many(mediaAttachments),
}));

export const navigationRelations = relations(navigation, ({ many }) => ({
  items: many(navigationItems),
}));

export const navigationItemsRelations = relations(navigationItems, ({ one, many }) => ({
  navigation: one(navigation, {
    fields: [navigationItems.navigationId],
    references: [navigation.id],
  }),
  parent: one(navigationItems, {
    fields: [navigationItems.parentId],
    references: [navigationItems.id],
  }),
  children: many(navigationItems),
}));

export const contentVersionsRelations = relations(contentVersions, ({ one }) => ({
  user: one(users, {
    fields: [contentVersions.userId],
    references: [users.id],
  }),
}));

export const redirectsRelations = relations(redirects, ({ one }) => ({
  page: one(pages, {
    fields: [redirects.pageId],
    references: [pages.id],
  }),
}));

export const pagesRelations = relations(pages, ({ many }) => ({
  redirects: many(redirects),
}));
