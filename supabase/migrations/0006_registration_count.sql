-- Public pages need a headcount without exposing who registered.
-- RLS on registrations only lets a student see their own rows, so a plain
-- count() from the client would always look empty to visitors.

create or replace function public.confirmed_registration_count(p_program_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.registrations
  where program_id = p_program_id
    and status = 'confirmed';
$$;

grant execute on function public.confirmed_registration_count(uuid) to anon, authenticated;
