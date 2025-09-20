import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select 
      value={i18n.language} 
      onChange={handleLanguageChange}
      className="glass-button rounded-lg px-3 py-1 text-sm text-text dark:text-text-dark border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all duration-200"
    >
      <option value="pt">{t('portuguese')}</option>
      <option value="en">{t('english')}</option>
    </select>
  );
};