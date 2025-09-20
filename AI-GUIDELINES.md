# 🤖 AI Development Guidelines for Pondera

## 📋 Project Overview

**Pondera** is a production-ready GPA calculator web application that converts Brazilian high school grades to the American GPA system. This document provides comprehensive guidelines for AI assistants working on future development sessions.

### 🎯 Project Status
- **Current Version:** 2.0.0 (Production Ready - 95%)
- **Architecture:** React 19 + TypeScript + Vite + Tailwind CSS
- **State Management:** Zustand
- **Deployment:** GitHub Pages ready
- **Build Status:** ✅ Functional (zero errors/warnings)

---

## 🏗️ Architecture Principles

### ✅ **DO - Established Patterns**

#### **Component Architecture**
```tsx
// Follow established component structure
src/
├── components/
│   ├── ui/              # Base UI components (Radix UI based)
│   ├── charts/          # Data visualization components
│   └── calculator/      # Calculator-specific components
├── pages/               # Main application pages
├── stores/              # Zustand state management
├── utils/               # Pure utility functions
└── lib/                 # Shared libraries and configs
```

#### **TypeScript Standards**
```tsx
// Always use proper TypeScript interfaces
interface ComponentProps {
  colors: ColorScheme;
  data: GPACalculation;
  onUpdate: (data: GPAData) => void;
}

// Use strict typing for state
interface GPAStore {
  gpaCalculation: GPACalculation | null;
  yearlyRecords: YearlyRecord[];
  student: StudentInfo;
}
```

#### **CSS Strategy**
```css
/* Prefer utility classes over inline styles */
.chart-container {
  border-radius: 1rem;
  padding: 1.5rem;
}

/* Only use inline styles for dynamic values */
style={{ backgroundColor: colors.background }}
```

### ❌ **DON'T - Anti-patterns**

#### **Avoid These Patterns**
- **Inline styles for static values** (use CSS classes instead)
- **Direct DOM manipulation** (use React patterns)
- **Hardcoded strings** (use i18n system)
- **Large component files** (split into smaller components)
- **Unused imports** (clean up regularly)

---

## 🎨 Design System Guidelines

### **Color Scheme Management**
```tsx
// Always use the colors prop for theming
const MyComponent = ({ colors }) => (
  <div style={{ backgroundColor: colors.background }}>
    <h1 style={{ color: colors.primary }}>Title</h1>
  </div>
);
```

### **Component Variants**
```tsx
// Use Class Variance Authority for consistent variants
import { cva } from "class-variance-authority";

const buttonVariants = cva("base-button-styles", {
  variants: {
    variant: {
      primary: "bg-primary text-white",
      secondary: "bg-secondary text-gray-700"
    }
  }
});
```

### **Responsive Design**
```css
/* Mobile-first approach */
.container {
  @apply w-full p-4;
}

@media (min-width: 768px) {
  .container {
    @apply p-6 max-w-4xl mx-auto;
  }
}
```

---

## 🌍 Internationalization Standards

### **Translation Usage**
```tsx
// Always use t() for user-facing strings
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('page_title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};
```

### **Adding New Translations**
```typescript
// src/i18n/i18n.ts - Add to both languages
const resources = {
  pt: {
    translation: {
      "new_key": "Texto em português",
    }
  },
  en: {
    translation: {
      "new_key": "Text in English",
    }
  }
};
```

---

## 📊 Data Management Patterns

### **Zustand Store Pattern**
```tsx
// Follow established store structure
interface StoreSlice {
  // State
  data: DataType[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchData: () => Promise<void>;
  updateData: (id: string, data: Partial<DataType>) => void;
  clearError: () => void;
}
```

### **GPA Calculation Flow**
```typescript
// Always use utility functions for calculations
import { calculateSubjectGradesAndGPA } from '../utils/gpaCalculator';

const processGPA = (yearlyRecords: YearlyRecord[]) => {
  const result = calculateSubjectGradesAndGPA(yearlyRecords);
  return {
    unweighted: result.unweighted,
    weighted: result.weighted,
    coreOnly: result.coreOnly
  };
};
```

---

## 🔧 Development Workflow

### **Before Making Changes**
1. **Run diagnostics:**
   ```bash
   npm run build  # Check for build errors
   npm run lint   # Check for code quality issues
   ```

2. **Check current state:**
   - Review existing component structure
   - Understand current functionality
   - Identify potential impacts

### **During Development**
1. **Follow incremental approach:**
   - Make small, focused changes
   - Test each change individually
   - Maintain backwards compatibility

2. **Quality checks:**
   - Ensure TypeScript compliance
   - Maintain CSS class usage over inline styles
   - Use established patterns

3. **Documentation:**
   - Update comments for complex logic
   - Document new patterns or exceptions
   - Maintain clear variable names

### **After Changes**
1. **Validation:**
   ```bash
   npm run build  # Ensure no build breaks
   npm run lint   # Verify code quality
   ```

2. **Testing recommendations:**
   - Test core functionality (GPA calculation)
   - Verify responsive design
   - Check theme switching
   - Validate i18n functionality

---

## 📈 Performance Guidelines

### **Bundle Optimization**
```typescript
// Vite config pattern for GitHub Pages
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/pondera/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-libs': ['recharts'],
          'three-libs': ['three', '@react-three/fiber'],
          // ... other strategic chunks
        }
      }
    }
  }
});
```

### **Component Optimization**
```tsx
// Use React.memo for expensive components
export const ChartComponent = React.memo(({ data, colors }) => {
  // Chart rendering logic
});

// Optimize re-renders with useMemo/useCallback
const processedData = useMemo(
  () => processChartData(rawData),
  [rawData]
);
```

---

## 🚨 Critical Areas - Handle With Care

### **1. GPA Calculation Logic**
- **Location:** `src/utils/gpaCalculator.ts`
- **Warning:** Core business logic - test thoroughly after changes
- **Pattern:** Always maintain backwards compatibility

### **2. State Management**
- **Location:** `src/stores/gpaStore.ts`
- **Warning:** Central data store - impacts entire app
- **Pattern:** Update state immutably

### **3. Export Functionality**
- **Location:** `src/utils/exportUtils.ts`
- **Warning:** Professional document generation
- **Pattern:** Test exports in multiple browsers

### **4. PWA Configuration**
- **Location:** `vite.config.ts`, `public/manifest.json`
- **Warning:** Affects app installation and offline functionality
- **Pattern:** Validate paths and configurations

---

## 🎯 Common Tasks & Patterns

### **Adding a New Page**
```tsx
// 1. Create page component
// src/pages/NewPage.tsx
const NewPage: React.FC<PageProps> = ({ colors }) => {
  const { t } = useTranslation();
  
  return (
    <div className="container">
      <h1 style={{ color: colors.primary }}>{t('new_page_title')}</h1>
    </div>
  );
};

// 2. Add translations
// src/i18n/i18n.ts
"new_page_title": "New Page Title"

// 3. Add routing if needed
// src/App.tsx or routing configuration
```

### **Adding a New Chart**
```tsx
// Follow established chart pattern
const NewChart: React.FC<ChartProps> = ({ data, colors }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip" style={{ /* colors */ }}>
          {/* tooltip content */}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container" style={{ /* colors */ }}>
      <h3 className="chart-title">{/* title */}</h3>
      <ResponsiveContainer>
        {/* Chart component */}
      </ResponsiveContainer>
    </div>
  );
};
```

### **CSS Optimization Task**
```typescript
// Step 1: Identify inline styles
grep -r "style={{" src/components/

// Step 2: Create CSS classes
// src/styles/global.css
.new-component-class {
  /* extracted styles */
}

// Step 3: Replace inline styles
<div className="new-component-class" style={{ /* only dynamic styles */ }}>
```

---

## 🔍 Quality Assurance Checklist

### **Code Quality**
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] No unused imports
- [ ] Consistent naming conventions
- [ ] Proper error handling

### **Functionality**
- [ ] GPA calculations accurate
- [ ] Export functionality working
- [ ] Theme switching functional
- [ ] Language switching working
- [ ] Mobile responsiveness maintained

### **Performance**
- [ ] Build time reasonable (< 15 seconds)
- [ ] Bundle size optimized
- [ ] No memory leaks in components
- [ ] Smooth animations and transitions

### **Accessibility**
- [ ] Proper ARIA labels
- [ ] Keyboard navigation functional
- [ ] Color contrast adequate
- [ ] Screen reader compatibility

---

## 📚 Resources & References

### **Documentation**
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

### **Project Files**
- **Main Configuration:** `vite.config.ts`, `tsconfig.json`
- **Styling:** `src/styles/global.css`, `src/styles/colors.ts`
- **State:** `src/stores/gpaStore.ts`, `src/stores/settingsStore.ts`
- **Utilities:** `src/utils/gpaCalculator.ts`, `src/utils/exportUtils.ts`

### **Build & Deploy**
```bash
# Development
npm run dev

# Production Build
npm run build

# Quality Checks
npm run lint
npm run type-check  # if available

# Deploy (GitHub Pages)
npm run build && git add dist && git commit -m "Deploy"
```

---

## 🚀 Future Development Priorities

### **Immediate (v2.1.0)**
1. **Performance Monitoring** - Analytics integration
2. **Advanced Loading States** - Skeleton components
3. **Error Boundaries** - Production error handling

### **Short-term (v2.2.0)**
1. **Advanced Animations** - Framer Motion enhancements
2. **Accessibility Improvements** - WCAG 2.1 AA compliance
3. **Mobile Optimizations** - Touch interactions

### **Long-term (v3.0.0)**
1. **Advanced Analytics** - Machine learning insights
2. **Multi-language Expansion** - Spanish, French support
3. **Collaboration Features** - Share and compare GPAs

---

## ⚠️ Important Notes

### **Production Considerations**
- Always test in production-like environment
- Verify GitHub Pages deployment configuration
- Ensure all images are in WebP format
- Validate PWA functionality across devices

### **Collaboration Guidelines**
- Document significant architectural decisions
- Maintain clear commit messages
- Update this guidelines document when patterns evolve
- Preserve backwards compatibility when possible

### **Emergency Procedures**
- If build breaks: revert to last working commit
- If performance degrades: check bundle analyzer
- If functionality breaks: test core GPA calculation first
- If deployment fails: verify vite.config.ts base path

---

**Version:** 2.0.0  
**Last Updated:** 2024-03-20  
**Maintainer:** AI Development System  
**Status:** Active and ready for production development