import React from 'react';
import { lightColors } from '../../styles/colors';
import { getProgressBarVariantColor, getProgressBarSizeHeight, getProgressBarVariantIcon } from '../../lib/uiUtils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  colors: typeof lightColors;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  striped?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  showValue = false,
  colors,
  size = 'medium',
  variant = 'default',
  animated = true,
  striped = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variantColor = getProgressBarVariantColor(variant, colors.primary);
  const sizeHeight = getProgressBarSizeHeight(size);
  const variantIcon = getProgressBarVariantIcon(percentage);

  return (
    <div style={{
      width: '100%',
      fontFamily: 'inherit'
    }}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{
            color: colors.text,
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            {label}
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {showValue && (
              <span style={{
                color: colors.mutedForeground,
                fontSize: '0.8rem'
              }}>
                {value}/{max}
              </span>
            )}
            {showPercentage && (
              <span style={{
                color: variantColor,
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                {percentage.toFixed(1)}% {variantIcon}
              </span>
            )}
          </div>
        </div>
      )}
      
      <div style={{
        width: '100%',
        height: sizeHeight,
        backgroundColor: colors.border,
        borderRadius: '9999px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: variantColor,
            borderRadius: 'inherit',
            transition: animated ? 'width 0.6s ease-in-out' : 'none',
            position: 'relative',
            backgroundImage: striped ? 
              'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)' : 
              'none',
            backgroundSize: striped ? '1rem 1rem' : 'auto',
            animation: striped && animated ? 'progress-stripes 1s linear infinite' : 'none'
          }}
        />
        
        {/* Glow effect for high values */}
        {percentage >= 80 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, transparent, ${variantColor}40, transparent)`,
            borderRadius: 'inherit',
            animation: 'progress-glow 2s ease-in-out infinite alternate'
          }} />
        )}
      </div>
      
      {/* Mini milestones */}
      {size !== 'small' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.25rem',
          fontSize: '0.7rem',
          color: colors.mutedForeground
        }}>
          <span>0</span>
          <span style={{ opacity: percentage >= 25 ? 1 : 0.5 }}>25%</span>
          <span style={{ opacity: percentage >= 50 ? 1 : 0.5 }}>50%</span>
          <span style={{ opacity: percentage >= 75 ? 1 : 0.5 }}>75%</span>
          <span>{max}</span>
        </div>
      )}
      
      <style>{`
        @keyframes progress-stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 1rem 0;
          }
        }
        
        @keyframes progress-glow {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
