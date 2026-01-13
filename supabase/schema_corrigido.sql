-- Criar tabelas
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  plano TEXT NOT NULL DEFAULT 'gratuito',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notas_fiscais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  chave_acesso TEXT NOT NULL UNIQUE,
  emitente TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  data_emissao DATE NOT NULL,
  valor_total NUMERIC NOT NULL,
  valor_desconto NUMERIC NOT NULL DEFAULT 0,
  valor_pago NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notas_fiscais_chave_idx ON public.notas_fiscais(chave_acesso);

CREATE TABLE IF NOT EXISTS public.nota_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nota_id UUID NOT NULL REFERENCES public.notas_fiscais(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade NUMERIC NOT NULL,
  unidade TEXT,
  valor_unitario NUMERIC,
  valor_total NUMERIC NOT NULL,
  categoria TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS nota_itens_nota_idx ON public.nota_itens(nota_id);

CREATE TABLE IF NOT EXISTS public.listas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lista_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lista_id UUID NOT NULL REFERENCES public.listas(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade NUMERIC,
  unidade TEXT,
  preco_estimado NUMERIC,
  preco_real NUMERIC,
  categoria TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  tempo_preparo INTEGER,
  dificuldade TEXT,
  rendimento INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.receita_ingredientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receita_id UUID NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  quantidade NUMERIC,
  unidade TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nota_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receita_ingredientes ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY profiles_read_own ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY notas_read_own ON public.notas_fiscais FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY notas_insert_own ON public.notas_fiscais FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY itens_read_own ON public.nota_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.notas_fiscais n WHERE n.id = nota_id AND n.usuario_id = auth.uid())
);
CREATE POLICY itens_insert_own ON public.nota_itens FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.notas_fiscais n WHERE n.id = nota_id AND n.usuario_id = auth.uid())
);

CREATE POLICY listas_read_own ON public.listas FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY listas_insert_own ON public.listas FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY lista_itens_read_own ON public.lista_itens FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.listas l WHERE l.id = lista_id AND l.usuario_id = auth.uid())
);
CREATE POLICY lista_itens_insert_own ON public.lista_itens FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.listas l WHERE l.id = lista_id AND l.usuario_id = auth.uid())
);

CREATE POLICY receitas_read_own ON public.receitas FOR SELECT USING (usuario_id = auth.uid());
CREATE POLICY receitas_insert_own ON public.receitas FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY receita_ingredientes_read_own ON public.receita_ingredientes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.receitas r WHERE r.id = receita_id AND r.usuario_id = auth.uid())
);
CREATE POLICY receita_ingredientes_insert_own ON public.receita_ingredientes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.receitas r WHERE r.id = receita_id AND r.usuario_id = auth.uid())
);