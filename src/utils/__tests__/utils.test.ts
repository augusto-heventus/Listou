import { formatarMoeda, formatarData, normalizarTexto, validarChaveAcessoNFe, validarCNPJ, gerarId } from '../index';

describe('Utils', () => {
  describe('formatarMoeda', () => {
    it('deve formatar valores em moeda brasileira', () => {
      expect(formatarMoeda(10.50)).toBe('R$\u00A010,50');
      expect(formatarMoeda(1000)).toBe('R$\u00A01.000,00');
      expect(formatarMoeda(0.99)).toBe('R$\u00A00,99');
    });

    it('deve aceitar moeda personalizada', () => {
      expect(formatarMoeda(10.50, 'USD')).toBe('US$\u00A010,50');
    });
  });

  describe('formatarData', () => {
    it('deve formatar datas corretamente', () => {
      const data = new Date('2024-11-12T12:00:00'); // Adicionar hora para evitar problemas de fuso
      expect(formatarData(data)).toBe('12/11/2024');
    });

    it('deve aceitar string de data', () => {
      expect(formatarData('2024-11-12T12:00:00')).toBe('12/11/2024');
    });
  });

  describe('normalizarTexto', () => {
    it('deve remover acentos e converter para minúsculas', () => {
      expect(normalizarTexto('ARROZ BRANCO')).toBe('arroz branco');
      expect(normalizarTexto('AÇÚCAR REFINADO')).toBe('acucar refinado');
      expect(normalizarTexto('FEIJÃO CARIOCA')).toBe('feijao carioca');
    });

    it('deve remover caracteres especiais', () => {
      expect(normalizarTexto('ARROZ @ BRANCO')).toBe('arroz branco');
      expect(normalizarTexto('FEIJÃO # CARIOCA')).toBe('feijao carioca');
    });
  });

  describe('validarChaveAcessoNFe', () => {
    it('deve validar chaves de acesso corretas', () => {
      const chaveValida = '35230812345678000123550010000000011000000011';
      expect(validarChaveAcessoNFe(chaveValida)).toBe(true);
    });

    it('deve rejeitar chaves inválidas', () => {
      expect(validarChaveAcessoNFe('123')).toBe(false);
      expect(validarChaveAcessoNFe('3523081234567800012355001000000001100000001')).toBe(false); // 43 dígitos
      expect(validarChaveAcessoNFe('')).toBe(false);
    });
  });

  describe('validarCNPJ', () => {
    it('deve validar CNPJs corretos', () => {
      expect(validarCNPJ('11.222.333/0001-81')).toBe(true); // CNPJ válido
      expect(validarCNPJ('11222333000181')).toBe(true);
    });

    it('deve rejeitar CNPJs inválidos', () => {
      expect(validarCNPJ('11.111.111/1111-11')).toBe(false);
      expect(validarCNPJ('1234567890')).toBe(false);
      expect(validarCNPJ('')).toBe(false);
    });
  });

  describe('gerarId', () => {
    it('deve gerar IDs únicos', () => {
      const id1 = gerarId();
      const id2 = gerarId();
      expect(id1).not.toBe(id2);
      expect(id1).toHaveLength(17); // 9 caracteres + 8 do timestamp em base36
    });
  });
});