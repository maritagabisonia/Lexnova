-- LexNova core schema
-- Defines the first set of public tables for profiles, programs, sessions,
-- registrations, news, and contact. Does not enable RLS or seed data.

create extension if not exists pgcrypto with schema extensions;

-- Keep updated_at in sync on row changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- One row per Auth user. role is student | admin | teacher.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null default 'student'
    check (role in ('student', 'admin', 'teacher')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- lecturers
-- Public-facing instructor records. May later link to a teacher profile.
-- ---------------------------------------------------------------------------
create table public.lecturers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_url text,
  bio text,
  title text,
  linked_profile_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- programs
-- Courses and trainings shown on the site.
-- ---------------------------------------------------------------------------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  type text not null
    check (type in ('course', 'training')),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  target_audience text,
  objectives text,
  learning_outcomes text,
  duration_text text,
  start_date date,
  end_date date,
  registration_deadline date,
  format text not null
    check (format in ('online', 'in_person', 'hybrid')),
  location text,
  lecturer_id uuid not null references public.lecturers (id) on delete restrict,
  max_participants integer
    check (max_participants is null or max_participants > 0),
  status text not null default 'coming_soon'
    check (
      status in (
        'registration_open',
        'coming_soon',
        'fully_booked',
        'in_progress',
        'completed',
        'archived'
      )
    ),
  price numeric(10, 2)
    check (price is null or price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger programs_set_updated_at
before update on public.programs
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- program_sessions
-- Individual meetings for a program. lecturer_id overrides the program lecturer.
-- ---------------------------------------------------------------------------
create table public.program_sessions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  location text,
  format text not null
    check (format in ('online', 'in_person', 'hybrid')),
  lecturer_id uuid references public.lecturers (id) on delete set null,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

-- ---------------------------------------------------------------------------
-- registrations
-- A student may register for a given program only once.
-- ---------------------------------------------------------------------------
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled')),
  registered_at timestamptz not null default now(),
  unique (program_id, student_id)
);

-- ---------------------------------------------------------------------------
-- news_articles
-- ---------------------------------------------------------------------------
create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_image_url text,
  short_description text,
  content text,
  author text,
  related_program_id uuid references public.programs (id) on delete set null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index lecturers_linked_profile_id_idx
  on public.lecturers (linked_profile_id);

create index programs_lecturer_id_idx
  on public.programs (lecturer_id);

create index programs_status_idx
  on public.programs (status);

create index program_sessions_program_id_idx
  on public.program_sessions (program_id);

create index program_sessions_lecturer_id_idx
  on public.program_sessions (lecturer_id);

create index registrations_student_id_idx
  on public.registrations (student_id);

create index news_articles_related_program_id_idx
  on public.news_articles (related_program_id);

create index news_articles_published_idx
  on public.news_articles (published, published_at desc);
