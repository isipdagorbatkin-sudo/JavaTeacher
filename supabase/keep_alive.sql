create table if not exists public.project_heartbeat (
  id smallint primary key check (id = 1),
  created_at timestamptz not null default now()
);

insert into public.project_heartbeat (id)
values (1)
on conflict (id) do nothing;

alter table public.project_heartbeat enable row level security;

drop policy if exists "heartbeat_public_read" on public.project_heartbeat;

create policy "heartbeat_public_read"
on public.project_heartbeat for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated;
grant select on public.project_heartbeat to anon, authenticated;
