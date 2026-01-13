import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, ShoppingCart, Calendar, Users } from 'lucide-react';
import { formatarData, formatarMoeda } from '../utils';

const ListasCompras: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todas' | 'ativas' | 'concluidas'>('todas');

  // Dados mockados para demonstração
  const listas = [
    {
      id: '1',
      nome: 'Compras da Semana',
      itensCount: 15,
      itensConcluidos: 8,
      totalEstimado: 125.50,
      criadaEm: new Date('2024-11-10'),
      compartilhadaCom: ['João', 'Maria'],
      status: 'ativa'
    },
    {
      id: '2',
      nome: 'Churrasco do Final de Semana',
      itensCount: 12,
      itensConcluidos: 12,
      totalEstimado: 89.90,
      criadaEm: new Date('2024-11-08'),
      compartilhadaCom: [],
      status: 'concluida'
    },
    {
      id: '3',
      nome: 'Itens de Limpeza',
      itensCount: 8,
      itensConcluidos: 3,
      totalEstimado: 45.30,
      criadaEm: new Date('2024-11-09'),
      compartilhadaCom: ['Ana'],
      status: 'ativa'
    }
  ];

  const filteredListas = listas.filter(lista => {
    const matchesSearch = lista.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todas' || 
      (filterStatus === 'ativas' && lista.status === 'ativa') ||
      (filterStatus === 'concluidas' && lista.status === 'concluida');
    
    return matchesSearch && matchesFilter;
  });

  const progressoConclusao = (concluidos: number, total: number) => {
    return total > 0 ? Math.round((concluidos / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Listas de Compras</h1>
        <Link
          to="/listas/nova"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Lista</span>
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar listas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input"
          >
            <option value="todas">Todas</option>
            <option value="ativas">Ativas</option>
            <option value="concluidas">Concluídas</option>
          </select>
        </div>
      </div>

      {/* Lista de listas */}
      <div className="space-y-4">
        {filteredListas.map((lista) => (
          <div key={lista.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{lista.nome}</h3>
                  {lista.status === 'ativa' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Concluída
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                  <span className="flex items-center space-x-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{lista.itensConcluidos}/{lista.itensCount} itens</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatarData(lista.criadaEm)}</span>
                  </span>
                  {lista.compartilhadaCom.length > 0 && (
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{lista.compartilhadaCom.length} pessoas</span>
                    </span>
                  )}
                </div>

                {/* Barra de progresso */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{progressoConclusao(lista.itensConcluidos, lista.itensCount)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressoConclusao(lista.itensConcluidos, lista.itensCount)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Valor estimado */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor estimado:</span>
                  <span className="font-semibold text-gray-900">
                    {formatarMoeda(lista.totalEstimado)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to={`/listas/${lista.id}`}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title="Editar lista"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Link>
                <button
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="Mais opções"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingCart className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma lista encontrada' : 'Crie sua primeira lista'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Tente ajustar sua busca ou criar uma nova lista.'
              : 'Organize suas compras criando listas categorizadas e compartilhe com sua família.'
            }
          </p>
          <Link to="/listas/nova" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Criar Lista</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ListasCompras;