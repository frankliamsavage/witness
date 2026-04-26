-- Run this once in Supabase SQL Editor.
-- Enforces case-insensitive unique screen names and syncs signup metadata.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  screen_name text not null,
  screen_name_normalized text generated always as (lower(screen_name)) stored,
  account_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists user_profiles_screen_name_normalized_key
  on public.user_profiles (screen_name_normalized);

alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
  on public.user_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.touch_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_touch_updated_at on public.user_profiles;
create trigger user_profiles_touch_updated_at
before update on public.user_profiles
for each row execute function public.touch_user_profiles_updated_at();

create or replace function public.sync_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  incoming_screen_name text;
  incoming_account_type text;
begin
  incoming_screen_name := nullif(trim(new.raw_user_meta_data->>'screen_name'), '');
  incoming_account_type := nullif(trim(new.raw_user_meta_data->>'role'), '');

  if incoming_screen_name is null then
    return new;
  end if;

  insert into public.user_profiles (user_id, screen_name, account_type)
  values (new.id, incoming_screen_name, incoming_account_type)
  on conflict (user_id) do update
    set screen_name = excluded.screen_name,
        account_type = excluded.account_type;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_sync_profile on auth.users;
create trigger on_auth_user_created_sync_profile
after insert on auth.users
for each row execute function public.sync_profile_from_auth_user();

drop trigger if exists on_auth_user_updated_sync_profile on auth.users;
create trigger on_auth_user_updated_sync_profile
after update of raw_user_meta_data on auth.users
for each row execute function public.sync_profile_from_auth_user();

create or replace function public.is_screen_name_available(candidate_screen_name text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select not exists (
    select 1
    from public.user_profiles
    where screen_name_normalized = lower(trim(candidate_screen_name))
  );
$$;

grant execute on function public.is_screen_name_available(text) to anon, authenticated;

-- Backfill existing auth users with screen_name metadata.
insert into public.user_profiles (user_id, screen_name, account_type)
select
  u.id,
  trim(u.raw_user_meta_data->>'screen_name') as screen_name,
  nullif(trim(u.raw_user_meta_data->>'role'), '') as account_type
from auth.users u
where nullif(trim(u.raw_user_meta_data->>'screen_name'), '') is not null
on conflict (user_id) do update
  set screen_name = excluded.screen_name,
      account_type = excluded.account_type;
