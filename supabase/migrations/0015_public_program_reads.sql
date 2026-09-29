-- Public catalog reads must not inspect registrations.
-- 0013's programs_select_public / program_sessions_select_public used an
-- EXISTS on public.registrations in the same policy as the anon catalog
-- read. Anon has no GRANT SELECT on registrations, so Postgres rejects the
-- whole SELECT (permission denied) even for non-archived rows. The Next.js
-- catalog then looks empty and program detail pages 404 for visitors.
--
-- Split the rules:
--   * anyone can SELECT non-archived programs, their sessions, and lecturers
--   * admins and confirmed students keep access to archived rows they need
--     (those policies run only for authenticated, who may read registrations)

grant select on table public.lecturers to anon, authenticated;
grant select on table public.programs to anon, authenticated;
grant select on table public.program_sessions to anon, authenticated;
grant execute on function public.confirmed_registration_count(uuid) to anon, authenticated;

drop policy if exists "programs_select_public" on public.programs;
create policy "programs_select_public"
on public.programs
for select
to anon, authenticated
using (status <> 'archived');

drop policy if exists "programs_select_archived_admin" on public.programs;
create policy "programs_select_archived_admin"
on public.programs
for select
to authenticated
using (public.is_admin());

drop policy if exists "programs_select_archived_registrant" on public.programs;
create policy "programs_select_archived_registrant"
on public.programs
for select
to authenticated
using (
  exists (
    select 1
    from public.registrations as r
    where r.program_id = programs.id
      and r.student_id = auth.uid()
      and r.status = 'confirmed'
  )
);

drop policy if exists "program_sessions_select_public" on public.program_sessions;
create policy "program_sessions_select_public"
on public.program_sessions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.programs as p
    where p.id = program_sessions.program_id
      and p.status <> 'archived'
  )
);

drop policy if exists "program_sessions_select_admin" on public.program_sessions;
create policy "program_sessions_select_admin"
on public.program_sessions
for select
to authenticated
using (public.is_admin());

drop policy if exists "program_sessions_select_archived_registrant" on public.program_sessions;
create policy "program_sessions_select_archived_registrant"
on public.program_sessions
for select
to authenticated
using (
  exists (
    select 1
    from public.registrations as r
    where r.program_id = program_sessions.program_id
      and r.student_id = auth.uid()
      and r.status = 'confirmed'
  )
);
