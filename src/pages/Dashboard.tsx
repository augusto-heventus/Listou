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
    <div className="page-container pb-6">
      {/* Header Premium com Saudação */}
      <div className="section-header">
        <h1 className="page-title">
          {getSaudacao()}, Augusto Matos!
        </h1>
      </div>

      {/* Card Principal Premium - Carousel com Métricas */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
        {/* Ícone decorativo */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Receipt className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Conteúdo do Carousel */}
        <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
          {/* Slide 1 - Total Gasto */}
          {slideAtivo === 0 && (
            <div className="carousel-content space-y-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Total gasto {resumoFinanceiro.mesAtual}</p>
                <p className="text-4xl font-black tracking-tight">{formatarMoeda(resumoFinanceiro.totalMes)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Variação Mensal</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold">{resumoFinanceiro.variacaoMensal.toFixed(0)}%</span>
                    {resumoFinanceiro.variacaoMensal > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
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
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Média Mensal</p>
                <p className="text-4xl font-black tracking-tight">{formatarMoeda(resumoFinanceiro.mediaMensal)}</p>
              </div>
            </div>
          )}

          {/* Slide 3 - Gasto do Ano */}
          {slideAtivo === 2 && (
            <div className="carousel-content">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Gasto do Ano</p>
                <p className="text-4xl font-black tracking-tight">{formatarMoeda(resumoFinanceiro.totalAno)}</p>
              </div>
            </div>
          )}

          {/* Slide 4 - Economizado */}
          {slideAtivo === 3 && (
            <div className="carousel-content">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Economizado</p>
                <p className="text-4xl font-black tracking-tight text-emerald-400">R$ 0,00</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Indicadores de carousel */}
        <div className="flex justify-center space-x-2 mt-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                slideAtivo === index ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-700'
              }`}
              onClick={() => mudarSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Atalhos Rápidos - Grid Responsivo */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          to="/notas/importar"
          className="card p-4 hover:border-emerald-200 text-center flex flex-col items-center group"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ScanLine className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-gray-900">Importar</p>
        </Link>
        
        <Link
          to="/listas/nova"
          className="card p-4 hover:border-emerald-200 text-center flex flex-col items-center group"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-gray-900">Nova Lista</p>
        </Link>
        
        <Link
          to="/receitas"
          className="card p-4 hover:border-emerald-200 text-center flex flex-col items-center group"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ChefHat className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs font-bold text-gray-900">Receitas</p>
        </Link>
      </div>

      {/* Últimas Compras */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Últimas compras</h2>
          <Link to="/notas" className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider">
            Ver todas
          </Link>
        </div>
        
        {isLoading ? (
          <div className="card text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 font-medium tracking-tight">Buscando registros...</p>
          </div>
        ) : ultimasCompras.length === 0 ? (
          <div className="card text-center py-10">
            <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">Sem compras registradas</h3>
            <p className="text-xs text-gray-500 mb-4 max-w-[200px] mx-auto">Comece importando notas para visualizar seus gastos.</p>
            <Link to="/notas/importar" className="btn-primary text-xs shadow-md">
              Importar Nota
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ultimasCompras.map((compra) => (
              <Link
                key={compra.id}
                to={`/notas/${compra.id}/itens`}
                className="card p-4 group hover:border-primary-200 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                      <ShoppingCart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">{compra.emitente}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatarData(compra.data_emissao)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
                
                <div className="grid grid-cols-5 gap-2 border-t border-gray-50 pt-4">
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter mb-1">Var.</p>
                    <div className="flex items-center justify-center gap-0.5">
                      <span className={`text-[11px] font-bold ${compra.variacao > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {Math.abs(compra.variacao).toFixed(1)}%
                      </span>
                      {compra.variacao > 0 ? <ArrowUpRight className="w-2.5 h-2.5 text-emerald-500" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-500" />}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter mb-1">Itens</p>
                    <p className="text-[11px] font-bold text-gray-900">{compra.quantidadeItens}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter mb-1">Total</p>
                    <p className="text-[11px] font-bold text-gray-900">{formatarMoeda(compra.valor_total)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter mb-1">Desc.</p>
                    <p className="text-[11px] font-bold text-emerald-600">{formatarMoeda(compra.valor_desconto)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter mb-1">Pago</p>
                    <p className="text-[11px] font-bold text-gray-900">{formatarMoeda(compra.valor_pago || compra.valor_total)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Seção Premium */}
      {!isPremium && (
        <div className="bg-gradient-to-br from-primary-600 to-emerald-700 rounded-2xl p-6 text-white shadow-xl shadow-primary-900/10 border border-white/10 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-yellow-400 text-gray-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Premium</span>
            </div>
            <h3 className="text-xl font-black mb-1">Compare preços agora</h3>
            <p className="text-primary-100 text-sm mb-4 max-w-[200px]">Descubra o mercado mais barato da sua região.</p>
            <Link
              to="/comparacao"
              className="inline-flex items-center px-5 py-2.5 bg-white text-primary-700 font-black rounded-xl hover:bg-primary-50 transition-all shadow-lg active:scale-95 text-sm"
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