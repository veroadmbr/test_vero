-- ============================================================
-- VERO MVP — Supabase Schema
-- Run this entire file in: Supabase > SQL Editor > New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── SECTORS ──────────────────────────────────────────────────
create table if not exists sectors (
  id         text primary key default 'sec'||extract(epoch from now())::text,
  name       text not null
);

-- ── STAFF (users) ─────────────────────────────────────────────
create table if not exists staff (
  id          text primary key,
  name        text not null,
  first_name  text,
  last_name   text,
  email       text unique not null,
  phone       text,
  role        text,
  av          text,
  score       integer default 0,
  admin       boolean default false,
  status      text default 'pending',   -- 'pending' | 'approved' | 'rejected'
  password    text,
  member_role text default 'team',      -- 'admin' | 'leader' | 'team'
  sector      text references sectors(id) on delete set null,
  created_at  timestamptz default now()
);

-- ── TEMPLATES ─────────────────────────────────────────────────
create table if not exists templates (
  id         text primary key,
  name       text not null,
  icon       text,
  cat        text,
  items      jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ── CHECKLISTS ────────────────────────────────────────────────
create table if not exists checklists (
  id                  text primary key,
  tid                 text references templates(id) on delete set null,
  name                text not null,
  icon                text,
  sid                 text references staff(id) on delete set null,
  due                 text,
  st                  text default 'pending',  -- 'pending'|'in_progress'|'done'|'alert'
  freq                text,
  days                jsonb default '[]'::jsonb,
  due_time            text,
  last_reset          text,
  overdue_alert_sent  boolean default false,
  items               jsonb default '[]'::jsonb,
  created_at          timestamptz default now()
);

-- ── TASKS ─────────────────────────────────────────────────────
create table if not exists tasks (
  id          text primary key,
  title       text not null,
  description text,
  priority    text default 'medium',  -- 'high'|'medium'|'low'
  sid         text references staff(id) on delete set null,
  done        boolean default false,
  due_date    text,
  created_at  timestamptz default now(),
  creator_id  text references staff(id) on delete set null,
  section     text
);

-- ── ALERTS ────────────────────────────────────────────────────
create table if not exists alerts (
  id          text primary key,
  type        text,   -- 'danger'|'warning'|'info'|'success'
  title       text not null,
  body        text,
  time        text,
  read        boolean default false,
  link        jsonb,
  sid         text,   -- target staff id (null = all)
  for_admins  boolean default false,
  created_at  timestamptz default now()
);

-- ── ROW LEVEL SECURITY (open for MVP - tighten later) ─────────
alter table sectors   enable row level security;
alter table staff     enable row level security;
alter table templates enable row level security;
alter table checklists enable row level security;
alter table tasks     enable row level security;
alter table alerts    enable row level security;

-- Allow all operations for MVP (you can restrict later by user role)
create policy "public_all_sectors"    on sectors    for all using (true) with check (true);
create policy "public_all_staff"      on staff      for all using (true) with check (true);
create policy "public_all_templates"  on templates  for all using (true) with check (true);
create policy "public_all_checklists" on checklists for all using (true) with check (true);
create policy "public_all_tasks"      on tasks      for all using (true) with check (true);
create policy "public_all_alerts"     on alerts     for all using (true) with check (true);

-- ── SEED DATA ─────────────────────────────────────────────────
insert into sectors (id, name) values
  ('sec1', 'Cozinha'),
  ('sec2', 'Salão'),
  ('sec3', 'Estoque')
on conflict (id) do nothing;

insert into staff (id, name, first_name, last_name, email, phone, role, av, score, admin, status, password, member_role, sector) values
  ('s1','Ana Lima','Ana','Lima','ana@vero.com','(11)99100-0001','Gerente','AL',94,true,'approved','admin123','admin',null),
  ('s2','Bruno Costa','Bruno','Costa','bruno@vero.com','(11)99100-0002','Cozinheiro','BC',78,false,'approved','team123','team','sec1'),
  ('s3','Carla Nunes','Carla','Nunes','carla@vero.com','(11)99100-0003','Garçonete','CN',91,false,'approved','team123','team','sec2'),
  ('s4','Diego Melo','Diego','Melo','diego@vero.com','(11)99100-0004','Auxiliar','DM',65,false,'approved','team123','team','sec1')
on conflict (id) do nothing;

insert into templates (id, name, icon, cat, items) values
  ('t1','Abertura de Cozinha','🌅','Operacional','["Ligar equipamentos e verificar temperatura","Verificar estoque do dia","Checar higiene das superfícies","Conferir validade dos alimentos","Organizar mise en place"]'),
  ('t2','Fechamento de Cozinha','🌙','Operacional','["Desligar todos os equipamentos","Limpar e higienizar superfícies","Embalar e armazenar alimentos","Verificar temperatura das câmaras","Fechar registros de gás"]'),
  ('t3','Higienização Salão','🧹','Limpeza','["Limpar mesas e cadeiras","Varrer e passar pano no chão","Limpar cardápios","Repor guardanapos e talheres","Verificar banheiros"]')
on conflict (id) do nothing;
