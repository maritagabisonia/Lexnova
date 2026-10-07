-- Public bucket for lecturer photos. The admin lecturer form uploads here
-- and stores the public URL on lecturers.photo_url (unchanged column).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lecturer-photos',
  'lecturer-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "lecturer_photos_public_select" on storage.objects;
create policy "lecturer_photos_public_select"
on storage.objects
for select
to public
using (bucket_id = 'lecturer-photos');
