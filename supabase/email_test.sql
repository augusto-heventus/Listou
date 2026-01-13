-- Testar configuração de email do Supabase
-- Este script verifica se o serviço de email está configurado

-- Verificar configurações de email
SELECT * FROM auth.config WHERE key LIKE '%email%' OR key LIKE '%smtp%';

-- Verificar se há configurações de SMTP
SELECT * FROM auth.config WHERE key = 'SMTP_HOST' OR key = 'SMTP_USER';

-- Verificar logs de email (se disponíveis)
SELECT * FROM auth.audit_log_entries 
WHERE payload->>'action' LIKE '%email%' 
   OR payload->>'action' LIKE '%reset%'
ORDER BY created_at DESC 
LIMIT 10;

-- Verificar se o serviço de email está ativado
SELECT * FROM auth.config WHERE key = 'EMAIL_ENABLED';