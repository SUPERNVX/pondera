import { useState, useEffect, useCallback } from 'react';

export type CookieConsentStatus = 'pending' | 'accepted' | 'declined';

interface CookieConsentData {
  status: CookieConsentStatus;
  date: string | null;
}

export const useCookieConsent = () => {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>('pending');
  const [consentDate, setConsentDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check existing consent on mount
    const savedConsent = localStorage.getItem('pondera-cookie-consent');
    const savedDate = localStorage.getItem('pondera-cookie-consent-date');
    
    if (savedConsent && (savedConsent === 'accepted' || savedConsent === 'declined')) {
      setConsentStatus(savedConsent as CookieConsentStatus);
      setConsentDate(savedDate);
    }
    
    setIsLoading(false);
  }, []);

  const acceptCookies = () => {
    const timestamp = new Date().toISOString();
    localStorage.setItem('pondera-cookie-consent', 'accepted');
    localStorage.setItem('pondera-cookie-consent-date', timestamp);
    setConsentStatus('accepted');
    setConsentDate(timestamp);
  };

  const declineCookies = () => {
    const timestamp = new Date().toISOString();
    localStorage.setItem('pondera-cookie-consent', 'declined');
    localStorage.setItem('pondera-cookie-consent-date', timestamp);
    setConsentStatus('declined');
    setConsentDate(timestamp);
    
    // Clear all non-essential data if user declines
    clearNonEssentialData();
  };

  const resetConsent = () => {
    localStorage.removeItem('pondera-cookie-consent');
    localStorage.removeItem('pondera-cookie-consent-date');
    setConsentStatus('pending');
    setConsentDate(null);
  };

  const clearNonEssentialData = () => {
    // Keep only essential data when user declines cookies
    const essentialKeys = [
      'pondera-cookie-consent',
      'pondera-cookie-consent-date',
      'i18nextLng', // Language preference
      'theme', // Theme preference
      // Add any other essential keys here
    ];

    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!essentialKeys.includes(key) && !key.startsWith('pondera-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const hasConsent = () => {
    return consentStatus === 'accepted';
  };

  const shouldShowBanner = () => {
    return !isLoading && consentStatus === 'pending';
  };

  const getConsentInfo = (): CookieConsentData => {
    return {
      status: consentStatus,
      date: consentDate
    };
  };

  // Check if consent is still valid (e.g., not older than 1 year)
  const isConsentValid = useCallback(() => {
    if (!consentDate) return false;
    
    const consentTime = new Date(consentDate).getTime();
    const now = new Date().getTime();
    const oneYear = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
    
    return (now - consentTime) < oneYear;
  }, [consentDate]);

  // Automatically reset consent if it's expired
  useEffect(() => {
    if (consentDate && !isConsentValid()) {
      resetConsent();
    }
  }, [consentDate, isConsentValid]);

  return {
    consentStatus,
    consentDate,
    isLoading,
    acceptCookies,
    declineCookies,
    resetConsent,
    hasConsent,
    shouldShowBanner,
    getConsentInfo,
    isConsentValid
  };
};