import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit3, Share2, Check, Clock, Users, DollarSign, Filter, ShoppingBag, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatarMoeda, formatarData } from '../utils';
import { toast } from 'sonner';

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
  
  // Dados mockados iniciais
  const initialLista: ListaCompras = {
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
      }
    ]
  };

  const [items, setItems] = useState<ItemLista[]>(initialLista.itens);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'categoria' | 'prioridade' | 'preco'>('nome');
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemLista | null>(null);

  const toggleItemConcluido = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, concluido: !item.concluido } : item
    ));
    toast.success('Status do item atualizado');
  };

  const excluirItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removido da lista');
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      toast.success('Item atualizado com sucesso');
    }
  };

  const compartilharLista = () => {
    toast.success('Link copiado para a área de transferência');
    setShowShareModal(false);
  };

  const itensFiltrados = items.filter(item => {
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

  const itensConcluidos = items.filter(item => item.concluido).length;
  const progresso = items.length > 0 ? (itensConcluidos / items.length) * 100 : 0;
  const totalEstimado = items.reduce((sum, item) => sum + ((item.precoEstimado || 0) * item.quantidade), 0);
  const totalReal = items.reduce((sum, item) => sum + ((item.precoReal || 0) * item.quantidade), 0);

  const getPrioridadeCor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categorias = ['todas', 'Mercearia', 'Laticínios', 'Carnes', 'Vegetais', 'Frutas', 'Padaria', 'Bebidas', 'Limpeza', 'Higiene'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/listas')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div className="flex items-center space-x-2">
              <button onClick={() => setShowShareModal(true)} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button onClick={() => navigate(`/listas/${id}/editar`)} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{initialLista.nome}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1"><Clock className="w-4 h-4" /> <span>{formatarData(initialLista.dataCriacao)}</span></span>
                <span className="flex items-center space-x-1"><Users className="w-4 h-4" /> <span>{initialLista.participantes} pessoas</span></span>
              </div>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${initialLista.status === 'ativa' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {initialLista.status === 'ativa' ? 'Ativa' : 'Concluída'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-600">Progresso</span> <span className="text-sm font-medium text-gray-900">{Math.round(progresso)}%</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progresso}%` }}></div></div>
              <div className="text-xs text-gray-500 mt-1">{itensConcluidos} de {items.length} itens</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1"><DollarSign className="w-4 h-4 text-gray-600" /> <span className="text-sm text-gray-600">Estimado</span></div>
              <div className="text-lg font-semibold text-gray-900">{formatarMoeda(totalEstimado)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1"><TrendingUp className="w-4 h-4 text-gray-600" /> <span className="text-sm text-gray-600">Real</span></div>
              <div className="text-lg font-semibold text-gray-900">{formatarMoeda(totalReal)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="input text-sm">
            {categorias.map(c => <option key={c} value={c}>{c === 'todas' ? 'Categorias' : c}</option>)}
          </select>
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="input text-sm">
            <option value="todos">Status</option>
            <option value="concluidos">Concluídos</option>
            <option value="pendentes">Pendentes</option>
          </select>
          <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value as any)} className="input text-sm">
            <option value="nome">Nome</option>
            <option value="categoria">Categoria</option>
            <option value="prioridade">Prioridade</option>
            <option value="preco">Preço</option>
          </select>
          <button className="btn-primary flex items-center justify-center space-x-2 text-sm"><Plus className="w-4 h-4" /> <span>Novo Item</span></button>
        </div>

        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
          {itensFiltrados.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button onClick={() => toggleItemConcluido(item.id)} className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${item.concluido ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'}`}>
                    {item.concluido && <Check className="w-3 h-3" />}
                  </button>
                  <div className={item.concluido ? 'opacity-60' : ''}>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${item.concluido ? 'line-through text-gray-500' : 'text-gray-900'}`}>{item.descricao}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPrioridadeCor(item.prioridade)}`}>{item.prioridade}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>{item.quantidade} {item.unidade}</span>
                      <span>•</span>
                      <span>{item.categoria}</span>
                      {item.precoEstimado && <span>• {formatarMoeda(item.precoEstimado * item.quantidade)}</span>}
                    </div>
                    {item.precoReal && <div className="text-xs text-emerald-600 font-bold mt-1">Pago: {formatarMoeda(item.precoReal * item.quantidade)}</div>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setEditingItem(item)} className="p-1 text-gray-400 hover:text-primary-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => excluirItem(item.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black mb-2">Compartilhar Lista</h3>
            <p className="text-gray-600 mb-6 text-sm">Compartilhe esta lista para edição colaborativa.</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6"><div className="text-[10px] font-black uppercase text-gray-400 mb-2">Link</div><div className="text-sm font-mono text-primary-700 break-all select-all font-bold">listou.app/lista/{initialLista.id}</div></div>
            <div className="flex gap-3">
              <button onClick={() => setShowShareModal(false)} className="flex-1 h-11 border border-gray-200 text-gray-600 font-bold rounded-xl">Fechar</button>
              <button onClick={compartilharLista} className="flex-1 h-11 bg-primary-600 text-white font-bold rounded-xl">Copiar</button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-black text-gray-900 mb-6">Editar Item</h3>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Descrição</label>
                <input type="text" value={editingItem.descricao} onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })} className="input bg-gray-50 h-11 rounded-xl text-sm w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Quantidade</label>
                  <input type="number" step="0.01" value={editingItem.quantidade} onChange={(e) => setEditingItem({ ...editingItem, quantidade: parseFloat(e.target.value) })} className="input bg-gray-50 h-11 rounded-xl text-sm w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Unidade</label>
                  <input type="text" value={editingItem.unidade} onChange={(e) => setEditingItem({ ...editingItem, unidade: e.target.value })} className="input bg-gray-50 h-11 rounded-xl text-sm w-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Preço Estimado</label>
                  <input type="number" step="0.01" value={editingItem.precoEstimado} onChange={(e) => setEditingItem({ ...editingItem, precoEstimado: parseFloat(e.target.value) })} className="input bg-gray-50 h-11 rounded-xl text-sm w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Preço Real</label>
                  <input type="number" step="0.01" value={editingItem.precoReal} onChange={(e) => setEditingItem({ ...editingItem, precoReal: parseFloat(e.target.value) })} className="input bg-emerald-50 h-11 rounded-xl text-sm w-full font-bold text-emerald-700" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 h-12 border border-gray-200 text-gray-600 font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="flex-1 h-12 bg-primary-600 text-white font-bold rounded-xl">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarLista;