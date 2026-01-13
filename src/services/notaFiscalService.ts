import axios from 'axios';

interface InfoSimplesResponse {
  code: number;
  code_message: string;
  data: {
    cancelada: boolean;
    consumidor: {
      cpf: string | null;
      cnpj: string | null;
      nome: string | null;
    };
    emitente: {
      cnpj: string;
      endereco: string;
      nome_razao_social: string;
    };
    formas_pagamento: Array<{
      forma_pagamento: string;
      normalizado_valor_pago: number;
      valor_pago: string;
    }>;
    informacoes_nota: {
      ambiente: string;
      chave_acesso: string;
      data_autorizacao: string;
      data_emissao: string;
      hora_autorizacao: string;
      hora_emissao: string;
      numero: string;
      protocolo_autorizacao: string;
      serie: string;
      tipo_emissao: string;
      versao_xlst: string;
      versao_xml: string;
    };
    normalizado_quantidade_total_items: number;
    normalizado_tributos_totais: number | null;
    normalizado_valor_a_pagar: number;
    normalizado_valor_desconto: number;
    normalizado_valor_total: number;
    produtos: Array<{
      codigo: string;
      nome: string;
      normalizado_quantidade: number;
      normalizado_valor_total_produto: number;
      normalizado_valor_unitario: number;
      quantidade: string;
      unidade: string;
      valor_total_produto: string;
      valor_unitario: string;
    }>;
  }[];
  data_count: number;
  errors: string[];
  header: {
    api_version: string;
    api_version_full: string;
    billable: boolean;
    client_name: string;
    elapsed_time_in_milliseconds: number;
    price: string;
    product: string;
    remote_ip: string;
    service: string;
    signature: string;
    token_name: string;
  };
  mensagem: string | null;
}

export class NotaFiscalService {
  private readonly API_BASE_URL = '/infosimples/api/v2/consultas/sefaz/nfce';
  private readonly TOKEN = 'llSFAQtqofMdBAxcAs7BjxVsIWzr-KEdkP_8uE2d';

  async consultarNFCe(chaveAcesso: string): Promise<InfoSimplesResponse> {
    try {
      const response = await axios.get<InfoSimplesResponse>(this.API_BASE_URL, {
        params: {
          token: this.TOKEN,
          timeout: 600,
          ignore_site_receipt: 0,
          nfce: chaveAcesso
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code !== 200) {
        throw new Error(response.data.code_message || 'Erro ao consultar nota fiscal');
      }

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Erro na API: ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Erro ao conectar com o serviço de consulta de notas fiscais');
    }
  }

  validarChaveAcesso(chaveAcesso: string): boolean {
    // Remove espaços e traços
    const chaveLimpa = chaveAcesso.replace(/[\s-]/g, '');
    
    // Verifica se tem 44 dígitos (padrão NFC-e)
    if (chaveLimpa.length !== 44) {
      return false;
    }
    
    // Verifica se são apenas números
    if (!/^\d+$/.test(chaveLimpa)) {
      return false;
    }
    
    // Validação do dígito verificador (módulo 11)
    return this.validarDigitoVerificador(chaveLimpa);
  }

  private validarDigitoVerificador(chave: string): boolean {
    const chaveSemDV = chave.slice(0, -1);
    const dvInformado = parseInt(chave.slice(-1));
    
    let peso = 2;
    let soma = 0;
    
    // Calcula o dígito verificador
    for (let i = chaveSemDV.length - 1; i >= 0; i--) {
      soma += parseInt(chaveSemDV[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    
    let resto = soma % 11;
    let dvCalculado;
    
    if (resto === 0 || resto === 1) {
      dvCalculado = 0;
    } else {
      dvCalculado = 11 - resto;
    }
    
    return dvCalculado === dvInformado;
  }

  formatarChaveAcesso(chaveAcesso: string): string {
    const chaveLimpa = chaveAcesso.replace(/[\s-]/g, '');
    
    if (chaveLimpa.length !== 44) {
      return chaveAcesso;
    }
    
    // Formata como: XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX
    return chaveLimpa.match(/.{1,4}/g)?.join(' ') || chaveAcesso;
  }
}

export const notaFiscalService = new NotaFiscalService();