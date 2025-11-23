-- Enable RLS on user-centric tables. Run inside Supabase SQL editor.

alter table if exists public.user_stats enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.forum_members enable row level security;
alter table if exists public.video_rooms enable row level security;

drop policy if exists "Users can view their stats" on public.user_stats;
create policy "Users can view their stats" on public.user_stats
  for select using (auth.uid() = user_id);

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile" on public.profiles
  for select using (auth.uid() = user_id);

drop policy if exists "Users manage their forum membership" on public.forum_members;
create policy "Users manage their forum membership" on public.forum_members
  for select using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users create video rooms they own" on public.video_rooms;
create policy "Users create video rooms they own" on public.video_rooms
  for insert with check (auth.uid() = participant_1_id or auth.uid() = participant_2_id);
create policy "Users view their video rooms" on public.video_rooms
  for select using (participant_1_id = auth.uid() or participant_2_id = auth.uid());

