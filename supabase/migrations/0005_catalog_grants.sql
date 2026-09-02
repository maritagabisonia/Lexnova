-- Public catalog tables created in the SQL editor may lack GRANTs even when
-- RLS policies exist. Without these, anon/authenticated queries return
-- "permission denied" and the home page cannot show programs or news.

grant select on table public.lecturers to anon, authenticated;
grant select on table public.programs to anon, authenticated;
grant select on table public.program_sessions to anon, authenticated;
grant select on table public.news_articles to anon, authenticated;
grant insert on table public.contact_messages to anon, authenticated;
grant all on table public.lecturers to service_role;
grant all on table public.programs to service_role;
grant all on table public.program_sessions to service_role;
grant all on table public.news_articles to service_role;
grant all on table public.contact_messages to service_role;
