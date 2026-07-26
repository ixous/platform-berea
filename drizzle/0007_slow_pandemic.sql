CREATE TABLE "homepage_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_tagline" varchar(255) DEFAULT '',
	"hero_title" varchar(255) DEFAULT '',
	"hero_subtitle" text,
	"hero_cta_text" varchar(100) DEFAULT '',
	"hero_cta_href" varchar(255) DEFAULT '',
	"hero_secondary_cta_text" varchar(100) DEFAULT '',
	"hero_secondary_cta_href" varchar(255) DEFAULT '',
	"hero_background_image" varchar(500),
	"hero_image_alt" varchar(255) DEFAULT '',
	"welcome_title" varchar(255) DEFAULT '',
	"welcome_description" text,
	"welcome_cta_text" varchar(100) DEFAULT '',
	"welcome_cta_href" varchar(255) DEFAULT '',
	"welcome_cta_secondary_text" varchar(100) DEFAULT '',
	"welcome_cta_secondary_href" varchar(255) DEFAULT '',
	"cta_title" varchar(255) DEFAULT '',
	"cta_description" text,
	"cta_button_text" varchar(100) DEFAULT '',
	"cta_button_href" varchar(255) DEFAULT '',
	"cta_background_image" varchar(500),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homepage_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"day" varchar(50),
	"time" varchar(50),
	"description" text,
	"icon" varchar(50),
	"link" varchar(255),
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "homepage_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_key" varchar(100) NOT NULL,
	"title" varchar(255),
	"subtitle" text,
	"visible" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "homepage_sections_section_key_unique" UNIQUE("section_key")
);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "featured" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "devotionals" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devotionals" ADD COLUMN "featured_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "featured_order" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "ministries" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ministries" ADD COLUMN "featured_order" integer DEFAULT 0;--> statement-breakpoint
CREATE INDEX "idx_homepage_services_status" ON "homepage_services" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_homepage_services_display_order" ON "homepage_services" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_homepage_services_deleted_at" ON "homepage_services" USING btree ("deleted_at");