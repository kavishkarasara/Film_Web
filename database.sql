-- CineVault initial migration. Run once in a NEW Supabase project SQL editor.
-- Supabase owns auth.*, storage.*, the anon/authenticated roles and realtime.
begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated;

create table private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table private.admin_users enable row level security;
revoke all on private.admin_users from public, anon, authenticated;
-- No client policies: only privileged SQL can manage this allowlist.

create function private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from private.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- Coarse DB validation; application validation adds provider host allowlists.
create function private.valid_https_url(value text)
returns boolean language sql immutable set search_path = ''
as $$
  select value is not null and length(value) between 9 and 2048
    and value ~ '^https://[A-Za-z0-9][A-Za-z0-9.-]*(:[0-9]{1,5})?([/?#][^[:space:]]*)?$'
    and value !~ '[[:cntrl:]]';
$$;
revoke all on function private.valid_https_url(text) from public;
grant execute on function private.valid_https_url(text) to anon, authenticated;

create function private.valid_download_links(value jsonb)
returns boolean language plpgsql immutable set search_path = ''
as $$
declare item jsonb;
begin
  if value is null or jsonb_typeof(value) <> 'array' then return false; end if;
  if jsonb_array_length(value) > 50 then return false; end if;
  for item in select jsonb_array_elements(value) loop
    if jsonb_typeof(item) <> 'object' then return false; end if;
    if not (item ?& array['quality','provider','url','label'])
       or (item - array['quality','provider','url','label']) <> '{}'::jsonb
    then return false; end if;
    if jsonb_typeof(item->'quality') <> 'string'
       or jsonb_typeof(item->'provider') <> 'string'
       or jsonb_typeof(item->'url') <> 'string'
       or jsonb_typeof(item->'label') <> 'string'
    then return false; end if;
    if length(btrim(item->>'quality')) not between 1 and 30
       or length(btrim(item->>'label')) not between 1 and 100
       or (item->>'provider') not in
          ('google-drive','mega','telegram','mediafire','dropbox','onedrive','other')
       or not private.valid_https_url(item->>'url')
    then return false; end if;
  end loop;
  return true;
end;
$$;
revoke all on function private.valid_download_links(jsonb) from public;
grant execute on function private.valid_download_links(jsonb) to anon, authenticated;

create function private.valid_categories(value text[])
returns boolean language sql immutable set search_path = ''
as $$
  select value is not null
    and cardinality(value) <= 20
    and not exists (
      select 1 from unnest(value) as category
      where category is null or length(btrim(category)) not between 1 and 50
    );
$$;
revoke all on function private.valid_categories(text[]) from public;
grant execute on function private.valid_categories(text[]) to anon, authenticated;

create table public.movies (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(btrim(title)) between 1 and 200),
  description text not null default '' check (length(description) <= 10000),
  poster_url text check (poster_url is null or private.valid_https_url(poster_url)),
  cover_url text check (cover_url is null or private.valid_https_url(cover_url)),
  categories text[] not null default '{}' check (private.valid_categories(categories)),
  tmdb_rating numeric(3,1) check (tmdb_rating between 0 and 10),
  download_links jsonb not null default '[]'::jsonb
    check (private.valid_download_links(download_links)),
  likes_count bigint not null default 0 check (likes_count >= 0),
  created_at timestamptz not null default now()
);
create index movies_latest_idx on public.movies(created_at desc, id);
create index movies_categories_idx on public.movies using gin(categories);
create index movies_search_idx on public.movies using gin(
  to_tsvector('simple', title || ' ' || description)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies(id) on delete cascade,
  user_name text not null check (length(btrim(user_name)) between 1 and 80),
  comment_text text not null check (length(btrim(comment_text)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index comments_movie_created_idx on public.comments(movie_id, created_at desc, id);

alter table public.movies enable row level security;
alter table public.comments enable row level security;
revoke all on public.movies, public.comments from public, anon, authenticated;
grant select on public.movies, public.comments to anon, authenticated;
grant insert, update, delete on public.movies to authenticated;
-- Limit caller-supplied columns, so id and timestamp cannot be forged.
grant insert (movie_id, user_name, comment_text) on public.comments to anon, authenticated;
grant update (user_name, comment_text), delete on public.comments to authenticated;

create policy movies_public_read on public.movies
  for select to anon, authenticated using (true);
create policy movies_admin_insert on public.movies
  for insert to authenticated with check ((select private.is_admin()));
create policy movies_admin_update on public.movies
  for update to authenticated using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy movies_admin_delete on public.movies
  for delete to authenticated using ((select private.is_admin()));

create policy comments_public_read on public.comments
  for select to anon, authenticated using (true);
create policy comments_public_insert on public.comments
  for insert to anon, authenticated with check (
    exists (select 1 from public.movies where id = movie_id)
  );
create policy comments_admin_update on public.comments
  for update to authenticated using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy comments_admin_delete on public.comments
  for delete to authenticated using ((select private.is_admin()));

-- Public reads for posters/covers; public buckets do NOT grant upload rights.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('movie-images', 'movie-images', true, 5242880,
        array['image/jpeg','image/png','image/webp','image/avif']);
create policy movie_images_admin_select on storage.objects
  for select to authenticated using (
    bucket_id = 'movie-images' and (select private.is_admin())
  );
create policy movie_images_admin_insert on storage.objects
  for insert to authenticated with check (
    bucket_id = 'movie-images' and (select private.is_admin())
  );
create policy movie_images_admin_update on storage.objects
  for update to authenticated using (
    bucket_id = 'movie-images' and (select private.is_admin())
  ) with check (
    bucket_id = 'movie-images' and (select private.is_admin())
  );
create policy movie_images_admin_delete on storage.objects
  for delete to authenticated using (
    bucket_id = 'movie-images' and (select private.is_admin())
  );

-- Supabase projects normally have this publication already.
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'comments'
  ) then
    alter publication supabase_realtime add table public.comments;
  end if;
end;
$$;
commit;

-- AFTER creating an admin Auth account, separately run with its real UUID:
-- insert into private.admin_users(user_id) values ('YOUR_AUTH_USER_UUID'::uuid);
-- Never trust user-editable user_metadata to decide administrator status.
