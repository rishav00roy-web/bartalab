# SATYAMEV JAYATE 24 (SJ24)

The SJ24 digital news portal: a public news site in English and Assamese, and
a signed-in newsroom for SJ24's reporters and editors. Published by Gousamuh
Gramaya Foundation. Built with Next.js 15 (App Router) and Supabase.

| Where | What |
| --- | --- |
| `/` | Public homepage |
| `/news/[slug]`, `/category/[slug]`, `/district/[slug]`, `/districts`, `/search`, `/p/[slug]` | Public article, section, district, search and information pages |
| `/newsroom`, `/members`, `/profile` | Newsroom (sign-in required) |
| `/login` | Newsroom sign-in |

Assamese pages are the same addresses with `?lang=as`.

**Sample content.** The public pages show sample stories from `lib/sj24/sample.ts`
(a banner on every page says so) until the article database is built.

## Code map

- `app/` – routes. `app/sj24.css` styles the public site, `app/globals.css` the newsroom.
- `app/newsletter-actions.ts` – the morning newsletter sign-up (server action).
- `components/sj24/site.tsx` – the public site's shell: masthead, floating navbar, footer, story cards.
- `components/sj24/views.tsx` – one view per public page.
- `components/sj24/client/` – the interactive parts, one file each: header (clock, theme, floating navbar, More menu), motion (rotating words, elastic divider), line figures, footer crowd video, newsletter form, print button.
- `lib/sj24/` – languages and interface text (`i18n.ts`), date formatting, sample content.
- `lib/hairline/` – three line figures (dish, relay, loupe) copied from [Hairline](https://github.com/lucasmarkes/hairline), MIT (see `lib/hairline/LICENSE`).
- `components/*.tsx`, `app/actions.ts` – the newsroom feed.
- `public/footer/` – the footer crowd video (generated with Gemini) and its still.

The floating navbar, rotating words and elastic divider are adapted from the
Annnimate starter pack and rewritten without GSAP.

## Newsroom permissions

- The **first account** that signs up becomes the admin. Everyone after that must be **approved by an admin** (Members page) before they can see anything.
- Only admins can create, edit, pin or delete posts and upload media (enforced by database policies, not just the interface).
- Members can react (one reaction per post) and comment. People can delete their own comments; admins can delete any.
- Everyone can change their name and password on the Profile page. The feed updates live.

## Database

Apply every file in `supabase/migrations/` in order (Supabase > SQL Editor):

- `0001`–`0003` – the newsroom (profiles, posts, comments, reactions, approval, pins).
- `0004_newsletter_signups.sql` – newsletter sign-ups. Anyone can add an email; nobody can read the list from the site (see it in Supabase > Table Editor). Until this is applied the sign-up form says sign-up isn't available.

Sending the newsletter needs an email service (for example Resend or Brevo); it isn't built yet.

## Email

Supabase's built-in email only delivers to the project owner's address, so "Confirm email" is turned off
and password-reset emails only work after you add your own SMTP provider
(Supabase > Authentication > Emails > SMTP settings).

## Running locally

1. `cp .env.example .env.local` and fill in your Supabase URL and publishable key.
2. Apply the SQL in `supabase/migrations/` to your Supabase project.
3. `npm install` then `npm run dev`, and open http://localhost:3000.

## Deploying

Import the repo in Vercel and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
In Supabase, set Authentication > URL Configuration > Site URL to your Vercel URL.
Use a Vercel Pro plan (or another host) once the site carries advertising: the free Hobby plan is for non-commercial use only.
