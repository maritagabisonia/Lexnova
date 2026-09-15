-- Tighten public reads and student self-registration so they match the app.
-- Archived programs stay off the public catalog; students who are already
-- registered can still see those rows. Self-service inserts only work when
-- registration is open and the deadline has not passed.

drop policy if exists "programs_select_public" on public.programs;
create policy "programs_select_public"
on public.programs
for select
to anon, authenticated
using (
  status <> 'archived'
  or public.is_admin()
  or exists (
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
      and (
        p.status <> 'archived'
        or public.is_admin()
        or exists (
          select 1
          from public.registrations as r
          where r.program_id = p.id
            and r.student_id = auth.uid()
            and r.status = 'confirmed'
        )
      )
  )
);

drop policy if exists "registrations_insert_own" on public.registrations;
create policy "registrations_insert_own"
on public.registrations
for insert
to authenticated
with check (
  student_id = auth.uid()
  and status = 'confirmed'
  and exists (
    select 1
    from public.programs as p
    where p.id = program_id
      and p.status = 'registration_open'
      and (
        p.registration_deadline is null
        or p.registration_deadline >= (timezone('utc', now()))::date
      )
  )
);
