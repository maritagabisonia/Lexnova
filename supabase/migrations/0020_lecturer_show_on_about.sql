-- Flag lecturers who should appear in the About page team section.
-- Existing rows stay false; nothing else on lecturers changes.

alter table public.lecturers
  add column if not exists show_on_about boolean not null default false;
