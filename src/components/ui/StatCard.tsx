import React from 'react';
import { lightColors } from '../../styles/colors';
import { getStatCardVariantColors, getStatCardSizeStyles, getStatCardTrendIcon, getStatCardTrendColor } from '../../lib/uiUtils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  colors: typeof lightColors;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  colors,
  size = 'medium',
  variant = 'default'
}) => {
  const variantColors = getStatCardVariantColors(variant, colors);
  const sizeStyles = getStatCardSizeStyles(size);

  return (
    <div style={{
      backgroundColor: variantColors.bg,
      borderRadius: '1rem',
      border: variant === 'default' ? `1px solid ${colors.border}` : 'none',
      padding: sizeStyles.padding,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    className="fade-in"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
      }}>
        <h3 style={{
          color: variant === 'default' ? colors.mutedForeground : variantColors.text,
          fontSize: sizeStyles.fontSize,
          fontWeight: 500,
          margin: 0,
          opacity: 0.9
        }}>
          {title}
        </h3>
        {icon && (
          <span style={{ fontSize: '1.5rem' }}>
            {icon}
          </span>
        )}
      </div>
      
      <div style={{
        color: variantColors.text,
        fontSize: sizeStyles.valueSize,
        fontWeight: 700,
        marginBottom: subtitle || trend ? '0.5rem' : 0,
        lineHeight: 1.2
      }}>
        {value}
      </div>
      
      {subtitle && (
        <p style={{
          color: variant === 'default' ? colors.mutedForeground : variantColors.text,
          fontSize: '0.85rem',
          margin: 0,
          opacity: 0.8
        }}>
          {subtitle}
        </p>
      )}
      
      {trend && trendValue && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          marginTop: '0.5rem'
        }}>
          <span style={{ fontSize: '0.9rem' }}>
            {getStatCardTrendIcon(trend)}
          </span>
          <span style={{
            color: getStatCardTrendColor(trend, colors),
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
