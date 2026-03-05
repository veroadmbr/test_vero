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
  ('s1','Larissa Admin','Larissa','Admin','larissa@vero.com','','Administradora','LA',95,true,'approved','larissa123','admin',null),
  ('s2','Walter Admin','Walter','Admin','walter@vero.com','','Administrador','WA',92,true,'approved','walter123','admin',null),
  ('s3','Jaqueline Lider','Jaqueline','Lider','jaqueline@vero.com','','Líder','JL',88,false,'approved','jaqueline123','leader','sec1'),
  ('s4','Victoria Lider','Victoria','Lider','victoria.l@vero.com','','Líder','VL',85,false,'approved','victoria123','leader','sec2'),
  ('s5','Rafael Lider','Rafael','Lider','rafael@vero.com','','Líder','RL',82,false,'approved','rafael123','leader','sec3'),
  ('s6','Anderson Equipe','Anderson','Equipe','anderson@vero.com','','Equipe','AE',70,false,'approved','anderson123','base','sec1'),
  ('s7','Victoria Equipe','Victoria','Equipe','victoria.e@vero.com','','Equipe','VE',68,false,'approved','victoria123','base','sec2')
on conflict (id) do nothing;

insert into templates (id, name, icon, cat, items) values
  ('t1','Abertura de Cozinha','🌅','Operacional','["Ligar equipamentos e verificar temperatura","Verificar estoque do dia","Checar higiene das superfícies","Conferir validade dos alimentos","Organizar mise en place"]'),
  ('t2','Fechamento de Cozinha','🌙','Operacional','["Desligar todos os equipamentos","Limpar e higienizar superfícies","Embalar e armazenar alimentos","Verificar temperatura das câmaras","Fechar registros de gás"]'),
  ('t3','Higienização Salão','🧹','Limpeza','["Limpar mesas e cadeiras","Varrer e passar pano no chão","Limpar cardápios","Repor guardanapos e talheres","Verificar banheiros"]')
on conflict (id) do nothing;
