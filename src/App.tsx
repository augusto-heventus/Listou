// import React from 'react'; // Not needed in React 18+
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import NotasFiscais from './pages/NotasFiscais';
import ImportarNota from './pages/ImportarNota';
import ItensNota from './pages/ItensNota';
import ListasCompras from './pages/ListasCompras';
import NovaLista from './pages/NovaLista';
import VisualizarLista from './pages/VisualizarLista';
import Receitas from './pages/Receitas';
import NovaReceita from './pages/NovaReceita';
import VisualizarReceita from './pages/VisualizarReceita';
import ComparacaoMercados from './pages/ComparacaoMercados';
import Perfil from './pages/Perfil';
import Onboarding from './pages/Onboarding';
import Login from './pages/auth/Login';
import Cadastro from './pages/auth/Cadastro';
import RedefinirSenha from './pages/auth/RedefinirSenha';
import TestResetPassword from './pages/auth/TestResetPassword';
import EmailConfigCheck from './pages/auth/EmailConfigCheck';
import { useOnboarding } from './stores/onboardingStore';
import { useAuth } from './hooks/useAuth';

function App() {
  const { hasCompletedOnboarding, resetOnboarding } = useOnboarding();
  const { user, isAuthenticated, loading, reset } = useAuth();
  
  // Limpar storage problemático na primeira carga
  useEffect(() => {
    try {
      // Verificar se há dados corrompidos no storage
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed.state && parsed.state.loading === true && !parsed.state.user) {
          console.log('Storage corrompido detectado - limpando...');
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('onboarding-storage');
          sessionStorage.clear();
        }
      }
    } catch (error) {
      console.log('Erro ao verificar storage - limpando tudo');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('onboarding-storage');
      sessionStorage.clear();
    }
  }, []);
  
  // Timeout para forçar parada do loading se travar
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log('Forçando parada do loading após 10 segundos - possível travamento detectado');
        reset();
        resetOnboarding();
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [loading, reset, resetOnboarding]);

  // Monitorar se usuário está autenticado mas loading ainda está true (DESATIVADO)
  // useEffect(() => {
  //   if (isAuthenticated && loading) {
  //     console.log('USUÁRIO AUTENTICADO MAS LOADING AINDA TRUE - Forçando loading=false');
  //     // Apenas desligar loading, não resetar!
  //     setTimeout(() => {
  //       console.log('Desligando loading forçado...');
  //       const { setLoading } = useAuthStore.getState();
  //       setLoading(false);
  //     }, 3000);
  //   }
  // }, [isAuthenticated, loading]);



  // Debug logging
  console.log('App state:', { hasCompletedOnboarding, isAuthenticated, loading, user: user?.email });

  // Mostrar onboarding se ainda não foi completado
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  // Se usuário está autenticado, mostrar dashboard imediatamente (ignorar loading)
  if (isAuthenticated) {
    console.log('USUÁRIO AUTENTICADO - Mostrando dashboard diretamente');
    return (
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notas" element={<NotasFiscais />} />
            <Route path="/notas/importar" element={<ImportarNota />} />
            <Route path="/notas/:id/itens" element={<ItensNota />} />
            <Route path="/listas" element={<ListasCompras />} />
            <Route path="/listas/nova" element={<NovaLista />} />
            <Route path="/listas/:id" element={<VisualizarLista />} />
            <Route path="/receitas" element={<Receitas />} />
            <Route path="/receitas/nova" element={<NovaReceita />} />
            <Route path="/receitas/:id" element={<VisualizarReceita />} />
            <Route path="/comparacao" element={<ComparacaoMercados />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </div>
    );
  }

  // Mostrar loading apenas se NÃO estiver autenticado e ainda estiver carregando
  if (loading) {
    console.log('AGUARDANDO: Sistema carregando... - loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
          <button 
            onClick={() => {
              console.log('Manual reset triggered by user');
              reset(); // Reset auth state
              resetOnboarding(); // Reset onboarding state
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clique aqui se a tela ficar travada por mais de 10 segundos
          </button>
        </div>
      </div>
    );
  }

  // Se usuário NÃO está autenticado, mostrar tela de login
  if (!isAuthenticated) {
    console.log('USUÁRIO NÃO AUTENTICADO - Redirecionando para login');
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/cadastro" element={<Cadastro />} />
          <Route path="/auth/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/auth/test-reset" element={<TestResetPassword />} />
          <Route path="/auth/email-config" element={<EmailConfigCheck />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    );
  }

  // Fallback - não deve chegar aqui, mas por segurança
  console.log('ESTADO INESPERADO - Redirecionando para login');
  return <Navigate to="/auth/login" replace />;
}

export default App;