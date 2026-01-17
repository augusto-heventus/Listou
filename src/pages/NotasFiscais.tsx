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
    <div className="page-container">
      <div className="section-header">
        <h1 className="page-title">Notas Fiscais</h1>
        <Link
          to="/notas/importar"
          className="btn-primary inline-flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Importar Nota</span>
        </Link>
      </div>

      {/* Barra de busca */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por emitente ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full bg-gray-50 border-transparent focus:bg-white transition-all"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">Carregando notas...</h3>
          <p className="text-xs text-gray-500 font-medium">Isso levará apenas alguns instantes.</p>
        </div>
      )}

      {/* Lista de notas */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {filteredNotas.map((nota) => (
            <div key={nota.id} className="card p-4 group hover:border-primary-200 relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
               
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors leading-tight">{nota.emitente}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-400 border border-gray-100">
                      {nota.cnpj}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-primary-600" />
                      {formatarData(nota.data_emissao)}
                    </span>
                    <span className="flex items-center gap-1.5 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-lg text-primary-700">
                      💰 {formatarMoeda(nota.valor_total)}
                    </span>
                  </div>

                  <div className="text-[10px] text-gray-400 font-mono bg-gray-50 px-3 py-2 rounded-xl border border-dashed border-gray-200 break-all select-all">
                    {nota.chave_acesso}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Link
                    to={`/notas/${nota.id}/itens`}
                    className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                    title="Ver itens"
                  >
                    <Receipt className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteNota(nota.id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredNotas.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Nenhuma nota por aqui</h3>
          <p className="text-sm text-gray-500 mb-8 max-w-[280px] mx-auto font-medium leading-relaxed">
            {searchTerm 
              ? 'Não encontramos notas com esse emitente ou CNPJ. Tente outros termos.'
              : 'Importe sua primeira nota fiscal e comece a organizar sua vida financeira agora mesmo.'
            }
          </p>
          <Link to="/notas/importar" className="btn-primary inline-flex items-center gap-2 shadow-lg px-8">
            <Plus className="w-5 h-5" />
            <span>Importar Nota</span>
          </Link>
        </div>
      )}
    </div>
  );
  );
};

export default NotasFiscais;