-- Admins need insert/update on lecturers in addition to the public select
-- grant from 0005. RLS still limits those writes to is_admin().
-- Run in the Supabase SQL editor if the catalog tables were created there.
grant insert, update on table public.lecturers to authenticated;
grant all on table public.lecturers to service_role;
