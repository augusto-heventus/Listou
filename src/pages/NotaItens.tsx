import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Calendar, Hash, Building2, MapPin, Phone, Mail, DollarSign, Tag, Package } from 'lucide-react';
import { formatarMoeda, formatarData } from '../utils';
import { getNotaFiscalById, NotaFiscal } from '../services/notasFiscaisService';
import { toast } from 'sonner';

const NotaItens: React.FC = () => {
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/notas')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Detalhes da Nota Fiscal</h1>
                <p className="text-sm text-gray-600">Visualize os itens e informações da compra</p>
              </div>
            </div>
            <Link
              to="/notas"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas as notas
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Informações do Estabelecimento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Dados do Estabelecimento</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                <p className="text-gray-900 font-medium">{nota.emitente}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <p className="text-gray-900 font-mono">{nota.cnpj}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Compra</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{formatarData(nota.data_emissao)}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chave de Acesso</label>
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900 font-mono text-sm">{nota.chave_acesso}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatarMoeda(nota.valor_total)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Desconto</p>
                <p className="text-2xl font-bold text-green-600">{formatarMoeda(nota.valor_desconto)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Tag className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Pago</p>
                <p className="text-2xl font-bold text-blue-600">{formatarMoeda(nota.valor_pago || nota.valor_total)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Itens da Nota */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Itens da Compra</h2>
                <p className="text-sm text-gray-600">{nota.itens?.length || 0} produtos encontrados</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {nota.itens?.map((item, index) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{item.descricao}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Package className="w-3 h-3" />
                            <span>{item.quantidade} {item.unidade}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{formatarMoeda(item.valor_unitario || 0)} un.</span>
                          </span>
                          {item.categoria && (
                            <span className="flex items-center space-x-1">
                              <Tag className="w-3 h-3" />
                              <span>{item.categoria}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-lg">{formatarMoeda(item.valor_total)}</p>
                    <p className="text-sm text-gray-500">Total do item</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {(!nota.itens || nota.itens.length === 0) && (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
              <p className="text-gray-600">Esta nota fiscal não possui itens cadastrados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotaItens;