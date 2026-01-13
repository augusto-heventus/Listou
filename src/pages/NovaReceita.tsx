import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Clock, Users, Save, X, ChefHat, Upload } from 'lucide-react';
import { receitasService } from '../services/receitasService';
import { toast } from 'sonner';

// Principais unidades de medida para alimentos
const UNIDADES_MEDIDA = [
  { value: 'g', label: 'g (grama)' },
  { value: 'kg', label: 'kg (quilo)' },
  { value: 'ml', label: 'ml (mililitro)' },
  { value: 'l', label: 'l (litro)' },
  { value: 'xícara', label: 'xícara' },
  { value: 'colher_sopa', label: 'colher de sopa' },
  { value: 'colher_cha', label: 'colher de chá' },
  { value: 'unidade', label: 'unidade' },
  { value: 'dúzia', label: 'dúzia' },
  { value: 'maço', label: 'maço' },
  { value: 'fatia', label: 'fatia' },
  { value: 'pedaço', label: 'pedaço' },
  { value: 'dentes', label: 'dentes' },
  { value: 'lata', label: 'lata' },
  { value: 'pacote', label: 'pacote' },
  { value: 'pote', label: 'pote' }
];

interface IngredienteForm {
  descricao: string;
  quantidade: number | '';
  unidade: string;
}

const NovaReceita: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    tempo_preparo: 30,
    dificuldade: 'facil' as 'facil' | 'media' | 'dificil',
    rendimento: 4,
    usuario_id: null as string | null,
    imagem: '' as string | null
  });

  const [ingredientes, setIngredientes] = useState<IngredienteForm[]>([
    { descricao: '', quantidade: '', unidade: '' }
  ]);

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, { descricao: '', quantidade: '', unidade: '' }]);
  };

  const removerIngrediente = (index: number) => {
    if (ingredientes.length > 1) {
      setIngredientes(ingredientes.filter((_, i) => i !== index));
    }
  };

  const atualizarIngrediente = (index: number, campo: keyof IngredienteForm, valor: string | number) => {
    const novosIngredientes = [...ingredientes];
    novosIngredientes[index] = {
      ...novosIngredientes[index],
      [campo]: valor
    };
    setIngredientes(novosIngredientes);
  };

  const testarSalvamento = async () => {
    console.log('=== TESTANDO FUNÇÃO DE SALVAMENTO ===');
    
    // Preencher formulário com dados de teste
    const dadosTeste = {
      titulo: 'Receita de Teste Automática',
      tempo_preparo: 45,
      dificuldade: 'facil' as const,
      rendimento: 6,
      imagem: null as string | null,
      usuario_id: null as string | null
    };
    
    const ingredientesTeste = [
      { descricao: 'Farinha de trigo', quantidade: 2, unidade: 'xícara' },
      { descricao: 'Ovos', quantidade: 3, unidade: 'unidade' }
    ];
    
    console.log('Dados de teste:', dadosTeste);
    console.log('Ingredientes de teste:', ingredientesTeste);
    
    try {
      // Testar apenas o serviço de receitas
      console.log('Testando serviço salvarReceita...');
      const resultado = await receitasService.salvarReceita(dadosTeste as any); // Teste temporário
      console.log('✅ Teste bem-sucedido! Resultado:', resultado);
      toast.success('Teste de salvamento bem-sucedido!');
      
      // Testar ingredientes
      console.log('Testando salvamento de ingredientes...');
      for (const ing of ingredientesTeste) {
        const resultadoIngrediente = await receitasService.salvarIngrediente({
          receita_id: resultado.id,
          descricao: ing.descricao,
          quantidade: ing.quantidade,
          unidade: ing.unidade
        });
        console.log('✅ Ingrediente salvo:', resultadoIngrediente);
      }
      
      toast.success('Teste completo! Ingredientes salvos com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      toast.error(`Erro no teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
    
    console.log('=== FINALIZANDO TESTE ===');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== INICIANDO SALVAMENTO DA RECEITA ===');
    console.log('Dados do formulário:', formData);
    console.log('Ingredientes:', ingredientes);
    
    if (!formData.titulo.trim()) {
      toast.error('Por favor, insira o título da receita');
      return;
    }

    const ingredientesValidos = ingredientes.filter(ing => 
      ing.descricao.trim() && ing.quantidade && ing.unidade.trim()
    );

    console.log('Ingredientes válidos:', ingredientesValidos);

    if (ingredientesValidos.length === 0) {
      toast.error('Por favor, adicione pelo menos um ingrediente completo');
      return;
    }

    try {
      setLoading(true);
      
      // Se não houver imagem personalizada, gerar uma automaticamente
      const dadosReceita = {
        ...formData,
        imagem: formData.imagem || receitasService.gerarImagem(formData.titulo)
      };
      
      console.log('Dados da receita para salvar:', dadosReceita);
      
      // Salvar receita
      const novaReceita = await receitasService.salvarReceita(dadosReceita);
      console.log('✅ Receita salva com sucesso:', novaReceita);
      toast.success('Receita salva com sucesso!');
      
      // Salvar ingredientes
      for (let i = 0; i < ingredientesValidos.length; i++) {
        const ing = ingredientesValidos[i];
        console.log(`Salvando ingrediente ${i + 1}/${ingredientesValidos.length}:`, ing);
        await receitasService.salvarIngrediente({
          receita_id: novaReceita.id,
          descricao: ing.descricao,
          quantidade: ing.quantidade as number,
          unidade: ing.unidade
        });
        console.log(`✅ Ingrediente ${i + 1} salvo com sucesso`);
      }

      toast.success('Receita criada com sucesso!');
      console.log('=== RECEITA CRIADA COM SUCESSO ===');
      navigate('/receitas');
      
    } catch (error) {
      console.error('❌ ERRO DETALHADO AO SALVAR RECEITA:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'Stack não disponível');
      console.error('Tipo do erro:', typeof error);
      console.error('Propriedades do erro:', Object.keys(error || {}));
      
      let mensagemErro = 'Erro ao salvar receita';
      if (error instanceof Error) {
        mensagemErro += `: ${error.message}`;
      } else if (typeof error === 'string') {
        mensagemErro += `: ${error}`;
      } else if (error && typeof error === 'object') {
        mensagemErro += `: ${JSON.stringify(error)}`;
      }
      
      toast.error(mensagemErro);
      console.error('Mensagem de erro exibida:', mensagemErro);
    } finally {
      setLoading(false);
      console.log('=== FINALIZANDO PROCESSO DE SALVAMENTO ===');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChefHat className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Criar Nova Receita</h1>
        </div>
        <button
          onClick={() => navigate('/receitas')}
          className="btn-outline inline-flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancelar</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações básicas */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Receita *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="input"
                placeholder="Ex: Bolo de Cenoura"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dificuldade
              </label>
              <select
                value={formData.dificuldade}
                onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value as any })}
                className="input"
              >
                <option value="facil">Fácil</option>
                <option value="media">Média</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo de Preparo (minutos)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.tempo_preparo}
                  onChange={(e) => setFormData({ ...formData, tempo_preparo: parseInt(e.target.value) || 0 })}
                  className="input pl-10"
                  min="5"
                  max="300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rendimento (porções)
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.rendimento}
                  onChange={(e) => setFormData({ ...formData, rendimento: parseInt(e.target.value) || 1 })}
                  className="input pl-10"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem (opcional)
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  value={formData.imagem || ''}
                  onChange={(e) => setFormData({ ...formData, imagem: e.target.value || null })}
                  className="input pl-10"
                  placeholder="https://exemplo.com/imagem.jpg (deixe em branco para gerar automaticamente)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Se não fornecer uma imagem, uma será gerada automaticamente baseada no título
              </p>
            </div>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ingredientes</h2>
            <button
              type="button"
              onClick={adicionarIngrediente}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Ingrediente</span>
            </button>
          </div>

          <div className="space-y-3">
            {ingredientes.map((ingrediente, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={ingrediente.descricao}
                  onChange={(e) => atualizarIngrediente(index, 'descricao', e.target.value)}
                  placeholder="Descrição do ingrediente"
                  className="input flex-1"
                />
                <input
                  type="number"
                  value={ingrediente.quantidade}
                  onChange={(e) => atualizarIngrediente(index, 'quantidade', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Qtd"
                  className="input w-20"
                  min="0"
                  step="0.1"
                />
                <select
                  value={ingrediente.unidade}
                  onChange={(e) => atualizarIngrediente(index, 'unidade', e.target.value)}
                  className="input w-32"
                >
                  <option value="">Unidade</option>
                  {UNIDADES_MEDIDA.map(unidade => (
                    <option key={unidade.value} value={unidade.value}>
                      {unidade.label}
                    </option>
                  ))}
                </select>
                {ingredientes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerIngrediente(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/receitas')}
            className="btn-outline"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => testarSalvamento()}
            className="btn-secondary inline-flex items-center space-x-2"
            disabled={loading}
          >
            <span>Testar Salvamento</span>
          </button>
          <button
            type="submit"
            className="btn-primary inline-flex items-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Receita</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovaReceita;