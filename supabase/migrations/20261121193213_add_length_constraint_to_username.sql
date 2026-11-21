SET local check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_orphaned_tag()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $function$
begin
  if not exists (
    select 1 from bookmark_tag where tag_id = old.tag_id
  ) then
    delete from tag where id = old.tag_id;
  end if;
  return old;
end;
$function$;

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

ALTER TABLE "public"."profile"
  ADD CONSTRAINT "profile_username_check" CHECK (((char_length(username) >= 3) AND (char_length(username) <= 30)));
