-- Verificar permissões de INSERT na tabela receitas
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'receitas' 
AND privilege_type = 'INSERT'
AND grantee IN ('anon', 'authenticated');

-- Verificar políticas de INSERT para receitas
SELECT policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'receitas' 
AND cmd = 'INSERT';