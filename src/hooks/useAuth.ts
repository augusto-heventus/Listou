import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { toast } from 'sonner';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, session, isAuthenticated, loading, setUser, setSession, setLoading, logout, reset } = useAuthStore();
  const { setUsuario, clearUsuario } = useUserStore();
  const initialized = useRef(false);

  // Inicializar autenticação ao carregar o app
  useEffect(() => {
    console.log('Inicializando autenticação...');
    
    // Evitar executar múltiplas vezes
    if (initialized.current) {
      console.log('Autenticação já foi inicializada, ignorando...');
      return;
    }
    
    const initializeAuth = async () => {
      let loadingTimeout: NodeJS.Timeout | undefined;
      
      try {
        initialized.current = true;
        setLoading(true);
        console.log('Loading set to true');
        
        // Garantir que loading será falso após 8 segundos, independentemente do resultado
        loadingTimeout = setTimeout(() => {
          console.log('Forçando loading=false após timeout de 8 segundos');
          setLoading(false);
        }, 8000);
        
        // Verificar se o Supabase está configurado
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.error('Supabase não está configurado corretamente');
          console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
          console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
          return;
        }
        
        console.log('Verificando sessão e usuário...');
        // Verificar sessão atual com timeout de 5 segundos
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 5000)
        );
        
        const sessionPromise = authService.getCurrentSession();
        const userPromise = authService.getCurrentUser();
        
        const [currentSession, currentUser] = await Promise.race([
          Promise.all([sessionPromise, userPromise]),
          Promise.all([timeoutPromise, timeoutPromise])
        ]);
        
        console.log('Resultados:', { currentSession, currentUser });
        
        if (currentSession && currentUser) {
          setSession(currentSession);
          setUser(currentUser);
          console.log('Usuário autenticado:', currentUser.email);
          
          // Carregar perfil do usuário do Supabase
          await loadUserProfile(currentUser.id);
        } else {
          console.log('Nenhum usuário autenticado encontrado');
          // Limpar estado se não houver usuário autenticado
          logout();
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        // Em caso de erro, garantir que o estado é limpo
        logout();
      } finally {
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
        setLoading(false);
        console.log('Loading set to false');
      }
    };

    initializeAuth();

    // Configurar listener para mudanças de autenticação
    const unsubscribe = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        logout();
        clearUsuario();
        navigate('/auth/login');
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setSession(session);
        // Carregar perfil do usuário
        await loadUserProfile(session.user.id);
        // Redirecionar para dashboard após login bem-sucedido
        console.log('Evento SIGNED_IN detectado, redirecionando para dashboard');
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, setUser, setSession, setLoading, logout, clearUsuario]);

  // Função para carregar perfil do usuário e sincronizar com userStore
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil do usuário:', userId);
      const profile = await authService.getUserProfile(userId);
      
      if (profile) {
        console.log('Perfil encontrado:', profile);
        // Mapear dados do Supabase para o formato do userStore
        const usuarioData = {
          id: profile.id,
          nome: profile.nome,
          email: profile.email,
          telefone: profile.telefone || '',
          endereco: profile.endereco ? {
            rua: profile.endereco.rua || '',
            numero: profile.endereco.numero || '',
            complemento: profile.endereco.complemento || '',
            bairro: profile.endereco.bairro || '',
            cidade: profile.endereco.cidade || '',
            estado: profile.endereco.estado || '',
            cep: profile.endereco.cep || '',
          } : undefined,
          foto: profile.foto || '',
          plano: profile.plano || 'gratuito',
          dataCadastro: new Date(profile.data_cadastro || new Date()),
          preferencias: {
            moeda: (profile.preferencias?.moeda as 'BRL' | 'USD' | 'EUR') || 'BRL',
            notificacoes: profile.preferencias?.notificacoes ?? true,
            backupAutomatico: profile.preferencias?.backup_automatico ?? true,
            categoriasPersonalizadas: [] // Padrão vazio, pode ser expandido posteriormente
          }
        };
        
        setUsuario(usuarioData);
        console.log('Usuário sincronizado no userStore:', usuarioData);
        console.log('Nome do usuário:', usuarioData.nome);
        console.log('Email do usuário:', usuarioData.email);
        console.log('Plano do usuário:', usuarioData.plano);
      } else {
        console.warn('Perfil não encontrado para o usuário:', userId);
        // Criar perfil básico se não existir
        const usuarioBasico = {
          id: userId,
          nome: user?.email?.split('@')[0] || 'Usuário',
          email: user?.email || '',
          telefone: '',
          endereco: undefined,
          foto: '',
          plano: 'gratuito' as const,
          dataCadastro: new Date(),
          preferencias: {
            moeda: 'BRL' as const,
            notificacoes: true,
            backupAutomatico: true,
            categoriasPersonalizadas: [] // Padrão vazio
          }
        };
        setUsuario(usuarioBasico);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      // Criar perfil básico em caso de erro
      const usuarioBasico = {
        id: userId,
        nome: user?.email?.split('@')[0] || 'Usuário',
        email: user?.email || '',
        telefone: '',
        endereco: undefined,
        foto: '',
        plano: 'gratuito' as const,
        dataCadastro: new Date(),
        preferencias: {
          moeda: 'BRL' as const,
          notificacoes: true,
          backupAutomatico: true,
          categoriasPersonalizadas: [] // Padrão vazio
        }
      };
      setUsuario(usuarioBasico);
    }
  };

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        toast.error('Erro ao fazer logout: ' + error.message);
        return;
      }
      
      logout(); // Limpa authStore
      clearUsuario(); // Limpa userStore
      toast.success('Logout realizado com sucesso!');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
      console.error('Erro no logout:', error);
    }
  };

  // Proteger rotas
  const requireAuth = () => {
    if (!isAuthenticated && !loading) {
      navigate('/auth/login', { 
        replace: true,
        state: { from: { pathname: window.location.pathname } }
      });
      return false;
    }
    return true;
  };

  return {
    user,
    session,
    isAuthenticated,
    loading,
    logout: handleLogout,
    requireAuth,
    reset,
  };
};