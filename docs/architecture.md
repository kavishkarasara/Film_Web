# Implementation contracts

## Download links

`download_links` is an array of objects with exactly: `quality`, `provider`, `url`, `label`. Example: `[{"quality":"1080p","provider":"google-drive","url":"https://drive.google.com/example","label":"Download"}]`. Valid providers: google-drive, mega, telegram, mediafire, dropbox, onedrive, other. All URLs must use HTTPS and have no embedded credentials. Step 2 must validate URLs with Zod plus provider-specific host allowlists; SQL validates coarse format and size only.

Ad URLs belong in server-owned configuration in a later phase. Four clicks are counted per download button: clicks 1–3 open the configured ad; click 4 opens the download. UI must show progress and disclose the ads, handle blocked popups, and use noopener/noreferrer. Client state is bypassable.

## Authorization

Private admin membership -> private.is_admin() -> explicit RLS policies. Privileged service-role keys bypass RLS and must never reach a browser. Later server actions should use the caller's verified session and the public key so RLS stays active. Verify the session with Supabase server APIs; do not trust a client-submitted role or user-editable metadata.

## Comments

Only movie_id, user_name, comment_text may be supplied by public inserts. UUID and timestamp are database defaults; clients cannot set them. Anonymous names are self-asserted, not verified identities. Realtime publication includes comments for INSERT events; the frontend should subscribe per movie and refetch after admin moderation deletes/updates.

## Storage

movie-images is public for reading posters/covers; JPEG, PNG, WebP and AVIF only, max 5 MiB. Only authorized admins can write/list/delete through policies. Step 2 must inspect bytes rather than trusting file extensions or browser MIME declarations.
