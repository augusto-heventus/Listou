import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Keyboard, QrCode, Upload, CheckCircle, AlertCircle, Loader2, Search, Database, Check } from 'lucide-react';
import { formatarMoeda, converterDataBrasileiraParaISO } from '../utils';
import { salvarNotaFiscal } from '@/services/supabaseNotasService'
import { toast } from 'sonner'
import { notaFiscalService } from '../services/notaFiscalService';
import { verificarChaveExistente } from '../services/notasFiscaisService';

const ImportarNota: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'chave' | 'qrcode'>('chave');
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [notaImportada, setNotaImportada] = useState<any>(null);
  const [error, setError] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const qrReaderRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);
  const hasSupabaseEnv = Boolean((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY)

  const handleImportarChave = async (chaveManual?: string) => {
    const chaveParaProcessar = (typeof chaveManual === 'string' ? chaveManual : chaveAcesso).replace(/\s/g, '');
    
    if (!chaveParaProcessar) {
      setError('Por favor, insira a chave de acesso');
      return;
    }

    // Validação da chave de acesso
    if (!notaFiscalService.validarChaveAcesso(chaveParaProcessar)) {
      setError('Chave de acesso inválida. Deve conter 44 dígitos e dígito verificador correto.');
      return;
    }

    setIsLoading(true);
    setError('');
    setLoadingStatus('Validando chave de acesso...');

    try {
      // Verificar se a chave já foi importada
      const chaveExiste = await verificarChaveExistente(chaveParaProcessar);
      if (chaveExiste) {
        toast.error('Esta nota fiscal já foi importada anteriormente.');
        setLoadingStatus('');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar chave existente:', error);
      setError('Erro ao verificar se a nota já foi importada.');
      setLoadingStatus('');
      setIsLoading(false);
      return;
    }

    // Simulação de etapas do processo com progresso mais detalhado
    const etapas = [
      { status: 'Validando chave de acesso...', progresso: 25, delay: 800 },
      { status: 'Conectando ao SEFAZ...', progresso: 50, delay: 1200 },
      { status: 'Buscando dados da nota...', progresso: 75, delay: 1500 },
      { status: 'Processando informações...', progresso: 90, delay: 1000 },
      { status: 'Finalizando importação...', progresso: 100, delay: 500 }
    ];

    let etapaAtual = 0;
    
    const processarEtapa = async () => {
      if (etapaAtual < etapas.length) {
        const etapa = etapas[etapaAtual];
        setLoadingStatus(etapa.status);
        
        await new Promise(resolve => setTimeout(resolve, etapa.delay));
        etapaAtual++;
        
        if (etapaAtual < etapas.length) {
          processarEtapa();
        }
      }
    };

    await processarEtapa();

    try {
      // Chama a API real da InfoSimples
      const response = await notaFiscalService.consultarNFCe(chaveParaProcessar);
      
      setLoadingStatus('Processando resultados...');
      
      if (response.data && response.data.length > 0) {
        const notaData = response.data[0];
        
        // Transforma os dados da API para o formato do nosso sistema
        // Convert Brazilian date format to ISO format for PostgreSQL
        console.log('Data de emissão recebida da API:', notaData.informacoes_nota.data_emissao);
        
        let dataEmissaoISO: string;
        try {
          // Try to convert Brazilian format DD/MM/YYYY to ISO YYYY-MM-DD
          const dataOriginal = notaData.informacoes_nota.data_emissao;
          
          // Check if it's already in ISO format (YYYY-MM-DD)
          if (dataOriginal.match(/^\d{4}-\d{2}-\d{2}$/)) {
            dataEmissaoISO = dataOriginal;
          } else if (dataOriginal.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            // Convert DD/MM/YYYY to YYYY-MM-DD
            dataEmissaoISO = converterDataBrasileiraParaISO(dataOriginal);
          } else {
            throw new Error(`Formato de data desconhecido: ${dataOriginal}`);
          }
          
          console.log('Data convertida para ISO:', dataEmissaoISO);
        } catch (dateError) {
          console.error('Erro ao converter data:', dateError);
          toast.error(`Erro ao processar data da nota fiscal: ${dateError instanceof Error ? dateError.message : 'Formato inválido'}`);
          setLoadingStatus('');
          setIsLoading(false);
          return;
        }

        const itensTransformados = notaData.produtos.map((produto, index) => ({
          id: index + 1,
          descricao: produto.nome,
          quantidade: produto.normalizado_quantidade,
          unidade: produto.unidade,
          valorUnitario: produto.normalizado_valor_unitario,
          valorTotal: (produto.normalizado_valor_total_produto ?? (produto.normalizado_valor_unitario * produto.normalizado_quantidade)),
          categoria: 'Mercearia'
        }));

        const totalCalculado = itensTransformados.reduce((acc, item) => acc + item.valorTotal, 0);
        const totalApi = Number(notaData.normalizado_valor_total);
        const valorTotalFinal = Number.isFinite(totalApi) && totalApi > 0 ? totalApi : totalCalculado;

        const notaTransformada = {
          chave: notaData.informacoes_nota.chave_acesso,
          emitente: notaData.emitente.nome_razao_social,
          cnpj: notaData.emitente.cnpj,
          dataEmissao: dataEmissaoISO,
          valorTotal: valorTotalFinal,
          valorDesconto: notaData.normalizado_valor_desconto || 0,
          valorPago: notaData.normalizado_valor_a_pagar,
          itens: itensTransformados
        };
        
        setLoadingStatus('Nota importada com sucesso!');
        setTimeout(() => {
          setNotaImportada(notaTransformada);
          setLoadingStatus('');
        }, 800);
        
      } else {
        setError('Nota fiscal não encontrada ou inválida.');
        setLoadingStatus('');
      }
    } catch (error) {
      console.error('Erro ao importar nota:', error);
      setError(error instanceof Error ? error.message : 'Erro ao importar nota fiscal. Verifique a chave e tente novamente.');
      setLoadingStatus('');
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleConfirmarImportacao = async () => {
    if (!notaImportada) return
    if (!hasSupabaseEnv) {
      toast.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
      return
    }
    try {
      toast.message('Salvando nota no Supabase...'); // TODO: Adicionar loading state
      const nota = await salvarNotaFiscal(notaImportada)
      toast.success('Nota salva com sucesso');
      // Navigate to notas page and show all notas including the newly imported one
      navigate('/notas', { state: { savedNoteId: nota.id, refresh: true } })
    } catch (e: any) {
      console.error('Erro ao salvar nota:', e);
      toast.error(e.message || 'Falha ao salvar nota')
    }
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  const startQrScan = async () => {
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');
      const extractChaveAcessoFromQr = (text: string) => {
        const decoded = decodeURIComponent(text);
        const patterns = [
          /chNFe=([0-9]{44})/i,
          /[?&]p=([0-9]{44})/i,
          /ChaveAcesso=([0-9]{44})/i,
          /([0-9]{44})/,
        ];
        for (const re of patterns) {
          const m = decoded.match(re);
          if (m && m[1]) return m[1];
        }
        return '';
      };
      
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
      }

      const html5QrCode = new Html5Qrcode(qrReaderRef.current!.id);
      html5QrCodeRef.current = html5QrCode;
      
      setIsScanning(true);
      setError('');

      const onScanSuccess = (decodedText: string) => {
        const chave = extractChaveAcessoFromQr(decodedText);
        if (chave) {
          setChaveAcesso(chave);
          setQrCodeData(chave);
          stopQrScan();
          // Trigger the import process automatically
          setTimeout(() => {
            handleImportarChave(chave);
          }, 100);
        } else {
          setError('QR Code não contém chave de acesso válida.');
        }
      };

      const onScanFailure = (_errorMessage: string) => {};

      try {
        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          },
          onScanSuccess,
          onScanFailure
        );
      } catch (err) {
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            await html5QrCode.start(
              devices[0].id,
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
              },
              onScanSuccess,
              onScanFailure
            );
          } else {
            setError('Nenhuma câmera disponível para escanear.');
            setIsScanning(false);
          }
        } catch (err2) {
          console.error('Erro ao iniciar scanner:', err2);
          setError('Erro ao acessar câmera. Verifique as permissões.');
          setIsScanning(false);
        }
      }

    } catch (err) {
      console.error('Erro ao carregar html5-qrcode:', err);
      setError('Erro ao inicializar scanner de QR Code.');
      setIsScanning(false);
    }
  };

  const stopQrScan = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error('Erro ao parar scanner:', err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopQrScan();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleVoltar}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Importar Nota Fiscal</h1>
      </div>

      {/* Título da importação */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {activeTab === 'chave' ? 'Importar por Chave de Acesso' : 'Importar por QR Code'}
        </h2>
        <p className="text-gray-600 text-sm">
          {activeTab === 'chave' ? 'Digite a chave de acesso da NF-e para importar' : 'Escaneie o QR Code da NF-e para importar'}
        </p>
      </div>

      {/* Tabs de navegação */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('chave')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'chave'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Chave de Acesso</span>
        </button>
        <button
          onClick={() => setActiveTab('qrcode')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'qrcode'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Code</span>
        </button>
      </div>

      {/* Conteúdo da importação */}
      <div className="card">
        {!notaImportada ? (
          <div className="space-y-4">
            {activeTab === 'chave' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chave de Acesso da NF-e
                  </label>
                  <textarea
                    value={chaveAcesso}
                    onChange={(e) => setChaveAcesso(e.target.value)}
                    placeholder="Ex: 33250735881333000313650140001214521014935909"
                    className="input h-24 resize-none"
                    maxLength={60}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {chaveAcesso.replace(/\s/g, '').length}/44 dígitos
                  </p>
                </div>
                <button
                  id="btn-importar-chave"
                  onClick={handleImportarChave}
                  disabled={isLoading || chaveAcesso.replace(/\s/g, '').length !== 44}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Importar Nota Fiscal</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div 
                    id="qr-reader" 
                    ref={qrReaderRef}
                    onClick={!isScanning ? startQrScan : undefined}
                    className="mx-auto w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer"
                  >
                    {!isScanning ? (
                      <div className="text-center space-y-3">
                        <QrCode className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm text-gray-600">Clique para escanear QR Code</p>
                          <p className="text-xs text-gray-500 mt-1">Posicione o QR Code da NF-e na câmera</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm text-primary-600">Escaneando...</p>
                      </div>
                    )}
                  </div>
                  
                  {qrCodeData && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-800">QR Code detectado!</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1 break-all">{qrCodeData}</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 mt-4">
                    {!isScanning ? (
                      <button
                        onClick={startQrScan}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 inline-flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Escanear QR Code</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopQrScan}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 inline-flex items-center justify-center space-x-2"
                      >
                        <span>Cancelar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'chave' && isLoading && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                            <div className="absolute inset-0 w-6 h-6 border-2 border-primary-300 rounded-full animate-ping opacity-20"></div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary-800">Importando nota fiscal</h4>
                            <p className="text-sm text-primary-600">Aguarde enquanto processamos os dados</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-primary-600 mb-1">Progresso</div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-primary-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                  width: loadingStatus.includes('Validando') ? '20%' :
                                         loadingStatus.includes('Conectando') ? '40%' :
                                         loadingStatus.includes('Buscando') ? '70%' :
                                         loadingStatus.includes('Processando') ? '85%' :
                                         loadingStatus.includes('Finalizando') ? '95%' : '100%'
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-primary-700">
                              {loadingStatus.includes('Validando') ? '20%' :
                               loadingStatus.includes('Conectando') ? '40%' :
                               loadingStatus.includes('Buscando') ? '70%' :
                               loadingStatus.includes('Processando') ? '85%' :
                               loadingStatus.includes('Finalizando') ? '95%' : '100%'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                          loadingStatus.includes('Validando') ? 'bg-white shadow-sm border border-primary-200' : 'bg-transparent'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            loadingStatus.includes('Validando') ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            {loadingStatus.includes('Validando') ? (
                              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : loadingStatus.includes('Conectando') || loadingStatus.includes('Buscando') || loadingStatus.includes('Processando') || loadingStatus.includes('Finalizando') || loadingStatus.includes('sucesso') ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Search className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Validação da chave de acesso</div>
                            <div className="text-xs text-gray-500">Verificando formato e autenticidade</div>
                          </div>
                        </div>

                        <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                          loadingStatus.includes('Conectando') ? 'bg-white shadow-sm border border-primary-200' : 'bg-transparent'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            loadingStatus.includes('Conectando') ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            {loadingStatus.includes('Conectando') ? (
                              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : loadingStatus.includes('Buscando') || loadingStatus.includes('Processando') || loadingStatus.includes('Finalizando') || loadingStatus.includes('sucesso') ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Database className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Conexão com SEFAZ</div>
                            <div className="text-xs text-gray-500">Estabelecendo comunicação segura</div>
                          </div>
                        </div>

                        <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                          loadingStatus.includes('Buscando') ? 'bg-white shadow-sm border border-primary-200' : 'bg-transparent'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            loadingStatus.includes('Buscando') ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            {loadingStatus.includes('Buscando') ? (
                              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : loadingStatus.includes('Processando') || loadingStatus.includes('Finalizando') || loadingStatus.includes('sucesso') ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Search className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">Busca de dados da nota</div>
                            <div className="text-xs text-gray-500">Obtendo informações dos produtos</div>
                          </div>
                        </div>
                      </div>

                      {loadingStatus && (
                        <div className="bg-white rounded-lg p-3 border border-primary-200">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-primary-700">{loadingStatus}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">Este processo pode levar até 30 segundos</p>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3].map((i) => (
                          <div 
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              loadingStatus && (i === 1 && loadingStatus.includes('Validando')) ||
                                             (i === 2 && loadingStatus.includes('Conectando')) ||
                                             (i === 3 && loadingStatus.includes('Buscando'))
                                ? 'bg-primary-600' : 'bg-gray-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            

            {activeTab === 'chave' && !isLoading && (
              <button
                onClick={handleImportarChave}
                disabled={isLoading || !chaveAcesso.trim()}
                className="btn-primary w-full inline-flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Importando...' : 'Importar Nota'}</span>
              </button>
            )}
            
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo da nota importada */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800 mb-1">Nota importada com sucesso!</h3>
                  <p className="text-green-600 font-medium">{notaImportada.emitente}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">Chave válida</span>
                    <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full">Importação completa</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">CNPJ</span>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{notaImportada.cnpj}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">📅</span>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{notaImportada.dataEmissao}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">#</span>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 text-xs break-all">{notaImportada.chave}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">🏪</span>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{notaImportada.emitente}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-red-600">💰</span>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{formatarMoeda(notaImportada.valorDesconto)}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">💳</span>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-900 text-sm">{formatarMoeda(notaImportada.valorPago || notaImportada.valorTotal)}</div>
                </div>
              </div>
              
              {(notaImportada.valorDesconto > 0 || notaImportada.valorPago) && (
                <div className="grid grid-cols-2 gap-3">
                  {notaImportada.valorDesconto > 0 && (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-green-700 font-medium">Desconto aplicado</span>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Economia</span>
                      </div>
                      <div className="font-bold text-green-800 text-lg">{formatarMoeda(notaImportada.valorDesconto)}</div>
                    </div>
                  )}
                  {notaImportada.valorPago && (
                    <div className="bg-gradient-to-r from-primary-100 to-blue-100 rounded-lg p-3 border border-primary-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-primary-700 font-medium">Valor pago</span>
                        <span className="text-xs bg-primary-200 text-primary-800 px-2 py-0.5 rounded-full">Total</span>
                      </div>
                      <div className="font-bold text-primary-800 text-lg">{formatarMoeda(notaImportada.valorPago)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Itens da nota */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Itens da Nota</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{notaImportada.itens.length} produtos</span>
                  <span className="text-sm font-medium text-primary-600">{formatarMoeda(notaImportada.valorTotal)}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-3 text-xs font-medium text-gray-600">
                    <div className="col-span-6">Produto</div>
                    <div className="col-span-2 text-center">Qtd.</div>
                    <div className="col-span-2 text-right">Unit.</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {notaImportada.itens.map((item: any, index: number) => (
                    <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors group">
                      <div className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-6">
                          <p className="font-medium text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                            {item.descricao}
                          </p>
                          <p className="text-xs text-gray-500">{item.categoria || 'Mercearia'}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="text-sm text-gray-700 font-medium">
                            {item.quantidade} {item.unidade}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="text-sm text-gray-700">
                            {formatarMoeda(item.valorUnitario)}
                          </span>
                        </div>
                        <div className="col-span-2 text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatarMoeda(item.valorTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-6">
                      <span className="text-sm font-medium text-gray-700">Total da nota</span>
                    </div>
                    <div className="col-span-6 text-right">
                      <span className="text-lg font-bold text-gray-900">{formatarMoeda(notaImportada.valorTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmarImportacao}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirmar Importação</span>
                </div>
              </button>
              <button
                onClick={() => setNotaImportada(null)}
                className="flex-1 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-red-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Cancelar Importação</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportarNota;