import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Calendar, Hash, Building2, DollarSign, Tag, Package, Store } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatarMoeda, formatarData } from '../utils';
import { getNotaFiscalById, NotaFiscal } from '../services/notasFiscaisService';
import { toast } from 'sonner';

interface ItemNota {
  id: number;
  produto: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  valorTotal: number;
}

const ItensNota: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nota, setNota] = useState<NotaFiscal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNota();
  }, [id]);

  const loadNota = async () => {
    try {
      setIsLoading(true);
      if (!id) {
        toast.error('ID da nota não fornecido');
        navigate('/notas');
        return;
      }
      
      const notaData = await getNotaFiscalById(id);
      if (!notaData) {
        toast.error('Nota fiscal não encontrada');
        navigate('/notas');
        return;
      }
      
      setNota(notaData);
    } catch (error) {
      console.error('Erro ao carregar nota:', error);
      toast.error('Erro ao carregar nota fiscal');
      navigate('/notas');
    } finally {
      setIsLoading(false);
    }
  };

  // Transformar itens do Supabase para o formato da interface
  const itens: ItemNota[] = nota?.itens?.map((item, index) => ({
    id: index + 1,
    produto: item.descricao,
    quantidade: item.quantidade,
    unidade: item.unidade || 'UN',
    valorUnitario: item.valor_unitario || 0,
    valorTotal: item.valor_total
  })) || [];

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + item.valorTotal, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando nota fiscal...</p>
        </div>
      </div>
    );
  }

  if (!nota) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Premium */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
              <ShoppingCart className="w-4 h-4 text-gray-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Itens da Nota</h1>
          </div>
          <div className="w-10" /> {/* Espaço para balancear */}
        </div>
      </div>

      {/* Informações do Estabelecimento */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Store className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{nota.emitente}</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Data da Compra</p>
                  <p className="font-medium text-gray-900">{formatarData(nota.data_emissao)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Chave de Acesso</p>
                  <p className="font-mono text-xs text-gray-900">{nota.chave_acesso.slice(-20)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">CNPJ</p>
                  <p className="font-mono text-sm text-gray-900">{nota.cnpj}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Desconto</p>
                  <p className="font-medium text-green-600">{formatarMoeda(nota.valor_desconto)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Principal com Total */}
      <div className="px-4 py-2">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl p-4 text-white mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Total da Nota</p>
              <p className="text-2xl font-bold">{formatarMoeda(nota.valor_total)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Itens</p>
              <p className="text-lg font-semibold">{itens.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Itens */}
      <div className="px-4 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header da Tabela */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Produtos da Compra</h3>
                <p className="text-sm text-gray-600">{itens.length} itens encontrados</p>
              </div>
            </div>
          </div>
          
          {/* Header da Grid */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="col-span-1">
              <span className="text-sm font-medium text-gray-600">#</span>
            </div>
            <div className="col-span-5">
              <span className="text-sm font-medium text-gray-600">Produto</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-sm font-medium text-gray-600">Qtd</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="text-sm font-medium text-gray-600">UN</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm font-medium text-gray-600">Unit.</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
          </div>

          {/* Linhas dos Itens */}
          <div className="divide-y divide-gray-100">
            {itens.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="col-span-1">
                  <span className="text-sm text-gray-600">{item.id}</span>
                </div>
                <div className="col-span-5">
                  <p className="text-sm text-gray-900 font-medium leading-tight">
                    {item.produto}
                  </p>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm text-gray-900">
                    {item.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm text-gray-900">{item.unidade}</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm text-gray-900">
                    {formatarMoeda(item.valorUnitario)}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatarMoeda(item.valorTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItensNota;