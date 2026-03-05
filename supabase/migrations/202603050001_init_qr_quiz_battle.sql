create extension if not exists pgcrypto;

create table if not exists public.quiz_sets (
  id uuid primary key default gen_random_uuid(),
  title text not null
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_set_id uuid not null references public.quiz_sets(id) on delete cascade,
  text text not null,
  time_limit_seconds integer not null check (time_limit_seconds > 0),
  order_index integer not null check (order_index >= 0),
  unique (quiz_set_id, order_index)
);

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  text text not null,
  is_correct boolean not null default false
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (room_code ~ '^[A-Z0-9]{6}$'),
  host_token text not null,
  quiz_set_id uuid not null references public.quiz_sets(id),
  status text not null default 'lobby' check (status in ('lobby', 'running', 'finished')),
  current_question_index integer not null default 0 check (current_question_index >= 0),
  question_started_at timestamptz null,
  created_at timestamptz not null default now(),
  finished_at timestamptz null
);

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 24),
  guest_id text not null,
  joined_at timestamptz not null default now(),
  total_score integer not null default 0,
  unique (room_id, guest_id)
);

create table if not exists public.room_answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.room_players(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  option_id uuid not null references public.options(id) on delete cascade,
  is_correct boolean not null,
  score_awarded integer not null default 0,
  submitted_at timestamptz not null default now(),
  unique (room_id, player_id, question_id)
);

create table if not exists public.leaderboard_global (
  guest_id text primary key,
  display_name text not null,
  total_score_all_time integer not null default 0,
  matches_played integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_questions_quiz_order
  on public.questions (quiz_set_id, order_index);

create index if not exists idx_options_question
  on public.options (question_id);

create index if not exists idx_rooms_room_code
  on public.rooms (room_code);

create index if not exists idx_room_players_room_score
  on public.room_players (room_id, total_score desc);

create index if not exists idx_room_answers_room_question
  on public.room_answers (room_id, question_id);

create index if not exists idx_leaderboard_total_score
  on public.leaderboard_global (total_score_all_time desc, updated_at asc);

alter table public.quiz_sets enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.rooms enable row level security;
alter table public.room_players enable row level security;
alter table public.room_answers enable row level security;
alter table public.leaderboard_global enable row level security;

drop policy if exists "quiz_sets_read_all" on public.quiz_sets;
create policy "quiz_sets_read_all"
  on public.quiz_sets
  for select
  using (true);

drop policy if exists "questions_read_all" on public.questions;
create policy "questions_read_all"
  on public.questions
  for select
  using (true);

drop policy if exists "options_read_all" on public.options;
create policy "options_read_all"
  on public.options
  for select
  using (true);

drop policy if exists "rooms_read_all" on public.rooms;
create policy "rooms_read_all"
  on public.rooms
  for select
  using (true);

drop policy if exists "room_players_read_all" on public.room_players;
create policy "room_players_read_all"
  on public.room_players
  for select
  using (true);

drop policy if exists "room_players_insert_valid_room" on public.room_players;
create policy "room_players_insert_valid_room"
  on public.room_players
  for insert
  with check (
    exists (
      select 1
      from public.rooms r
      where r.id = room_id
        and r.status = 'lobby'
    )
    and (
      select count(*)
      from public.room_players rp
      where rp.room_id = room_id
    ) < 50
  );

drop policy if exists "room_answers_read_all" on public.room_answers;
create policy "room_answers_read_all"
  on public.room_answers
  for select
  using (true);

drop policy if exists "room_answers_insert_if_player_belongs" on public.room_answers;
create policy "room_answers_insert_if_player_belongs"
  on public.room_answers
  for insert
  with check (
    exists (
      select 1
      from public.room_players rp
      where rp.id = player_id
        and rp.room_id = room_id
    )
  );

drop policy if exists "leaderboard_read_all" on public.leaderboard_global;
create policy "leaderboard_read_all"
  on public.leaderboard_global
  for select
  using (true);

create or replace function public.finalize_room_to_leaderboard(p_room_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.leaderboard_global (
    guest_id,
    display_name,
    total_score_all_time,
    matches_played
  )
  select
    rp.guest_id,
    rp.display_name,
    rp.total_score,
    1
  from public.room_players rp
  where rp.room_id = p_room_id
  on conflict (guest_id) do update
    set display_name = excluded.display_name,
        total_score_all_time = public.leaderboard_global.total_score_all_time + excluded.total_score_all_time,
        matches_played = public.leaderboard_global.matches_played + 1,
        updated_at = now();
end;
$$;

grant execute on function public.finalize_room_to_leaderboard(uuid) to anon, authenticated, service_role;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.rooms;
    exception
      when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.room_players;
    exception
      when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.room_answers;
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;
