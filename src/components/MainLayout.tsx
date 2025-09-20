import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ui/theme-toggle';
import { LanguageSelector } from './ui/language-selector';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme is now managed by ThemeToggle, but we still need to read it for dynamic styles
  const currentTheme = localStorage.getItem('theme') || 'light';

  

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50 dark:bg-black/50",
        "border-b border-gray-200 dark:border-gray-800"
      )}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div 
              className="font-bold text-2xl cursor-pointer text-primary-500 hover:text-primary-600 transition-colors"
              onClick={() => handleNavigation('/')}
            >
              Pondera
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                <button 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleNavigation('/')}
                >
                  {t('home')}
                </button>
                <button 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleNavigation('/calculator')}
                >
                  {t('calculator')}
                </button>
                <button 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => alert('Modo Lote em breve!')}
                >
                  {t('batch_mode')}
                </button>
              </nav>
              
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Theme Toggle */}
              <ThemeToggle 
                theme={currentTheme as 'light' | 'dark'} 
                onToggle={() => {
                  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                  localStorage.setItem('theme', newTheme);
                  window.location.reload();
                }}
              />

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 dark:bg-black/90 border-t border-gray-200 dark:border-gray-800">
            <button 
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleNavigation('/')}
            >
              🏠 {t('home')}
            </button>
            <button 
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleNavigation('/calculator')}
            >
              🧮 {t('calculator')}
            </button>
            <button 
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => alert('Modo Lote em breve!')}
            >
              👥 {t('batch_mode')}
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p className="mb-1">
            © {new Date().getFullYear()} Pondera - Calculadora de GPA
          </p>
          <p className="text-xs">
            Desenvolvido com ❤️ para estudantes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
