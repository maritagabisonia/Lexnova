-- Create a student profile whenever a new Auth user is created.
-- Reads full_name from signup metadata so the row exists even before first login.
-- Run after 0001 (profiles table) and 0002 (RLS). Tables created in the SQL
-- editor may lack API grants, which would block profile inserts from the app.

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
