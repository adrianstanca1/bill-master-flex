-- Migration for user_consents and company_invites tables
-- Auto-generated on 2025-08-25

-- 1) User consents (ToS/Privacy, versioned)
create table if not exists public.user_consents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  policy      text not null check (policy in ('terms','privacy')),
  version     text not null,
  accepted_at timestamptz not null default now()
);

alter table public.user_consents enable row level security;

-- Users can see & write their own consents
drop policy if exists "consents_select_own" on public.user_consents;
create policy "consents_select_own"
on public.user_consents for select
to authenticated using (auth.uid() = user_id);

drop policy if exists "consents_insert_own" on public.user_consents;
create policy "consents_insert_own"
on public.user_consents for insert
to authenticated with check (auth.uid() = user_id);

-- 2) Company invites (optional)
create table if not exists public.company_invites (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid not null references public.companies(id) on delete cascade,
  code         text not null unique,
  invited_email text,
  role         text not null default 'member',
  expires_at   timestamptz not null,
  created_by   uuid not null,
  created_at   timestamptz not null default now(),
  redeemed_by  uuid,
  redeemed_at  timestamptz
);

alter table public.company_invites enable row level security;

-- Only company admins can create/view invites for their company
create policy "invites_view_members"
on public.company_invites for select
to authenticated
using (public.is_company_member(company_id));

create policy "invites_create_admin_only"
on public.company_invites for insert
to authenticated
with check (public.is_company_admin(company_id));

-- Helper: redeem invite (joins user to company_members)
create or replace function public.redeem_company_invite(_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv public.company_invites;
begin
  select * into v_inv
  from public.company_invites
  where code = _code and redeemed_at is null and now() < expires_at;

  if not found then
    return false;
  end if;

  insert into public.company_members (company_id, user_id, role)
  values (v_inv.company_id, auth.uid(), v_inv.role)
  on conflict (company_id, user_id) do nothing;

  update public.company_invites
    set redeemed_by = auth.uid(), redeemed_at = now()
  where id = v_inv.id;

  return true;
end;
$$;