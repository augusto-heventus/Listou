import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { usuario, isPremium } = useUserStore();
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Listou+</h1>
            {isPremium && (
              <span className="premium-badge text-xs">Premium</span>
            )}
          </Link>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link to="/perfil" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {usuario?.foto ? (
                  <img src={usuario.foto} alt="Foto do perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-600 font-medium text-sm">
                    {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </Link>
            <button 
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;