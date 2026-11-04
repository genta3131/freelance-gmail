-- ============================================================
-- WorkFlow Hub — Initial Schema (0001_init.sql)
-- Jalankan di SQL Editor Supabase, urut dari [0001] naik.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- updated_at helper ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'freelancer' check (role in ('admin', 'freelancer')),
  full_name text,
  avatar_url text,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  notification_email boolean not null default true,
  notification_submission boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. CLIENTS
-- ============================================================
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_clients_updated
  before update on public.clients
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3. FREELANCERS
-- ============================================================
create table public.freelancers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text,
  phone text,
  skills text[] not null default '{}',
  hourly_rate numeric(12, 2),
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_freelancers_updated
  before update on public.freelancers
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. TASKS
-- ============================================================
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) >= 3 and char_length(title) <= 200),
  description text,
  client_id uuid references public.clients (id) on delete set null,
  freelancer_id uuid references public.freelancers (id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'review', 'completed', 'rejected')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_tasks_updated
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5. SUBMISSIONS
-- ============================================================
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  freelancer_id uuid references public.freelancers (id) on delete set null,
  notes text,
  file_url text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  feedback text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_file_url check (file_url is null or file_url like 'http%')
);

create trigger trg_submissions_updated
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- ============================================================
-- 6. ACTIVITY_LOGS
-- ============================================================
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null check (entity_type in ('task', 'freelancer', 'client', 'submission', 'auth')),
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_tasks_status on public.tasks (status);
create index idx_tasks_priority on public.tasks (priority);
create index idx_tasks_client_id on public.tasks (client_id);
create index idx_tasks_freelancer_id on public.tasks (freelancer_id);
create index idx_tasks_due_date on public.tasks (due_date);
create index idx_tasks_created_at on public.tasks (created_at desc);

create index idx_submissions_task_id on public.submissions (task_id);
create index idx_submissions_freelancer_id on public.submissions (freelancer_id);
create index idx_submissions_status on public.submissions (status);

create index idx_freelancers_user_id on public.freelancers (user_id);
create index idx_freelancers_status on public.freelancers (status);

create index idx_activity_logs_user_id on public.activity_logs (user_id);
create index idx_activity_logs_created_at on public.activity_logs (created_at desc);
create index idx_activity_logs_entity on public.activity_logs (entity_type, entity_id);

-- ============================================================
-- HELPER: is_admin (security definer — aman dari RLS recursion)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- SIGNUP TRIGGER — otomatis buat profile.
-- User pertama otomatis menjadi admin, selanjutnya freelancer.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(coalesce(new.email, 'user'), '@', 1)
    ),
    case
      when (select count(*) from public.profiles) = 0 then 'admin'
      else 'freelancer'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.freelancers enable row level security;
alter table public.tasks enable row level security;
alter table public.submissions enable row level security;
alter table public.activity_logs enable row level security;

-- ---------- profiles ----------
create policy "profiles_select_authenticated"
  on public.profiles for select to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- ---------- clients (admin only) ----------
create policy "clients_admin_all"
  on public.clients for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- freelancers ----------
create policy "freelancers_admin_all"
  on public.freelancers for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "freelancers_select_own"
  on public.freelancers for select to authenticated
  using (user_id = auth.uid());

-- ---------- tasks ----------
create policy "tasks_admin_all"
  on public.tasks for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "tasks_select_assigned"
  on public.tasks for select to authenticated
  using (
    freelancer_id in (
      select id from public.freelancers where user_id = auth.uid()
    )
  );

create policy "tasks_update_assigned_status"
  on public.tasks for update to authenticated
  using (
    freelancer_id in (
      select id from public.freelancers where user_id = auth.uid()
    )
  )
  with check (
    freelancer_id in (
      select id from public.freelancers where user_id = auth.uid()
    )
  );

-- ---------- submissions ----------
create policy "submissions_admin_all"
  on public.submissions for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "submissions_select_own"
  on public.submissions for select to authenticated
  using (
    freelancer_id in (
      select id from public.freelancers where user_id = auth.uid()
    )
  );

create policy "submissions_insert_own"
  on public.submissions for insert to authenticated
  with check (
    exists (
      select 1 from public.tasks
      where tasks.id = task_id
        and tasks.freelancer_id in (
          select id from public.freelancers where user_id = auth.uid()
        )
    )
  );

create policy "submissions_update_own_pending"
  on public.submissions for update to authenticated
  using (
    status = 'pending'
    and freelancer_id in (
      select id from public.freelancers where user_id = auth.uid()
    )
  )
  with check (
    status = 'pending'
    and freelancer_id in (
      select id from public.freelancers where user_id = auth.uid()
    )
  );

-- ---------- activity_logs ----------
create policy "activity_logs_select_admin"
  on public.activity_logs for select to authenticated
  using (public.is_admin());

create policy "activity_logs_select_own"
  on public.activity_logs for select to authenticated
  using (user_id = auth.uid());

create policy "activity_logs_insert_own"
  on public.activity_logs for insert to authenticated
  with check (user_id = auth.uid());

create policy "activity_logs_admin_delete"
  on public.activity_logs for delete to authenticated
  using (public.is_admin());
