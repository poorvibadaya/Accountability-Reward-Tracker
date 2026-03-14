-- Accountability & Reward Tracker - Initial Schema

-- Plans table
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  file_url text not null,
  original_filename text,
  uploaded_at timestamptz default now() not null
);

-- Tasks table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.plans(id) on delete set null,
  date date not null,
  title text not null,
  description text,
  points integer not null default 10,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now() not null
);

-- Points ledger (append-only)
create table public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  task_id uuid references public.tasks(id) on delete set null,
  reward_redemption_id uuid,
  points integer not null,
  type text not null check (type in ('earned', 'redeemed')),
  created_at timestamptz default now() not null
);

-- Rewards table
create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  point_cost integer not null check (point_cost > 0),
  active boolean not null default true,
  created_at timestamptz default now() not null
);

-- Reward redemptions
create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  reward_id uuid references public.rewards(id) on delete set null not null,
  points_spent integer not null,
  created_at timestamptz default now() not null
);

-- Add deferred FK on points_ledger
alter table public.points_ledger
  add constraint fk_points_ledger_redemption
  foreign key (reward_redemption_id)
  references public.reward_redemptions(id)
  on delete set null;

-- Streaks table (one row per user)
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date
);

-- Indexes
create index idx_tasks_user_date on public.tasks(user_id, date);
create index idx_tasks_user_completed on public.tasks(user_id, completed);
create index idx_points_ledger_user on public.points_ledger(user_id);
create index idx_plans_user on public.plans(user_id);
create index idx_reward_redemptions_user on public.reward_redemptions(user_id);

-- Row Level Security
alter table public.plans enable row level security;
alter table public.tasks enable row level security;
alter table public.points_ledger enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.streaks enable row level security;

-- RLS Policies
create policy "Users manage own plans" on public.plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own points" on public.points_ledger
  for select using (auth.uid() = user_id);

create policy "Users insert own points" on public.points_ledger
  for insert with check (auth.uid() = user_id);

create policy "Users manage own rewards" on public.rewards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own redemptions" on public.reward_redemptions
  for select using (auth.uid() = user_id);

create policy "Users insert own redemptions" on public.reward_redemptions
  for insert with check (auth.uid() = user_id);

create policy "Users manage own streaks" on public.streaks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helper function: get user's total available points
create or replace function public.get_available_points(uid uuid)
returns integer
language sql
stable
security definer
as $$
  select coalesce(sum(
    case when type = 'earned' then points
         when type = 'redeemed' then -points
         else 0
    end
  ), 0)::integer
  from public.points_ledger
  where user_id = uid;
$$;

-- Atomic reward redemption function
create or replace function public.redeem_reward(uid uuid, rid uuid)
returns integer
language plpgsql
security definer
as $$
declare
  cost integer;
  balance integer;
  redemption_id uuid;
begin
  select point_cost into cost from public.rewards where id = rid and user_id = uid;
  if cost is null then raise exception 'Reward not found'; end if;

  select public.get_available_points(uid) into balance;
  if balance < cost then raise exception 'Insufficient points'; end if;

  insert into public.reward_redemptions (user_id, reward_id, points_spent)
    values (uid, rid, cost) returning id into redemption_id;

  insert into public.points_ledger (user_id, reward_redemption_id, points, type)
    values (uid, redemption_id, cost, 'redeemed');

  return balance - cost;
end;
$$;

-- Storage bucket for plan uploads
insert into storage.buckets (id, name, public) values ('plans', 'plans', false);

create policy "Users upload own plans"
  on storage.objects for insert
  with check (bucket_id = 'plans' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users read own plans"
  on storage.objects for select
  using (bucket_id = 'plans' and auth.uid()::text = (storage.foldername(name))[1]);
