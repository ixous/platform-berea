ALTER TABLE "service_ministries" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "service_ministries" ADD COLUMN "image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "service_ministries" ADD COLUMN "published_at" timestamp with time zone;