import React from 'react';
import { lightColors } from '../../styles/colors';
import { calculateTrendData, getTrendIndicatorConfig, getTrendIndicatorSizeStyles } from '../../lib/uiUtils';

interface TrendIndicatorProps {
  value: number;
  previousValue?: number;
  label?: string;
  showPercentage?: boolean;
  showIcon?: boolean;
  colors: typeof lightColors;
  size?: 'small' | 'medium' | 'large';
  precision?: number;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  previousValue,
  label,
  showPercentage = true,
  showIcon = true,
  colors,
  size = 'medium',
  precision = 1
}) => {
  const trendData = calculateTrendData(value, previousValue);
  const trendConfig = getTrendIndicatorConfig(trendData.type, colors);
  const sizeStyles = getTrendIndicatorSizeStyles(size);

  const formatValue = (val: number) => {
    return val.toFixed(precision);
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      {label && (
        <span style={{
          color: colors.text,
          fontSize: sizeStyles.fontSize,
          fontWeight: 500
        }}>
          {label}:
        </span>
      )}
      
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        backgroundColor: trendConfig.bgColor,
        color: trendConfig.color,
        padding: sizeStyles.padding,
        borderRadius: '0.5rem',
        fontSize: sizeStyles.fontSize,
        fontWeight: 600,
        border: `1px solid ${trendConfig.color}30`
      }}>
        {showIcon && (
          <span style={{ fontSize: sizeStyles.iconSize }}>
            {trendConfig.icon}
          </span>
        )}
        
        <span>
          {formatValue(value)}
        </span>
        
        {previousValue !== undefined && trendData.type !== 'stable' && (
          <>
            <span style={{ fontSize: sizeStyles.iconSize }}>
              {trendConfig.arrow}
            </span>
            <span>
              {trendData.change > 0 ? '+' : ''}{formatValue(trendData.change)}
            </span>
            {showPercentage && (
              <span style={{ fontSize: '0.8em', opacity: 0.8 }}>
                ({trendData.percentage > 0 ? '+' : ''}{trendData.percentage.toFixed(1)}%)
              </span>
            )}
          </>
        )}
        
        {previousValue !== undefined && trendData.type === 'stable' && (
          <span style={{ fontSize: '0.8em', opacity: 0.8 }}>
            (sem mudança)
          </span>
        )}
      </div>
      
      {size === 'large' && previousValue !== undefined && (
        <div style={{
          fontSize: '0.7rem',
          color: colors.mutedForeground,
          marginLeft: '0.5rem'
        }}>
          Anterior: {formatValue(previousValue)}
        </div>
      )}
    </div>
  );
};

export default TrendIndicator;
