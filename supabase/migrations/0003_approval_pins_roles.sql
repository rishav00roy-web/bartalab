-- Members must be approved by an admin before they can see anything.
alter table public.profiles add column approved boolean not null default false;
update public.profiles set approved = true;  -- everyone who signed up before this change

-- Pinned posts float to the top of the feed.
alter table public.posts add column pinned boolean not null default false;
create index posts_pinned_idx on public.posts (pinned desc, created_at desc);

create or replace function public.is_approved()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and approved);
$$;
revoke execute on function public.is_approved() from public, anon;
grant execute on function public.is_approved() to authenticated;

-- First account: approved admin. Everyone after: unapproved member.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare first_user boolean;
begin
  first_user := not exists (select 1 from public.profiles where role = 'admin');
  insert into public.profiles (id, full_name, role, approved)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    case when first_user then 'admin' else 'member' end,
    first_user
  );
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Read access now requires approval (you can always read your own profile).
drop policy "Signed-in users can read profiles" on public.profiles;
create policy "Approved users read profiles; everyone reads own" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_approved()));

drop policy "Signed-in users can read posts" on public.posts;
create policy "Approved users can read posts" on public.posts for select to authenticated
  using ((select public.is_approved()));

drop policy "Signed-in users can read comments" on public.comments;
create policy "Approved users can read comments" on public.comments for select to authenticated
  using ((select public.is_approved()));
drop policy "Signed-in users can comment as themselves" on public.comments;
create policy "Approved users comment as themselves" on public.comments for insert to authenticated
  with check (author_id = (select auth.uid()) and (select public.is_approved()));

drop policy "Signed-in users can read reactions" on public.reactions;
create policy "Approved users can read reactions" on public.reactions for select to authenticated
  using ((select public.is_approved()));
drop policy "Users react as themselves" on public.reactions;
create policy "Approved users react as themselves" on public.reactions for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.is_approved()));

-- Admin-only member management. Guards against leaving the org with no admin.
create or replace function public.admin_set_member(target uuid, new_role text, new_approved boolean)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can manage members';
  end if;
  if new_role not in ('admin', 'member') then
    raise exception 'Unknown role';
  end if;
  if target = (select auth.uid()) and (new_role <> 'admin' or not new_approved) then
    raise exception 'You can''t remove your own admin access';
  end if;
  update public.profiles
    set role = new_role, approved = case when new_role = 'admin' then true else new_approved end
    where id = target;
end;
$$;
revoke execute on function public.admin_set_member(uuid, text, boolean) from public, anon;
grant execute on function public.admin_set_member(uuid, text, boolean) to authenticated;

-- Live feed updates.
alter publication supabase_realtime add table public.posts, public.comments, public.reactions;
