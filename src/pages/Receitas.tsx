import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Users, DollarSign, Heart, ChefHat, Plus } from 'lucide-react';
import { formatarMoeda } from '../utils';
import { receitasService, Receita } from '../services/receitasService';

const Receitas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('todas');
  const [maxTime, setMaxTime] = useState(120);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categorias = ['todas', 'Prato Principal', 'Massas', 'Saladas', 'Sobremesas', 'Aperitivos'];
  const dificuldades = ['todas', 'facil', 'media', 'dificil'];

  // Buscar receitas do banco ao carregar
  useEffect(() => {
    const carregarReceitas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await receitasService.buscarReceitas();
        setReceitas(data);
      } catch (err) {
        console.error('Erro ao carregar receitas:', err);
        setError('Erro ao carregar receitas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    carregarReceitas();
  }, []);

  // Filtrar receitas
  const filteredReceitas = receitas.filter(receita => {
    const matchesSearch = receita.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || receita.categoria === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'todas' || receita.dificuldade === selectedDifficulty;
    const matchesTime = receita.tempo_preparo <= maxTime;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
  });

  const toggleFavorita = (id: string) => {
    // Implementar toggle de favorito
    console.log('Toggle favorita:', id);
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setSelectedCategory('todas');
    setSelectedDifficulty('todas');
    setMaxTime(120);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
          <div className="flex items-center space-x-2">
            <ChefHat className="w-6 h-6 text-primary-600" />
            <span className="text-sm text-gray-600">Carregando...</span>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar receitas</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-header">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center">
            <ChefHat className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h1 className="page-title leading-tight">Receitas</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {filteredReceitas.length} pratos sugeridos
            </p>
          </div>
        </div>
        <Link
          to="/receitas/nova"
          className="btn-primary inline-flex items-center space-x-2 shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nova Receita</span>
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="card space-y-6 bg-white p-6 rounded-2xl border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="O que você quer cozinhar hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12 h-12 w-full bg-gray-50 border-transparent focus:bg-white text-base transition-all rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input bg-gray-50 border-transparent h-10 rounded-xl font-bold text-xs"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria === 'todas' ? 'Tudo' : categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">Dificuldade</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input bg-gray-50 border-transparent h-10 rounded-xl font-bold text-xs"
            >
              {dificuldades.map(dificuldade => (
                <option key={dificuldade} value={dificuldade}>
                  {dificuldade === 'todas' ? 'Qualquer nível' : 
                   dificuldade === 'facil' ? 'Fácil' :
                   dificuldade === 'media' ? 'Média' : 'Difícil'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1 block">
              Tempo: {maxTime} min
            </label>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={maxTime}
              onChange={(e) => setMaxTime(parseInt(e.target.value))}
              className="w-full accent-primary-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={limparFiltros}
              className="w-full h-10 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs rounded-xl transition-all border border-gray-100"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de receitas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReceitas.map((receita) => (
          <div key={receita.id} className="card p-0 group overflow-hidden hover:border-primary-200 border-transparent transition-all hover:-translate-y-1">
            <div className="relative h-44">
              <img
                src={receita.imagem}
                alt={receita.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA4NUgxMTVWMTE1SDg1Vjg1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <button
                onClick={() => toggleFavorita(receita.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all active:scale-90"
              >
                <Heart
                  className={`w-4 h-4 ${
                    receita.favorita ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`}
                />
              </button>
              <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                receita.dificuldade === 'facil' ? 'bg-emerald-500 text-white' :
                receita.dificuldade === 'media' ? 'bg-yellow-400 text-gray-900' :
                'bg-red-500 text-white'
              }`}>
                {receita.dificuldade}
              </span>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-0.5 group-hover:text-primary-600 transition-colors leading-tight line-clamp-1">
                  {receita.titulo}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{receita.categoria}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 border-y border-gray-50 py-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                    <Clock className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Tempo</span>
                  </div>
                  <p className="text-[11px] font-black text-gray-900">{receita.tempo_preparo}m</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                    <Users className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Rend.</span>
                  </div>
                  <p className="text-[11px] font-black text-gray-900">{receita.rendimento}p</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">Custo</span>
                  </div>
                  <p className="text-[11px] font-black text-emerald-600">{formatarMoeda(receita.custoEstimado || 0)}</p>
                </div>
              </div>

              <Link
                to={`/receitas/${receita.id}`}
                className="w-full flex items-center justify-center py-2.5 bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-bold text-xs rounded-xl transition-all border border-gray-100 hover:border-primary-100"
              >
                Ver Preparo
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredReceitas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ChefHat className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma receita encontrada</h3>
          <p className="text-gray-600">
            Tente ajustar seus filtros ou buscar por outro termo.
          </p>
        </div>
      )}
    </div>
  );
};

export default Receitas;