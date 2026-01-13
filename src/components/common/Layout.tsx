import React from 'react';
// import { Outlet } from 'react-router-dom'; // Commented out as it's not used currently
import BottomNavigation from './BottomNavigation';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;