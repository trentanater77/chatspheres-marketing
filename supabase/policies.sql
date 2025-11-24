-- Enable RLS on user-centric tables. Run inside Supabase SQL editor.

alter table if exists public.user_stats enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.forum_members enable row level security;
alter table if exists public.video_rooms enable row level security;
alter table if exists public.match_requests enable row level security;
alter table if exists public.moderation_logs enable row level security;

alter table if exists public.profiles add column if not exists stripe_customer_id text;

-- Ensure matchmaking table carries referencing info used across the app.
alter table if exists public.match_requests add column if not exists sphere_slug text;
alter table if exists public.match_requests add column if not exists room_slug text;

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

drop policy if exists "Users submit matchmaking request" on public.match_requests;
create policy "Users submit matchmaking request" on public.match_requests
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated users view matchmaking queue" on public.match_requests;
create policy "Authenticated users view matchmaking queue" on public.match_requests
  for select
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

drop policy if exists "Admin moderation updates" on public.match_requests;
create policy "Admin moderation updates" on public.match_requests
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Moderation service logs actions" on public.moderation_logs;
create policy "Moderation service logs actions" on public.moderation_logs
  for insert
  with check (auth.role() = 'service_role');

drop policy if exists "Moderators view moderation logs" on public.moderation_logs;
create policy "Moderators view moderation logs" on public.moderation_logs
  for select
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

