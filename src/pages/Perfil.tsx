import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings, Bell, Shield, CreditCard, LogOut, Save, Crown, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUserStore } from '../stores/userStore';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabaseClient';
import { formatarData } from '../utils';

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { usuario, updateUsuario } = useUserStore();
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Debug: Verificar dados do usuário
  console.log('Dados do usuário no Perfil:', usuario);

  // Atualizar formulário quando os dados do usuário mudarem
  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        foto: usuario.foto || '',
        endereco: {
          rua: usuario.endereco?.rua || '',
          numero: usuario.endereco?.numero || '',
          complemento: usuario.endereco?.complemento || '',
          bairro: usuario.endereco?.bairro || '',
          cidade: usuario.endereco?.cidade || '',
          estado: usuario.endereco?.estado || '',
          cep: usuario.endereco?.cep || '',
        },
        notificacoes: usuario.preferencias?.notificacoes ?? true,
        backupAutomatico: usuario.preferencias?.backupAutomatico ?? true,
      });
      console.log('Formulário atualizado com dados do usuário:', usuario);
    }
  }, [usuario]);

  // Se não houver usuário, mostrar mensagem de carregamento ou erro
  if (!usuario) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        </div>
        
        <div className="card text-center py-8">
          <p className="text-gray-600 mb-4">Nenhum dado de usuário encontrado.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    telefone: usuario?.telefone || '',
    foto: usuario?.foto || '',
    endereco: {
      rua: usuario?.endereco?.rua || '',
      numero: usuario?.endereco?.numero || '',
      complemento: usuario?.endereco?.complemento || '',
      bairro: usuario?.endereco?.bairro || '',
      cidade: usuario?.endereco?.cidade || '',
      estado: usuario?.endereco?.estado || '',
      cep: usuario?.endereco?.cep || '',
    },
    notificacoes: usuario?.preferencias?.notificacoes ?? true,
    backupAutomatico: usuario?.preferencias?.backupAutomatico ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!usuario?.id) {
      setSaveError('Usuário não identificado');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Verificar se o email foi alterado
      const emailChanged = formData.email !== usuario.email;
      
      // Se o email foi alterado, atualizar via auth primeiro
      if (emailChanged) {
        console.log('Email alterado, atualizando via auth...');
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });
        
        if (emailError) {
          console.error('Erro ao atualizar email:', emailError);
          throw new Error(`Erro ao atualizar email: ${emailError.message}`);
        }
      }

      // Preparar dados para salvar no Supabase (sem email)
      const profileData = {
        nome: formData.nome,
        telefone: formData.telefone,
        foto: formData.foto,
        endereco: formData.endereco,
        preferencias: {
          moeda: usuario.preferencias?.moeda || 'BRL',
          notificacoes: formData.notificacoes,
          backup_automatico: formData.backupAutomatico,
          categorias_personalizadas: usuario.preferencias?.categoriasPersonalizadas || []
        }
      };

      console.log('Salvando dados do perfil (sem email):', profileData);

      // Salvar no Supabase
      const { error } = await authService.updateUserProfile(usuario.id, profileData);

      if (error) {
        throw error;
      }

      // Atualizar local store apenas após salvar com sucesso
      updateUsuario({
        ...usuario,
        nome: formData.nome,
        email: formData.email, // Atualizar email no store também
        telefone: formData.telefone,
        foto: formData.foto,
        endereco: formData.endereco,
        preferencias: {
          ...usuario.preferencias,
          moeda: usuario.preferencias?.moeda || 'BRL',
          notificacoes: formData.notificacoes,
          backupAutomatico: formData.backupAutomatico,
          categoriasPersonalizadas: usuario.preferencias?.categoriasPersonalizadas || []
        }
      });

      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!' + (emailChanged ? ' Um email de confirmação foi enviado para seu novo endereço.' : ''));
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao salvar perfil';
      setSaveError(`Erro ao salvar perfil: ${errorMessage}`);
      toast.error(`Erro ao salvar perfil: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout(); // Usa a função de logout do useAuth que já limpa ambos os stores
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError(null); // Limpar erros ao iniciar edição
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError(null); // Limpar erros ao cancelar
    // Restaurar dados do formulário para os valores originais do usuário
    if (usuario) {
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        foto: usuario.foto || '',
        endereco: {
          rua: usuario.endereco?.rua || '',
          numero: usuario.endereco?.numero || '',
          complemento: usuario.endereco?.complemento || '',
          bairro: usuario.endereco?.bairro || '',
          cidade: usuario.endereco?.cidade || '',
          estado: usuario.endereco?.estado || '',
          cep: usuario.endereco?.cep || '',
        },
        notificacoes: usuario.preferencias?.notificacoes ?? true,
        backupAutomatico: usuario.preferencias?.backupAutomatico ?? true,
      });
    }
  };

  // Função para lidar com upload de imagem
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem válida
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem válido.');
        return;
      }

      // Limitar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, foto: result });
        toast.success('Foto carregada com sucesso!');
      };
      reader.onerror = () => {
        toast.error('Erro ao carregar a imagem.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover a foto
  const handleRemovePhoto = () => {
    setFormData({ ...formData, foto: '' });
    toast.success('Foto removida com sucesso!');
  };

  const menuItems = [
    { icon: Settings, label: 'Preferências', action: handleEditClick },
    { icon: Bell, label: 'Notificações', action: () => {} },
    { icon: Shield, label: 'Privacidade', action: () => {} },
    { icon: CreditCard, label: 'Plano e Pagamento', action: () => navigate('/perfil/upgrade') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
      </div>

      {/* Informações do usuário */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
            {usuario?.foto ? (
              <img src={usuario.foto} alt="Foto do perfil" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-primary-600" />
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                {/* Foto do perfil */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                    {formData.foto ? (
                      <img src={formData.foto} alt="Foto do perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto do perfil</label>
                    <div className="flex space-x-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="btn-secondary inline-flex items-center space-x-2 px-3 py-2 text-sm">
                          <Upload className="w-4 h-4" />
                          <span>Escolher Foto</span>
                        </div>
                      </label>
                      {formData.foto && (
                        <button
                          onClick={handleRemovePhoto}
                          className="btn-outline inline-flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                          <span>Remover</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.</p>
                  </div>
                </div>

                {/* Dados pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="input"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="input"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                {/* Endereço */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Endereço</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <input
                        type="text"
                        value={formData.endereco.cep}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, cep: e.target.value }
                        })}
                        className="input"
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                      <input
                        type="text"
                        value={formData.endereco.rua}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, rua: e.target.value }
                        })}
                        className="input"
                        placeholder="Nome da rua"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        value={formData.endereco.numero}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, numero: e.target.value }
                        })}
                        className="input"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                      <input
                        type="text"
                        value={formData.endereco.complemento}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, complemento: e.target.value }
                        })}
                        className="input"
                        placeholder="Apto, casa, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        value={formData.endereco.bairro}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, bairro: e.target.value }
                        })}
                        className="input"
                        placeholder="Bairro"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        value={formData.endereco.cidade}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, cidade: e.target.value }
                        })}
                        className="input"
                        placeholder="Cidade"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <input
                        type="text"
                        value={formData.endereco.estado}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, estado: e.target.value }
                        })}
                        className="input"
                        placeholder="UF"
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">{usuario?.nome || 'Usuário'}</h2>
                <p className="text-gray-600">{usuario?.email || 'email@exemplo.com'}</p>
                
                {usuario?.telefone && (
                  <p className="text-gray-600">📱 {usuario.telefone}</p>
                )}
                
                {usuario?.endereco && (usuario.endereco.rua || usuario.endereco.cidade) && (
                  <div className="text-sm text-gray-500 mt-2">
                    <p className="font-medium">Endereço:</p>
                    <p>
                      {usuario.endereco.rua && `${usuario.endereco.rua}, `}
                      {usuario.endereco.numero && `${usuario.endereco.numero} `}
                      {usuario.endereco.complemento && `- ${usuario.endereco.complemento}`}
                    </p>
                    <p>
                      {usuario.endereco.bairro && `${usuario.endereco.bairro}, `}
                      {usuario.endereco.cidade && `${usuario.endereco.cidade} `}
                      {usuario.endereco.estado && `- ${usuario.endereco.estado}`}
                    </p>
                    {usuario.endereco.cep && <p>CEP: {usuario.endereco.cep}</p>}
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-1">
                  Membro desde {usuario?.dataCadastro ? formatarData(usuario.dataCadastro) : '2024'}
                </p>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Notificações</h4>
                <p className="text-sm text-gray-600">Receber alertas sobre gastos e lembretes</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, notificacoes: !formData.notificacoes })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.notificacoes ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.notificacoes ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Backup Automático</h4>
                <p className="text-sm text-gray-600">Salvar dados na nuvem automaticamente</p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, backupAutomatico: !formData.backupAutomatico })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.backupAutomatico ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.backupAutomatico ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{saveError}</p>
              </div>
            )}
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleEditClick}
            className="btn-outline"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {/* Plano atual */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Plano Atual</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            usuario?.plano === 'premium' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {usuario?.plano === 'premium' ? 'Premium' : 'Gratuito'}
          </span>
        </div>
        
        {usuario?.plano === 'gratuito' ? (
          <div className="space-y-3">
            <p className="text-gray-600">
              Você está usando o plano gratuito com acesso a funcionalidades básicas.
            </p>
            <button
              onClick={() => navigate('/perfil/upgrade')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>Atualizar para Premium</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">
              Você tem acesso completo a todas as funcionalidades premium.
            </p>
            <div className="text-sm text-gray-600">
              <p>✓ Comparação de mercados</p>
              <p>✓ Relatórios avançados</p>
              <p>✓ Backup ilimitado</p>
              <p>✓ Suporte prioritário</p>
            </div>
          </div>
        )}
      </div>

      {/* Menu de configurações */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Configurações</h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sobre o app */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Sobre o Listou+</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>Versão: 1.0.0</p>
          <p>Desenvolvido para ajudar famílias a organizarem suas finanças e economizarem nas compras.</p>
          <div className="pt-3 border-t border-gray-200">
            <p>© 2024 Listou+ - Todos os direitos reservados</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
      >
        <LogOut className="w-5 h-5" />
        <span>Sair da Conta</span>
      </button>
    </div>
  );
};

export default Perfil;