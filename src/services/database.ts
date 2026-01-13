import Dexie, { Table } from 'dexie';
import { 
  NotaFiscal, 
  ItemNotaFiscal, 
  ListaCompras, 
  ItemLista, 
  Receita, 
  IngredienteReceita, 
  HistoricoPreco,
  Usuario,
  Mercado 
} from '../types';

export class ListouMaisDB extends Dexie {
  notasFiscais!: Table<NotaFiscal>;
  itensNotas!: Table<ItemNotaFiscal>;
  listasCompras!: Table<ListaCompras>;
  itensLista!: Table<ItemLista>;
  receitas!: Table<Receita>;
  ingredientesReceita!: Table<IngredienteReceita>;
  historicoPrecos!: Table<HistoricoPreco>;
  usuarios!: Table<Usuario>;
  mercados!: Table<Mercado>;

  constructor() {
    super('ListouMaisDB');
    
    this.version(1).stores({
      // Tabela de notas fiscais
      notasFiscais: 'id, chaveAcesso, emitente, dataEmissao, valorTotal, importadaEm',
      
      // Tabela de itens de notas (para busca eficiente)
      itensNotas: 'id, notaFiscalId, descricaoNormalizada, categoria, valorTotal',
      
      // Tabelas de listas de compras
      listasCompras: 'id, nome, criadaEm, atualizadaEm, totalEstimado',
      itensLista: 'id, listaId, descricao, categoria, concluido, prioridade',
      
      // Tabela de receitas
      receitas: 'id, nome, categoria, tempoPreparo, custoEstimado, favorita',
      ingredientesReceita: 'id, receitaId, descricao, quantidade, unidade',
      
      // Tabela de histórico de preços
      historicoPrecos: 'id, produtoNormalizado, estabelecimento, preco, data',
      
      // Tabela de usuários
      usuarios: 'id, email, nome, plano, dataCadastro'
    });

    // Relacionamentos
    this.notasFiscais.mapToClass(NotaFiscalClass);
    this.listasCompras.mapToClass(ListaComprasClass);
    this.receitas.mapToClass(ReceitaClass);
  }
}

// Classes para mapeamento
class NotaFiscalClass {
  id!: string;
  chaveAcesso!: string;
  emitente!: string;
  cnpj!: string;
  dataEmissao!: Date;
  valorTotal!: number;
  itens!: ItemNotaFiscal[];
  categoriaGastos!: Record<string, number>;
  importadaEm!: Date;
}

class ListaComprasClass {
  id!: string;
  nome!: string;
  itens!: ItemLista[];
  categorias!: any[];
  totalEstimado!: number;
  criadaEm!: Date;
  atualizadaEm!: Date;
  compartilhadaCom!: string[];
}

class ReceitaClass {
  id!: string;
  nome!: string;
  ingredientes!: IngredienteReceita[];
  modoPreparo!: string[];
  tempoPreparo!: number;
  rendimento!: number;
  custoEstimado!: number;
  categoria!: string;
  dificuldade!: 'facil' | 'media' | 'dificil';
  favorita!: boolean;
  imagem?: string;
}

// Exportar instância do banco
export const db = new ListouMaisDB();