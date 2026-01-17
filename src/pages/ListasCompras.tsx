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
    <div className="page-container">
      <div className="section-header">
        <h1 className="page-title">Listas de Compras</h1>
        <Link
          to="/listas/nova"
          className="btn-primary inline-flex items-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nova Lista</span>
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar listas pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full bg-gray-50 border-transparent focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 min-w-[140px]">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input bg-gray-50 border-transparent focus:bg-white cursor-pointer"
          >
            <option value="todas">Todas as listas</option>
            <option value="ativas">Somente Ativas</option>
            <option value="concluidas">Concluídas</option>
          </select>
        </div>
      </div>

      {/* Lista de listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredListas.map((lista) => (
          <div key={lista.id} className="card hover:border-primary-200 group relative overflow-hidden">
            {/* Indicador de Status Lateral */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${lista.status === 'ativa' ? 'bg-primary-500' : 'bg-gray-300'}`} />
            
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-700 transition-colors">{lista.nome}</h3>
                    {lista.status === 'ativa' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-100">
                        Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                        Concluída
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatarData(lista.criadaEm)}
                    </span>
                    {lista.compartilhadaCom.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {lista.compartilhadaCom.length} pessoas
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center -mt-1 -mr-1">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Estatísticas e Progresso */}
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <ShoppingCart className="w-4 h-4 text-primary-600" />
                    <span>{lista.itensConcluidos} de {lista.itensCount} itens</span>
                  </div>
                  <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                    {formatarMoeda(lista.totalEstimado)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    <span>Conclusão</span>
                    <span className={lista.status === 'ativa' ? 'text-primary-600' : 'text-gray-500'}>
                      {progressoConclusao(lista.itensConcluidos, lista.itensCount)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-50">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        lista.status === 'ativa' ? 'bg-primary-500 shadow-[0_0_8px_rgba(13,148,136,0.3)]' : 'bg-gray-400'
                      }`}
                      style={{ width: `${progressoConclusao(lista.itensConcluidos, lista.itensCount)}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  to={`/listas/${lista.id}`}
                  className="w-full mt-2 py-2.5 bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-100 hover:border-primary-100 shadow-sm"
                >
                  Abrir Detalhes
                </Link>
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