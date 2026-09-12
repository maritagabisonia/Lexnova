-- Admins need insert/update on news_articles in addition to the public
-- select grant from 0005. RLS still limits those writes to is_admin().
-- Run in the Supabase SQL editor if the catalog tables were created there.
grant insert, update on table public.news_articles to authenticated;
grant all on table public.news_articles to service_role;
