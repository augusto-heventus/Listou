import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setSession, isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Usuário já autenticado, redirecionando para dashboard');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, session, error } = await authService.signIn(
        formData.email,
        formData.password
      );

      if (error) {
        toast.error('Erro ao fazer login: ' + error.message);
        return;
      }

      if (user && session) {
        setUser(user);
        setSession(session);
        
        toast.success('Login realizado com sucesso!');
        
        // Pequeno delay para garantir que o estado seja atualizado antes do redirecionamento
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/';
          console.log('Redirecionando para:', from);
          navigate(from, { replace: true });
        }, 100);
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer login');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      toast.error('Por favor, insira seu email primeiro');
      return;
    }

    try {
      console.log('Enviando email de redefinição para:', formData.email);
      const { error } = await authService.resetPassword(formData.email);
      if (error) {
        console.error('Erro ao enviar email:', error);
        
        // Se o erro for relacionado à configuração de email, mostrar instruções alternativas
        if (error.message?.includes('email') || error.message?.includes('smtp') || error.message?.includes('configuration')) {
          toast.error('Serviço de email não configurado. Por favor, entre em contato com o suporte.', {
            duration: 5000,
          });
          
          // Mostrar link alternativo para teste
          const testLink = `${window.location.origin}/auth/reset-password?email=${encodeURIComponent(formData.email)}&test=true`;
          console.log('Link de teste para redefinição:', testLink);
          
          // Para desenvolvimento, podemos mostrar uma mensagem com instruções
          toast.message('Para desenvolvimento: Verifique o console para ver o link de redefinição', {
            duration: 10000,
          });
        } else {
          toast.error('Erro ao enviar email: ' + error.message);
        }
      } else {
        console.log('Email enviado com sucesso!');
        toast.success('Email de redefinição enviado! Verifique sua caixa de entrada');
      }
    } catch (error) {
      console.error('Erro inesperado ao enviar email:', error);
      toast.error('Erro ao enviar email de redefinição');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao Listou+</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* Test Links for Development */}
            <div className="text-center space-y-2">
              <Link
                to="/auth/test-reset"
                className="text-xs text-gray-500 hover:text-gray-700 underline block"
              >
                Testar redefinição de senha (desenvolvimento)
              </Link>
              <Link
                to="/auth/email-config"
                className="text-xs text-gray-500 hover:text-gray-700 underline block"
              >
                Verificar configuração de email
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/auth/cadastro"
              className="w-full flex items-center justify-center space-x-2 bg-white text-primary-600 py-3 px-4 rounded-xl font-medium border-2 border-primary-600 hover:bg-primary-50 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span>Criar nova conta</span>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o início</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;