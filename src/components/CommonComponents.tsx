import React from 'react';
import { lightColors } from '../styles/colors';
import { cn } from '../lib/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  colors: typeof lightColors;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, colors }) => (
  <h2 className={cn("section-title font-title", `text-[${colors.primary}]`)}>
    {children}
  </h2>
);

interface SectionSubtitleProps {
  children: React.ReactNode;
  colors: typeof lightColors;
}

export const SectionSubtitle: React.FC<SectionSubtitleProps> = ({ children, colors }) => (
  <p className={cn("section-subtitle", `text-[${colors.mutedForeground}]`)}>
    {children}
  </p>
);

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  colors: typeof lightColors;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, colors }) => (
  <div 
    className={cn(
      "feature-card",
      `bg-[${colors.background}]`,
      `border-[${colors.border}]`
    )}
  >
    <div className="feature-card-icon" style={{ color: colors.primary }}>
      {icon}
    </div>
    <h3 className={cn("feature-card-title font-title", `text-[${colors.text}]`)}>
      {title}
    </h3>
    <p className={cn("feature-card-description", `text-[${colors.mutedForeground}]`)}>
      {description}
    </p>
  </div>
);