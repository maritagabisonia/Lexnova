-- Admins need to cancel (update) registrations in addition to the
-- select/insert grant from 0007. RLS still limits updates to is_admin().
-- Run in the Supabase SQL editor if the catalog tables were created there.
grant update on table public.registrations to authenticated;
grant all on table public.registrations to service_role;
