import React, { useState } from 'react';
import { ArrowLeft, Clock, Users, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
// import { formatarMoeda } from '../utils';

interface Ingrediente {
  id: number;
  nome: string;
  quantidade: string;
  unidade: string;
  categoria: string;
}

interface Passo {
  id: number;
  ordem: number;
  descricao: string;
}

const VisualizarReceita: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [selectedList, setSelectedList] = useState<string>('');

  // TODO: Buscar receita real usando o ID
  console.log('ID da receita:', id);

  // Dados mockados da receita
  const receita = {
    id: 1,
    nome: "Bolo de Cenoura com Cobertura de Chocolate",
    descricao: "Um bolo fofo e úmido de cenoura com cobertura de chocolate cremosa. Perfeito para sobremesa ou lanche da tarde.",
    tempoPreparo: 60,
    rendimento: 8,
    dificuldade: "Fácil",
    categoria: "Sobremesa",
    imagem: "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Bolo%20de%20cenoura%20com%20cobertura%20de%20chocolate%20em%20uma%20forma%20de%20bolo%20dourada%2C%20foto%20de%20comida%20apetitosa%2C%20ilumina%C3%A7%C3%A3o%20natural%2C%20estilo%20gourmet&image_size=square_hd"
  };

  const ingredientes: Ingrediente[] = [
    { id: 1, nome: "Cenoura média", quantidade: "3", unidade: "unidades", categoria: "Vegetais" },
    { id: 2, nome: "Ovos", quantidade: "4", unidade: "unidades", categoria: "Laticínios" },
    { id: 3, nome: "Óleo de milho", quantidade: "1", unidade: "xícara", categoria: "Óleos" },
    { id: 4, nome: "Farinha de trigo", quantidade: "2", unidade: "xícaras", categoria: "Farinhas" },
    { id: 5, nome: "Açúcar", quantidade: "2", unidade: "xícaras", categoria: "Açúcares" },
    { id: 6, nome: "Fermento em pó", quantidade: "1", unidade: "colher de sopa", categoria: "Fermentos" },
    { id: 7, nome: "Leite", quantidade: "1/2", unidade: "xícara", categoria: "Laticínios" },
    { id: 8, nome: "Chocolate em pó", quantidade: "2", unidade: "colheres de sopa", categoria: "Chocolates" },
    { id: 9, nome: "Manteiga", quantidade: "1", unidade: "colher de sopa", categoria: "Laticínios" }
  ];

  const passos: Passo[] = [
    { id: 1, ordem: 1, descricao: "Preaqueça o forno a 180°C. Unte e enfarinhe uma forma de bolo média." },
    { id: 2, ordem: 2, descricao: "Em um liquidificador, bata as cenouras picadas até obter um purê liso." },
    { id: 3, ordem: 3, descricao: "Adicione os ovos, o óleo e o leite ao liquidificador e bata até misturar bem." },
    { id: 4, ordem: 4, descricao: "Em uma tigela grande, peneire a farinha, o açúcar e o fermento." },
    { id: 5, ordem: 5, descricao: "Adicione a mistura do liquidificador aos ingredientes secos e mexa até incorporar." },
    { id: 6, ordem: 6, descricao: "Despeje a massa na forma preparada e leve ao forno por 40-45 minutos." },
    { id: 7, ordem: 7, descricao: "Para a cobertura, derreta a manteiga e misture com o chocolate em pó." },
    { id: 8, ordem: 8, descricao: "Espalhe a cobertura sobre o bolo ainda morno e sirva." }
  ];

  const listasExistentes = [
    { id: '1', nome: 'Compras do Mês' },
    { id: '2', nome: 'Churrasco de Domingo' },
    { id: '3', nome: 'Festa de Aniversário' }
  ];

  const handleAddToList = () => {
    if (selectedList === 'new') {
      // Criar nova lista e adicionar itens
      navigate('/listas/nova', { 
        state: { 
          itens: ingredientes.map(ing => ({
            nome: ing.nome,
            quantidade: ing.quantidade,
            unidade: ing.unidade,
            categoria: ing.categoria
          }))
        }
      });
    } else if (selectedList) {
      // Adicionar à lista existente
      console.log('Adicionando itens à lista:', selectedList);
      setShowAddToListModal(false);
      // Aqui você implementaria a lógica real de adicionar à lista
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/receitas')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Receita</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Imagem e Informações Principais */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={receita.imagem}
            alt={receita.nome}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{receita.nome}</h1>
            <p className="text-gray-600 mb-4">{receita.descricao}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{receita.tempoPreparo} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{receita.rendimento} porções</span>
              </div>
              <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                {receita.dificuldade}
              </div>
            </div>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ingredientes</h2>
            <button
              onClick={() => setShowAddToListModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar à Lista</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {ingredientes.map((ingrediente) => (
              <div key={ingrediente.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-gray-900 font-medium">{ingrediente.nome}</span>
                </div>
                <div className="text-gray-600">
                  {ingrediente.quantidade} {ingrediente.unidade}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modo de Preparo */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Modo de Preparo</h2>
          
          <div className="space-y-4">
            {passos.map((passo) => (
              <div key={passo.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {passo.ordem}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 leading-relaxed">{passo.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para adicionar à lista */}
      {showAddToListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar à Lista de Compras</h3>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="listOption"
                  value="new"
                  checked={selectedList === 'new'}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="text-primary-600"
                />
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-gray-600" />
                  <span>Criar nova lista</span>
                </div>
              </label>
              
              {listasExistentes.map((lista) => (
                <label key={lista.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="listOption"
                    value={lista.id}
                    checked={selectedList === lista.id}
                    onChange={(e) => setSelectedList(e.target.value)}
                    className="text-primary-600"
                  />
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                    <span>{lista.nome}</span>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddToListModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToList}
                disabled={!selectedList}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizarReceita;