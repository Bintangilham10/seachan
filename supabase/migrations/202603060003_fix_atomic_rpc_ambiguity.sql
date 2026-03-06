create or replace function public.join_room_atomic(
  p_room_code text,
  p_display_name text,
  p_guest_id text
)
returns table (
  id uuid,
  room_id uuid,
  display_name text,
  guest_id text,
  joined_at timestamptz,
  total_score integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.rooms%rowtype;
  v_player public.room_players%rowtype;
begin
  select r.*
  into v_room
  from public.rooms as r
  where r.room_code = upper(trim(coalesce(p_room_code, '')))
  limit 1;

  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  select rp.*
  into v_player
  from public.room_players as rp
  where rp.room_id = v_room.id
    and rp.guest_id = trim(coalesce(p_guest_id, ''))
  limit 1;

  if found then
    return query
    select
      v_player.id,
      v_player.room_id,
      v_player.display_name,
      v_player.guest_id,
      v_player.joined_at,
      v_player.total_score;
    return;
  end if;

  if v_room.status = 'finished' then
    raise exception 'ROOM_FINISHED';
  end if;

  if v_room.status <> 'lobby' then
    raise exception 'ROOM_JOIN_CLOSED';
  end if;

  insert into public.room_players (
    room_id,
    display_name,
    guest_id
  )
  values (
    v_room.id,
    left(trim(coalesce(p_display_name, '')), 24),
    trim(coalesce(p_guest_id, ''))
  )
  returning *
  into v_player;

  return query
  select
    v_player.id,
    v_player.room_id,
    v_player.display_name,
    v_player.guest_id,
    v_player.joined_at,
    v_player.total_score;
exception
  when unique_violation then
    select rp.*
    into v_player
    from public.room_players as rp
    where rp.room_id = v_room.id
      and rp.guest_id = trim(coalesce(p_guest_id, ''))
    limit 1;

    if found then
      return query
      select
        v_player.id,
        v_player.room_id,
        v_player.display_name,
        v_player.guest_id,
        v_player.joined_at,
        v_player.total_score;
      return;
    end if;

    raise;
end;
$$;

create or replace function public.submit_room_answer(
  p_room_code text,
  p_player_id uuid,
  p_question_id uuid,
  p_option_id uuid
)
returns table (
  id uuid,
  option_id uuid,
  is_correct boolean,
  score_awarded integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.rooms%rowtype;
  v_player public.room_players%rowtype;
  v_question public.questions%rowtype;
  v_answer public.room_answers%rowtype;
  v_selected_option public.options%rowtype;
  v_elapsed_seconds numeric;
  v_remaining_seconds numeric;
  v_speed_bonus integer;
  v_awarded_score integer;
begin
  select r.*
  into v_room
  from public.rooms as r
  where r.room_code = upper(trim(coalesce(p_room_code, '')))
  limit 1;

  if not found then
    raise exception 'ROOM_NOT_FOUND';
  end if;

  if v_room.status <> 'running' or v_room.question_started_at is null then
    raise exception 'QUESTION_NOT_ACTIVE';
  end if;

  select q.*
  into v_question
  from public.questions as q
  where q.quiz_set_id = v_room.quiz_set_id
    and q.order_index = v_room.current_question_index
  limit 1;

  if not found then
    raise exception 'QUESTION_NOT_FOUND';
  end if;

  if v_question.id <> p_question_id then
    raise exception 'INVALID_QUESTION';
  end if;

  v_elapsed_seconds := extract(epoch from (clock_timestamp() - v_room.question_started_at));
  if v_elapsed_seconds > v_question.time_limit_seconds then
    raise exception 'TIME_UP';
  end if;

  select rp.*
  into v_player
  from public.room_players as rp
  where rp.id = p_player_id
    and rp.room_id = v_room.id
  for update;

  if not found then
    raise exception 'PLAYER_NOT_FOUND';
  end if;

  select o.*
  into v_selected_option
  from public.options as o
  where o.id = p_option_id
    and o.question_id = p_question_id
  limit 1;

  if not found then
    raise exception 'INVALID_OPTION';
  end if;

  v_remaining_seconds := greatest(0, v_question.time_limit_seconds - v_elapsed_seconds);
  v_speed_bonus := greatest(0, floor((v_remaining_seconds / v_question.time_limit_seconds) * 50));
  v_awarded_score := case when v_selected_option.is_correct then 100 + v_speed_bonus else 0 end;

  insert into public.room_answers (
    room_id,
    player_id,
    question_id,
    option_id,
    is_correct,
    score_awarded,
    submitted_at
  )
  values (
    v_room.id,
    p_player_id,
    p_question_id,
    p_option_id,
    v_selected_option.is_correct,
    v_awarded_score,
    clock_timestamp()
  )
  on conflict (room_id, player_id, question_id) do nothing
  returning *
  into v_answer;

  if v_answer.id is null then
    raise exception 'ANSWER_ALREADY_SUBMITTED';
  end if;

  if v_awarded_score > 0 then
    update public.room_players as rp
    set total_score = rp.total_score + v_awarded_score
    where rp.id = p_player_id
      and rp.room_id = v_room.id;
  end if;

  return query
  select
    v_answer.id,
    v_answer.option_id,
    v_answer.is_correct,
    v_answer.score_awarded;
end;
$$;
