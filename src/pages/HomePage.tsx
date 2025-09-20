import React from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureCard } from '../components/CommonComponents';
import { lightColors } from '../styles/colors';
import PixelBlast from '../components/ui/PixelBlast';

interface HomePageProps {
  setPage: (page: 'home' | 'dashboard' | 'calculator' | 'results') => void;
  colors: typeof lightColors;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, colors }) => {
  const { t } = useTranslation();
  
  // Detectar se está no modo escuro
  const isDarkMode = colors.background === '#0f0f1a';
  
  // Cor personalizada para teste no modo escuro
  const pixelBlastColor = isDarkMode ? '#b19eef' : colors.primary;
  const heroStyles = {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.mutedBackground
  };

  const pixelBlastStyles = {
    position: 'absolute' as const,
    top: '0',
    left: '0',
    right: '0',
    bottom: '-150px', // Estende 150px para baixo
    zIndex: 1,
    opacity: 0.8,
    pointerEvents: 'auto' as const,
  };

  const contentStyles = {
    position: 'relative' as const,
    zIndex: 10,
    textAlign: 'center' as const,
    pointerEvents: 'none' as const
  };

  const titleStyles = {
    fontSize: '2.25rem',
    fontWeight: 800,
    lineHeight: 1.2,
    color: colors.text,
    margin: 0,
    pointerEvents: 'none' as const,
    transition: 'color 0.15s ease',
    fontFamily: '"GC Quick Gaseous", "Glacial Indifference", system-ui, sans-serif'
  };

  const subtitleStyles = {
    fontSize: '1.125rem',
    color: colors.mutedForeground,
    marginTop: '1rem',
    maxWidth: '32rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    pointerEvents: 'none' as const
  };

  const buttonsContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
    gap: '1rem',
    pointerEvents: 'auto'
  };

  const primaryButtonStyles = {
    padding: '1rem 2rem',
    backgroundColor: colors.primary,
    color: colors.primaryForeground,
    fontSize: '1.125rem',
    fontWeight: 700,
    borderRadius: '9999px',
    border: 'none',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    pointerEvents: 'auto' as const,
    position: 'relative' as const,
    zIndex: 20
  };

  const secondaryButtonStyles = {
    padding: '1rem 2rem',
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground,
    fontSize: '1.125rem',
    fontWeight: 700,
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    pointerEvents: 'auto' as const,
    position: 'relative' as const,
    zIndex: 20
  };

  // Media query for larger screens
  const isLargeScreen = window.innerWidth >= 640;
  
  if (isLargeScreen) {
    heroStyles.padding = '3rem';
    titleStyles.fontSize = '3rem';
    buttonsContainerStyles.flexDirection = 'row';
  }

  return (
    <section className="space-y-16">
      <div style={heroStyles}>
        {/* PixelBlast Background */}
        <PixelBlast
          variant="circle"
          pixelSize={10}
          color={pixelBlastColor}
          patternScale={4}
          patternDensity={1.7}
          pixelSizeJitter={0.2}
          enableRipples
          rippleSpeed={1.2}
          rippleThickness={0.25}
          rippleIntensityScale={4.0}
          liquid={false}
          liquidStrength={0}
          liquidRadius={0}
          liquidWobbleSpeed={0}
          speed={0.85}
          edgeFade={0.1}
          transparent
          style={pixelBlastStyles}
        />
        <div style={contentStyles}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            pointerEvents: 'none'
          }}>
            <img 
              src="/logo.webp" 
              alt="Pondera Logo" 
              style={{
                width: '120px',
                height: '120px'
              }}
            />
          </div>
          <h1 style={titleStyles}>
            {t('convert_grades').split('<1>')[0]}
            <span style={{ color: colors.primary, display: 'block', textAlign: 'center' }}>
              {t('convert_grades').split('<1>')[1]?.split('</1>')[0] || 'GPA americano'}
            </span>
          </h1>
          <p style={subtitleStyles}>
            {t('instant_professional')}
          </p>
          <div style={buttonsContainerStyles}>
            <button 
              onClick={() => setPage('calculator')} 
              style={primaryButtonStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {t('calculate_now')}
            </button>
            <button 
              onClick={() => alert('Modo Lote em breve!')} 
              style={secondaryButtonStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {t('batch_mode_teachers')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid-1-md-3">
        <FeatureCard
          colors={colors}
          icon="✏️"
          title={t('enter_grades')}
          description={t('enter_grades_desc')}
        />
        <FeatureCard
          colors={colors}
          icon="⚡"
          title={t('automatic_calculation')}
          description={t('automatic_calculation_desc')}
        />
        <FeatureCard
          colors={colors}
          icon="📊"
          title={t('export_share')}
          description={t('export_share_desc')}
        />
      </div>
    </section>
  );
};

export default HomePage;