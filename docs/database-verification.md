# Database verification

Run these checks in a disposable Supabase project after the initial SQL. They require real Auth UUIDs and signed sessions. Application build checks do not establish RLS correctness.

1. With an anon client: selecting movies/comments succeeds. Inserting a comment for an existing movie succeeds; supplying id or created_at is denied. Whitespace-only/oversized fields and nonexistent movie IDs fail.
2. With anon and ordinary authenticated sessions: movie inserts/updates/deletes and comment updates/deletes are denied. Admin membership reads and writes are denied.
3. With an allowlisted admin session: movie CRUD and comment moderation succeed. Removing the admin's allowlist entry immediately blocks subsequent writes.
4. Invalid rating, empty title, negative likes_count, non-HTTPS URLs and malformed link objects fail database constraints.
5. Subscribe to comments INSERT filtered by movie_id using an anon client, insert a valid comment and confirm delivery.
6. Upload a raster image <=5 MiB using an allowlisted admin: succeeds. Upload as anon or a non-admin: denied. SVG and over-limit objects: denied.
7. Confirm private is not an exposed API schema, service-role credentials remain server-only, and no broader legacy policies exist on storage.objects.

Inspection queries:

```sql
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies where schemaname in ('public', 'private', 'storage');
select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_name in ('movies', 'comments', 'admin_users');
select * from pg_publication_tables where pubname = 'supabase_realtime';
```
