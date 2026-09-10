-- Students need table grants in addition to RLS policies, otherwise
-- insert/select on registrations returns "permission denied".
grant select, insert on table public.registrations to authenticated;
grant all on table public.registrations to service_role;
