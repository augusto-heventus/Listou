
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock dos hooks e stores
jest.mock('../../stores/userStore', () => ({
  useUserStore: () => ({
    isPremium: false,
  }),
}));

describe('Dashboard', () => {
  it('deve renderizar o título corretamente', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Bem-vindo ao Listou+')).toBeInTheDocument();
  });

  it('deve exibir cards de resumo financeiro', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Gasto do Mês')).toBeInTheDocument();
    expect(screen.getByText('Gasto do Ano')).toBeInTheDocument();
    expect(screen.getByText('Média Mensal')).toBeInTheDocument();
    expect(screen.getByText('Maior Categoria')).toBeInTheDocument();
  });

  it('deve exibir atalhos rápidos', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Importar Nota')).toBeInTheDocument();
    expect(screen.getByText('Nova Lista')).toBeInTheDocument();
    expect(screen.getByText('Buscar Receitas')).toBeInTheDocument();
  });

  it('deve exibir últimas notas importadas', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Últimas Notas Importadas')).toBeInTheDocument();
  });

  it('deve exibir seção premium para usuários gratuitos', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Recurso Premium')).toBeInTheDocument();
    expect(screen.getByText('Compare preços entre mercados')).toBeInTheDocument();
  });
});