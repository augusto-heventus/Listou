-- Garantir permissões completas para anon e authenticated
GRANT INSERT ON receitas TO anon;
GRANT INSERT ON receitas TO authenticated;
GRANT INSERT ON receita_ingredientes TO anon;
GRANT INSERT ON receita_ingredientes TO authenticated;

-- Criar políticas de inserção mais permissivas
CREATE POLICY "Permitir inserção pública de receitas" ON receitas
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Permitir inserção pública de ingredientes" ON receita_ingredientes
    FOR INSERT
    WITH CHECK (true);