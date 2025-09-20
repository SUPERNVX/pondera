import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

import CalculatorPage from './pages/CalculatorPage';
import ResultsPage from './pages/ResultsPage';
import { ThemeToggle } from './components/ui/theme-toggle';
import { lightColors, darkColors } from './styles/colors';
import { usePageAnimations } from './hooks/useAnimations';
import './styles/global.css';
import './i18n/i18n';

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize page animations
  usePageAnimations();

  const colors = isDarkMode ? darkColors : lightColors;

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setPage = (page: 'home' | 'dashboard' | 'calculator' | 'results') => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'calculator':
        navigate('/calculator');
        break;
      case 'results':
        navigate('/results');
        break;
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <div 
      className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      data-theme={isDarkMode ? 'dark' : 'light'}
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <div className="container">
        <header className="main-header">
          <h1 style={{ color: colors.primary }}>Pondera</h1>
          <nav className="navigation">
            {!isHomePage && (
              <button
                onClick={() => setPage('home')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '1rem',
                  border: 'none',
                  backgroundColor: colors.secondary,
                  color: colors.secondaryForeground,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                  e.currentTarget.style.color = colors.primaryForeground;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.secondary;
                  e.currentTarget.style.color = colors.secondaryForeground;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
                title="Voltar para a página inicial"
              >
                🏠 Início
              </button>
            )}
            <ThemeToggle 
              theme={isDarkMode ? 'dark' : 'light'}
              onToggle={toggleDarkMode}
            />
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HomePage setPage={setPage} colors={colors} />} />
          <Route path="/dashboard" element={<DashboardPage colors={colors} />} />
          
          <Route path="/calculator" element={<CalculatorPage colors={colors} />} />
          <Route path="/results" element={<ResultsPage colors={colors} />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
