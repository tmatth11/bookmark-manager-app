SET local check_function_bodies = off;

DROP TRIGGER "handle_profile_updated_at" ON "public"."profile";

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
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
begin
  insert into public.profile (id, username, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$function$;

CREATE TRIGGER handle_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');
