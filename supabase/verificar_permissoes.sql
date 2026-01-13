-- Verificar permissões atuais
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'receitas' 
AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- Garantir permissões de SELECT para anon e authenticated
GRANT SELECT ON receitas TO anon;
GRANT SELECT ON receitas TO authenticated;

-- Criar política de leitura pública para receitas
CREATE POLICY "Permitir leitura pública de receitas" ON receitas
    FOR SELECT
    USING (true);