-- Admin user management infrastructure for Witness Project.
-- Run in Supabase SQL Editor as a privileged role.

create table if not exists public.user_admin_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  account_status text not null default 'active' check (account_status in ('active', 'suspended', 'disabled', 'pending', 'anonymized')),
  admin_notes text null,
  updated_by uuid null references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_log (
  id bigserial primary key,
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  target_user_id uuid not null references auth.users(id) on delete cascade,
  action_type text not null,
  old_value jsonb null,
  new_value jsonb null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text null,
  recipient_name text not null,
  address_line1 text not null,
  address_line2 text null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'United States',
  phone text null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkout_sessions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_session_id text not null unique,
  status text not null default 'created',
  payment_status text not null default 'pending',
  item_count integer not null default 0,
  amount_total numeric null,
  shipping_recipient_name text null,
  shipping_address_line1 text null,
  shipping_address_line2 text null,
  shipping_city text null,
  shipping_state text null,
  shipping_postal_code text null,
  shipping_country text null,
  shipping_phone text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  screen_name text not null unique,
  display_name text not null,
  tagline text null,
  bio text null,
  mission text null,
  follow_links jsonb not null default '{}'::jsonb,
  avatar_url text null,
  banner_url text null,
  background_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.creator_profiles add column if not exists avatar_url text null;
alter table public.creator_profiles add column if not exists banner_url text null;
alter table public.creator_profiles add column if not exists background_url text null;

create unique index if not exists user_addresses_one_default_per_user
  on public.user_addresses (user_id)
  where is_default = true;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_addresses_touch_updated_at on public.user_addresses;
create trigger user_addresses_touch_updated_at
before update on public.user_addresses
for each row execute function public.touch_updated_at();

drop trigger if exists checkout_sessions_touch_updated_at on public.checkout_sessions;
create trigger checkout_sessions_touch_updated_at
before update on public.checkout_sessions
for each row execute function public.touch_updated_at();

drop trigger if exists creator_profiles_touch_updated_at on public.creator_profiles;
create trigger creator_profiles_touch_updated_at
before update on public.creator_profiles
for each row execute function public.touch_updated_at();

alter table public.user_admin_state enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.user_addresses enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.creator_profiles enable row level security;

drop policy if exists user_addresses_select_own on public.user_addresses;
create policy user_addresses_select_own on public.user_addresses
for select to authenticated using (auth.uid() = user_id);

drop policy if exists user_addresses_insert_own on public.user_addresses;
create policy user_addresses_insert_own on public.user_addresses
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists user_addresses_update_own on public.user_addresses;
create policy user_addresses_update_own on public.user_addresses
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists user_addresses_delete_own on public.user_addresses;
create policy user_addresses_delete_own on public.user_addresses
for delete to authenticated using (auth.uid() = user_id);

drop policy if exists checkout_sessions_none on public.checkout_sessions;
create policy checkout_sessions_none on public.checkout_sessions
for all to authenticated using (false) with check (false);

drop policy if exists creator_profiles_public_read on public.creator_profiles;
create policy creator_profiles_public_read on public.creator_profiles
for select to anon, authenticated using (true);

drop policy if exists creator_profiles_owner_insert on public.creator_profiles;
create policy creator_profiles_owner_insert on public.creator_profiles
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists creator_profiles_owner_update on public.creator_profiles;
create policy creator_profiles_owner_update on public.creator_profiles
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists user_admin_state_read_none on public.user_admin_state;
create policy user_admin_state_read_none on public.user_admin_state
for select to authenticated using (false);

drop policy if exists user_admin_state_write_none on public.user_admin_state;
create policy user_admin_state_write_none on public.user_admin_state
for all to authenticated using (false) with check (false);

drop policy if exists admin_audit_log_read_none on public.admin_audit_log;
create policy admin_audit_log_read_none on public.admin_audit_log
for select to authenticated using (false);

drop policy if exists admin_audit_log_write_none on public.admin_audit_log;
create policy admin_audit_log_write_none on public.admin_audit_log
for all to authenticated using (false) with check (false);

create or replace function public.is_admin_user(p_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, auth
as $$
  select coalesce(lower(u.raw_user_meta_data->>'role') = 'admin', false)
  from auth.users u
  where u.id = p_user_id
$$;

grant execute on function public.is_admin_user(uuid) to authenticated;

create or replace function public.get_order_count_for_user(p_user_id uuid)
returns integer
language plpgsql
security definer
stable
set search_path = public, auth
as $$
declare
  c integer := 0;
begin
  if to_regclass('public.orders') is not null then
    execute 'select count(*)::int from public.orders where user_id = $1' into c using p_user_id;
  elsif to_regclass('public.order_history') is not null then
    execute 'select count(*)::int from public.order_history where user_id = $1' into c using p_user_id;
  end if;
  return coalesce(c, 0);
end;
$$;

create or replace function public.get_submission_count_for_user(p_user_id uuid)
returns integer
language plpgsql
security definer
stable
set search_path = public, auth
as $$
declare
  c integer := 0;
begin
  if to_regclass('public.submitted_designs') is not null then
    execute 'select count(*)::int from public.submitted_designs where user_id = $1' into c using p_user_id;
  elsif to_regclass('public.design_submissions') is not null then
    execute 'select count(*)::int from public.design_submissions where user_id = $1' into c using p_user_id;
  end if;
  return coalesce(c, 0);
end;
$$;

create or replace function public.get_total_spent_for_user(p_user_id uuid)
returns numeric
language plpgsql
security definer
stable
set search_path = public, auth
as $$
declare
  total_spent numeric := 0;
begin
  if to_regclass('public.orders') is not null then
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'orders' and column_name = 'total_amount'
    ) then
      execute 'select coalesce(sum(total_amount), 0)::numeric from public.orders where user_id = $1' into total_spent using p_user_id;
    elsif exists (
      select 1
      from information_schema.columns
      where table_schema = 'public' and table_name = 'orders' and column_name = 'total'
    ) then
      execute 'select coalesce(sum(total), 0)::numeric from public.orders where user_id = $1' into total_spent using p_user_id;
    end if;
  end if;

  if coalesce(total_spent, 0) = 0 and to_regclass('public.checkout_sessions') is not null then
    execute 'select coalesce(sum(amount_total), 0)::numeric from public.checkout_sessions where user_id = $1 and payment_status = ''paid'''
      into total_spent
      using p_user_id;
  end if;

  return coalesce(total_spent, 0);
end;
$$;

grant execute on function public.get_total_spent_for_user(uuid) to authenticated;

create or replace function public.admin_list_users(
  p_search text default null,
  p_status text default null,
  p_role text default null
)
returns table (
  user_id uuid,
  display_name text,
  email text,
  role text,
  account_status text,
  created_at timestamptz,
  last_login_at timestamptz,
  order_count integer,
  submission_count integer,
  total_spent numeric
)
language sql
security definer
set search_path = public, auth
as $$
  select
    u.id as user_id,
    coalesce(u.raw_user_meta_data->>'screen_name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as display_name,
    u.email,
    coalesce(u.raw_user_meta_data->>'role', 'Customer') as role,
    coalesce(s.account_status, 'active') as account_status,
    u.created_at,
    u.last_sign_in_at as last_login_at,
    public.get_order_count_for_user(u.id) as order_count,
    public.get_submission_count_for_user(u.id) as submission_count,
    public.get_total_spent_for_user(u.id) as total_spent
  from auth.users u
  left join public.user_admin_state s on s.user_id = u.id
  where public.is_admin_user(auth.uid())
    and (
      p_search is null
      or p_search = ''
      or u.email ilike '%' || p_search || '%'
      or coalesce(u.raw_user_meta_data->>'screen_name', u.raw_user_meta_data->>'full_name', '') ilike '%' || p_search || '%'
    )
    and (p_status is null or p_status = '' or coalesce(s.account_status, 'active') = p_status)
    and (
      p_role is null
      or p_role = ''
      or lower(coalesce(u.raw_user_meta_data->>'role', 'Customer')) = lower(p_role)
    )
  order by u.created_at desc
$$;

grant execute on function public.admin_list_users(text, text, text) to authenticated;

create or replace function public.admin_get_user_detail(p_target_user_id uuid)
returns table (
  user_id uuid,
  display_name text,
  email text,
  role text,
  account_status text,
  created_at timestamptz,
  last_login_at timestamptz,
  order_count integer,
  submission_count integer,
  total_spent numeric,
  phone_number text,
  admin_notes text
)
language sql
security definer
set search_path = public, auth
as $$
  select
    u.id as user_id,
    coalesce(u.raw_user_meta_data->>'screen_name', u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as display_name,
    u.email,
    coalesce(u.raw_user_meta_data->>'role', 'Customer') as role,
    coalesce(s.account_status, 'active') as account_status,
    u.created_at,
    u.last_sign_in_at as last_login_at,
    public.get_order_count_for_user(u.id) as order_count,
    public.get_submission_count_for_user(u.id) as submission_count,
    public.get_total_spent_for_user(u.id) as total_spent,
    coalesce(
      nullif(u.raw_user_meta_data->>'phone', ''),
      nullif(u.raw_user_meta_data->>'shipping_phone', '')
    ) as phone_number,
    s.admin_notes
  from auth.users u
  left join public.user_admin_state s on s.user_id = u.id
  where public.is_admin_user(auth.uid()) and u.id = p_target_user_id
$$;

grant execute on function public.admin_get_user_detail(uuid) to authenticated;

create or replace function public.admin_update_user(
  p_target_user_id uuid,
  p_new_role text,
  p_new_status text,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_admin uuid := auth.uid();
  v_old_meta jsonb;
  v_new_meta jsonb;
  v_old_status text;
begin
  if not public.is_admin_user(v_admin) then
    raise exception 'Admin access required';
  end if;

  select raw_user_meta_data into v_old_meta from auth.users where id = p_target_user_id;
  if v_old_meta is null then
    raise exception 'User not found';
  end if;

  v_old_meta := coalesce(v_old_meta, '{}'::jsonb);
  v_new_meta := jsonb_set(v_old_meta, '{role}', to_jsonb(p_new_role), true);

  update auth.users
  set raw_user_meta_data = v_new_meta
  where id = p_target_user_id;

  select account_status into v_old_status from public.user_admin_state where user_id = p_target_user_id;

  insert into public.user_admin_state (user_id, account_status, admin_notes, updated_by, updated_at)
  values (p_target_user_id, p_new_status, p_notes, v_admin, now())
  on conflict (user_id) do update
    set account_status = excluded.account_status,
        admin_notes = excluded.admin_notes,
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at;

  insert into public.admin_audit_log (admin_user_id, target_user_id, action_type, old_value, new_value)
  values (
    v_admin,
    p_target_user_id,
    'update_user',
    jsonb_build_object('meta', v_old_meta, 'status', coalesce(v_old_status, 'active')),
    jsonb_build_object('meta', v_new_meta, 'status', p_new_status, 'notes', p_notes)
  );
end;
$$;

grant execute on function public.admin_update_user(uuid, text, text, text) to authenticated;

create or replace function public.admin_apply_dangerous_action(
  p_target_user_id uuid,
  p_action text,
  p_confirmation text
)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_admin uuid := auth.uid();
  v_email text;
  v_old_meta jsonb;
  v_new_meta jsonb;
  v_target_has_orders boolean := false;
begin
  if not public.is_admin_user(v_admin) then
    raise exception 'Admin access required';
  end if;

  select email, coalesce(raw_user_meta_data, '{}'::jsonb) into v_email, v_old_meta from auth.users where id = p_target_user_id;
  if v_email is null then
    raise exception 'User not found';
  end if;

  if p_confirmation is null or (p_confirmation <> 'DELETE' and lower(p_confirmation) <> lower(v_email)) then
    raise exception 'Confirmation text mismatch';
  end if;

  if to_regclass('public.orders') is not null then
    execute 'select exists(select 1 from public.orders where user_id = $1)' into v_target_has_orders using p_target_user_id;
  end if;

  if p_action = 'suspend' then
    insert into public.user_admin_state (user_id, account_status, updated_by, updated_at)
    values (p_target_user_id, 'suspended', v_admin, now())
    on conflict (user_id) do update set account_status = 'suspended', updated_by = v_admin, updated_at = now();
  elsif p_action = 'reactivate' then
    insert into public.user_admin_state (user_id, account_status, updated_by, updated_at)
    values (p_target_user_id, 'active', v_admin, now())
    on conflict (user_id) do update set account_status = 'active', updated_by = v_admin, updated_at = now();
  elsif p_action = 'disable' then
    insert into public.user_admin_state (user_id, account_status, updated_by, updated_at)
    values (p_target_user_id, 'disabled', v_admin, now())
    on conflict (user_id) do update set account_status = 'disabled', updated_by = v_admin, updated_at = now();
  elsif p_action = 'anonymize' or p_action = 'delete_data' then
    v_new_meta := v_old_meta
      || jsonb_build_object(
        'screen_name', 'anonymized-user',
        'full_name', 'Anonymized',
        'shipping_address', null,
        'shipping_city', null,
        'shipping_state', null,
        'shipping_zip', null
      );

    update auth.users
    set raw_user_meta_data = v_new_meta
    where id = p_target_user_id;

    if to_regclass('public.user_profiles') is not null then
      execute 'update public.user_profiles set screen_name = $2, bio = null, website = null, avatar_url = null where user_id = $1'
      using p_target_user_id, 'anonymized-user';
    end if;

    insert into public.user_admin_state (user_id, account_status, updated_by, updated_at)
    values (p_target_user_id, 'anonymized', v_admin, now())
    on conflict (user_id) do update set account_status = 'anonymized', updated_by = v_admin, updated_at = now();
  else
    raise exception 'Unsupported action';
  end if;

  insert into public.admin_audit_log (admin_user_id, target_user_id, action_type, old_value, new_value)
  values (
    v_admin,
    p_target_user_id,
    p_action,
    jsonb_build_object('email', v_email, 'meta', v_old_meta, 'had_orders', v_target_has_orders),
    jsonb_build_object('status', (select account_status from public.user_admin_state where user_id = p_target_user_id))
  );

  return case when v_target_has_orders and p_action = 'delete_data'
    then 'User had order history. Personal data was anonymized instead of full deletion.'
    else 'Action completed.'
  end;
end;
$$;

grant execute on function public.admin_apply_dangerous_action(uuid, text, text) to authenticated;

create or replace function public.admin_get_user_shipping_addresses(p_target_user_id uuid)
returns table (
  id uuid,
  label text,
  is_default boolean,
  recipient_name text,
  line1 text,
  line2 text,
  city text,
  state text,
  postal_code text,
  country text,
  phone_number text
)
language sql
security definer
set search_path = public, auth
as $$
  select
    ua.id,
    ua.label,
    ua.is_default,
    ua.recipient_name,
    ua.address_line1 as line1,
    ua.address_line2 as line2,
    ua.city,
    ua.state,
    ua.postal_code,
    ua.country,
    ua.phone as phone_number
  from public.user_addresses ua
  where public.is_admin_user(auth.uid()) and ua.user_id = p_target_user_id
  union all
  select
    null::uuid as id,
    'Profile Shipping'::text as label,
    true as is_default,
    coalesce(
      nullif(u.raw_user_meta_data->>'full_name', ''),
      nullif(u.raw_user_meta_data->>'screen_name', '')
    ) as recipient_name,
    nullif(u.raw_user_meta_data->>'shipping_address', '') as line1,
    nullif(u.raw_user_meta_data->>'shipping_address_2', '') as line2,
    nullif(u.raw_user_meta_data->>'shipping_city', '') as city,
    nullif(u.raw_user_meta_data->>'shipping_state', '') as state,
    nullif(u.raw_user_meta_data->>'shipping_zip', '') as postal_code,
    coalesce(nullif(u.raw_user_meta_data->>'shipping_country', ''), 'United States') as country,
    coalesce(nullif(u.raw_user_meta_data->>'shipping_phone', ''), nullif(u.raw_user_meta_data->>'phone', '')) as phone_number
  from auth.users u
  where public.is_admin_user(auth.uid())
    and u.id = p_target_user_id
    and not exists (select 1 from public.user_addresses ua2 where ua2.user_id = p_target_user_id)
$$;

grant execute on function public.admin_get_user_shipping_addresses(uuid) to authenticated;

create or replace function public.admin_get_user_purchases(
  p_target_user_id uuid,
  p_limit integer default 20
)
returns table (
  order_id text,
  order_number text,
  order_date timestamptz,
  order_status text,
  payment_status text,
  item_count integer,
  order_total numeric,
  shipping_summary text
)
language plpgsql
security definer
stable
set search_path = public, auth
as $$
begin
  if not public.is_admin_user(auth.uid()) then
    raise exception 'Admin access required';
  end if;

  if to_regclass('public.orders') is null then
    if to_regclass('public.checkout_sessions') is not null then
      return query
      select
        cs.stripe_session_id as order_id,
        cs.stripe_session_id as order_number,
        cs.created_at as order_date,
        cs.status as order_status,
        cs.payment_status as payment_status,
        cs.item_count as item_count,
        coalesce(cs.amount_total, 0)::numeric as order_total,
        concat_ws(
          ', ',
          nullif(cs.shipping_address_line1, ''),
          nullif(cs.shipping_city, ''),
          nullif(cs.shipping_state, ''),
          nullif(cs.shipping_postal_code, '')
        ) as shipping_summary
      from public.checkout_sessions cs
      where cs.user_id = p_target_user_id
      order by cs.created_at desc
      limit greatest(coalesce(p_limit, 20), 1);
    end if;
    return;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public' and table_name = 'orders' and column_name = 'total_amount'
  ) then
    return query execute $sql$
      select
        o.id::text as order_id,
        coalesce(nullif(o.order_number::text, ''), o.id::text) as order_number,
        o.created_at as order_date,
        coalesce(o.status::text, 'unknown') as order_status,
        coalesce(o.payment_status::text, 'unknown') as payment_status,
        coalesce(o.item_count, 0) as item_count,
        coalesce(o.total_amount, 0)::numeric as order_total,
        concat_ws(', ', nullif(o.shipping_address, ''), nullif(o.shipping_city, ''), nullif(o.shipping_state, ''), nullif(o.shipping_zip, '')) as shipping_summary
      from public.orders o
      where o.user_id = $1
      order by o.created_at desc
      limit $2
    $sql$
    using p_target_user_id, greatest(coalesce(p_limit, 20), 1);
  else
    return query execute $sql$
      select
        o.id::text as order_id,
        coalesce(nullif(o.order_number::text, ''), o.id::text) as order_number,
        o.created_at as order_date,
        coalesce(o.status::text, 'unknown') as order_status,
        coalesce(o.payment_status::text, 'unknown') as payment_status,
        coalesce(o.item_count, 0) as item_count,
        coalesce(o.total, 0)::numeric as order_total,
        concat_ws(', ', nullif(o.shipping_address, ''), nullif(o.shipping_city, ''), nullif(o.shipping_state, ''), nullif(o.shipping_zip, '')) as shipping_summary
      from public.orders o
      where o.user_id = $1
      order by o.created_at desc
      limit $2
    $sql$
    using p_target_user_id, greatest(coalesce(p_limit, 20), 1);
  end if;
end;
$$;

grant execute on function public.admin_get_user_purchases(uuid, integer) to authenticated;
