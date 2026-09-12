-- Admins need insert/update/delete on program_sessions in addition to the
-- public select grant from 0005. RLS still limits those writes to is_admin().
-- Run in the Supabase SQL editor if the catalog tables were created there.
grant insert, update, delete on table public.program_sessions to authenticated;
grant all on table public.program_sessions to service_role;
