import React from 'react';
import { lightColors } from '../../styles/colors';
import { getGPAClassification } from '../../utils/gradeUtils';
import { getGPABadgeSizeStyles } from '../../lib/uiUtils';

interface GPABadgeProps {
  gpa: number;
  scale?: 4 | 10;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large';
  colors: typeof lightColors;
  variant?: 'default' | 'detailed';
}

const GPABadge: React.FC<GPABadgeProps> = ({
  gpa,
  scale = 4,
  showLabel = true,
  showIcon = true,
  size = 'medium',
  colors,
  variant = 'default'
}) => {
  // Convert GPA to 4.0 scale if needed
  const normalizedGPA = scale === 10 ? (gpa / 10) * 4 : gpa;
  
  const classification = getGPAClassification(normalizedGPA);
  const sizeStyles = getGPABadgeSizeStyles(size);

  if (variant === 'detailed') {
    return (
      <div style={{
        backgroundColor: classification.bgColor,
        border: `2px solid ${classification.color}`,
        borderRadius: '1rem',
        padding: '1rem',
        textAlign: 'center',
        minWidth: '150px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          {showIcon && (
            <span style={{ fontSize: '1.5rem' }}>
              {classification.icon}
            </span>
          )}
          <span style={{
            color: classification.color,
            fontSize: '2rem',
            fontWeight: 700
          }}>
            {normalizedGPA.toFixed(2)}
          </span>
        </div>
        
        <div style={{
          color: classification.color,
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '0.25rem'
        }}>
          {classification.label}
        </div>
        
        <div style={{
          color: colors.mutedForeground,
          fontSize: '0.8rem'
        }}>
          {classification.description}
        </div>
        
        {scale === 10 && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.25rem',
            backgroundColor: colors.mutedBackground,
            borderRadius: '0.25rem',
            fontSize: '0.7rem',
            color: colors.mutedForeground
          }}>
            Escala Original: {gpa.toFixed(1)}/10
          </div>
        )}
      </div>
    );
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      backgroundColor: classification.bgColor,
      color: classification.color,
      padding: sizeStyles.padding,
      borderRadius: '9999px',
      fontSize: sizeStyles.fontSize,
      fontWeight: 600,
      border: `1px solid ${classification.color}`,
      whiteSpace: 'nowrap'
    }}>
      {showIcon && (
        <span style={{ fontSize: sizeStyles.iconSize }}>
          {classification.icon}
        </span>
      )}
      <span style={{ fontSize: sizeStyles.gpaSize }}>
        {normalizedGPA.toFixed(2)}
      </span>
      {showLabel && (
        <span>
          {classification.label}
        </span>
      )}
    </span>
  );
};

export default GPABadge;
