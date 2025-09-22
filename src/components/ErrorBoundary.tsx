import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { lightColors } from '../styles/colors';

interface ErrorBoundaryProps {
  children: ReactNode;
  colors?: typeof lightColors;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Error Fallback Component
const ErrorFallback: React.FC<{ 
  error: Error | null; 
  errorInfo: React.ErrorInfo | null;
  colors: typeof lightColors;
  onReset: () => void;
}> = ({ error, errorInfo, colors, onReset }) => {
  const { t } = useTranslation();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      color: colors.text,
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: colors.mutedBackground,
        borderRadius: '1rem',
        padding: '2rem',
        border: `2px solid #ef4444`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        
        <h1 style={{ 
          color: '#ef4444', 
          fontSize: '1.5rem', 
          marginBottom: '1rem',
          fontWeight: 600
        }}>
          {t('error_boundary_title')}
        </h1>
        
        <p style={{ 
          color: colors.mutedForeground, 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {t('error_boundary_description')}
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details style={{
            backgroundColor: colors.background,
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
            border: `1px solid ${colors.border}`
          }}>
            <summary style={{ 
              cursor: 'pointer', 
              fontWeight: 600,
              color: colors.primary,
              marginBottom: '0.5rem'
            }}>
              {t('technical_details')}
            </summary>
            <div style={{
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              color: colors.mutedForeground,
              whiteSpace: 'pre-wrap',
              marginTop: '0.5rem'
            }}>
              <strong>Error:</strong> {error.message}
              {error.stack && (
                <>
                  <br /><br />
                  <strong>Stack Trace:</strong>
                  <br />{error.stack}
                </>
              )}
              {errorInfo?.componentStack && (
                <>
                  <br /><br />
                  <strong>Component Stack:</strong>
                  <br />{errorInfo.componentStack}
                </>
              )}
            </div>
          </details>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={onReset}
            style={{
              backgroundColor: colors.primary,
              color: colors.primaryForeground,
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🔄 {t('try_again')}
          </button>
          
          <button
            onClick={() => window.location.href = '/pondera/'}
            style={{
              backgroundColor: colors.secondary,
              color: colors.secondaryForeground,
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🏠 {t('back_to_home')}
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: colors.background,
          borderRadius: '0.5rem',
          border: `1px solid ${colors.border}`,
          fontSize: '0.875rem',
          color: colors.mutedForeground
        }}>
          <p><strong>{t('error_boundary_help')}:</strong></p>
          <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>{t('refresh_page')}</li>
            <li>{t('clear_browser_data')}</li>
            <li>{t('try_different_browser')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Send error to logging service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // TODO: Implement error logging service
    // For now, we'll just log to console
    console.error('Production Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          colors={this.props.colors || lightColors}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;