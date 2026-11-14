ALTER TABLE "public"."profile"
  DROP COLUMN "avatar_url";

ALTER TABLE "public"."profile"
  ADD COLUMN "avatar_path" text;
