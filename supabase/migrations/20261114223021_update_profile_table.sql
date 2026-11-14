SET local check_function_bodies = off;

DROP POLICY "Public profiles are viewable by everyone" ON "public"."profile";

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$begin
  insert into public.profile (id, username, avatar_path)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'avatar_path'
  );
  return new;
end;$function$;

CREATE POLICY "Users can view their own profile" ON "public"."profile"
  FOR SELECT
  TO "authenticated"
  USING ((auth.uid() = id));
