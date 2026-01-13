import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check, Save } from 'lucide-react';
import { formatarMoeda, gerarId } from '../utils';

interface ItemListaEdicao {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  categoria: string;
  prioridade: 'baixa' | 'media' | 'alta';
  observacoes?: string;
  concluido: boolean;
  precoEstimado?: number;
}

const NovaLista: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nomeLista, setNomeLista] = useState('');
  const [itens, setItens] = useState<ItemListaEdicao[]>([]);
  const [novoItem, setNovoItem] = useState({
    descricao: '',
    quantidade: 1,
    unidade: 'un',
    categoria: 'Mercearia',
    prioridade: 'media' as const,
    observacoes: '',
    precoEstimado: undefined as number | undefined
  });

  // Carregar itens da receita se vierem via state
  useEffect(() => {
    if (location.state?.itens) {
      const itensReceita = location.state.itens.map((item: any) => ({
        id: gerarId(),
        descricao: item.nome,
        quantidade: parseFloat(item.quantidade) || 1,
        unidade: item.unidade,
        categoria: item.categoria || 'Mercearia',
        prioridade: 'media' as const,
        observacoes: '',
        concluido: false,
        precoEstimado: undefined
      }));
      setItens(itensReceita);
    }
  }, [location.state]);

  const categorias = [
    'Mercearia', 'Frios', 'Carnes', 'Vegetais', 'Frutas', 'Padaria',
    'Limpeza', 'Higiene', 'Bebidas', 'Snacks', 'Outros'
  ];

  const unidades = ['un', 'kg', 'g', 'l', 'ml', 'pct', 'dz'];

  const adicionarItem = () => {
    if (!novoItem.descricao.trim()) return;

    const item: ItemListaEdicao = {
      id: gerarId(),
      ...novoItem,
      concluido: false
    };

    setItens([...itens, item]);
    setNovoItem({
      descricao: '',
      quantidade: 1,
      unidade: 'un',
      categoria: 'Mercearia',
      prioridade: 'media',
      observacoes: '',
      precoEstimado: undefined
    });
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const toggleConcluido = (id: string) => {
    setItens(itens.map(item =>
      item.id === id ? { ...item, concluido: !item.concluido } : item
    ));
  };

  // const _atualizarItem = (id: string, campo: keyof ItemListaEdicao, valor: any) => {
  //   setItens(itens.map(item =>
  //     item.id === id ? { ...item, [campo]: valor } : item
  //   ));
  // };

  const salvarLista = () => {
    if (!nomeLista.trim()) {
      alert('Por favor, dê um nome à sua lista');
      return;
    }

    if (itens.length === 0) {
      alert('Adicione pelo menos um item à lista');
      return;
    }

    // Salvar lista (mock)
    console.log('Salvando lista:', { nome: nomeLista, itens });
    navigate('/listas');
  };

  const totalEstimado = itens.reduce((total, item) => {
    return total + (item.precoEstimado || 0);
  }, 0);

  const itensAgrupados = itens.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, ItemListaEdicao[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nova Lista de Compras</h1>
      </div>

      {/* Nome da lista */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Lista
        </label>
        <input
          type="text"
          value={nomeLista}
          onChange={(e) => setNomeLista(e.target.value)}
          placeholder="Ex: Compras da Semana, Itens de Limpeza..."
          className="input"
        />
      </div>

      {/* Adicionar novo item */}
      <div className="card">
        <h3 className="font-medium text-gray-900 mb-4">Adicionar Item</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <input
              type="text"
              value={novoItem.descricao}
              onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
              placeholder="Ex: Arroz, Feijão, Leite..."
              className="input"
              onKeyPress={(e) => e.key === 'Enter' && adicionarItem()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input
              type="number"
              value={novoItem.quantidade}
              onChange={(e) => setNovoItem({ ...novoItem, quantidade: parseInt(e.target.value) || 1 })}
              min="1"
              className="input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
            <select
              value={novoItem.unidade}
              onChange={(e) => setNovoItem({ ...novoItem, unidade: e.target.value })}
              className="input"
            >
              {unidades.map(unidade => (
                <option key={unidade} value={unidade}>{unidade}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={novoItem.categoria}
              onChange={(e) => setNovoItem({ ...novoItem, categoria: e.target.value })}
              className="input"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <select
              value={novoItem.prioridade}
              onChange={(e) => setNovoItem({ ...novoItem, prioridade: e.target.value as any })}
              className="input"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Estimado</label>
            <input
              type="number"
              step="0.01"
              value={novoItem.precoEstimado || ''}
              onChange={(e) => setNovoItem({ ...novoItem, precoEstimado: parseFloat(e.target.value) || undefined })}
              placeholder="R$ 0,00"
              className="input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <input
              type="text"
              value={novoItem.observacoes}
              onChange={(e) => setNovoItem({ ...novoItem, observacoes: e.target.value })}
              placeholder="Ex: Marca preferida"
              className="input"
            />
          </div>
        </div>

        <button
          onClick={adicionarItem}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Item</span>
        </button>
      </div>

      {/* Itens da lista */}
      {itens.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Itens da Lista</h3>
            <div className="text-sm text-gray-600">
              Total estimado: <span className="font-semibold">{formatarMoeda(totalEstimado)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(itensAgrupados).map(([categoria, itensCategoria]) => (
              <div key={categoria}>
                <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">
                  {categoria}
                </h4>
                <div className="space-y-2">
                  {itensCategoria.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => toggleConcluido(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          item.concluido
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-gray-300 hover:border-green-600'
                        }`}
                      >
                        {item.concluido && <Check className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium ${item.concluido ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.descricao}
                          </p>
                          <div className="flex items-center space-x-2">
                            {item.precoEstimado && (
                              <span className="text-sm text-gray-600">
                                {formatarMoeda(item.precoEstimado)}
                              </span>
                            )}
                            <button
                              onClick={() => removerItem(item.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{item.quantidade} {item.unidade}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
                            item.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.prioridade === 'alta' ? 'Alta' : item.prioridade === 'media' ? 'Média' : 'Baixa'}
                          </span>
                          {item.observacoes && (
                            <span className="text-gray-500">{item.observacoes}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão salvar */}
      <div className="flex space-x-4">
        <button
          onClick={salvarLista}
          disabled={!nomeLista.trim() || itens.length === 0}
          className="flex-1 btn-primary inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Lista</span>
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default NovaLista;