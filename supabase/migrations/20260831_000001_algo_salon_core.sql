-- ALGO SALON: Core schema, access control, storage policies, and protected workflows.
-- Apply through the Supabase CLI or SQL editor only after reviewing project-specific legal,
-- payment-provider, and retention requirements. This is intentionally restrictive by default.

begin;

create extension if not exists pgcrypto;
create extension if not exists btree_gist;

-- -----------------------------------------------------------------------------
-- 1. Types
-- -----------------------------------------------------------------------------
do $$
begin
  create type public.salon_status as enum ('pending_review', 'published', 'suspended', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.salon_member_role as enum ('owner', 'manager', 'staff');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.appointment_status as enum (
    'pending',
    'confirmed',
    'rescheduled_by_business',
    'completed',
    'cancelled',
    'no_show'
  );
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_method as enum ('pay_at_salon', 'card');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.notification_type as enum ('booking', 'reminder', 'review', 'promo');
exception when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- 2. Tables
-- The Auth schema remains the source of truth for login identifiers and sessions.
-- Do not duplicate passwords, raw OTPs, card PAN/CVC, or Google tokens in public.
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 1 and 120),
  phone_e164 text check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  avatar_path text,
  preferred_locale text not null default 'en' check (preferred_locale ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  preferred_currency text not null default 'AED' check (preferred_currency ~ '^[A-Z]{3}$'),
  marketing_opt_in boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete restrict,
  status public.salon_status not null default 'pending_review',
  name text not null check (char_length(trim(name)) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  tagline text,
  description text,
  phone_e164 text not null check (phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  address_line1 text not null,
  address_line2 text,
  city text not null,
  country_code char(2) not null check (country_code ~ '^[A-Z]{2}$'),
  postal_code text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  timezone text not null default 'Asia/Dubai',
  map_url text,
  price_range smallint check (price_range between 1 and 4),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((latitude is null and longitude is null) or (latitude between -90 and 90 and longitude between -180 and 180))
);

create table if not exists public.salon_members (
  salon_id uuid not null references public.salons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.salon_member_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (salon_id, user_id)
);

create table if not exists public.business_hours (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  opens_at time,
  closes_at time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, day_of_week),
  check ((is_open = false and opens_at is null and closes_at is null) or
         (is_open = true and opens_at is not null and closes_at is not null and opens_at < closes_at))
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 120),
  category text not null check (char_length(trim(category)) between 2 and 80),
  description text,
  price_minor integer not null check (price_minor >= 0),
  currency char(3) not null default 'AED' check (currency ~ '^[A-Z]{3}$'),
  duration_minutes integer not null check (duration_minutes between 5 and 720),
  original_price_minor integer check (original_price_minor is null or original_price_minor >= price_minor),
  image_path text,
  gender_target text not null default 'Unisex' check (gender_target in ('Unisex', 'Male', 'Female')),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  user_id uuid unique references public.profiles(id) on delete set null,
  display_name text not null check (char_length(trim(display_name)) between 2 and 120),
  role_title text not null check (char_length(trim(role_title)) between 2 and 120),
  avatar_path text,
  phone_e164 text check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  specialties text[] not null default '{}',
  is_bookable boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_services (
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (staff_id, service_id)
);

create table if not exists public.staff_working_hours (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff_profiles(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  is_working boolean not null default true,
  starts_at time,
  ends_at time,
  unique (staff_id, day_of_week),
  check ((is_working = false and starts_at is null and ends_at is null) or
         (is_working = true and starts_at is not null and ends_at is not null and starts_at < ends_at))
);

create table if not exists public.salon_media (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  object_path text not null unique,
  alt_text text,
  media_type text not null check (media_type in ('cover', 'gallery', 'service')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete restrict,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  customer_display_name text not null check (char_length(trim(customer_display_name)) between 1 and 120),
  customer_phone_e164 text,
  customer_avatar_path text,
  service_id uuid not null references public.services(id) on delete restrict,
  staff_id uuid not null references public.staff_profiles(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'pending',
  payment_method public.payment_method not null default 'pay_at_salon',
  quoted_price_minor integer not null check (quoted_price_minor >= 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  customer_notes text check (char_length(customer_notes) <= 1000),
  business_note text check (char_length(business_note) <= 1000),
  proposed_starts_at timestamptz,
  proposed_ends_at timestamptz,
  proposal_note text check (char_length(proposal_note) <= 1000),
  cancelled_at timestamptz,
  cancellation_reason text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at),
  check ((proposed_starts_at is null and proposed_ends_at is null) or
         (proposed_starts_at is not null and proposed_ends_at is not null and proposed_starts_at < proposed_ends_at))
);

commit;
