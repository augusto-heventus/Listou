import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ScanLine, ChefHat, Receipt, ChevronRight, ArrowUpRight, ArrowDownRight, ShoppingCart } from 'lucide-react';
import { formatarMoeda, formatarData } from '../utils';
import { useUserStore } from '../stores/userStore';
import { getNotasFiscais, NotaFiscal } from '../services/notasFiscaisService';
import { toast } from 'sonner';

interface NotaFiscalDisplay extends NotaFiscal {
  variacao: number;
  quantidadeItens: number;
}

const Dashboard: React.FC = () => {
  const { isPremium } = useUserStore();
  const [slideAtivo, setSlideAtivo] = useState(0);
  const [ultimasCompras, setUltimasCompras] = useState<NotaFiscalDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Saudação baseada na hora
  const getSaudacao = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Função para mudar slide
  const mudarSlide = (indice: number) => {
    setSlideAtivo(indice);
  };

  // Auto carousel
  useEffect(() => {
    const intervalo = setInterval(() => {
      setSlideAtivo((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  // Load recent purchases from Supabase
  useEffect(() => {
    loadUltimasCompras();
  }, []);

  const loadUltimasCompras = async () => {
    try {
      setIsLoading(true);
      const notas = await getNotasFiscais();
      // Get the 4 most recent notas and format them for display
      const recentCompras: NotaFiscalDisplay[] = notas.slice(0, 4).map(nota => ({
        ...nota,
        // Calculate variation (mock for now, can be improved with historical data)
        variacao: Math.random() * 200 - 100, // Random variation between -100% and +100%
        quantidadeItens: nota.itens?.length || Math.floor(Math.random() * 50) + 5, // Use real item count if available
      }));
      setUltimasCompras(recentCompras);
    } catch (error) {
      console.error('Erro ao carregar últimas compras:', error);
      toast.error('Erro ao carregar últimas compras');
    } finally {
      setIsLoading(false);
    }
  };

  // Dados mockados premium para demonstração
  const resumoFinanceiro = {
    totalMes: 1250.80,
    totalAno: 14560.50,
    mediaMensal: 1213.37,
    variacaoMensal: -100.00, // -100% como no exemplo
    mesAtual: 'Novembro 25'
  };

  // const _ultimasNotas = [
  //   {
  //     id: '1',
  //     emitente: 'Supermercado Teste',
  //     valorTotal: 156.78,
  //     dataEmissao: new Date('2024-11-10')
  //   },
  //   {
  //     id: '2',
  //     emitente: 'Mercado Exemplo',
  //     valorTotal: 89.50,
  //     dataEmissao: new Date('2024-11-08')
  //   },
  //   {
  //     id: '3',
  //     emitente: 'Padaria Central',
  //     valorTotal: 45.30,
  //     dataEmissao: new Date('2024-11-07')
  //   }
  // ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header Premium com Saudação */}
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {getSaudacao()}, Augusto Matos!
        </h1>
      </div>

      {/* Card Principal Premium - Carousel com Métricas */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-2xl p-6 text-white relative overflow-hidden">
          {/* Ícone decorativo */}
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Conteúdo do Carousel */}
          <div className="space-y-4 min-h-[120px]">
            {/* Slide 1 - Total Gasto */}
            {slideAtivo === 0 && (
              <div className="carousel-content">
                <div>
                  <p className="text-sm text-gray-300">Total gasto {resumoFinanceiro.mesAtual}</p>
                  <p className="text-3xl font-bold">{formatarMoeda(resumoFinanceiro.totalMes)}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-xs text-gray-400">Variação Mensal</p>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-semibold">{resumoFinanceiro.variacaoMensal.toFixed(0)}%</span>
                      {resumoFinanceiro.variacaoMensal > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2 - Média Mensal */}
            {slideAtivo === 1 && (
              <div className="carousel-content">
                <div>
                  <p className="text-sm text-gray-300">Média Mensal</p>
                  <p className="text-3xl font-bold">{formatarMoeda(resumoFinanceiro.mediaMensal)}</p>
                </div>
              </div>
            )}

            {/* Slide 3 - Gasto do Ano */}
            {slideAtivo === 2 && (
              <div className="carousel-content">
                <div>
                  <p className="text-sm text-gray-300">Gasto do Ano</p>
                  <p className="text-3xl font-bold">{formatarMoeda(resumoFinanceiro.totalAno)}</p>
                </div>
              </div>
            )}

            {/* Slide 4 - Economizado */}
            {slideAtivo === 3 && (
              <div className="carousel-content">
                <div>
                  <p className="text-sm text-gray-300">Economizado</p>
                  <p className="text-3xl font-bold text-green-400">R$ 0,00</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Indicadores de carousel */}
          <div className="flex justify-center space-x-2 mt-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                  slideAtivo === index ? 'bg-green-500' : 'bg-gray-600'
                }`}
                onClick={() => mudarSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Últimas Compras - Estilo Premium */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Últimas compras</h2>
          <Link to="/notas" className="text-sm text-gray-500 hover:text-gray-700">
            Ver todas
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Carregando últimas compras...</p>
          </div>
        ) : ultimasCompras.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">Nenhuma compra recente</h3>
            <p className="text-sm text-gray-600 mb-4">Importe suas primeiras notas fiscais para ver suas compras aqui.</p>
            <Link to="/notas/importar" className="btn-primary text-sm">
              Importar Primeira Nota
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ultimasCompras.map((compra) => (
              <Link
                key={compra.id}
                to={`/notas/${compra.id}/itens`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{compra.emitente}</h3>
                      <p className="text-sm text-gray-500">{formatarData(compra.data_emissao)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                
                {/* Métricas em grid */}
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Variação</p>
                    <div className="flex items-center justify-center space-x-1">
                      <span className={`text-sm font-semibold ${compra.variacao > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {compra.variacao.toFixed(1)}%
                      </span>
                      {compra.variacao > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Qtd itens</p>
                    <p className="text-sm font-semibold text-gray-900">{compra.quantidadeItens}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valor total</p>
                    <p className="text-sm font-semibold text-gray-900">{formatarMoeda(compra.valor_total)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Desconto</p>
                    <p className="text-sm font-semibold text-green-600">{formatarMoeda(compra.valor_desconto)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valor pago</p>
                    <p className="text-sm font-semibold text-gray-900">{formatarMoeda(compra.valor_pago || compra.valor_total)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Atalhos Rápidos - Estilo Minimalista */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-3">
          <Link
            to="/notas/importar"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <ScanLine className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Importar</p>
            <p className="text-xs text-gray-500">Nota Fiscal</p>
          </Link>
          
          <Link
            to="/listas/nova"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Plus className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Nova</p>
            <p className="text-xs text-gray-500">Lista</p>
          </Link>
          
          <Link
            to="/receitas"
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-lime-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <ChefHat className="w-6 h-6 text-lime-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Buscar</p>
            <p className="text-xs text-gray-500">Receitas</p>
          </Link>
        </div>
      </div>

      {/* Seção Premium */}
      {!isPremium && (
        <div className="px-4">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-semibold text-emerald-800">Recurso Premium</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Compare preços entre mercados
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Descubra onde economizar mais nas suas compras
            </p>
            <Link
              to="/comparacao"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Experimentar Grátis
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;