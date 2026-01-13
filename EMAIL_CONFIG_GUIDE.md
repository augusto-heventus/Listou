# Guia de Configuração de Email - Supabase

## 📧 Configurando o Serviço de Email para Redefinição de Senha

### Por que o email não está sendo enviado?

O Supabase Auth requer configuração de SMTP para enviar emails de redefinição de senha. Por padrão, o serviço de email não vem configurado.

---

## 🔧 Método 1: Configurar SMTP (Recomendado)

### Passo a Passo:

1. **Acesse o Dashboard do Supabase**
   - Vá para: https://app.supabase.com
   - Selecione seu projeto

2. **Navegue até as Configurações de Autenticação**
   - Clique em "Authentication" no menu lateral
   - Vá para a aba "Settings"
   - Clique em "Auth Settings"

3. **Configure o SMTP**
   
   **Para Gmail:**
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: seu-email@gmail.com
   SMTP Password: [Senha de App do Google]
   ```
   
   **Para Outlook/Hotmail:**
   ```
   SMTP Host: smtp.office365.com
   SMTP Port: 587
   SMTP User: seu-email@outlook.com
   SMTP Password: sua-senha-do-email
   ```
   
   **Para outros provedores:**
   - Consulte a documentação do seu provedor de email
   - Use as configurações SMTP deles

4. **Salve as Configurações**
   - Clique em "Save"
   - Aguarde alguns minutos para as mudanças surtirem efeito

---

## 🧪 Método 2: Testar a Configuração

### Opção A: Usar a Página de Verificação
1. Acesse: `/auth/email-config`
2. Clique em "Verificar Configuração de Email"
3. Veja o resultado do teste

### Opção B: Testar no Login
1. Vá para a página de login: `/auth/login`
2. Digite seu email
3. Clique em "Esqueceu sua senha?"
4. Verifique se recebeu o email

---

## 🔄 Método 3: Alternativa com Magic Link (Desenvolvimento)

Se você não puder configurar o SMTP imediatamente, use nosso método alternativo:

1. Acesse: `/auth/test-reset`
2. Digite seu email
3. Clique em "Criar Link de Teste"
4. Use o link que aparecerá no console do navegador

---

## 📋 Solução de Problemas

### "Serviço de email não configurado"
- **Causa:** SMTP não configurado no Supabase
- **Solução:** Siga o Método 1 acima

### "Erro ao enviar email"
- **Causa:** Credenciais SMTP incorretas
- **Solução:** 
  - Verifique usuário e senha
  - Para Gmail: Use "Senha de App" (não a senha normal)
  - Verifique se o email está correto

### "Email não chegou"
- **Causa:** Pode estar na caixa de spam
- **Solução:** 
  - Verifique a pasta de spam
- Verifique se o email está correto
  - Tente com um email diferente

---

## 🔐 Segurança Importante

### Para Gmail (Recomendado):
1. Ative a verificação em duas etapas
2. Crie uma "Senha de App" específica
3. Use essa senha no lugar da senha normal

### Outros Provedores:
- Use senhas fortes
- Considere usar um email dedicado para o sistema
- Ative autenticação de dois fatores quando possível

---

## 🎯 Próximos Passos

1. **Configure o SMTP** seguindo o Método 1
2. **Teste o envio** usando a página de verificação
3. **Tente redefinir a senha** na página de login
4. **Se ainda tiver problemas**, acesse `/auth/email-config` para diagnóstico

---

## 📞 Precisa de Ajuda?

Se você seguiu todos os passos e ainda tem problemas:

1. Verifique os logs no console do navegador
2. Use a página `/auth/email-config` para diagnóstico
3. Teste o método alternativo `/auth/test-reset`
4. Verifique as configurações no dashboard do Supabase

---

**Nota:** O serviço de email é essencial para a funcionalidade de redefinição de senha. Recomendamos fortemente configurar o SMTP para uso em produção.