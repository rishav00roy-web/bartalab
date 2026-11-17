-- Bartalab: organization news feed. Only admins post; members comment and react.

-- Profiles -----------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- True when the signed-in user is an admin. Security definer so policies
-- can call it without recursing into profiles' own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- New sign-ups get a profile. The very first account becomes the admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    case when exists (select 1 from public.profiles where role = 'admin') then 'member' else 'admin' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create policy "Signed-in users can read profiles"
  on public.profiles for select to authenticated using (true);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "Admins can update any profile"
  on public.profiles for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Members may only change their name; role changes go through admins.
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Posts --------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null default '',
  link_url text,
  media_path text,
  media_type text check (media_type in ('image', 'video')),
  created_at timestamptz not null default now(),
  constraint post_not_empty check (
    length(trim(body)) > 0 or link_url is not null or media_path is not null
  ),
  constraint media_pair check ((media_path is null) = (media_type is null))
);

create index posts_created_at_idx on public.posts (created_at desc);
create index posts_author_idx on public.posts (author_id);

alter table public.posts enable row level security;

create policy "Signed-in users can read posts"
  on public.posts for select to authenticated using (true);

create policy "Admins can create posts"
  on public.posts for insert to authenticated
  with check ((select public.is_admin()) and author_id = (select auth.uid()));

create policy "Admins can edit posts"
  on public.posts for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins can delete posts"
  on public.posts for delete to authenticated
  using ((select public.is_admin()));

-- Comments -----------------------------------------------------------------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index comments_post_idx on public.comments (post_id, created_at);
create index comments_author_idx on public.comments (author_id);

alter table public.comments enable row level security;

create policy "Signed-in users can read comments"
  on public.comments for select to authenticated using (true);

create policy "Signed-in users can comment as themselves"
  on public.comments for insert to authenticated
  with check (author_id = (select auth.uid()));

create policy "Authors and admins can delete comments"
  on public.comments for delete to authenticated
  using (author_id = (select auth.uid()) or (select public.is_admin()));

-- Reactions (one per person per post) -------------------------------------
create table public.reactions (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('like', 'celebrate', 'insightful')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index reactions_user_idx on public.reactions (user_id);

alter table public.reactions enable row level security;

create policy "Signed-in users can read reactions"
  on public.reactions for select to authenticated using (true);

create policy "Users react as themselves"
  on public.reactions for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users change their own reaction"
  on public.reactions for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Users remove their own reaction"
  on public.reactions for delete to authenticated
  using (user_id = (select auth.uid()));

-- Media storage ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-media', 'post-media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

create policy "Admins upload post media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-media' and (select public.is_admin()));

create policy "Admins delete post media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-media' and (select public.is_admin()));
