CREATE TABLE "institutional_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"banner_title" varchar(255),
	"banner_subtitle" text,
	"banner_image" varchar(500),
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "institutional_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "institutional_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_slug" varchar(255) NOT NULL,
	"section_key" varchar(100) NOT NULL,
	"title" varchar(255),
	"content" text,
	"image_url" varchar(500),
	"button_text" varchar(255),
	"button_href" varchar(500),
	"display_order" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doctrines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" text,
	"content" text,
	"bible_verses" text,
	"image_url" varchar(500),
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_inst_pages_slug" ON "institutional_pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_inst_sections_page_slug" ON "institutional_sections" USING btree ("page_slug");--> statement-breakpoint
CREATE INDEX "idx_inst_sections_order" ON "institutional_sections" USING btree ("page_slug","display_order");--> statement-breakpoint
CREATE INDEX "idx_doctrines_order" ON "doctrines" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_doctrines_status" ON "doctrines" USING btree ("status");