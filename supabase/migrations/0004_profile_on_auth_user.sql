-- Automatically create a public.profiles row whenever a new Auth user is inserted.
-- Run this in the Supabase SQL editor after 0001 (profiles table) and 0002 (RLS).
-- Safe to re-run: the function is replaced, the trigger is dropped and recreated,
-- and existing Auth users without a profile are backfilled once.

grant select, insert, update on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'Student'),
    coalesce(new.email, ''),
    'student'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- Existing Auth users who signed up before this trigger was applied.
insert into public.profiles (id, full_name, email, role)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), 'Student'),
  coalesce(u.email, ''),
  'student'
from auth.users as u
where not exists (
  select 1
  from public.profiles as p
  where p.id = u.id
)
on conflict (id) do nothing;
