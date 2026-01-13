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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChefHat className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
            <p className="text-sm text-gray-600">{filteredReceitas.length} receitas encontradas</p>
          </div>
        </div>
        <Link
          to="/receitas/nova"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Receita</span>
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar receitas por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria === 'todas' ? 'Todas as categorias' : categoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input"
            >
              {dificuldades.map(dificuldade => (
                <option key={dificuldade} value={dificuldade}>
                  {dificuldade === 'todas' ? 'Todas as dificuldades' : 
                   dificuldade === 'facil' ? 'Fácil' :
                   dificuldade === 'media' ? 'Média' : 'Difícil'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo máximo: {maxTime} min
            </label>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={maxTime}
              onChange={(e) => setMaxTime(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={limparFiltros}
              className="btn-outline w-full inline-flex items-center justify-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de receitas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReceitas.map((receita) => (
          <div key={receita.id} className="card hover:shadow-lg transition-shadow group">
            <div className="relative mb-4">
              <img
                src={receita.imagem}
                alt={receita.titulo}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA4NUgxMTVWMTE1SDg1Vjg1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                }}
              />
              <button
                onClick={() => toggleFavorita(receita.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart
                  className={`w-5 h-5 ${
                    receita.favorita ? 'text-red-500 fill-current' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {receita.titulo}
                </h3>
                <p className="text-sm text-gray-600">{receita.categoria}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{receita.tempo_preparo} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{receita.rendimento} porções</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatarMoeda(receita.custoEstimado || 0)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  receita.dificuldade === 'facil' ? 'bg-green-100 text-green-800' :
                  receita.dificuldade === 'media' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {receita.dificuldade === 'facil' ? 'Fácil' :
                   receita.dificuldade === 'media' ? 'Média' : 'Difícil'}
                </span>
                <Link
                  to={`/receitas/${receita.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver receita →
                </Link>
              </div>
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