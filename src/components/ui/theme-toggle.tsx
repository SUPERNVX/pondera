import React, { useRef } from 'react';
import { flushSync } from 'react-dom';
import { lightColors, darkColors } from '../../styles/colors';
import { useAnalytics } from '../../hooks/useAnalytics';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const colors = theme === 'dark' ? darkColors : lightColors;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { trackUserPreference } = useAnalytics();
  
  const changeTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    trackUserPreference('theme', newTheme);

    if (!buttonRef.current) {
      onToggle();
      return;
    }

    // Verificar se o navegador suporta View Transitions
    if (!('startViewTransition' in document)) {
      onToggle();
      return;
    }

    await (document as unknown as Document).startViewTransition(() => {
      flushSync(() => {
        onToggle();
      });
    }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };
  
  return (
    <button 
      ref={buttonRef}
      onClick={changeTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: colors.mutedBackground,
        color: colors.text,
        fontSize: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(0)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.primary;
        e.currentTarget.style.color = colors.primaryForeground;
        e.currentTarget.style.transform = 'translateY(-2px) rotate(15deg)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.mutedBackground;
        e.currentTarget.style.color = colors.text;
        e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      title={theme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro'}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      <span 
        style={{
          transition: 'all 0.3s ease',
          filter: theme === 'light' 
            ? 'drop-shadow(0 0 4px #8b5cf6)' // Glow roxo para a lua
            : 'drop-shadow(0 0 4px #ffd700)' // Glow dourado para o sol
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};