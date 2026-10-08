-- Gallery images for news articles. Public read; admin-only writes.
-- Existing cover_image_url values are copied in as sort_order 0 so published
-- cards keep their photo. The cover_image_url column stays on news_articles
-- as the first-image thumbnail.

create table public.news_images (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news_articles (id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index news_images_news_id_sort_idx
  on public.news_images (news_id, sort_order, created_at);

alter table public.news_images enable row level security;

create policy "news_images_select_public"
on public.news_images
for select
to anon, authenticated
using (true);

create policy "news_images_insert_admin"
on public.news_images
for insert
to authenticated
with check (public.is_admin());

create policy "news_images_update_admin"
on public.news_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "news_images_delete_admin"
on public.news_images
for delete
to authenticated
using (public.is_admin());

grant select on table public.news_images to anon, authenticated;
grant insert, update, delete on table public.news_images to authenticated;
grant all on table public.news_images to service_role;

insert into public.news_images (news_id, url, sort_order)
select id, cover_image_url, 0
from public.news_articles
where cover_image_url is not null
  and btrim(cover_image_url) <> '';
