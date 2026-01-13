-- Verificar e garantir permissões para inserção de receitas e ingredientes
-- Para usuários não autenticados (anon)

-- Permissões para tabela receitas
GRANT SELECT, INSERT ON public.receitas TO anon;
GRANT SELECT, INSERT ON public.receitas TO authenticated;

-- Permissões para tabela receita_ingredientes  
GRANT SELECT, INSERT ON public.receita_ingredientes TO anon;
GRANT SELECT, INSERT ON public.receita_ingredientes TO authenticated;

-- Criar políticas para inserção (primeiro verificar se já existem)
DO $$
BEGIN
  -- Política para inserção de receitas (qualquer um pode criar)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'receitas_insert_public' AND tablename = 'receitas') THEN
    CREATE POLICY receitas_insert_public ON public.receitas
      FOR INSERT WITH CHECK (true);
  END IF;

  -- Política para inserção de ingredientes (qualquer um pode criar)  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'receita_ingredientes_insert_public' AND tablename = 'receita_ingredientes') THEN
    CREATE POLICY receita_ingredientes_insert_public ON public.receita_ingredientes
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Verificar as permissões atuais
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name IN ('receitas', 'receita_ingredientes')
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee;