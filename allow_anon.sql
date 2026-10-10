-- Temporary policy to allow anonymous users to insert and update movies
-- since we haven't set up full Supabase Authentication yet.

drop policy if exists movies_anon_insert on public.movies;
create policy movies_anon_insert on public.movies
  for insert to anon, authenticated with check (true);
  
drop policy if exists movies_anon_update on public.movies;
create policy movies_anon_update on public.movies
  for update to anon, authenticated using (true) with check (true);
  
drop policy if exists movies_anon_delete on public.movies;
create policy movies_anon_delete on public.movies
  for delete to anon, authenticated using (true);
