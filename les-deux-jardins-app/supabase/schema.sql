-- Les Deux Jardins — schéma Supabase (Postgres)
-- À exécuter dans Supabase → SQL Editor. Sécurité par Row-Level Security (RLS) :
-- chaque praticienne ne voit QUE ses propres accompagnées (l'amāna, garantie techniquement).

-- ───────── Praticiennes (profil lié au compte auth) ─────────
create table if not exists practitioners (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text not null default '',
  created_at timestamptz not null default now()
);

-- ───────── Clientes / accompagnées ─────────
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  practitioner_id uuid not null references practitioners(id) on delete cascade,
  nom text not null,
  intention text default '',
  rdv text default '',
  consentement boolean not null default false,
  etape int not null default 1,
  bilan jsonb not null default '{}'::jsonb,
  engagements jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists clients_practitioner_idx on clients(practitioner_id);

-- ───────── Séances ─────────
create table if not exists seances (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  date text not null,
  meteo text not null,
  notes text default '',
  axes text default '',
  created_at timestamptz not null default now()
);
create index if not exists seances_client_idx on seances(client_id);

-- ───────── Synthèses « Pour toi » ─────────
create table if not exists syntheses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  status text not null default 'brouillon',      -- brouillon | valide | publie
  sections jsonb not null default '[]'::jsonb,
  boussole text default '',
  semaine text default '',
  dua_idx int not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists syntheses_client_idx on syntheses(client_id);

-- ───────── Réponses aux questionnaires ─────────
create table if not exists questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  practitioner_id uuid not null references practitioners(id) on delete cascade,
  questionnaire_id text not null,
  answers jsonb not null default '{}'::jsonb,
  score int,
  score_max int,
  created_at timestamptz not null default now()
);
create index if not exists qr_client_idx on questionnaire_responses(client_id);

-- ───────── Row-Level Security ─────────
alter table practitioners enable row level security;
alter table clients enable row level security;
alter table seances enable row level security;
alter table syntheses enable row level security;
alter table questionnaire_responses enable row level security;

-- Une praticienne ne gère que SA fiche
create policy "own practitioner" on practitioners
  for all using (id = auth.uid()) with check (id = auth.uid());

-- ...et que SES clientes
create policy "own clients" on clients
  for all using (practitioner_id = auth.uid()) with check (practitioner_id = auth.uid());

-- Séances / synthèses : accessibles si la cliente appartient à la praticienne
create policy "own seances" on seances for all using (
  exists (select 1 from clients c where c.id = seances.client_id and c.practitioner_id = auth.uid())
) with check (
  exists (select 1 from clients c where c.id = seances.client_id and c.practitioner_id = auth.uid())
);
create policy "own syntheses" on syntheses for all using (
  exists (select 1 from clients c where c.id = syntheses.client_id and c.practitioner_id = auth.uid())
) with check (
  exists (select 1 from clients c where c.id = syntheses.client_id and c.practitioner_id = auth.uid())
);
create policy "own responses" on questionnaire_responses
  for all using (practitioner_id = auth.uid()) with check (practitioner_id = auth.uid());

-- ───────── Création auto du profil praticienne à l'inscription ─────────
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into practitioners (id, nom)
  values (new.id, coalesce(new.raw_user_meta_data->>'nom', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();
