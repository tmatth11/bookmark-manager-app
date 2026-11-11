create policy "Users can view their own avatar"
on storage.objects for select
to authenticated
using (
  ((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
);

create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  ((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
);

create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  ((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
)
with check (
  ((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
);

create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  ((bucket_id = 'avatar'::text) AND ((auth.uid())::text = (storage.foldername(name))[1]))
);
