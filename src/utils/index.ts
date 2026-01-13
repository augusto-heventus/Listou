import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatarMoeda(valor: number, moeda: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: moeda,
  }).format(valor);
}

export function formatarData(data: Date | string): string {
  const date = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatarDataHora(data: Date | string): string {
  const date = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function converterDataBrasileiraParaISO(dataBrasileira: string): string {
  // Converte data do formato DD/MM/YYYY para YYYY-MM-DD (ISO)
  const partes = dataBrasileira.split('/');
  if (partes.length !== 3) {
    throw new Error(`Formato de data inválido: ${dataBrasileira}. Esperado: DD/MM/YYYY`);
  }
  const [dia, mes, ano] = partes;
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Remove caracteres especiais
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
}

export function removerStopWords(texto: string): string {
  const stopWords = ['da', 'de', 'do', 'das', 'dos', 'para', 'com', 'kg', 'g', 'ml', 'l', 'und', 'un', 'pct'];
  return texto
    .split(' ')
    .filter(palavra => !stopWords.includes(palavra))
    .join(' ');
}

export function normalizarNomeProduto(descricao: string): string {
  const normalizada = normalizarTexto(descricao);
  return removerStopWords(normalizada);
}

export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function gerarId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function validarChaveAcessoNFe(chave: string): boolean {
  // Validação básica da chave de acesso da NF-e (44 dígitos)
  return /^\d{44}$/.test(chave);
}

export function validarCNPJ(cnpj: string): boolean {
  // Remove caracteres especiais
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  
  // Verifica se tem 14 dígitos
  if (cnpjLimpo.length !== 14) return false;
  
  // Verifica se são todos os mesmos dígitos
  if (/^(\d)\1+$/.test(cnpjLimpo)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  let peso = 2;
  for (let i = 11; i >= 0; i--) {
    soma += parseInt(cnpjLimpo.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  let resto = soma % 11;
  let digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cnpjLimpo.charAt(12)) !== digito1) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  peso = 2;
  for (let i = 12; i >= 0; i--) {
    soma += parseInt(cnpjLimpo.charAt(i)) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  resto = soma % 11;
  let digito2 = resto < 2 ? 0 : 11 - resto;
  
  return parseInt(cnpjLimpo.charAt(13)) === digito2;
}

export function agruparPorCategoria<T>(items: T[], getCategoria: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const categoria = getCategoria(item);
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function calcularTotalPorCategoria(itens: { categoria: string; valorTotal: number }[]): Record<string, number> {
  return itens.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.valorTotal;
    return acc;
  }, {} as Record<string, number>);
}