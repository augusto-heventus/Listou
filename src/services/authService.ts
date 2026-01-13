import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  session: any;
  error: Error | null;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  foto?: string;
  plano: 'gratuito' | 'premium';
  data_cadastro: string;
  preferencias: {
    moeda: 'BRL' | 'USD' | 'EUR';
    notificacoes: boolean;
    backup_automatico: boolean;
  };
}

class AuthService {
  // Login com email e senha
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // O trigger já deve ter criado o perfil, mas vamos verificar
      if (data.user) {
        const profileExists = await this.checkUserProfile(data.user.id);
        if (!profileExists) {
          console.warn('Perfil não encontrado para usuário:', data.user.id);
          // O perfil será criado pelo trigger se necessário
        }
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      };
    }
  }

  // Criar nova conta
  async signUp(email: string, password: string, nome: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
          },
        },
      });

      if (error) throw error;

      // O trigger no banco de dados irá criar o perfil automaticamente
      // Não precisamos criar manualmente aqui
      if (data.user) {
        console.log('Usuário criado com sucesso. Perfil será criado automaticamente pelo trigger.');
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      };
    }
  }

  // Verificar se o perfil do usuário existe
  private async checkUserProfile(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Erro ao verificar perfil:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
      return false;
    }
  }

  // Redefinir senha (enviar email)
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      console.log('Iniciando redefinição de senha para:', email);
      console.log('URL de redirecionamento:', `${window.location.origin}/auth/reset-password`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Erro do Supabase ao redefinir senha:', error);
        throw error;
      }

      console.log('Email de redefinição enviado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return { error: error as Error };
    }
  }

  // Atualizar senha (após clicar no link do email)
  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Logout
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      // Primeiro verificar se há uma sessão ativa
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData?.session) {
        console.log('Nenhuma sessão ativa encontrada');
        return null;
      }

      // Se houver sessão, obter o usuário
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erro ao obter usuário atual:', error);
        return null;
      }
      
      return data?.user || null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  // Obter sessão atual
  async getCurrentSession(): Promise<any> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao obter sessão atual:', error);
        return null;
      }
      return data?.session || null;
    } catch (error) {
      console.error('Erro ao obter sessão atual:', error);
      return null;
    }
  }

  // Verificar se usuário está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }

  // Obter perfil do usuário
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return null;
    }
  }

  // Atualizar perfil do usuário
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ error: Error | null }> {
    try {
      console.log('Atualizando perfil para usuário:', userId);
      console.log('Dados do perfil:', profileData);

      // Preparar dados para atualização (excluir email que é gerenciado pelo Auth)
      const updateData: any = {
        nome: profileData.nome,
        telefone: profileData.telefone,
        endereco: profileData.endereco,
        foto: profileData.foto,
        preferencias: profileData.preferencias,
        updated_at: new Date().toISOString()
      };

      // Remover campos undefined ou null
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      console.log('Dados filtrados para atualização:', updateData);

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        console.error('Erro do Supabase ao atualizar perfil:', error);
        console.error('Detalhes do erro:', error.message, error.code, error.details);
        throw error;
      }
      
      console.log('Perfil atualizado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { error: error as Error };
    }
  }

  // Listener para mudanças de autenticação
  onAuthStateChange(callback: (event: string, session: any) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  }
}

export const authService = new AuthService();
export default authService;