DROP POLICY "Users can delete their own bookmark icon" ON "storage"."objects";

DROP POLICY "Users can update their own bookmark icon" ON "storage"."objects";

DROP POLICY "Users can upload their own bookmark icon" ON "storage"."objects";

DROP POLICY "Users can view their own bookmark icon" ON "storage"."objects";

ALTER TABLE "public"."bookmark"
  DROP COLUMN "icon_url";
