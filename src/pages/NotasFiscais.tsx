import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Search, Eye, Trash2, Download, Receipt } from 'lucide-react';
import { formatarMoeda, formatarData } from '../utils';
import { getNotasFiscais, deleteNotaFiscal, NotaFiscal } from '../services/notasFiscaisService';
import { toast } from 'sonner';

const NotasFiscais: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Load notas from Supabase
  useEffect(() => {
    loadNotas();
  }, []);

  // Reload if coming from import with refresh flag
  useEffect(() => {
    if (location.state?.refresh) {
      loadNotas();
    }
  }, [location]);

  const loadNotas = async () => {
    try {
      setIsLoading(true);
      const notasData = await getNotasFiscais();
      setNotas(notasData);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      toast.error('Erro ao carregar notas fiscais');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNota = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      try {
        await deleteNotaFiscal(id);
        toast.success('Nota fiscal excluída com sucesso');
        loadNotas(); // Reload the list
      } catch (error) {
        console.error('Erro ao excluir nota:', error);
        toast.error('Erro ao excluir nota fiscal');
      }
    }
  };

  const filteredNotas = notas.filter(nota =>
    nota.emitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.cnpj.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notas Fiscais</h1>
        <Link
          to="/notas/importar"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Importar Nota</span>
        </Link>
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por emitente ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 w-full"
          disabled={isLoading}
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando notas fiscais...</h3>
          <p className="text-gray-600">Aguarde enquanto buscamos suas notas.</p>
        </div>
      )}

      {/* Lista de notas */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredNotas.map((nota) => (
            <div key={nota.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{nota.emitente}</h3>
                    <span className="text-sm text-gray-500">{nota.cnpj}</span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <span>📅 {formatarData(nota.data_emissao)}</span>
                    <span>💰 {formatarMoeda(nota.valor_total)}</span>
                  </div>

                  <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                    {nota.chave_acesso}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Link
                    to={`/notas/${nota.id}/itens`}
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    title="Ver itens"
                  >
                    <Receipt className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/notas/${nota.id}`}
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Baixar XML"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNota(nota.id)}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredNotas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Receipt className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma nota encontrada</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Tente ajustar sua busca ou importar uma nova nota fiscal.'
              : 'Comece importando sua primeira nota fiscal para acompanhar seus gastos.'
            }
          </p>
          <Link to="/notas/importar" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Importar Primeira Nota</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotasFiscais;