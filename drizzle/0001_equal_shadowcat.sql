CREATE INDEX "idx_annual_vision_status_year" ON "annual_vision" USING btree ("status","year");--> statement-breakpoint
CREATE INDEX "idx_donations_status" ON "donations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_media_created_at" ON "media" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_gallery_entity" ON "gallery" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_content_versions_entity_version" ON "content_versions" USING btree ("entity_type","entity_id","version_number");