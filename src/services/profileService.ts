import { supabase } from '../lib/supabaseClient';

// Function to create user profile using service role (admin) privileges
export async function createUserProfileAdmin(userId: string, nome: string, email: string) {
  try {
    // Use the service role key to bypass RLS for profile creation
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          nome,
          email,
          plano: 'gratuito',
          preferencias: {
            moeda: 'BRL',
            notificacoes: true,
            backup_automatico: true,
          },
        },
      ]);

    if (error) {
      console.error('Erro ao criar perfil com privilégios admin:', error);
      throw error;
    }

    console.log('Perfil criado com sucesso (admin):', data);
    return data;
  } catch (error) {
    console.error('Erro na função admin de criação de perfil:', error);
    throw error;
  }
}

// Function to check if user profile exists
export async function checkUserProfileExists(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar perfil:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar existência do perfil:', error);
    return false;
  }
}