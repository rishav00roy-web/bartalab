# Bartalab

A private news feed for one organization. Admins post text, pictures, videos and links; everyone else reads, reacts and comments.

Built with Next.js 15 (App Router) and Supabase (auth, Postgres with row-level security, storage).

## How permissions work

- The **first account** that signs up becomes the admin. Everyone after that is a member.
- Only admins can create or delete posts and upload media (enforced by database policies, not just the UI).
- Members can react (one reaction per post) and comment. People can delete their own comments; admins can delete any.
- To make someone else an admin, run in the Supabase SQL editor:
  `update profiles set role = 'admin' where id = (select id from auth.users where email = 'person@example.com');`

## Running locally

1. `cp .env.example .env.local` and fill in your Supabase URL and publishable key.
2. Apply the SQL in `supabase/migrations/` to your Supabase project (already done for the hosted project).
3. `npm install` then `npm run dev`.

## Deploying

Import the repo in Vercel and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
In Supabase, set Authentication > URL Configuration > Site URL to your Vercel URL.
