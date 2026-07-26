ALTER TABLE "contact" ADD COLUMN "church_name" varchar(255);--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "coordinates" jsonb;--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "schedule_note" text;--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "cta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "cta_description" text;--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "cta_button_text" varchar(255);--> statement-breakpoint
ALTER TABLE "contact" ADD COLUMN "cta_button_href" varchar(500);