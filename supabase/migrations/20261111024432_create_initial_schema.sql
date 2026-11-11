SET local check_function_bodies = off;

CREATE EXTENSION "moddatetime" SCHEMA "extensions";

CREATE TABLE "public"."bookmark_tag" (
  "bookmark_id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "tag_id"      uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT "bookmark_tag_pkey" PRIMARY KEY (bookmark_id, tag_id)
);

ALTER TABLE "public"."bookmark_tag"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."bookmark" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "user_id"     uuid                     NOT NULL,
  "page_url"    text                     NOT NULL,
  "title"       text                     NOT NULL,
  "description" text,
  "icon_url"    text,
  "visited_at"  timestamp with time zone,
  "visits"      bigint                   NOT NULL DEFAULT '0'::bigint,
  "is_archived" boolean                  NOT NULL DEFAULT false,
  CONSTRAINT "bookmark_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."bookmark"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profile" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "username"   text                     NOT NULL,
  "avatar_url" text,
  CONSTRAINT "profile_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profile"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."tag" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "name"       text                     NOT NULL,
  "user_id"    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT "tag_pkey" PRIMARY KEY (id),
  CONSTRAINT "unique_tag_names" UNIQUE (user_id, name)
);

ALTER TABLE "public"."tag"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.delete_orphaned_tag()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  if not exists (
    select 1 from bookmark_tag where tag_id = old.tag_id
  ) then
    delete from tags where id = old.tag_id;
  end if;
  return old;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;$function$;

ALTER TABLE "public"."bookmark_tag"
  ADD CONSTRAINT "bookmark_tag_bookmark_id_fkey" FOREIGN KEY (bookmark_id) REFERENCES public.bookmark(id) ON DELETE CASCADE;

ALTER TABLE "public"."profile"
  ADD CONSTRAINT "profile_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."bookmark"
  ADD CONSTRAINT "bookmark_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON DELETE CASCADE;

ALTER TABLE "public"."bookmark_tag"
  ADD CONSTRAINT "bookmark_tag_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON DELETE CASCADE;

ALTER TABLE "public"."tag"
  ADD CONSTRAINT "tag_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profile(id) ON DELETE CASCADE;

CREATE TRIGGER cleanup_unused_tag
  AFTER DELETE ON public.bookmark
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_orphaned_tag();

CREATE TRIGGER handle_bookmark_updated_at
  BEFORE UPDATE ON public.bookmark
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime();

CREATE TRIGGER handle_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime();

CREATE POLICY "Users can delete their own bookmarks" ON "public"."bookmark"
  FOR DELETE
  TO "authenticated"
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert their own bookmarks" ON "public"."bookmark"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can update their own bookmarks" ON "public"."bookmark"
  FOR UPDATE
  TO "authenticated"
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can view their own bookmarks" ON "public"."bookmark"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can manage their own bookmark tags" ON "public"."bookmark_tag"
  FOR ALL
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.bookmark
  WHERE ((bookmark.id = bookmark_tag.bookmark_id) AND (bookmark.user_id = auth.uid())))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.bookmark
  WHERE ((bookmark.id = bookmark_tag.bookmark_id) AND (bookmark.user_id = auth.uid())))));

CREATE POLICY "Public profiles are viewable by everyone" ON "public"."profile"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "Users can delete their own profile" ON "public"."profile"
  FOR DELETE
  TO "authenticated"
  USING ((auth.uid() = id));

CREATE POLICY "Users can update their own profile" ON "public"."profile"
  FOR UPDATE
  TO "authenticated"
  USING ((auth.uid() = id));

CREATE POLICY "Users can manage their own tags" ON "public"."tag"
  FOR ALL
  TO "authenticated"
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own avatar" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Users can delete their own bookmark icon" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'bookmark_icon'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Users can update their own avatar" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING (((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
  WITH CHECK (((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Users can update their own bookmark icon" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING (((bucket_id = 'bookmark_icon'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
  WITH CHECK (((bucket_id = 'bookmark_icon'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Users can upload their own avatar" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Users can upload their own bookmark icon" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'bookmark_icon'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Users can view their own avatar" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

CREATE POLICY "Users can view their own bookmark icon" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'bookmark_icon'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));

COMMENT ON EXTENSION "moddatetime" IS 'functions for tracking last modification time';

GRANT EXECUTE ON FUNCTION "public"."delete_orphaned_tag"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."delete_orphaned_tag"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."delete_orphaned_tag"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."delete_orphaned_tag"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmark" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."bookmark" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmark" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmark" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmark_tag" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."bookmark_tag" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmark_tag" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."bookmark_tag" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profile" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."tag" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."tag" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."tag" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."tag" TO "service_role";
