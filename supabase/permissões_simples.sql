-- Conceder permissões de inserção para receitas e ingredientes
GRANT SELECT, INSERT ON public.receitas TO anon;
GRANT SELECT, INSERT ON public.receitas TO authenticated;

GRANT SELECT, INSERT ON public.receita_ingredientes TO anon;
GRANT SELECT, INSERT ON public.receita_ingredientes TO authenticated;

-- Criar políticas simples para inserção
CREATE POLICY receitas_insert_public ON public.receitas
  FOR INSERT WITH CHECK (true);

CREATE POLICY receita_ingredientes_insert_public ON public.receita_ingredientes
  FOR INSERT WITH CHECK (true);