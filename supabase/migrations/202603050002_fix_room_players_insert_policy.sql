drop policy if exists "room_players_insert_valid_room" on public.room_players;

create policy "room_players_insert_valid_room"
  on public.room_players
  for insert
  with check (
    exists (
      select 1
      from public.rooms r
      where r.id = room_id
        and r.status in ('lobby', 'running')
    )
  );
