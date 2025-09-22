# 🎨 Pondera - Design Guidelines

## 📖 Overview

This document defines the comprehensive design system for **Pondera**, ensuring visual consistency, accessibility, and premium user experience across all components and interactions.

### 🎯 Design Philosophy
- **Educational Focus:** Clean, professional interface suitable for academic contexts
- **Modern Aesthetics:** Contemporary design with glassmorphism and subtle animations
- **Accessibility First:** WCAG 2.1 AA compliance with excellent contrast ratios
- **Performance Oriented:** Lightweight animations and optimized visual elements

---

## 🎨 Color System

### **Primary Color Palette**

#### Light Mode Colors
```css
--primary: #6e56cf;           /* Purple - Primary brand color */
--primary-foreground: #ffffff; /* White text on primary */
--secondary: #e4dfff;         /* Light purple - Secondary elements */
--secondary-foreground: #4a4080; /* Dark purple text */
--text: #2a2a4a;             /* Main text - Dark blue/purple */
--background: #ffffff;        /* Page background */
--border: #e4dfff;           /* Borders and dividers */
--muted-background: #f8f7ff;  /* Cards and containers */
--muted-foreground: #6b7280;  /* Secondary text - Gray */
```

#### Dark Mode Colors
```css
--primary: #a48fff;           /* Light purple - Adjusted for dark mode */
--primary-foreground: #0f0f1a; /* Dark navy text */
--secondary: #2d2b55;         /* Dark purple - Secondary elements */
--secondary-foreground: #c4c2ff; /* Light lavender text */
--text: #e2e2f5;             /* Light lavender/gray text */
--background: #0f0f1a;        /* Dark navy background */
--border: #2d2b55;           /* Dark purple borders */
--muted-background: #1a1a2e;  /* Darker navy containers */
--muted-foreground: #9ca3af;  /* Gray secondary text */
```

### **Semantic Colors**
```css
--success: #10b981;          /* Green - Success states */
--warning: #f59e0b;          /* Amber - Warning states */
--error: #ef4444;            /* Red - Error states */
--info: #3b82f6;             /* Blue - Information states */
```

### **Color Usage Guidelines**
- **Primary:** Call-to-action buttons, links, brand elements
- **Secondary:** Supporting elements, backgrounds, disabled states
- **Text:** Body text, headings (with hierarchy)
- **Muted:** Secondary information, placeholders, metadata
- **Semantic:** Status indicators, alerts, feedback messages

---

## 📝 Typography

### **Font Family**
```css
--font-primary: 'Glacial Indifference', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-display: 'GC Quick Gaseous', 'Glacial Indifference', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
```

### **Font Scale**
```css
--text-xs: 0.75rem;    /* 12px - Small labels, captions */
--text-sm: 0.875rem;   /* 14px - Secondary text, metadata */
--text-base: 1rem;     /* 16px - Body text, default */
--text-lg: 1.125rem;   /* 18px - Emphasis text */
--text-xl: 1.25rem;    /* 20px - Subtitle, card titles */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero titles */
```

### **Font Weights**
```css
--font-normal: 400;    /* Regular text */
--font-medium: 500;    /* Emphasis, labels */
--font-semibold: 600;  /* Headings, important text */
--font-bold: 700;      /* Strong emphasis */
```

### **Line Heights**
```css
--leading-tight: 1.25;  /* Headings */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.625; /* Long-form content */
```

---

## 🏗️ Layout System

### **Spacing Scale**
```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### **Border Radius**
```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Cards, inputs */
--radius-lg: 0.75rem;   /* 12px - Containers */
--radius-xl: 1rem;      /* 16px - Major sections */
--radius-2xl: 1.5rem;   /* 24px - Special elements */
--radius-full: 9999px;  /* Circular elements */
```

### **Container Widths**
```css
--container-sm: 640px;   /* Mobile landscape */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */
--container-2xl: 1536px; /* Extra large */
```

### **Breakpoints**
```css
--bp-sm: 640px;    /* Small devices */
--bp-md: 768px;    /* Medium devices */
--bp-lg: 1024px;   /* Large devices */
--bp-xl: 1280px;   /* Extra large devices */
--bp-2xl: 1536px;  /* 2X large devices */
```

---

## 🎭 Visual Effects

### **Shadows**
```css
/* Soft, subtle shadows for cards and elements */
--shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-soft-dark: 0 2px 8px rgba(0, 0, 0, 0.3);

/* Elevated elements like modals and dropdowns */
--shadow-elevated: 0 4px 16px rgba(0, 0, 0, 0.15);
--shadow-elevated-dark: 0 4px 16px rgba(0, 0, 0, 0.4);

/* Interactive elements on hover */
--shadow-interactive: 0 8px 32px rgba(110, 86, 207, 0.15);
--shadow-interactive-dark: 0 8px 32px rgba(164, 143, 255, 0.2);
```

### **Glassmorphism**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
}

.glass-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* Dark mode variations */
.dark .glass-card {
  background: rgba(42, 42, 74, 0.15);
  border: 1px solid rgba(164, 143, 255, 0.2);
}

.dark .glass-button {
  background: rgba(45, 43, 85, 0.2);
  border: 1px solid rgba(164, 143, 255, 0.3);
}
```

### **Gradients**
```css
/* Primary brand gradient */
--gradient-primary: linear-gradient(135deg, #6e56cf 0%, #a48fff 100%);

/* Subtle background gradients */
--gradient-background: linear-gradient(135deg, #ffffff 0%, #f8f7ff 100%);
--gradient-background-dark: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);

/* Interactive hover gradients */
--gradient-hover: linear-gradient(135deg, #5d47b8 0%, #8f73e6 100%);
```

---

## 🎬 Animation System

### **Timing Functions**
```css
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);     /* Fast start, slow end */
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);        /* Slow start, fast end */
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);  /* Balanced */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Spring effect */
```

### **Duration Scale**
```css
--duration-fast: 150ms;      /* Quick interactions */
--duration-normal: 300ms;    /* Standard transitions */
--duration-slow: 500ms;      /* Emphasis transitions */
--duration-slower: 700ms;    /* Page transitions */
```

### **Common Animations**

#### **Fade In/Out**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

#### **Slide Animations**
```css
@keyframes slideInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes slideInRight {
  from { 
    opacity: 0; 
    transform: translateX(-20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}
```

#### **Scale Animations**
```css
@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

/* Hover scale effect */
.hover-scale {
  transition: transform var(--duration-fast) var(--ease-out);
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

#### **Loading Animations**
```css
/* Hourglass rotation */
@keyframes hourglassRotate {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}

/* Sand falling effect */
@keyframes sandFall {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

/* Pulse effect for loading states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### **Micro-interactions**
```css
/* Button press effect */
.button-press {
  transition: transform var(--duration-fast) var(--ease-out);
}

.button-press:active {
  transform: scale(0.98);
}

/* Input focus effect */
.input-focus {
  transition: all var(--duration-normal) var(--ease-out);
}

.input-focus:focus {
  transform: translateY(-2px);
  box-shadow: var(--shadow-interactive);
}
```

---

## 🧩 Component Design Patterns

### **Buttons**

#### **Primary Button**
```css
.btn-primary {
  background: var(--gradient-primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  transition: all var(--duration-normal) var(--ease-out);
  box-shadow: var(--shadow-soft);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-interactive);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### **Secondary Button**
```css
.btn-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-medium);
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-secondary:hover {
  background: var(--primary);
  color: var(--primary-foreground);
  transform: translateY(-2px);
}
```

#### **Glass Button**
```css
.btn-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: var(--text);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-6);
  transition: all var(--duration-normal) var(--ease-out);
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}
```

### **Cards**

#### **Standard Card**
```css
.card {
  background: var(--muted-background);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-soft);
  transition: all var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elevated);
}
```

#### **Glass Card**
```css
.card-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--duration-normal) var(--ease-out);
}

.card-glass:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}
```

### **Inputs**

#### **Text Input**
```css
.input {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  color: var(--text);
  transition: all var(--duration-normal) var(--ease-out);
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(110, 86, 207, 0.1);
  transform: translateY(-1px);
}

.input::placeholder {
  color: var(--muted-foreground);
}
```

### **Progress Indicators**

#### **Progress Bar**
```css
.progress {
  background: var(--muted-background);
  border-radius: var(--radius-full);
  height: 8px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  background: var(--gradient-primary);
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## 📊 Chart Design System

### **Color Palette for Data Visualization**
```javascript
const chartColors = {
  primary: ['#6e56cf', '#a48fff', '#c4b3ff'],
  sequential: [
    '#f8f7ff', '#e4dfff', '#c4b3ff', 
    '#a48fff', '#8f73e6', '#7a5bd0', 
    '#6e56cf', '#5d47b8', '#4a3894'
  ],
  categorical: [
    '#6e56cf', // Purple (excellent grades)
    '#10b981', // Green (good grades)  
    '#f59e0b', // Amber (regular grades)
    '#ef4444', // Red (insufficient grades)
    '#3b82f6', // Blue (additional data)
    '#8b5cf6', // Violet (special categories)
  ],
  status: {
    excellent: '#10b981',
    good: '#22c55e',
    regular: '#f59e0b',
    insufficient: '#ef4444',
    neutral: '#6b7280'
  }
};
```

### **Chart Typography**
```css
.chart-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--primary);
  margin-bottom: var(--space-4);
  text-align: center;
}

.chart-subtitle {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
  text-align: center;
  margin-bottom: var(--space-6);
}

.chart-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text);
}

.chart-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text);
}
```

### **Tooltip Design**
```css
.chart-tooltip {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-elevated);
  backdrop-filter: blur(10px);
  max-width: 250px;
}

.chart-tooltip-title {
  font-weight: var(--font-semibold);
  color: var(--text);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}

.chart-tooltip-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--space-1) 0;
  font-size: var(--text-xs);
}

.chart-tooltip-footer {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--border);
  font-size: var(--text-xs);
  color: var(--muted-foreground);
}
```

---

## 🌙 Dark Mode Guidelines

### **Theme Switching**
```css
/* Root theme variables */
:root {
  --theme-transition: all 0.3s ease;
}

/* Theme toggle animation */
@keyframes themeTransition {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Dark mode styles */
[data-theme="dark"] {
  color-scheme: dark;
}

[data-theme="dark"] * {
  border-color: var(--border);
  transition: var(--theme-transition);
}
```

### **Theme Toggle Component**
```css
.theme-toggle {
  background: var(--muted-background);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  padding: var(--space-2);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.theme-toggle:hover {
  background: var(--primary);
  color: var(--primary-foreground);
  transform: scale(1.1);
}

/* Sun/Moon icons with glow effects */
.theme-icon-sun {
  color: #ffd700;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
}

.theme-icon-moon {
  color: #8b5cf6;
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.5));
}
```

---

## 📱 Responsive Design Patterns

### **Mobile-First Approach**
```css
/* Base styles (mobile) */
.container {
  padding: var(--space-4);
  width: 100%;
}

.grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

/* Tablet breakpoint */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
    max-width: var(--container-md);
    margin: 0 auto;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

/* Desktop breakpoint */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
    max-width: var(--container-lg);
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}
```

### **Touch-Friendly Design**
```css
/* Minimum touch target size */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Larger spacing on mobile */
@media (max-width: 768px) {
  .button {
    padding: var(--space-4) var(--space-6);
    font-size: var(--text-lg);
  }
  
  .input {
    padding: var(--space-4);
    font-size: var(--text-lg);
  }
}
```

---

## ♿ Accessibility Guidelines

### **Focus States**
```css
.focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove default outline, add custom */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### **Color Contrast**
- **Minimum contrast ratio:** 4.5:1 for normal text
- **Large text contrast:** 3:1 for 18px+ or 14px+ bold
- **Interactive elements:** 3:1 against adjacent colors

### **Typography Accessibility**
```css
/* Ensure readable line heights */
.text-content {
  line-height: var(--leading-normal);
  max-width: 65ch; /* Optimal reading width */
}

/* Responsive font sizes */
@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 18px;
  }
}
```

---

## 🎮 Interactive Elements

### **Hover Effects**
```css
.interactive {
  transition: all var(--duration-normal) var(--ease-out);
  cursor: pointer;
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-interactive);
}

.interactive:active {
  transform: translateY(0);
  transition-duration: var(--duration-fast);
}
```

### **Loading States**
```css
.loading {
  opacity: 0.7;
  pointer-events: none;
  position: relative;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid var(--primary);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

---

## 🔧 Implementation Guidelines

### **CSS Custom Properties Usage**
```css
/* Always use CSS custom properties for theme values */
.component {
  background: var(--background);
  color: var(--text);
  border: 1px solid var(--border);
}

/* Avoid hardcoded values */
.component-bad {
  background: #ffffff; /* ❌ Don't do this */
  color: #2a2a4a;     /* ❌ Not theme-aware */
}
```

### **Component Structure**
```tsx
// Consistent component props structure
interface ComponentProps {
  colors?: typeof lightColors;
  className?: string;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
```

### **Animation Performance**
```css
/* Use transform and opacity for smooth animations */
.animate-efficient {
  transform: translateY(0);
  opacity: 1;
  transition: transform var(--duration-normal) var(--ease-out),
              opacity var(--duration-normal) var(--ease-out);
}

/* Avoid animating layout properties */
.animate-expensive {
  height: auto; /* ❌ Causes layout recalculation */
  width: auto;  /* ❌ Causes layout recalculation */
}
```

---

## 📋 Component Checklist

### **Before Creating a New Component:**
- [ ] Does it follow the established color system?
- [ ] Are hover/focus states implemented?
- [ ] Is it responsive across all breakpoints?
- [ ] Does it support both light and dark themes?
- [ ] Are animations performant (transform/opacity only)?
- [ ] Is it accessible (ARIA labels, keyboard navigation)?
- [ ] Does it use consistent spacing from the scale?
- [ ] Are prop interfaces typed correctly?

### **Quality Assurance:**
- [ ] Test in both light and dark modes
- [ ] Verify on mobile, tablet, and desktop
- [ ] Check with keyboard navigation only
- [ ] Validate color contrast ratios
- [ ] Test with screen reader (if applicable)
- [ ] Ensure smooth animations (60fps)
- [ ] Verify loading and error states

---

## 🌟 Special Effects

### **PixelBlast Background**
```css
.pixel-blast-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.pixel-blast-interactive {
  pointer-events: auto;
}
```

### **Glassmorphism Cards**
```css
.glass-morphism {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}
```

### **Particle Effects**
- Used sparingly for celebration states
- Performance-optimized with requestAnimationFrame
- Configurable density based on device capabilities

---

**Version:** 2.1.0  
**Last Updated:** 2024-03-21  
**Status:** Complete and Production Ready  

*This design system ensures visual consistency, accessibility, and premium user experience across the entire Pondera application.*