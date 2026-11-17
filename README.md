# Bartalab

A private news feed for one organization. Admins post text, pictures, videos and links; everyone else reads, reacts and comments.

Built with Next.js 15 (App Router) and Supabase (auth, Postgres with row-level security, storage).

## How permissions work

- The **first account** that signs up becomes the admin. Everyone after that is a member who must be **approved by an admin** (Members page) before they can see anything.
- Only admins can create or delete posts and upload media (enforced by database policies, not just the UI).
- Members can react (one reaction per post) and comment. People can delete their own comments; admins can delete any.
- Admins approve sign-ups, make other admins, or remove access on the Members page.
- Admins can edit, pin and delete posts. Pinned posts stay at the top of the feed.
- Everyone can change their name and password on the Profile page.
- The feed updates live when someone posts, comments or reacts.

## Email

Supabase's built-in email only delivers to the project owner's address, so "Confirm email" is turned off
and password-reset emails only work after you add your own SMTP provider
(Supabase > Authentication > Emails > SMTP settings, e.g. Resend or Brevo free tiers).

## Running locally

1. `cp .env.example .env.local` and fill in your Supabase URL and publishable key.
2. Apply the SQL in `supabase/migrations/` to your Supabase project (already done for the hosted project).
3. `npm install` then `npm run dev`.

## Deploying

Import the repo in Vercel and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
In Supabase, set Authentication > URL Configuration > Site URL to your Vercel URL.
