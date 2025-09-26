import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { lightColors } from '../styles/colors';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { useAnalytics } from '../hooks/useAnalytics';

interface CookieConsentProps {
  colors?: typeof lightColors;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ colors = lightColors }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { shouldShowBanner, acceptCookies, declineCookies } = useCookieConsent();
  const { trackCookieConsent } = useAnalytics();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (shouldShowBanner()) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => {
        setTimeout(() => setIsVisible(true), 100);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowBanner]);

  const handleAccept = () => {
    acceptCookies();
    trackCookieConsent('accepted');
    hideBanner();
  };

  const handleDecline = () => {
    declineCookies();
    trackCookieConsent('declined');
    hideBanner();
  };

  const hideBanner = () => {
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    navigate('/privacy');
  };

  if (!shouldShowBanner()) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        onClick={hideBanner}
      />

      {/* Cookie Consent Banner */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
          padding: '1rem',
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.mutedBackground} 100%)`,
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${colors.border}`,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🍪</span>
            <h3 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              color: colors.primary
            }}>
              {t('cookie_consent_title')}
            </h3>
          </div>

          {/* Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: colors.text
            }}>
              {t('cookie_consent_description')}
            </p>

            {/* Essential cookies info */}
            <div style={{
              backgroundColor: colors.secondary,
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              color: colors.secondaryForeground
            }}>
              <strong>{t('essential_cookies_title')}:</strong> {t('essential_cookies_description')}
            </div>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}>
                {/* Accept Button */}
                <button
                  onClick={handleAccept}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.primaryForeground,
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ✅ {t('accept_cookies')}
                </button>

                {/* Decline Button */}
                <button
                  onClick={handleDecline}
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.secondaryForeground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.mutedBackground;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.secondary;
                  }}
                >
                  ❌ {t('decline_cookies')}
                </button>
              </div>

              {/* Learn More Link */}
              <button
                onClick={handleLearnMore}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primary,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0.5rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.primary;
                }}
              >
                📖 {t('learn_more_cookies')}
              </button>
            </div>
          </div>

          {/* Mobile responsive adjustments */}
          <style>
            {`
              @media (max-width: 768px) {
                .cookie-consent-actions {
                  flex-direction: column;
                  align-items: stretch;
                }
                
                .cookie-consent-actions button {
                  width: 100%;
                  justify-content: center;
                }
              }
            `}
          </style>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;