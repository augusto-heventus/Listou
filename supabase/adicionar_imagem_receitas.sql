-- Adicionar coluna de imagem na tabela receitas
ALTER TABLE public.receitas 
ADD COLUMN IF NOT EXISTS imagem TEXT;