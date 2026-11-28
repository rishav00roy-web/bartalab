-- Morning briefing sign-ups from the public site.
-- Anyone may add their email; nobody can read the list through the public
-- API (only the Supabase dashboard or a service key can).

create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  lang text not null default 'en' check (lang in ('en', 'as')),
  created_at timestamptz not null default now(),
  constraint newsletter_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254)
);

-- One sign-up per address, whatever the capitals.
create unique index newsletter_signups_email_idx on public.newsletter_signups (lower(email));

alter table public.newsletter_signups enable row level security;

create policy "Anyone can sign up"
  on public.newsletter_signups for insert to anon, authenticated
  with check (true);

-- No select, update or delete policies: the list is not readable from the site.
revoke all on public.newsletter_signups from anon, authenticated;
grant insert (email, lang) on public.newsletter_signups to anon, authenticated;
