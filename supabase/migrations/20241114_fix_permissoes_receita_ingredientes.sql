-- Corrigir permissões da tabela receita_ingredientes
-- Permitir que usuários autenticados e anônimos possam inserir ingredientes

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir inserção de ingredientes para usuários autenticados" ON receita_ingredientes;
DROP POLICY IF EXISTS "Permitir inserção de ingredientes para usuários anônimos" ON receita_ingredientes;
DROP POLICY IF EXISTS "Permitir leitura de ingredientes para todos" ON receita_ingredientes;

-- Criar política para permitir leitura de ingredientes para todos
CREATE POLICY "Permitir leitura de ingredientes para todos" ON receita_ingredientes
    FOR SELECT
    USING (true);

-- Criar política para permitir inserção de ingredientes para usuários autenticados
CREATE POLICY "Permitir inserção de ingredientes para usuários autenticados" ON receita_ingredientes
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM receitas 
            WHERE receitas.id = receita_ingredientes.receita_id 
            AND (receitas.usuario_id = auth.uid() OR receitas.usuario_id IS NULL)
        )
    );

-- Criar política para permitir inserção de ingredientes para usuários anônimos (apenas para receitas públicas)
CREATE POLICY "Permitir inserção de ingredientes para usuários anônimos" ON receita_ingredientes
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM receitas 
            WHERE receitas.id = receita_ingredientes.receita_id 
            AND receitas.usuario_id IS NULL
        )
    );

-- Garantir permissões básicas
GRANT SELECT ON receita_ingredientes TO anon, authenticated;
GRANT INSERT ON receita_ingredientes TO anon, authenticated;