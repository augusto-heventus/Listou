import { supabase } from '@/lib/supabaseClient'

type NotaTransformada = {
  chave: string
  emitente: string
  cnpj: string
  dataEmissao: string
  valorTotal: number
  valorDesconto?: number
  valorPago?: number
  itens: Array<{
    descricao: string
    quantidade: number
    unidade?: string
    valorUnitario?: number
    valorTotal: number
    categoria?: string
  }>
}

export async function salvarNotaFiscal(nota: NotaTransformada, usuarioId?: string) {
  // Get current user if usuarioId is not provided
  let currentUserId = usuarioId;
  if (!currentUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    currentUserId = user.id;
  }

  const { data: notaInserida, error: erroNota } = await supabase
    .from('notas_fiscais')
    .insert({
      usuario_id: currentUserId,
      chave_acesso: nota.chave,
      emitente: nota.emitente,
      cnpj: nota.cnpj,
      data_emissao: nota.dataEmissao,
      valor_total: nota.valorTotal,
      valor_desconto: nota.valorDesconto || 0,
      valor_pago: nota.valorPago ?? null
    })
    .select()
    .single()

  if (erroNota) {
    console.error('Erro ao inserir nota fiscal:', erroNota);
    console.error('Dados da nota:', {
      usuario_id: currentUserId,
      chave_acesso: nota.chave,
      emitente: nota.emitente,
      cnpj: nota.cnpj,
      data_emissao: nota.dataEmissao,
      valor_total: nota.valorTotal,
      valor_desconto: nota.valorDesconto || 0,
      valor_pago: nota.valorPago ?? null
    });
    throw new Error(`Erro ao salvar nota fiscal: ${erroNota.message}`);
  }

  const itensPayload = nota.itens.map((i) => ({
    nota_id: notaInserida.id,
    descricao: i.descricao,
    quantidade: i.quantidade,
    unidade: i.unidade || null,
    valor_unitario: i.valorUnitario ?? null,
    valor_total: i.valorTotal,
    categoria: i.categoria || null
  }))

  const { error: erroItens } = await supabase
    .from('nota_itens')
    .insert(itensPayload)

  if (erroItens) throw new Error(erroItens.message)

  return notaInserida
}