CREATE TABLE "leaders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"biography" text,
	"image_url" varchar(500),
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "idx_leaders_status" ON "leaders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leaders_display_order" ON "leaders" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_leaders_deleted_at" ON "leaders" USING btree ("deleted_at");