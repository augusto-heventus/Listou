import { supabase } from '@/lib/supabaseClient'

export interface NotaFiscal {
  id: string
  usuario_id?: string
  chave_acesso: string
  emitente: string
  cnpj: string
  data_emissao: string
  valor_total: number
  valor_desconto: number
  valor_pago?: number
  created_at: string
  itens?: NotaFiscalItem[]
}

export interface NotaFiscalItem {
  id: string
  nota_id: string
  descricao: string
  quantidade: number
  unidade?: string
  valor_unitario?: number
  valor_total: number
  categoria?: string
}

export async function getNotasFiscais(): Promise<NotaFiscal[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Erro ao carregar notas fiscais:', error)
    throw error
  }
}

export async function getNotaFiscalById(id: string): Promise<NotaFiscal | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('notas_fiscais')
      .select(`
        *,
        nota_itens (*)
      `)
      .eq('id', id)
      .eq('usuario_id', user.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Erro ao carregar nota fiscal:', error)
    throw error
  }
}

export async function deleteNotaFiscal(id: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // First delete items (cascade)
    const { error: itemsError } = await supabase
      .from('nota_itens')
      .delete()
      .eq('nota_id', id)

    if (itemsError) {
      throw new Error(itemsError.message)
    }

    // Then delete the nota
    const { error: notaError } = await supabase
      .from('notas_fiscais')
      .delete()
      .eq('id', id)
      .eq('usuario_id', user.id)

    if (notaError) {
      throw new Error(notaError.message)
    }
  } catch (error) {
    console.error('Erro ao deletar nota fiscal:', error)
    throw error
  }
}

export async function verificarChaveExistente(chaveAcesso: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('id')
      .eq('chave_acesso', chaveAcesso)
      .eq('usuario_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message)
    }

    return !!data
  } catch (error) {
    console.error('Erro ao verificar chave existente:', error)
    throw error
  }
}