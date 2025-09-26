import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { lightColors } from '../styles/colors';
import { useAnalytics } from '../hooks/useAnalytics';

interface TermsOfServiceProps {
  colors?: typeof lightColors;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ colors = lightColors }) => {
  const { t } = useTranslation();
  const { trackLegalPageView } = useAnalytics();

  useEffect(() => {
    trackLegalPageView('terms');
  }, [trackLegalPageView]);

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: colors.background,
      color: colors.text
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: colors.mutedBackground,
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          color: colors.primary, 
          fontSize: '2rem', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {t('terms_of_service_title')}
        </h1>
        
        <p style={{ 
          color: colors.mutedForeground, 
          fontSize: '0.9rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          {t('last_updated')}: {new Date().toLocaleDateString()}
        </p>

        <div style={{ lineHeight: '1.6', fontSize: '1rem' }}>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('acceptance_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('acceptance_desc')}
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('service_description_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('service_description_desc')}
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>{t('service_gpa_calculation')}</li>
              <li>{t('service_grade_conversion')}</li>
              <li>{t('service_report_generation')}</li>
              <li>{t('service_data_visualization')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('user_responsibilities_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('user_responsibilities_desc')}
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>{t('responsibility_accurate_data')}</li>
              <li>{t('responsibility_lawful_use')}</li>
              <li>{t('responsibility_no_misuse')}</li>
              <li>{t('responsibility_respect_ip')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('accuracy_disclaimer_title')}
            </h2>
            <div style={{
              backgroundColor: '#ef444420',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '2px solid #ef4444',
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#ef4444' }}>
                {t('important_disclaimer')}: 
              </strong>
              <span style={{ marginLeft: '0.5rem' }}>
                {t('accuracy_disclaimer_desc')}
              </span>
            </div>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('intellectual_property_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('intellectual_property_desc')}
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('limitation_liability_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('limitation_liability_desc')}
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('service_availability_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('service_availability_desc')}
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('modifications_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('modifications_desc')}
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('governing_law_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('governing_law_desc')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;