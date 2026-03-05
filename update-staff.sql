-- ============================================================
-- VERO — Atualizar usuários de demonstração
-- Cole este script no Supabase > SQL Editor > New Query
-- ============================================================

-- Remove usuários antigos de demonstração
delete from staff where id in ('s1','s2','s3','s4','s5','s6','s7');

-- Insere novos usuários
insert into staff (id, name, first_name, last_name, email, phone, role, av, score, admin, status, password, member_role, sector) values
  ('s1','Larissa Admin',  'Larissa',  'Admin',  'larissa@vero.com',   '','Administradora','LA',95,true, 'approved','larissa123', 'admin', null),
  ('s2','Walter Admin',   'Walter',   'Admin',  'walter@vero.com',    '','Administrador', 'WA',92,true, 'approved','walter123',  'admin', null),
  ('s3','Jaqueline Lider','Jaqueline','Lider',  'jaqueline@vero.com', '','Líder',         'JL',88,false,'approved','jaqueline123','leader','sec1'),
  ('s4','Victoria Lider', 'Victoria', 'Lider',  'victoria.l@vero.com','','Líder',         'VL',85,false,'approved','victoria123', 'leader','sec2'),
  ('s5','Rafael Lider',   'Rafael',   'Lider',  'rafael@vero.com',    '','Líder',         'RL',82,false,'approved','rafael123',   'leader','sec3'),
  ('s6','Anderson Equipe','Anderson', 'Equipe', 'anderson@vero.com',  '','Equipe',        'AE',70,false,'approved','anderson123', 'base',  'sec1'),
  ('s7','Victoria Equipe','Victoria', 'Equipe', 'victoria.e@vero.com','','Equipe',        'VE',68,false,'approved','victoria123', 'base',  'sec2');
