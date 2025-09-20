export interface GPABadgeSizeStyles {
  padding: string;
  fontSize: string;
  gpaSize: string;
  iconSize: string;
}

export const getGPABadgeSizeStyles = (size: 'small' | 'medium' | 'large'): GPABadgeSizeStyles => {
  switch (size) {
    case 'small':
      return {
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        gpaSize: '0.9rem',
        iconSize: '0.8rem'
      };
    case 'large':
      return {
        padding: '0.75rem 1.5rem',
        fontSize: '1.1rem',
        gpaSize: '1.5rem',
        iconSize: '1.3rem'
      };
    default:
      return {
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        gpaSize: '1.2rem',
        iconSize: '1rem'
      };
  }
};

// For ProgressBar component
export const getProgressBarVariantColor = (variant: 'default' | 'success' | 'warning' | 'danger', primaryColor: string): string => {
  switch (variant) {
    case 'success':
      return '#10b981';
    case 'warning':
      return '#f59e0b';
    case 'danger':
      return '#ef4444';
    default:
      return primaryColor;
  }
};

export const getProgressBarSizeHeight = (size: 'small' | 'medium' | 'large'): string => {
  switch (size) {
    case 'small':
      return '6px';
    case 'large':
      return '16px';
    default:
      return '10px';
  }
};

export const getProgressBarVariantIcon = (percentage: number): string => {
  if (percentage >= 90) return '🌟';
  if (percentage >= 75) return '✅';
  if (percentage >= 50) return '⚡';
  if (percentage >= 25) return '⚠️';
  return '🔴';
};

// For StatCard component
export const getStatCardVariantColors = (variant: 'default' | 'primary' | 'success' | 'warning' | 'danger', colors: { primary: string; primaryForeground: string; background: string; text: string; }) => {
  switch (variant) {
    case 'primary':
      return { bg: colors.primary, text: colors.primaryForeground };
    case 'success':
      return { bg: '#10b981', text: 'white' };
    case 'warning':
      return { bg: '#f59e0b', text: 'white' };
    case 'danger':
      return { bg: '#ef4444', text: 'white' };
    default:
      return { bg: colors.background, text: colors.text };
  }
};

export const getStatCardSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return { padding: '1rem', fontSize: '0.9rem', valueSize: '1.5rem' };
    case 'large':
      return { padding: '2rem', fontSize: '1.1rem', valueSize: '3rem' };
    default:
      return { padding: '1.5rem', fontSize: '1rem', valueSize: '2.5rem' };
  }
};

export const getStatCardTrendIcon = (trend: 'up' | 'down' | 'stable' | undefined) => {
  switch (trend) {
    case 'up':
      return '📈';
    case 'down':
      return '📉';
    case 'stable':
      return '➡️';
    default:
      return '';
  }
};

export const getStatCardTrendColor = (trend: 'up' | 'down' | 'stable' | undefined, colors: { mutedForeground: string; }) => {
  switch (trend) {
    case 'up':
      return '#10b981';
    case 'down':
      return '#ef4444';
    case 'stable':
      return colors.mutedForeground;
    default:
      return colors.mutedForeground;
  }
};

// For TrendIndicator component
export interface TrendData {
  type: 'up' | 'down' | 'stable';
  change: number;
  percentage: number;
}

export const calculateTrendData = (value: number, previousValue?: number): TrendData => {
  if (previousValue === undefined || previousValue === 0) {
    return { type: 'stable', change: 0, percentage: 0 };
  }

  const change = value - previousValue;
  const percentage = (change / previousValue) * 100;
  
  if (Math.abs(change) < 0.01) { // Consider very small changes as stable
    return { type: 'stable', change: 0, percentage: 0 };
  }
  
  return {
    type: change > 0 ? 'up' : 'down',
    change,
    percentage
  };
};

export interface TrendConfig {
  color: string;
  bgColor: string;
  icon: string;
  arrow: string;
  label: string;
}

export const getTrendIndicatorConfig = (type: 'up' | 'down' | 'stable', colors: { mutedForeground: string; mutedBackground: string; }) => {
  switch (type) {
    case 'up':
      return {
        color: '#10b981',
        bgColor: '#10b98120',
        icon: '📈',
        arrow: '↗️',
        label: 'Melhoria'
      };
    case 'down':
      return {
        color: '#ef4444',
        bgColor: '#ef444420',
        icon: '📉',
        arrow: '↘️',
        label: 'Declínio'
      };
    default:
      return {
        color: colors.mutedForeground,
        bgColor: colors.mutedBackground,
        icon: '➡️',
        arrow: '→',
        label: 'Estável'
      };
  }
};

export interface TrendIndicatorSizeStyles {
  padding: string;
  fontSize: string;
  iconSize: string;
}

export const getTrendIndicatorSizeStyles = (size: 'small' | 'medium' | 'large'): TrendIndicatorSizeStyles => {
  switch (size) {
    case 'small':
      return {
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        iconSize: '0.8rem'
      };
    case 'large':
      return {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        iconSize: '1.2rem'
      };
    default:
      return {
        padding: '0.5rem 0.75rem',
        fontSize: '0.85rem',
        iconSize: '1rem'
      };
  }
};