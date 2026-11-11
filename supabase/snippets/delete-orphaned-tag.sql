CREATE OR REPLACE FUNCTION delete_orphaned_tag()
RETURNS TRIGGER AS $$
begin
  if not exists (
    select 1 from bookmark_tag where tag_id = old.tag_id
  ) then
    delete from tags where id = old.tag_id;
  end if;
  return old;
end;
$$ language plpgsql security definer;