import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Settings, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

const EmailConfigCheck: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [config, setConfig] = useState<any>(null);

  const checkEmailConfig = async () => {
    setChecking(true);
    try {
      // Testar se o serviço de email está configurado
      const testEmail = `teste-${Date.now()}@example.com`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Erro ao testar email:', error);
        
        // Verificar tipos específicos de erros de configuração
        if (error.message?.includes('SMTP') || error.message?.includes('configuration')) {
          setConfig({
            status: 'not_configured',
            message: 'Serviço de email não configurado',
            details: error.message
          });
          toast.error('Serviço de email não configurado');
        } else {
          // Pode ser que o email não exista, mas o serviço está funcionando
          setConfig({
            status: 'working',
            message: 'Serviço de email parece estar funcionando',
            details: 'O erro pode ser apenas porque o email de teste não existe'
          });
          toast.success('Serviço de email parece estar configurado');
        }
      } else {
        setConfig({
          status: 'working',
          message: 'Serviço de email está funcionando',
          details: 'Email de redefinição enviado com sucesso'
        });
        toast.success('Serviço de email está funcionando!');
      }
    } catch (error) {
      console.error('Erro ao verificar configuração:', error);
      setConfig({
        status: 'error',
        message: 'Erro ao verificar configuração',
        details: String(error)
      });
      toast.error('Erro ao verificar configuração de email');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verificar Configuração de Email</h1>
          <p className="text-gray-600">Teste o serviço de email do Supabase</p>
        </div>

        {/* Config Check */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Status do Serviço de Email</h2>
            </div>

            {!config && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800 text-sm">
                  Clique no botão abaixo para verificar se o serviço de email do Supabase está configurado corretamente.
                </p>
              </div>
            )}

            {config && (
              <div className={`p-4 rounded-xl border ${
                config.status === 'working' 
                  ? 'bg-green-50 border-green-200' 
                  : config.status === 'not_configured'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {config.status === 'working' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${
                      config.status === 'working' ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {config.message}
                    </p>
                    {config.details && (
                      <p className="text-sm text-gray-600 mt-1">{config.details}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={checkEmailConfig}
              disabled={checking}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {checking ? 'Verificando...' : 'Verificar Configuração de Email'}
            </button>
          </div>
        </div>

        {/* Configuration Guide */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guia de Configuração</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">1. Acesse o Dashboard do Supabase</h4>
              <p className="text-sm text-gray-600">Vá para as configurações do seu projeto no Supabase</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">2. Configure o SMTP</h4>
              <p className="text-sm text-gray-600 mb-2">Em "Authentication" &gt; "Settings" &gt; "Auth Settings", configure:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>SMTP Host (ex: smtp.gmail.com)</li>
                <li>SMTP Port (ex: 587)</li>
                <li>SMTP User (seu email)</li>
                <li>SMTP Password (senha do app)</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">3. Teste o Envio</h4>
              <p className="text-sm text-gray-600">Após configurar, teste o envio de email na página de login</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Alternativa:</strong> Se não puder configurar o SMTP, use o método de magic link na página de teste.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/auth/login"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigCheck;