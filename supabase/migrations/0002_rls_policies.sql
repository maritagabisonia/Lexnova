-- LexNova row-level security
-- Turns on RLS for every table from 0001_core_schema.sql and adds access rules.
-- Helper functions use SECURITY DEFINER so checking "is this user an admin?"
-- does not loop back into the profiles policies.

-- Returns true when the logged-in user has role = 'admin' on their profile.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Returns the logged-in user's current role, used to block self-service role changes.
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.current_user_role() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.lecturers enable row level security;
alter table public.programs enable row level security;
alter table public.program_sessions enable row level security;
alter table public.registrations enable row level security;
alter table public.news_articles enable row level security;
alter table public.contact_messages enable row level security;

-- ===========================================================================
-- profiles
-- ===========================================================================

-- A logged-in person can see their own profile row.
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

-- An admin can see every profile.
create policy "profiles_select_admin"
on public.profiles
for select
to authenticated
using (public.is_admin());

-- A new account can create its own profile, but only as a student (not admin/teacher).
create policy "profiles_insert_own_student"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() and role = 'student');

-- An admin can create any profile, including admin or teacher.
create policy "profiles_insert_admin"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

-- A logged-in person can update their own profile, but their role must stay the same.
create policy "profiles_update_own_without_role_change"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = public.current_user_role());

-- An admin can update any profile, including changing that person's role.
create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ===========================================================================
-- lecturers
-- ===========================================================================

-- Anyone, even visitors who are not logged in, can view lecturers.
create policy "lecturers_select_public"
on public.lecturers
for select
to anon, authenticated
using (true);

-- Only an admin can add a lecturer.
create policy "lecturers_insert_admin"
on public.lecturers
for insert
to authenticated
with check (public.is_admin());

-- Only an admin can edit a lecturer.
create policy "lecturers_update_admin"
on public.lecturers
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Only an admin can delete a lecturer.
create policy "lecturers_delete_admin"
on public.lecturers
for delete
to authenticated
using (public.is_admin());

-- ===========================================================================
-- programs
-- ===========================================================================

-- Anyone, even visitors who are not logged in, can view programs.
create policy "programs_select_public"
on public.programs
for select
to anon, authenticated
using (true);

-- Only an admin can add a program.
create policy "programs_insert_admin"
on public.programs
for insert
to authenticated
with check (public.is_admin());

-- Only an admin can edit a program.
create policy "programs_update_admin"
on public.programs
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Only an admin can delete a program.
create policy "programs_delete_admin"
on public.programs
for delete
to authenticated
using (public.is_admin());

-- ===========================================================================
-- program_sessions
-- Public schedule details follow the same rules as programs.
-- ===========================================================================

-- Anyone, even visitors who are not logged in, can view program session times.
create policy "program_sessions_select_public"
on public.program_sessions
for select
to anon, authenticated
using (true);

-- Only an admin can add a program session.
create policy "program_sessions_insert_admin"
on public.program_sessions
for insert
to authenticated
with check (public.is_admin());

-- Only an admin can edit a program session.
create policy "program_sessions_update_admin"
on public.program_sessions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Only an admin can delete a program session.
create policy "program_sessions_delete_admin"
on public.program_sessions
for delete
to authenticated
using (public.is_admin());

-- ===========================================================================
-- registrations
-- ===========================================================================

-- A logged-in student can see their own registrations, not other people's.
create policy "registrations_select_own"
on public.registrations
for select
to authenticated
using (student_id = auth.uid());

-- An admin can see every registration.
create policy "registrations_select_admin"
on public.registrations
for select
to authenticated
using (public.is_admin());

-- A logged-in student can register themselves for a program, not someone else.
create policy "registrations_insert_own"
on public.registrations
for insert
to authenticated
with check (student_id = auth.uid());

-- An admin can create a registration for any student.
create policy "registrations_insert_admin"
on public.registrations
for insert
to authenticated
with check (public.is_admin());

-- An admin can change any registration (for example, mark it cancelled).
create policy "registrations_update_admin"
on public.registrations
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- An admin can delete any registration.
create policy "registrations_delete_admin"
on public.registrations
for delete
to authenticated
using (public.is_admin());

-- ===========================================================================
-- news_articles
-- ===========================================================================

-- Anyone, even visitors who are not logged in, can read news that is published.
create policy "news_articles_select_published"
on public.news_articles
for select
to anon, authenticated
using (published = true);

-- An admin can also read unpublished drafts.
create policy "news_articles_select_admin"
on public.news_articles
for select
to authenticated
using (public.is_admin());

-- Only an admin can add a news article.
create policy "news_articles_insert_admin"
on public.news_articles
for insert
to authenticated
with check (public.is_admin());

-- Only an admin can edit a news article.
create policy "news_articles_update_admin"
on public.news_articles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Only an admin can delete a news article.
create policy "news_articles_delete_admin"
on public.news_articles
for delete
to authenticated
using (public.is_admin());

-- ===========================================================================
-- contact_messages
-- ===========================================================================

-- Anyone, including visitors who are not logged in, can send a contact form message.
create policy "contact_messages_insert_public"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

-- Only an admin can read contact form messages.
create policy "contact_messages_select_admin"
on public.contact_messages
for select
to authenticated
using (public.is_admin());
