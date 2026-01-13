// Tipos principais
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: EnderecoUsuario;
  foto?: string;
  plano: 'gratuito' | 'premium';
  dataCadastro: Date;
  preferencias: PreferenciasUsuario;
}

export interface PreferenciasUsuario {
  moeda: 'BRL' | 'USD' | 'EUR';
  notificacoes: boolean;
  backupAutomatico: boolean;
  categoriasPersonalizadas: CategoriaPersonalizada[];
}

export interface EnderecoUsuario {
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface CategoriaPersonalizada {
  id: string;
  nome: string;
  cor: string;
  icone: string;
}

export interface NotaFiscal {
  id: string;
  chaveAcesso: string;
  emitente: string;
  cnpj: string;
  dataEmissao: Date;
  valorTotal: number;
  itens: ItemNotaFiscal[];
  categoriaGastos: Record<string, number>;
  importadaEm: Date;
}

export interface ItemNotaFiscal {
  id: string;
  descricao: string;
  descricaoNormalizada: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  ncm?: string;
  categoria: string;
  subcategoria?: string;
}

export interface ListaCompras {
  id: string;
  nome: string;
  itens: ItemLista[];
  categorias: CategoriaLista[];
  totalEstimado: number;
  criadaEm: Date;
  atualizadaEm: Date;
  compartilhadaCom: string[];
}

export interface ItemLista {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  categoria: string;
  observacoes?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluido: boolean;
  precoEstimado?: number;
}

export interface CategoriaLista {
  id: string;
  nome: string;
  ordem: number;
  cor?: string;
}

export interface Receita {
  id: string;
  titulo: string;
  ingredientes: IngredienteReceita[];
  modoPreparo: string[];
  tempo_preparo: number; // em minutos
  rendimento: number; // número de porções
  custoEstimado: number;
  categoria: string;
  dificuldade: 'facil' | 'media' | 'dificil';
  favorita: boolean;
  imagem?: string;
  usuario_id?: string | null;
  created_at?: string;
}

export interface IngredienteReceita {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  opcional: boolean;
}

export interface HistoricoPreco {
  id: string;
  produtoNormalizado: string;
  estabelecimento: string;
  preco: number;
  data: Date;
  unidade: string;
}

export interface Mercado {
  id: string;
  nome: string;
  endereco: string;
  cnpj?: string;
  telefone?: string;
  horarioFuncionamento: string;
  localizacao: {
    latitude: number;
    longitude: number;
  };
  distancia?: number; // em km
  precoTotalEstimado?: number;
  itensDisponiveis: ItemMercado[];
}

export interface ItemMercado {
  produtoNormalizado: string;
  preco: number;
  unidade: string;
  disponivel: boolean;
}

// Tipos para API de notas fiscais
export interface ApiNotaFiscalResponse {
  chave: string;
  emitente: string;
  cnpj: string;
  dataEmissao: string;
  valorTotal: number;
  itens: ApiItemNotaFiscal[];
}

export interface ApiItemNotaFiscal {
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
  ncm?: string;
}

// Tipos para categorização
export interface CategorizacaoResponse {
  categoria: string;
  subcategoria: string;
  confianca: number;
}

// Tipos para o dashboard
export interface ResumoFinanceiro {
  totalMes: number;
  totalAno: number;
  mediaMensal: number;
  categoriaMaiorGasto: {
    nome: string;
    valor: number;
    percentual: number;
  };
  ultimasNotas: NotaFiscal[];
  evolucaoGastos: {
    mes: string;
    valor: number;
  }[];
}

// Tipos para onboarding
export interface OnboardingStep {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  acao: string;
}