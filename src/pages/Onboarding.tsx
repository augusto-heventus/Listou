import React, { useState } from 'react';
import { ChevronRight, Receipt, ListTodo, MapPin, Crown, CheckCircle } from 'lucide-react';
import { useOnboarding } from '../stores/onboardingStore';

const Onboarding: React.FC = () => {
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Importe suas notas fiscais',
      description: 'Adicione gastos automaticamente escaneando o QR code ou digitando a chave de acesso da NF-e.',
      icon: Receipt,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=smartphone%20escaneando%20QR%20code%20de%20nota%20fiscal%20em%20supermercado%20interface%20limpa%20moderna%20estilo%20flat%20design&image_size=portrait_4_3',
      features: [
        'Leitura por QR Code',
        'Digitação de chave de acesso',
        'Categorização automática',
        'Histórico de preços'
      ]
    },
    {
      title: 'Organize suas listas de compras',
      description: 'Crie listas categorizadas, compartilhe com sua família e marque itens conforme for comprando.',
      icon: ListTodo,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=lista%20de%20compras%20organizada%20por%20categorias%20em%20smartphone%20interface%20clean%20moderna%20cores%20suaves&image_size=portrait_4_3',
      features: [
        'Listas por categoria',
        'Compartilhamento familiar',
        'Progresso em tempo real',
        'Sugestões inteligentes'
      ]
    },
    {
      title: 'Compare preços entre mercados',
      description: 'Descubra onde economizar mais com nossa comparação inteligente de preços (recurso premium).',
      icon: MapPin,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=mapa%20com%20supermercados%20marcados%20comparacao%20de%20precos%20interface%20mobile%20clean%20moderna&image_size=portrait_4_3',
      features: [
        'GPS integrado',
        'Comparação de preços',
        'Economia inteligente',
        'Rotas otimizadas'
      ],
      premium: true
    }
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    // Forçar navegação imediata para login
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-primary-600 w-8' : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Icon and title */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600">
                {currentStepData.description}
              </p>
              {currentStepData.premium && (
                <div className="mt-3">
                  <span className="premium-badge">
                    <Crown className="w-3 h-3 mr-1" />
                    Recurso Premium
                  </span>
                </div>
              )}
            </div>

            {/* Image */}
            <div className="rounded-xl overflow-hidden bg-gray-100">
              <img
                src={currentStepData.image}
                alt={currentStepData.title}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Features */}
            <div className="space-y-3">
              {currentStepData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="px-8 pb-8 space-y-4">
            <button
              onClick={handleNext}
              className="w-full btn-primary inline-flex items-center justify-center space-x-2"
            >
              <span>{isLastStep ? 'Começar' : 'Próximo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
              >
                Pular para Login →
              </button>
              
              <div className="text-sm text-gray-500">
                {currentStep + 1} de {steps.length}
              </div>
            </div>
          </div>
        </div>

        {/* App info */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Listou+</span>
          </div>
          <p className="text-sm text-gray-600">
            Sua gestão financeira familiar inteligente
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;