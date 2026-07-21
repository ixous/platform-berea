CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_name_unique" UNIQUE("name"),
	CONSTRAINT "permissions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"resource" varchar(100) NOT NULL,
	"resource_id" uuid,
	"details" text,
	"ip_address" varchar(45),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text,
	"excerpt" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "devotionals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"verse" text,
	"content" text NOT NULL,
	"excerpt" text,
	"author_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "devotionals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"time" varchar(50),
	"location" varchar(255),
	"event_type" varchar(50),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false,
	"organizer_id" uuid,
	"cost" varchar(100),
	"capacity" integer,
	"additional_info" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ministries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"leader" varchar(255),
	"schedule" text,
	"location" varchar(255),
	"contact_info" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "ministries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_ministries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"leader" varchar(255),
	"schedule" text,
	"location" varchar(255),
	"contact_info" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "service_ministries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "biblical_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"instructor" varchar(255),
	"duration" varchar(100),
	"modality" varchar(100),
	"schedule" varchar(255),
	"start_date" date,
	"end_date" date,
	"requirements" text,
	"materials" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "biblical_programs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" varchar(50),
	"leader" varchar(255),
	"co_leader" varchar(255),
	"meeting_day" varchar(20),
	"meeting_time" varchar(50),
	"address" varchar(500),
	"city" varchar(100),
	"location_map" text,
	"description" text,
	"capacity" integer,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"additional_info" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "cells_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "annual_vision" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"verse" text,
	"description" text,
	"year" integer NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auditorium" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"video_url" varchar(1000),
	"thumbnail_url" varchar(1000),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"bank_info" jsonb,
	"suggested_amounts" jsonb,
	"message" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" varchar(500),
	"phone" varchar(50),
	"email" varchar(255),
	"whatsapp" varchar(50),
	"map_url" text,
	"schedules" jsonb,
	"social_media" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(500) NOT NULL,
	"original_name" varchar(500) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"url" varchar(1000) NOT NULL,
	"thumbnail_url" varchar(1000),
	"width" integer,
	"height" integer,
	"alt_text" varchar(500),
	"media_type" varchar(50) DEFAULT 'image' NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "media_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" uuid NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid NOT NULL,
	"relation_type" varchar(50) DEFAULT 'gallery' NOT NULL,
	"display_order" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"entity_type" varchar(50),
	"entity_id" uuid,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"canonical_url" varchar(500),
	"og_title" varchar(255),
	"og_description" text,
	"og_image" varchar(500),
	"twitter_card" varchar(50),
	"twitter_title" varchar(255),
	"twitter_description" text,
	"twitter_image" varchar(500),
	"robots" varchar(100),
	"structured_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(500) NOT NULL,
	"destination" varchar(500) NOT NULL,
	"type" integer DEFAULT 301 NOT NULL,
	"page_id" uuid,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "redirects_source_unique" UNIQUE("source")
);
--> statement-breakpoint
CREATE TABLE "navigation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" varchar(500),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "navigation_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"navigation_id" uuid NOT NULL,
	"parent_id" uuid,
	"title" varchar(255) NOT NULL,
	"url" varchar(500),
	"link_type" varchar(50) DEFAULT 'internal' NOT NULL,
	"icon" varchar(100),
	"display_order" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb NOT NULL,
	"description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"content" jsonb NOT NULL,
	"comment" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devotionals" ADD CONSTRAINT "devotionals_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_attachments" ADD CONSTRAINT "media_attachments_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redirects" ADD CONSTRAINT "redirects_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_navigation_id_navigation_id_fk" FOREIGN KEY ("navigation_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_navigation_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_users_role_id" ON "users" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_deleted_at" ON "users" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_user_id" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_action" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_resource" ON "audit_logs" USING btree ("resource");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_pages_status" ON "pages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_pages_published_at" ON "pages" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "idx_devotionals_status_published_at" ON "devotionals" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "idx_devotionals_author_id" ON "devotionals" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_devotionals_deleted_at" ON "devotionals" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_events_start_date" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "idx_events_end_date" ON "events" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_events_featured" ON "events" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "idx_events_event_type" ON "events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_events_deleted_at" ON "events" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_ministries_status" ON "ministries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_ministries_display_order" ON "ministries" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_ministries_deleted_at" ON "ministries" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_service_ministries_status" ON "service_ministries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_service_ministries_display_order" ON "service_ministries" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_service_ministries_deleted_at" ON "service_ministries" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_biblical_programs_status" ON "biblical_programs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_biblical_programs_display_order" ON "biblical_programs" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_biblical_programs_deleted_at" ON "biblical_programs" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_cells_status" ON "cells" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_cells_city" ON "cells" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_cells_meeting_day" ON "cells" USING btree ("meeting_day");--> statement-breakpoint
CREATE INDEX "idx_cells_deleted_at" ON "cells" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_media_media_type" ON "media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "idx_media_uploaded_by" ON "media" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "idx_media_deleted_at" ON "media" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_media_attachments_media_id" ON "media_attachments" USING btree ("media_id");--> statement-breakpoint
CREATE INDEX "idx_media_attachments_entity" ON "media_attachments" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_media_attachments_relation_type" ON "media_attachments" USING btree ("relation_type");--> statement-breakpoint
CREATE INDEX "idx_media_attachments_display_order" ON "media_attachments" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_gallery_deleted_at" ON "gallery" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_seo_metadata_entity_unique" ON "seo_metadata" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_redirects_page_id" ON "redirects" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "idx_redirects_deleted_at" ON "redirects" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_navigation_deleted_at" ON "navigation" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_navigation_items_navigation_id" ON "navigation_items" USING btree ("navigation_id");--> statement-breakpoint
CREATE INDEX "idx_navigation_items_parent_id_order" ON "navigation_items" USING btree ("parent_id","display_order");--> statement-breakpoint
CREATE INDEX "idx_navigation_items_deleted_at" ON "navigation_items" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_settings_deleted_at" ON "settings" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_content_versions_entity" ON "content_versions" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_content_versions_user_id" ON "content_versions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_content_versions_created_at" ON "content_versions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_pages_search" ON "pages" USING gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, '')));--> statement-breakpoint
CREATE INDEX "idx_devotionals_search" ON "devotionals" USING gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(verse, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, '')));--> statement-breakpoint
CREATE INDEX "idx_events_search" ON "events" USING gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(additional_info, '')));--> statement-breakpoint
CREATE INDEX "idx_ministries_search" ON "ministries" USING gin (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(leader, '')));--> statement-breakpoint
CREATE INDEX "idx_biblical_programs_search" ON "biblical_programs" USING gin (to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(instructor, '')));