import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

const TestResetPassword: React.FC = () => {
  // useNavigate removido pois não estava sendo usado
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDirectReset = async () => {
    if (!email) {
      toast.error('Por favor, insira seu email');
      return;
    }

    setLoading(true);
    try {
      // Método alternativo: criar um link mágico diretamente
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/reset-password`,
        },
      });

      if (error) {
        console.error('Erro ao criar link mágico:', error);
        toast.error('Erro: ' + error.message);
      } else {
        console.log('Link mágico criado:', data);
        toast.success('Link de redefinição criado! Verifique o console para o link.');
        
        // Para desenvolvimento, mostrar instruções
        toast.message('Para teste: Use qualquer senha com 6+ caracteres na página de redefinição', {
          duration: 10000,
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teste de Redefinição</h1>
          <p className="text-gray-600">Método alternativo para redefinir senha</p>
        </div>

        {/* Test Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email para teste
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <button
              onClick={handleDirectReset}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processando...' : 'Criar Link de Teste'}
            </button>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Modo de teste:</strong> Este é um método alternativo para testar a redefinição de senha sem depender do serviço de email.
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

export default TestResetPassword;