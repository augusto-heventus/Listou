create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  plano text not null default 'gratuito',
  created_at timestamptz not null default now()
);

create table if not exists public.notas_fiscais (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.profiles(id) on delete set null,
  chave_acesso text not null unique,
  emitente text not null,
  cnpj text not null,
  data_emissao date not null,
  valor_total numeric not null,
  valor_desconto numeric not null default 0,
  valor_pago numeric,
  created_at timestamptz not null default now()
);

create index if not exists notas_fiscais_chave_idx on public.notas_fiscais(chave_acesso);

create table if not exists public.nota_itens (
  id uuid primary key default gen_random_uuid(),
  nota_id uuid not null references public.notas_fiscais(id) on delete cascade,
  descricao text not null,
  quantidade numeric not null,
  unidade text,
  valor_unitario numeric,
  valor_total numeric not null,
  categoria text,
  created_at timestamptz not null default now()
);

create index if not exists nota_itens_nota_idx on public.nota_itens(nota_id);

create table if not exists public.listas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.profiles(id) on delete set null,
  nome text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lista_itens (
  id uuid primary key default gen_random_uuid(),
  lista_id uuid not null references public.listas(id) on delete cascade,
  descricao text not null,
  quantidade numeric,
  unidade text,
  preco_estimado numeric,
  preco_real numeric,
  categoria text,
  status text default 'pendente',
  created_at timestamptz not null default now()
);

create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.profiles(id) on delete set null,
  titulo text not null,
  tempo_preparo integer,
  dificuldade text,
  rendimento integer,
  created_at timestamptz not null default now()
);

create table if not exists public.receita_ingredientes (
  id uuid primary key default gen_random_uuid(),
  receita_id uuid not null references public.receitas(id) on delete cascade,
  descricao text not null,
  quantidade numeric,
  unidade text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.notas_fiscais enable row level security;
alter table public.nota_itens enable row level security;
alter table public.listas enable row level security;
alter table public.lista_itens enable row level security;
alter table public.receitas enable row level security;
alter table public.receita_ingredientes enable row level security;

create policy if not exists profiles_read_own on public.profiles
  for select using (auth.uid() = id);

create policy if not exists notas_read_own on public.notas_fiscais
  for select using (usuario_id = auth.uid());
create policy if not exists notas_insert_own on public.notas_fiscais
  for insert with check (usuario_id = auth.uid());

create policy if not exists itens_read_own on public.nota_itens
  for select using (exists (select 1 from public.notas_fiscais n where n.id = nota_id and n.usuario_id = auth.uid()));
create policy if not exists itens_insert_own on public.nota_itens
  for insert with check (exists (select 1 from public.notas_fiscais n where n.id = nota_id and n.usuario_id = auth.uid()));

create policy if not exists listas_read_own on public.listas
  for select using (usuario_id = auth.uid());
create policy if not exists listas_insert_own on public.listas
  for insert with check (usuario_id = auth.uid());

create policy if not exists lista_itens_read_own on public.lista_itens
  for select using (exists (select 1 from public.listas l where l.id = lista_id and l.usuario_id = auth.uid()));
create policy if not exists lista_itens_insert_own on public.lista_itens
  for insert with check (exists (select 1 from public.listas l where l.id = lista_id and l.usuario_id = auth.uid()));

create policy if not exists receitas_read_own on public.receitas
  for select using (usuario_id = auth.uid());
create policy if not exists receitas_insert_own on public.receitas
  for insert with check (usuario_id = auth.uid());

create policy if not exists receita_ingredientes_read_own on public.receita_ingredientes
  for select using (exists (select 1 from public.receitas r where r.id = receita_id and r.usuario_id = auth.uid()));
create policy if not exists receita_ingredientes_insert_own on public.receita_ingredientes
  for insert with check (exists (select 1 from public.receitas r where r.id = receita_id and r.usuario_id = auth.uid()));