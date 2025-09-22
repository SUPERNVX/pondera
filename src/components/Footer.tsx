import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { lightColors } from '../styles/colors';

interface FooterProps {
  colors?: typeof lightColors;
}

const Footer: React.FC<FooterProps> = ({ colors = lightColors }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <footer style={{
      marginTop: 'auto',
      padding: '2rem 0',
      borderTop: `1px solid ${colors.border}`,
      backgroundColor: colors.background,
      color: colors.mutedForeground
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '0.875rem' }}>
          © 2024 Pondera. {t('all_rights_reserved')}.
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <button
            onClick={() => navigate('/privacy')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.mutedForeground,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.mutedForeground;
            }}
          >
            {t('privacy_policy_title')}
          </button>
          
          <button
            onClick={() => navigate('/terms')}
            style={{
              background: 'none',
              border: 'none',
              color: colors.mutedForeground,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.mutedForeground;
            }}
          >
            {t('terms_of_service_title')}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;