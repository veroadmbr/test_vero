import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase env vars. Create a .env file with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Helpers ────────────────────────────────────────────────────────────────

export const db = {
  // STAFF
  getStaff: () => supabase.from('staff').select('*').order('name'),
  upsertStaff: (row) => supabase.from('staff').upsert(toDbStaff(row)).select().single(),
  deleteStaff: (id) => supabase.from('staff').delete().eq('id', id),

  // SECTORS
  getSectors: () => supabase.from('sectors').select('*').order('name'),
  upsertSector: (row) => supabase.from('sectors').upsert(row).select().single(),
  deleteSector: (id) => supabase.from('sectors').delete().eq('id', id),

  // TEMPLATES
  getTemplates: () => supabase.from('templates').select('*').order('name'),
  upsertTemplate: (row) => supabase.from('templates').upsert(toDbTemplate(row)).select().single(),
  deleteTemplate: (id) => supabase.from('templates').delete().eq('id', id),

  // CHECKLISTS
  getChecklists: () => supabase.from('checklists').select('*').order('created_at', { ascending: false }),
  upsertChecklist: (row) => supabase.from('checklists').upsert(toDbChecklist(row)).select().single(),
  deleteChecklist: (id) => supabase.from('checklists').delete().eq('id', id),

  // TASKS
  getTasks: () => supabase.from('tasks').select('*').order('created_at', { ascending: false }),
  upsertTask: (row) => supabase.from('tasks').upsert(toDbTask(row)).select().single(),
  deleteTask: (id) => supabase.from('tasks').delete().eq('id', id),

  // ALERTS
  getAlerts: () => supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(100),
  upsertAlert: (row) => supabase.from('alerts').upsert(toDbAlert(row)).select().single(),
  deleteAlert: (id) => supabase.from('alerts').delete().eq('id', id),
};

// ─── DB → App mappers ───────────────────────────────────────────────────────

export const fromDbStaff = (r) => ({
  id: r.id, name: r.name, firstName: r.first_name, lastName: r.last_name,
  email: r.email, phone: r.phone, role: r.role, av: r.av,
  score: r.score, admin: r.admin, status: r.status, password: r.password,
  memberRole: r.member_role, sector: r.sector,
});

export const fromDbTemplate = (r) => ({
  id: r.id, name: r.name, icon: r.icon, cat: r.cat,
  items: typeof r.items === 'string' ? JSON.parse(r.items) : (r.items || []),
});

export const fromDbChecklist = (r) => ({
  id: r.id, tid: r.tid, name: r.name, icon: r.icon, sid: r.sid,
  due: r.due, st: r.st, freq: r.freq,
  days: typeof r.days === 'string' ? JSON.parse(r.days) : (r.days || []),
  dueTime: r.due_time, lastReset: r.last_reset,
  overdueAlertSent: r.overdue_alert_sent,
  items: typeof r.items === 'string' ? JSON.parse(r.items) : (r.items || []),
});

export const fromDbTask = (r) => ({
  id: r.id, title: r.title, desc: r.description, priority: r.priority,
  sid: r.sid, done: r.done, dueDate: r.due_date,
  createdAt: r.created_at ? r.created_at.slice(0, 10) : '',
  creatorId: r.creator_id,
  createdBySid: r.creator_id || null,
  section: r.section,
});

export const fromDbAlert = (r) => ({
  id: r.id, type: r.type, title: r.title, body: r.body,
  time: r.time, read: r.read,
  link: typeof r.link === 'string' ? JSON.parse(r.link) : (r.link || null),
  sid: r.sid, forAdmins: r.for_admins,
});

export const fromDbSector = (r) => ({ id: r.id, name: r.name });

// ─── App → DB mappers ───────────────────────────────────────────────────────

const toDbStaff = (r) => ({
  id: r.id, name: r.name, first_name: r.firstName, last_name: r.lastName,
  email: r.email, phone: r.phone, role: r.role, av: r.av,
  score: r.score, admin: r.admin, status: r.status, password: r.password,
  member_role: r.memberRole, sector: r.sector || null,
});

const toDbTemplate = (r) => ({
  id: r.id, name: r.name, icon: r.icon, cat: r.cat, items: r.items,
});

const toDbChecklist = (r) => ({
  id: r.id, tid: r.tid, name: r.name, icon: r.icon, sid: r.sid,
  due: r.due, st: r.st, freq: r.freq || null, days: r.days || [],
  due_time: r.dueTime || null, last_reset: r.lastReset || null,
  overdue_alert_sent: r.overdueAlertSent || false, items: r.items,
});

const toDbTask = (r) => ({
  id: r.id, title: r.title, description: r.desc || null, priority: r.priority,
  sid: r.sid || null, done: r.done, due_date: r.dueDate || null,
  creator_id: r.createdBySid || r.creatorId || null,
  section: r.section || null,
});

const toDbAlert = (r) => ({
  id: r.id, type: r.type, title: r.title, body: r.body,
  time: r.time, read: r.read, link: r.link || null,
  sid: r.sid || null, for_admins: r.forAdmins || false,
});
