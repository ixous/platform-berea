CREATE TABLE "history_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" varchar(10) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar(1000),
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "idx_history_milestones_order" ON "history_milestones" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "idx_history_milestones_status" ON "history_milestones" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_history_milestones_deleted_at" ON "history_milestones" USING btree ("deleted_at");