-- ============================================================================
-- PRAJAVAANI PRO - Sovereign AI Civic Governance Platform
-- Supabase PostgreSQL Schema & Real-Time Sync Configuration
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. DEPARTMENTS TABLE
create table if not exists public.departments (
  id text primary key,
  name text not null,
  code text not null unique,
  description text,
  sla_critical_hours integer default 4,
  sla_high_hours integer default 24,
  sla_medium_hours integer default 72,
  sla_low_hours integer default 168,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  department_id text references public.departments(id) on delete cascade,
  name text not null,
  description text,
  icon text default 'AlertCircle',
  default_priority text default 'MEDIUM',
  sla_hours integer default 48,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. USERS / CITIZENS & OFFICIALS TABLE
create table if not exists public.users (
  id text primary key,
  name text not null,
  phone text not null,
  role text not null check (role in ('citizen', 'field_officer', 'panchayat_staff', 'dept_officer', 'district_collector', 'super_admin')),
  employee_id text,
  aadhaar_verified boolean default true,
  department_id text references public.departments(id) on delete set null,
  language text default 'te',
  state text default 'Telangana',
  district text default 'Rangareddy',
  local_body text default 'GHMC Ward 12',
  ward text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. COMPLAINTS / CIVIC GRIEVANCES TABLE
create table if not exists public.complaints (
  id text primary key,
  complaint_number text not null unique,
  citizen_id text references public.users(id) on delete set null,
  citizen_name text not null,
  citizen_phone text not null,
  original_language text default 'te',
  title text not null,
  description text not null,
  category_id text references public.categories(id) on delete set null,
  category_name text not null,
  department_id text references public.departments(id) on delete set null,
  department_name text not null,
  priority text not null check (priority in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status text not null check (status in ('SUBMITTED', 'AUTO_DISPATCHED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED')),
  latitude double precision not null,
  longitude double precision not null,
  address text not null,
  ward text not null,
  photo_url text,
  after_photo_url text,
  ai_confidence double precision default 0.92,
  evidence_clarity_score integer default 85,
  sla_target_hours integer not null default 24,
  sla_deadline timestamp with time zone not null,
  assigned_officer_id text references public.users(id) on delete set null,
  assigned_officer_name text,
  resolution_notes text,
  resolution_rating integer,
  resolution_feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone
);

-- 5. AUDIT LOGS (Immutable Civic History)
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  complaint_id text references public.complaints(id) on delete cascade not null,
  action text not null,
  actor_id text not null,
  actor_name text not null,
  actor_role text not null,
  details text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  complaint_id text references public.complaints(id) on delete cascade,
  title text not null,
  message text not null,
  type text check (type in ('info', 'success', 'warning', 'urgent')) default 'info',
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. INCIDENT CLUSTERS TABLE
create table if not exists public.incident_clusters (
  id text primary key,
  name text not null,
  category_id text references public.categories(id) on delete set null,
  latitude double precision not null,
  longitude double precision not null,
  radius_meters integer default 250,
  complaint_count integer default 1,
  severity text check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) default 'HIGH',
  status text check (status in ('ACTIVE', 'UNDER_INVESTIGATION', 'RESOLVED')) default 'ACTIVE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.departments enable row level security;
alter table public.categories enable row level security;
alter table public.users enable row level security;
alter table public.complaints enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.incident_clusters enable row level security;

-- Departments & Categories: Public Read
create policy "Allow public read departments" on public.departments for select using (true);
create policy "Allow public read categories" on public.categories for select using (true);

-- Complaints: Public Read for Transparency & Tracking (excluding private PII in public queries)
create policy "Allow public read complaints" on public.complaints for select using (true);
create policy "Allow insert complaints" on public.complaints for insert with check (true);
create policy "Allow update complaints" on public.complaints for update using (true);

-- Users: Read/Insert for authentication
create policy "Allow read users" on public.users for select using (true);
create policy "Allow insert/update users" on public.users for all using (true);

-- Audit Logs & Notifications
create policy "Allow public read audit_logs" on public.audit_logs for select using (true);
create policy "Allow insert audit_logs" on public.audit_logs for insert with check (true);
create policy "Allow read notifications" on public.notifications for select using (true);
create policy "Allow update notifications" on public.notifications for update using (true);
create policy "Allow insert notifications" on public.notifications for insert with check (true);

-- Incident Clusters: Public Read
create policy "Allow read incident_clusters" on public.incident_clusters for select using (true);

-- ============================================================================
-- REAL-TIME SUBSCRIPTION ACTIVATION
-- ============================================================================
alter publication supabase_realtime add table public.complaints;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.incident_clusters;

-- ============================================================================
-- STORAGE BUCKET FOR PHOTO EVIDENCE (BEFORE & AFTER REPAIRS)
-- ============================================================================
insert into storage.buckets (id, name, public) 
values ('evidence-photos', 'evidence-photos', true)
on conflict (id) do nothing;

create policy "Public Access to Evidence Photos"
on storage.objects for select
using (bucket_id = 'evidence-photos');

create policy "Allow Upload to Evidence Photos"
on storage.objects for insert
with check (bucket_id = 'evidence-photos');

-- ============================================================================
-- SEED DATA (Departments, Categories, Seed Complaints)
-- ============================================================================
insert into public.departments (id, name, code, description, sla_critical_hours, sla_high_hours, sla_medium_hours, sla_low_hours) values
('dept-roads', 'Roads & Buildings Department (R&B)', 'R&B', 'Highway, arterial roads, potholes, pavement repairs, bridges', 4, 24, 72, 168),
('dept-water', 'Water Supply & Sewerage Board (HMWSSB / RWS)', 'WATER', 'Drinking water pipelines, leakage, contamination, borewells, sewage drainage', 4, 18, 48, 120),
('dept-sanitation', 'Municipal Sanitation & Solid Waste (GHMC / CDMA)', 'SAN', 'Garbage clearing, street sweeping, dump yards, dead animal disposal', 6, 24, 48, 96),
('dept-electrical', 'State Electricity Distribution (TSSPDCL / TSNPDCL)', 'ELEC', 'Streetlights, fallen poles, transformer sparks, power disruptions', 2, 12, 24, 72),
('dept-panchayat', 'Panchayat Raj & Rural Development (PR&RD)', 'PRRD', 'Rural roads, village sanitation, Gram Panchayat works, drainage culverts', 6, 24, 72, 168)
on conflict (id) do nothing;

insert into public.categories (id, department_id, name, description, default_priority, sla_hours) values
('pothole', 'dept-roads', 'Pothole & Asphalt Crater Repair', 'Dangerous road surface depressions risking vehicle safety', 'HIGH', 24),
('water-leak', 'dept-water', 'Pressurized Water Main Burst', 'Fresh water wastage or flooded roadway from pipeline rupture', 'CRITICAL', 8),
('garbage', 'dept-sanitation', 'Unsegregated Solid Municipal Waste Pile', 'Public health risk due to accumulated trash obstruction', 'MEDIUM', 24),
('streetlight', 'dept-electrical', 'Streetlight Blackout / Broken Pole', 'Dark road sector increasing accident and security hazards', 'MEDIUM', 24),
('open-drain', 'dept-water', 'Overflowing Sewage / Open Silt Culvert', 'Sewage overflow near residential schools or hospitals', 'HIGH', 18)
on conflict (id) do nothing;

-- Sample Citizen & Official Users
insert into public.users (id, name, phone, role, employee_id, aadhaar_verified, language, state, district, local_body) values
('user-citizen-1', 'Ramesh Reddy', '9876543210', 'citizen', null, true, 'te', 'Telangana', 'Rangareddy', 'GHMC Ward 12'),
('user-officer-1', 'K. Suresh Kumar', '9876543211', 'field_officer', 'ENG-RND-4402', true, 'te', 'Telangana', 'Rangareddy', 'GHMC Ward 12'),
('user-ee-1', 'P. Venkat Rao (EE)', '9876543213', 'dept_officer', 'EE-RBD-8810', true, 'te', 'Telangana', 'Rangareddy', 'GHMC Head Office'),
('user-collector-1', 'Dr. Ananya Sharma, IAS', '9876543214', 'district_collector', 'IAS-TG-2016-042', true, 'en', 'Telangana', 'Rangareddy', 'District Collectorate')
on conflict (id) do nothing;

-- Sample Seed Grievance
insert into public.complaints (
  id, complaint_number, citizen_id, citizen_name, citizen_phone, original_language,
  title, description, category_id, category_name, department_id, department_name,
  priority, status, latitude, longitude, address, ward,
  ai_confidence, evidence_clarity_score, sla_target_hours, sla_deadline,
  created_at, updated_at
) values (
  'comp-seed-1', 'PV-2026-004821', 'user-citizen-1', 'Ramesh Reddy', '9876543210', 'te',
  'Severe asphalt pothole causing heavy traffic hazard',
  'Deep pothole of about 15cm depth near bus stop. Multiple two-wheelers slipping during morning rains.',
  'pothole', 'Pothole & Asphalt Crater Repair', 'dept-roads', 'Roads & Buildings Department (R&B)',
  'HIGH', 'IN_PROGRESS', 17.3850, 78.4867, 'Main Road near Bus Stop, Ward 12, Gachibowli, Hyderabad', 'GHMC Ward 12',
  0.94, 88, 24, timezone('utc'::text, now() + interval '18 hours'),
  timezone('utc'::text, now() - interval '6 hours'), timezone('utc'::text, now())
) on conflict (id) do nothing;
