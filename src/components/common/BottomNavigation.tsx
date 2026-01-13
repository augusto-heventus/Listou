import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListTodo, ScanLine, ChefHat, User } from 'lucide-react';
import { cn } from '../../utils';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/listas', icon: ListTodo, label: 'Listas' },
    { path: '/notas', icon: ScanLine, label: 'Notas', isCenter: true }, // Mudado de importar para notas
    { path: '/receitas', icon: ChefHat, label: 'Receitas' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  // Verificar se está em uma página de notas (incluindo importar, detalhes, itens)
  const isNotasPage = location.pathname.startsWith('/notas');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          // Para o botão central de notas, verificar se está em qualquer página de notas
          const isCenterActive = item.isCenter && isNotasPage;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full text-xs transition-colors',
                isActive || isCenterActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600',
                item.isCenter && isNotasPage && 'bg-primary-50 rounded-full mx-2 my-1'
              )}
            >
              <Icon className={cn(
                'w-6 h-6 mb-1',
                item.isCenter && 'w-8 h-8'
              )} />
              <span className={cn(
                item.isCenter && 'font-medium'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;