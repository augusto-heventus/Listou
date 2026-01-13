# Listou+ - Gestão Financeira Familiar

Aplicativo completo para gestão financeira familiar com foco em controle de gastos, organização de compras e planejamento de receitas.

## 🚀 Funcionalidades

### Dashboard
- Resumo financeiro com gastos mensais/anuais
- Cards com indicadores principais
- Atalhos rápidos para funcionalidades principais
- Últimas notas fiscais importadas

### Notas Fiscais
- Importação por chave de acesso (44 dígitos)
- Leitura de QR Code
- Upload de arquivo XML
- Categorização automática de itens
- Visualização completa dos dados da nota

### Listas de Compras
- Criação e gerenciamento de múltiplas listas
- Itens com quantidade, unidade, categoria e prioridade
- Progresso visual de conclusão
- Compartilhamento com familiares
- Filtros por categoria e status

### Receitas
- Catálogo com busca e filtros
- Ingredientes com quantidades e unidades
- Modo de preparo passo a passo
- Tempo de preparo e rendimento
- Custo estimado por receita
- Favoritos

### Comparação de Mercados (Premium)
- Integração com GPS para localização
- Mapa interativo com mercados próximos
- Comparação de preços por produto
- Cálculo de economia potencial
- Rotas otimizadas

### Perfil e Configurações
- Dados pessoais editáveis
- Preferências de notificação
- Configurações de privacidade
- Gerenciamento de plano (Gratuito/Premium)

### Onboarding
- Fluxo inicial de 3 telas explicativas
- Introdução às principais funcionalidades
- Opção de pular o onboarding

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Estado Global**: Zustand
- **Armazenamento**: IndexedDB (Dexie.js)
- **Build**: Vite
- **Testes**: Jest + React Testing Library
- **Ícones**: Lucide React
- **Notificações**: Sonner

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/listou-plus.git

# Entre no diretório
cd listou-plus

# Instale as dependências
npm install

# Execute o projeto em modo desenvolvimento
npm run dev

# Execute os testes
npm test

# Build para produção
npm run build
```

## 🎯 Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes React
│   ├── common/         # Componentes compartilhados
│   ├── dashboard/      # Componentes do dashboard
│   ├── notas/         # Componentes de notas fiscais
│   ├── listas/         # Componentes de listas
│   └── receitas/       # Componentes de receitas
├── hooks/              # Custom hooks
├── services/           # Serviços e APIs
├── utils/              # Funções utilitárias
├── types/              # Definições TypeScript
├── stores/             # Estado global (Zustand)
├── styles/             # Estilos globais
├── pages/              # Páginas principais
└── tests/              # Testes unitários
```

### Modelo de Dados
- **Usuario**: Informações do usuário e preferências
- **NotaFiscal**: Dados das notas fiscais importadas
- **ListaCompras**: Listas de compras com itens
- **Receita**: Receitas com ingredientes e modo de preparo
- **HistoricoPreco**: Histórico de preços por produto

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://api.exemplo.com
VITE_API_KEY=sua-chave-api
```

### Configuração do IndexedDB
O banco de dados local é configurado automaticamente ao iniciar a aplicação, criando as tabelas necessárias para armazenamento offline.

## 🧪 Testes

O projeto inclui testes unitários para:
- Funções utilitárias (formatação, validação)
- Componentes principais
- Lógica de negócio

Execute os testes com:
```bash
npm test
```

## 📱 Responsividade

- Mobile-first design
- Otimizado para telas de 375px em diante
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly com áreas mínimas de 44x44px

## 🎨 Design

- Estilo clean e minimalista
- Fundo claro (white/off-white)
- Ícones no estilo outline
- Tipografia Inter
- Paleta de cores suave e acessível
- Cards com sombra suave

## 🔐 Segurança

- Validação de dados de entrada
- Sanitização de textos
- Armazenamento local seguro
- Sem exposição de dados sensíveis

## 📄 Funcionalidades Premium

As seguintes funcionalidades são marcadas como Premium e exibem "Recurso Premium - liberado temporariamente":
- Comparação de mercados com GPS
- Relatórios avançados de gastos
- Backup ilimitado na nuvem
- Suporte prioritário

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para: suporte@listoumais.com.br

---

Desenvolvido com ❤️ para ajudar famílias a organizarem suas finanças.