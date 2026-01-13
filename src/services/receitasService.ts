import { supabase } from '../lib/supabaseClient';

export interface Receita {
  id: string;
  titulo: string;
  tempo_preparo: number;
  dificuldade: 'facil' | 'media' | 'dificil';
  rendimento: number;
  usuario_id: string | null;
  created_at: string;
  // Campos adicionais para compatibilidade com frontend
  categoria?: string;
  custoEstimado?: number;
  favorita?: boolean;
  imagem?: string;
}

export interface Ingrediente {
  id: string;
  receita_id: string;
  descricao: string;
  quantidade?: number;
  unidade?: string;
  created_at: string;
}

export interface ReceitaCompleta extends Receita {
  ingredientes: Ingrediente[];
}

export const receitasService = {
  // Salvar ingrediente individual
  async salvarIngrediente(ingrediente: Omit<Ingrediente, 'id' | 'created_at'>): Promise<Ingrediente> {
    try {
      console.log('🔄 Service: Salvando ingrediente:', ingrediente);
      
      const { data, error } = await supabase
        .from('receita_ingredientes')
        .insert([ingrediente])
        .select()
        .single();

      console.log('📥 Service: Resultado do ingrediente:', { data, error });

      if (error) {
        console.error('❌ Service: Erro ao salvar ingrediente:', error);
        throw error;
      }
      
      console.log('✅ Service: Ingrediente salvo com sucesso:', data);
      return data;
    } catch (error) {
      console.error('❌ Service: Erro ao salvar ingrediente:', error);
      throw error;
    }
  },

  // Buscar todos os ingredientes de uma receita
  async buscarIngredientesPorReceita(receitaId: string): Promise<Ingrediente[]> {
    try {
      const { data, error } = await supabase
        .from('receita_ingredientes')
        .select('*')
        .eq('receita_id', receitaId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      throw error;
    }
  },

  // Buscar todas as receitas (públicas e do usuário)
  async buscarReceitas(): Promise<Receita[]> {
    try {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear para o formato esperado pelo frontend
      return data.map(receita => ({
        ...receita,
        nome: receita.titulo,
        tempoPreparo: receita.tempo_preparo,
        // Adicionar valores padrão para campos que não estão no banco ainda
        categoria: this.definirCategoria(receita.titulo),
        custoEstimado: this.estimarCusto(receita.titulo),
        favorita: false,
        imagem: this.gerarImagem(receita.titulo)
      }));
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      throw error;
    }
  },

  // Buscar receita por ID com ingredientes
  async buscarReceitaPorId(id: string): Promise<ReceitaCompleta | null> {
    try {
      const { data: receita, error: receitaError } = await supabase
        .from('receitas')
        .select('*')
        .eq('id', id)
        .single();

      if (receitaError) throw receitaError;
      if (!receita) return null;

      const { data: ingredientes, error: ingredientesError } = await supabase
        .from('receita_ingredientes')
        .select('*')
        .eq('receita_id', id)
        .order('created_at', { ascending: true });

      if (ingredientesError) throw ingredientesError;

      return {
        ...receita,
        nome: receita.titulo,
        tempoPreparo: receita.tempo_preparo,
        categoria: this.definirCategoria(receita.titulo),
        custoEstimado: this.estimarCusto(receita.titulo),
        favorita: false,
        imagem: this.gerarImagem(receita.titulo),
        ingredientes: ingredientes || []
      };
    } catch (error) {
      console.error('Erro ao buscar receita:', error);
      throw error;
    }
  },

  // Salvar nova receita
  async salvarReceita(receita: Omit<Receita, 'id' | 'created_at'>): Promise<Receita> {
    try {
      console.log('🔄 Service: Iniciando salvamento da receita:', receita);
      
      const dadosParaInserir: any = {
        titulo: receita.titulo,
        tempo_preparo: receita.tempo_preparo,
        dificuldade: receita.dificuldade,
        rendimento: receita.rendimento,
        usuario_id: receita.usuario_id || null
      };
      
      // Apenas adicionar imagem se foi fornecida
      if (receita.imagem) {
        dadosParaInserir.imagem = receita.imagem;
      }
      
      console.log('📤 Service: Dados para inserir:', dadosParaInserir);
      
      const { data, error } = await supabase
        .from('receitas')
        .insert([dadosParaInserir])
        .select()
        .single();

      console.log('📥 Service: Resultado do Supabase:', { data, error });

      if (error) {
        console.error('❌ Service: Erro do Supabase:', error);
        console.error('❌ Service: Detalhes do erro:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ Service: Receita salva com sucesso:', data);

      return {
        ...data,
        nome: data.titulo,
        tempoPreparo: data.tempo_preparo,
        categoria: this.definirCategoria(data.titulo),
        custoEstimado: this.estimarCusto(data.titulo),
        favorita: false,
        imagem: data.imagem || this.gerarImagem(data.titulo)
      };
    } catch (error) {
      console.error('❌ Service: Erro ao salvar receita:', error);
      throw error;
    }
  },

  // Métodos auxiliares
  definirCategoria(titulo: string): string {
    const tituloLower = titulo.toLowerCase();
    if (tituloLower.includes('bolo') || tituloLower.includes('sobremesa') || tituloLower.includes('doce')) {
      return 'Sobremesas';
    } else if (tituloLower.includes('macarrão') || tituloLower.includes('massa') || tituloLower.includes('nhoque')) {
      return 'Massas';
    } else if (tituloLower.includes('salada') || tituloLower.includes('salpicão')) {
      return 'Saladas';
    } else if (tituloLower.includes('arroz') || tituloLower.includes('feijão') || tituloLower.includes('principal')) {
      return 'Prato Principal';
    } else {
      return 'Prato Principal'; // Categoria padrão
    }
  },

  estimarCusto(titulo: string): number {
    // Estimativa simples baseada no título
    const tituloLower = titulo.toLowerCase();
    if (tituloLower.includes('bolo')) return 18.50;
    if (tituloLower.includes('macarrão')) return 28.90;
    if (tituloLower.includes('arroz')) return 25.50;
    if (tituloLower.includes('feijão')) return 32.80;
    if (tituloLower.includes('salpicão')) return 35.20;
    return 25.00; // Valor padrão
  },

  gerarImagem(titulo: string): string {
    // Gerar URL de imagem baseada no título (usando o mesmo padrão do frontend)
    const tituloEncoded = encodeURIComponent(titulo + ' prato de comida fotografia gastronomica iluminação natural');
    return `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${tituloEncoded}&image_size=square`;
  }
};