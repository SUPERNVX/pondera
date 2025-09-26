import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { lightColors } from '../styles/colors';
import { useAnalytics } from '../hooks/useAnalytics';

interface PrivacyPolicyProps {
  colors?: typeof lightColors;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ colors = lightColors }) => {
  const { t } = useTranslation();
  const { trackLegalPageView } = useAnalytics();

  useEffect(() => {
    trackLegalPageView('privacy');
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
          {t('privacy_policy_title')}
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
              {t('data_collection_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('data_collection_desc')}
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>{t('data_collection_grades')}</li>
              <li>{t('data_collection_student_info')}</li>
              <li>{t('data_collection_preferences')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('data_storage_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('data_storage_desc')}
            </p>
            <div style={{
              backgroundColor: colors.secondary,
              padding: '1rem',
              borderRadius: '0.5rem',
              border: `2px solid ${colors.primary}`,
              marginBottom: '1rem'
            }}>
              <strong style={{ color: colors.primary }}>
                {t('important_note')}: 
              </strong>
              <span style={{ marginLeft: '0.5rem' }}>
                {t('no_data_transmission')}
              </span>
            </div>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('cookies_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('cookies_desc')}
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>{t('cookies_preferences')}</li>
              <li>{t('cookies_language')}</li>
              <li>{t('cookies_theme')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('third_party_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('third_party_desc')}
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('data_rights_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('data_rights_desc')}
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>{t('right_access')}</li>
              <li>{t('right_delete')}</li>
              <li>{t('right_portability')}</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('compliance_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('compliance_desc')}
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('changes_title')}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t('changes_desc')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;