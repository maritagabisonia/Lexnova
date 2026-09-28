-- Georgian copy for programs, sessions, lecturers, and news.
-- English columns stay as they are. New *_ka columns are nullable so
-- existing English seed data can be translated later from the admin panel.
-- Do not run this from the app; apply it with the usual Supabase workflow.

alter table public.programs
  add column if not exists title_ka text,
  add column if not exists short_description_ka text,
  add column if not exists full_description_ka text,
  add column if not exists target_audience_ka text,
  add column if not exists objectives_ka text,
  add column if not exists learning_outcomes_ka text;

alter table public.programs
  alter column title drop not null;

alter table public.programs
  drop constraint if exists programs_title_present;

alter table public.programs
  add constraint programs_title_present
  check (
    nullif(btrim(coalesce(title, '')), '') is not null
    or nullif(btrim(coalesce(title_ka, '')), '') is not null
  );

alter table public.program_sessions
  add column if not exists location_ka text;

alter table public.lecturers
  add column if not exists bio_ka text;

alter table public.news_articles
  add column if not exists title_ka text,
  add column if not exists short_description_ka text,
  add column if not exists content_ka text;

alter table public.news_articles
  alter column title drop not null;

alter table public.news_articles
  drop constraint if exists news_articles_title_present;

alter table public.news_articles
  add constraint news_articles_title_present
  check (
    nullif(btrim(coalesce(title, '')), '') is not null
    or nullif(btrim(coalesce(title_ka, '')), '') is not null
  );
