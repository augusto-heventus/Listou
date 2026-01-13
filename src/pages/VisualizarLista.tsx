import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit3, Share2, Check, Clock, Users, DollarSign, Filter, ShoppingBag, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatarMoeda, formatarData } from '../utils';

interface ItemLista {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  categoria: string;
  prioridade: 'baixa' | 'media' | 'alta';
  observacoes?: string;
  concluido: boolean;
  precoEstimado?: number;
  precoReal?: number;
}

interface ListaCompras {
  id: string;
  nome: string;
  descricao?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  itens: ItemLista[];
  status: 'ativa' | 'concluida' | 'cancelada';
  participantes: number;
  orcamento?: number;
}

const VisualizarLista: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'categoria' | 'prioridade' | 'preco'>('nome');
  const [showShareModal, setShowShareModal] = useState(false);
  const [_showAddItemModal, setShowAddItemModal] = useState(false); // TODO: Implementar adição de itens
  const [_editingItem, setEditingItem] = useState<string | null>(null); // TODO: Implementar edição de itens

  // Dados mockados da lista
  const lista: ListaCompras = {
    id: id || '1',
    nome: 'Compras da Semana',
    descricao: 'Lista semanal para família de 2 pessoas',
    dataCriacao: new Date('2024-11-10'),
    dataAtualizacao: new Date('2024-11-12'),
    status: 'ativa',
    participantes: 2,
    orcamento: 200,
    itens: [
      {
        id: '1',
        descricao: 'Arroz branco tipo 1',
        quantidade: 2,
        unidade: 'kg',
        categoria: 'Mercearia',
        prioridade: 'alta',
        concluido: true,
        precoEstimado: 8.50,
        precoReal: 7.90
      },
      {
        id: '2',
        descricao: 'Feijão carioca',
        quantidade: 1,
        unidade: 'kg',
        categoria: 'Mercearia',
        prioridade: 'alta',
        concluido: true,
        precoEstimado: 7.80,
        precoReal: 8.20
      },
      {
        id: '3',
        descricao: 'Macarrão parafuso',
        quantidade: 3,
        unidade: 'un',
        categoria: 'Mercearia',
        prioridade: 'media',
        concluido: false,
        precoEstimado: 4.50,
        observacoes: 'Marca preferida: Barilla'
      },
      {
        id: '4',
        descricao: 'Leite integral',
        quantidade: 6,
        unidade: 'l',
        categoria: 'Laticínios',
        prioridade: 'alta',
        concluido: false,
        precoEstimado: 4.20
      },
      {
        id: '5',
        descricao: 'Queijo mussarela',
        quantidade: 500,
        unidade: 'g',
        categoria: 'Laticínios',
        prioridade: 'media',
        concluido: false,
        precoEstimado: 28.90
      },
      {
        id: '6',
        descricao: 'Frango peito sem pele',
        quantidade: 1.5,
        unidade: 'kg',
        categoria: 'Carnes',
        prioridade: 'alta',
        concluido: false,
        precoEstimado: 19.90
      },
      {
        id: '7',
        descricao: 'Tomate maduro',
        quantidade: 1,
        unidade: 'kg',
        categoria: 'Vegetais',
        prioridade: 'media',
        concluido: false,
        precoEstimado: 6.50
      },
      {
        id: '8',
        descricao: 'Cebola branca',
        quantidade: 1,
        unidade: 'kg',
        categoria: 'Vegetais',
        prioridade: 'media',
        concluido: false,
        precoEstimado: 4.90
      },
      {
        id: '9',
        descricao: 'Banana prata',
        quantidade: 1.5,
        unidade: 'kg',
        categoria: 'Frutas',
        prioridade: 'baixa',
        concluido: false,
        precoEstimado: 4.50
      },
      {
        id: '10',
        descricao: 'Maçã gala',
        quantidade: 1,
        unidade: 'kg',
        categoria: 'Frutas',
        prioridade: 'baixa',
        concluido: false,
        precoEstimado: 7.90
      }
    ]
  };

  const categorias = ['todas', 'Mercearia', 'Laticínios', 'Carnes', 'Vegetais', 'Frutas', 'Padaria', 'Bebidas', 'Limpeza', 'Higiene'];

  const toggleItemConcluido = (itemId: string) => {
    // Implementar toggle de item concluído
    console.log('Toggle item:', itemId);
  };

  const excluirItem = (itemId: string) => {
    // Implementar exclusão de item
    console.log('Excluir item:', itemId);
  };

  const compartilharLista = () => {
    // Implementar compartilhamento
    console.log('Compartilhar lista');
    setShowShareModal(false);
  };

  const itensFiltrados = lista.itens.filter(item => {
    const filtroCategoriaOK = filtroCategoria === 'todas' || item.categoria === filtroCategoria;
    const filtroStatusOK = filtroStatus === 'todos' || 
      (filtroStatus === 'concluidos' && item.concluido) ||
      (filtroStatus === 'pendentes' && !item.concluido);
    return filtroCategoriaOK && filtroStatusOK;
  }).sort((a, b) => {
    switch (ordenacao) {
      case 'categoria':
        return a.categoria.localeCompare(b.categoria);
      case 'prioridade':
        const prioridades = { alta: 3, media: 2, baixa: 1 };
        return prioridades[b.prioridade] - prioridades[a.prioridade];
      case 'preco':
        return (b.precoEstimado || 0) - (a.precoEstimado || 0);
      default:
        return a.descricao.localeCompare(b.descricao);
    }
  });

  const itensConcluidos = lista.itens.filter(item => item.concluido).length;
  const progresso = (itensConcluidos / lista.itens.length) * 100;
  const totalEstimado = lista.itens.reduce((sum, item) => sum + (item.precoEstimado || 0), 0);
  const totalReal = lista.itens.reduce((sum, item) => sum + (item.precoReal || 0), 0);

  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/listas')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Compartilhar lista"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate(`/listas/${id}/editar`)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Editar lista"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Informações da Lista */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lista.nome}</h1>
              {lista.descricao && (
                <p className="text-gray-600 mb-3">{lista.descricao}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Criada em {formatarData(lista.dataCriacao)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{lista.participantes} pessoas</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                lista.status === 'ativa' ? 'bg-green-100 text-green-800' :
                lista.status === 'concluida' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {lista.status === 'ativa' ? 'Ativa' :
                 lista.status === 'concluida' ? 'Concluída' : 'Cancelada'}
              </div>
            </div>
          </div>

          {/* Progresso e Valores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progresso</span>
                <span className="text-sm font-medium text-gray-900">{Math.round(progresso)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {itensConcluidos} de {lista.itens.length} itens
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Estimado</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatarMoeda(totalEstimado)}
              </div>
              {lista.orcamento && (
                <div className="text-xs text-gray-500">
                  Orçamento: {formatarMoeda(lista.orcamento)}
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Real</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {formatarMoeda(totalReal)}
              </div>
              {totalReal > 0 && (
                <div className={`text-xs ${
                  totalReal <= totalEstimado ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalReal <= totalEstimado ? 'Economia' : '+'} {formatarMoeda(Math.abs(totalReal - totalEstimado))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtros e Ordenação */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="input text-sm"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas' : categoria}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="input text-sm"
              >
                <option value="todos">Todos</option>
                <option value="concluidos">Concluídos</option>
                <option value="pendentes">Pendentes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value as any)}
                className="input text-sm"
              >
                <option value="nome">Nome</option>
                <option value="categoria">Categoria</option>
                <option value="prioridade">Prioridade</option>
                <option value="preco">Preço</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowAddItemModal(true)}
                className="btn-primary w-full inline-flex items-center justify-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Itens ({itensFiltrados.length})
              </h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {filtroCategoria !== 'todas' && filtroCategoria} • {filtroStatus !== 'todos' && filtroStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {itensFiltrados.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleItemConcluido(item.id)}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        item.concluido 
                          ? 'bg-primary-600 border-primary-600 text-white' 
                          : 'border-gray-300 hover:border-primary-600'
                      }`}
                    >
                      {item.concluido && <Check className="w-3 h-3" />}
                    </button>
                    
                    <div className={`flex-1 ${item.concluido ? 'opacity-60' : ''}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${
                          item.concluido ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {item.descricao}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getPrioridadeCor(item.prioridade)
                        }`}>
                          {item.prioridade}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                        <span>{item.quantidade} {item.unidade}</span>
                        <span>•</span>
                        <span>{item.categoria}</span>
                        {item.precoEstimado && (
                          <>
                            <span>•</span>
                            <span>{formatarMoeda(item.precoEstimado)}</span>
                          </>
                        )}
                      </div>
                      
                      {item.observacoes && (
                        <p className="text-sm text-gray-500 italic">
                          {item.observacoes}
                        </p>
                      )}
                      
                      {item.precoReal && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          Comprado por: {formatarMoeda(item.precoReal)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Editar item"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => excluirItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {itensFiltrados.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingBag className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
              <p className="text-gray-600">
                {filtroCategoria !== 'todas' || filtroStatus !== 'todos' 
                  ? 'Tente ajustar seus filtros ou adicionar novos itens.'
                  : 'Adicione itens à sua lista de compras.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compartilhar Lista</h3>
            <p className="text-gray-600 mb-4">
              Compartilhe esta lista com outras pessoas para que elas possam visualizar e editar os itens.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600 mb-1">Link de compartilhamento:</div>
              <div className="text-sm font-mono text-gray-900 break-all">
                listou.app/lista/{lista.id}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={compartilharLista}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Copiar Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarLista;