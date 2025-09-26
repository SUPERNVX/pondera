import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookieConsent } from './useCookieConsent';

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Analytics event types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Predefined event types for type safety
export const ANALYTICS_EVENTS = {
  // GPA Calculation Events
  GPA_CALCULATED: {
    action: 'gpa_calculated',
    category: 'calculator',
  },
  GRADE_ENTERED: {
    action: 'grade_entered',
    category: 'calculator',
  },
  SUBJECT_ADDED: {
    action: 'subject_added',
    category: 'calculator',
  },
  SUBJECT_REMOVED: {
    action: 'subject_removed',
    category: 'calculator',
  },
  
  // Export Events
  PDF_EXPORTED: {
    action: 'pdf_exported',
    category: 'export',
  },
  CSV_EXPORTED: {
    action: 'csv_exported',
    category: 'export',
  },
  
  // Navigation Events
  PAGE_VIEW: {
    action: 'page_view',
    category: 'navigation',
  },
  STEP_COMPLETED: {
    action: 'step_completed',
    category: 'calculator',
  },
  
  // User Preferences
  LANGUAGE_CHANGED: {
    action: 'language_changed',
    category: 'preferences',
  },
  THEME_CHANGED: {
    action: 'theme_changed',
    category: 'preferences',
  },
  
  // Engagement
  DASHBOARD_VIEWED: {
    action: 'dashboard_viewed',
    category: 'engagement',
  },
  CHART_INTERACTED: {
    action: 'chart_interacted',
    category: 'engagement',
  },
  
  // Legal
  PRIVACY_VIEWED: {
    action: 'privacy_policy_viewed',
    category: 'legal',
  },
  TERMS_VIEWED: {
    action: 'terms_of_service_viewed',
    category: 'legal',
  },
  COOKIES_ACCEPTED: {
    action: 'cookies_accepted',
    category: 'legal',
  },
  COOKIES_DECLINED: {
    action: 'cookies_declined',
    category: 'legal',
  },
} as const;

export const useAnalytics = () => {
  const location = useLocation();
  const { hasConsent } = useCookieConsent();

  // Track page views automatically
  useEffect(() => {
    if (hasConsent() && window.gtag) {
      const pagePath = location.pathname + location.search;
      
      // Send page view
      window.gtag('config', 'G-L17QT3GYL0', {
        page_path: pagePath,
        page_title: document.title,
      });

      // Track as custom event
      trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
        page_path: pagePath,
        page_title: document.title,
      });
    }
  }, [location, hasConsent]);

  // Main tracking function
  const trackEvent = (event: Partial<AnalyticsEvent>, customParams?: Record<string, any>) => {
    // Only track if user has given consent and gtag is available
    if (!hasConsent() || !window.gtag) {
      console.log('Analytics: Event not tracked - no consent or gtag unavailable', event);
      return;
    }

    try {
      window.gtag('event', event.action || 'unknown_action', {
        event_category: event.category || 'general',
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters,
        ...customParams,
      });

      // Log in development mode
      if (import.meta.env.DEV) {
        console.log('Analytics: Event tracked', {
          action: event.action,
          category: event.category,
          label: event.label,
          value: event.value,
          customParams,
        });
      }
    } catch (error) {
      console.error('Analytics: Error tracking event', error, event);
    }
  };

  // Convenience functions for common events
  const trackGPACalculation = (gpaType: 'unweighted' | 'weighted' | 'core', value: number) => {
    trackEvent(ANALYTICS_EVENTS.GPA_CALCULATED, {
      gpa_type: gpaType,
      gpa_value: Math.round(value * 100) / 100, // Round to 2 decimal places
    });
  };

  const trackExport = (type: 'pdf' | 'csv', subjectCount?: number) => {
    const event = type === 'pdf' ? ANALYTICS_EVENTS.PDF_EXPORTED : ANALYTICS_EVENTS.CSV_EXPORTED;
    trackEvent(event, {
      subject_count: subjectCount,
      export_timestamp: new Date().toISOString(),
    });
  };

  const trackUserPreference = (type: 'language' | 'theme', value: string) => {
    const event = type === 'language' ? ANALYTICS_EVENTS.LANGUAGE_CHANGED : ANALYTICS_EVENTS.THEME_CHANGED;
    trackEvent(event, {
      [type]: value,
    });
  };

  const trackCalculatorStep = (step: number, stepName: string) => {
    trackEvent(ANALYTICS_EVENTS.STEP_COMPLETED, {
      step_number: step,
      step_name: stepName,
    });
  };

  const trackSubjectAction = (action: 'added' | 'removed', subjectName?: string, subjectType?: string) => {
    const event = action === 'added' ? ANALYTICS_EVENTS.SUBJECT_ADDED : ANALYTICS_EVENTS.SUBJECT_REMOVED;
    trackEvent(event, {
      subject_name: subjectName,
      subject_type: subjectType,
    });
  };

  const trackChartInteraction = (chartType: string, action: string) => {
    trackEvent(ANALYTICS_EVENTS.CHART_INTERACTED, {
      chart_type: chartType,
      interaction_type: action,
    });
  };

  const trackLegalPageView = (page: 'privacy' | 'terms') => {
    const event = page === 'privacy' ? ANALYTICS_EVENTS.PRIVACY_VIEWED : ANALYTICS_EVENTS.TERMS_VIEWED;
    trackEvent(event);
  };

  const trackCookieConsent = (action: 'accepted' | 'declined') => {
    const event = action === 'accepted' ? ANALYTICS_EVENTS.COOKIES_ACCEPTED : ANALYTICS_EVENTS.COOKIES_DECLINED;
    trackEvent(event);
  };

  // Custom event tracking
  const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
    trackEvent({
      action: eventName,
      category: 'custom',
      custom_parameters: parameters,
    });
  };

  // Get analytics consent status
  const getAnalyticsStatus = () => {
    return {
      hasConsent: hasConsent(),
      gtagAvailable: typeof window.gtag === 'function',
      canTrack: hasConsent() && typeof window.gtag === 'function',
    };
  };

  return {
    // Core functions
    trackEvent,
    trackCustomEvent,
    getAnalyticsStatus,
    
    // Convenience functions
    trackGPACalculation,
    trackExport,
    trackUserPreference,
    trackCalculatorStep,
    trackSubjectAction,
    trackChartInteraction,
    trackLegalPageView,
    trackCookieConsent,
    
    // Event constants
    EVENTS: ANALYTICS_EVENTS,
  };
};