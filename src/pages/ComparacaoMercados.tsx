import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, DollarSign, Star, Crown } from 'lucide-react';
import { formatarMoeda } from '../utils';
import { useUserStore } from '../stores/userStore';

const ComparacaoMercados: React.FC = () => {
  const navigate = useNavigate();
  const { isPremium } = useUserStore();

  // Dados mockados para demonstração
  const mercados = [
    {
      id: '1',
      nome: 'Supermercado Economia',
      endereco: 'Rua das Flores, 123 - Centro',
      distancia: 0.8,
      precoTotalEstimado: 125.50,
      avaliacao: 4.2,
      itensDisponiveis: 12,
      totalItens: 15
    },
    {
      id: '2',
      nome: 'Mercado Bom Preço',
      endereco: 'Av. Principal, 456 - Jardim',
      distancia: 1.2,
      precoTotalEstimado: 132.80,
      avaliacao: 4.5,
      itensDisponiveis: 14,
      totalItens: 15
    },
    {
      id: '3',
      nome: 'Hipermercado Melhor Compra',
      endereco: 'Rua Comercial, 789 - Comercial',
      distancia: 2.1,
      precoTotalEstimado: 118.90,
      avaliacao: 4.0,
      itensDisponiveis: 11,
      totalItens: 15
    }
  ];

  const melhorOpcao = mercados.reduce((melhor, atual) => 
    atual.precoTotalEstimado < melhor.precoTotalEstimado ? atual : melhor
  );

  const economiaPotencial = Math.max(...mercados.map(m => m.precoTotalEstimado)) - Math.min(...mercados.map(m => m.precoTotalEstimado));

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Comparação de Mercados</h1>
        </div>

        <div className="premium-feature">
          <div className="premium-overlay">
            <div className="premium-content text-center p-8">
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recurso Premium</h2>
              <p className="text-gray-600 mb-6">
                Compare preços entre diferentes mercados e economize até {formatarMoeda(economiaPotencial)} em suas compras!
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Economize tempo e dinheiro</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>Encontre os melhores preços próximos a você</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4 text-blue-500" />
                  <span>Rotas otimizadas para suas compras</span>
                </div>
              </div>
              <button className="btn-primary mt-6 inline-flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Ativar Premium Grátis</span>
              </button>
            </div>
          </div>
          
          {/* Conteúdo borrado para demonstração */}
          <div className="space-y-4 opacity-30">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Melhor Opção</h3>
                <span className="premium-badge">Economia de {formatarMoeda(economiaPotencial)}</span>
              </div>
              <div className="space-y-3">
                {mercados.slice(0, 2).map((mercado) => (
                  <div key={mercado.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{mercado.nome}</h4>
                        <p className="text-sm text-gray-600">{mercado.endereco}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatarMoeda(mercado.precoTotalEstimado)}</p>
                        <p className="text-sm text-gray-600">{mercado.distancia} km</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Comparação de Mercados</h1>
        <span className="premium-badge">Premium</span>
      </div>

      {/* Resumo da economia */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Economia Potencial</h3>
            <p className="text-2xl font-bold text-green-600">{formatarMoeda(economiaPotencial)}</p>
            <p className="text-sm text-gray-600">entre os mercados analisados</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Lista atual</p>
            <p className="text-lg font-semibold text-gray-900">15 itens</p>
          </div>
        </div>
      </div>

      {/* Lista de mercados */}
      <div className="space-y-4">
        {mercados.map((mercado) => (
          <div key={mercado.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{mercado.nome}</h3>
                  {mercado.id === melhorOpcao.id && (
                    <span className="premium-badge bg-green-100 text-green-800">
                      Melhor Opção
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{mercado.distancia} km</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{mercado.avaliacao}</span>
                  </span>
                  <span>
                    {mercado.itensDisponiveis}/{mercado.totalItens} itens disponíveis
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{mercado.endereco}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">Valor estimado:</span>
                    <p className="text-xl font-bold text-gray-900">
                      {formatarMoeda(mercado.precoTotalEstimado)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn-outline inline-flex items-center space-x-2">
                      <Navigation className="w-4 h-4" />
                      <span>Rota</span>
                    </button>
                    <button className="btn-primary inline-flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Ver Detalhes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mapa (placeholder) */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Mapa de Mercados</h3>
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Mapa interativo dos mercados</p>
            <p className="text-sm text-gray-500">Clique para ver rotas e detalhes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparacaoMercados;