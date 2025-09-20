import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme configuration interface
interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  chartTheme: 'default' | 'colorful' | 'monochrome' | 'pastel';
}

// GPA targets and goals
interface GPATargets {
  targetGPA: number;
  minimumGPA: number;
  dreamGPA: number;
  enableGoalTracking: boolean;
}

// Display preferences
interface DisplayPreferences {
  showDecimalPlaces: number;
  compactMode: boolean;
  showTrends: boolean;
  showProjections: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

// Notification settings
interface NotificationSettings {
  enableNotifications: boolean;
  goalReminders: boolean;
  calculationComplete: boolean;
  dataBackup: boolean;
}

// Export preferences
interface ExportSettings {
  defaultFormat: 'pdf' | 'csv' | 'xlsx';
  includeCharts: boolean;
  includeStatistics: boolean;
  logoUrl?: string;
  customHeader?: string;
}

// Performance settings
interface PerformanceSettings {
  enableCache: boolean;
  cacheDuration: number; // in minutes
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  enableDebouncing: boolean;
  debounceDelay: number; // in milliseconds
}

// Main settings interface
interface SettingsStore {
  theme: ThemeConfig;
  gpaTargets: GPATargets;
  display: DisplayPreferences;
  notifications: NotificationSettings;
  export: ExportSettings;
  performance: PerformanceSettings;
  
  // Actions
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateGPATargets: (targets: Partial<GPATargets>) => void;
  updateDisplayPreferences: (prefs: Partial<DisplayPreferences>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  updatePerformanceSettings: (settings: Partial<PerformanceSettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

// Default configurations
const defaultTheme: ThemeConfig = {
  mode: 'system',
  primaryColor: '#6366f1',
  accentColor: '#8b5cf6',
  chartTheme: 'default'
};

const defaultGPATargets: GPATargets = {
  targetGPA: 3.5,
  minimumGPA: 2.0,
  dreamGPA: 4.0,
  enableGoalTracking: true
};

const defaultDisplayPreferences: DisplayPreferences = {
  showDecimalPlaces: 2,
  compactMode: false,
  showTrends: true,
  showProjections: true,
  animationsEnabled: true,
  soundEnabled: false
};

const defaultNotificationSettings: NotificationSettings = {
  enableNotifications: true,
  goalReminders: true,
  calculationComplete: true,
  dataBackup: false
};

const defaultExportSettings: ExportSettings = {
  defaultFormat: 'pdf',
  includeCharts: true,
  includeStatistics: true
};

const defaultPerformanceSettings: PerformanceSettings = {
  enableCache: true,
  cacheDuration: 5,
  autoSave: true,
  autoSaveInterval: 30,
  enableDebouncing: true,
  debounceDelay: 1000
};

// Create the settings store
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      theme: defaultTheme,
      gpaTargets: defaultGPATargets,
      display: defaultDisplayPreferences,
      notifications: defaultNotificationSettings,
      export: defaultExportSettings,
      performance: defaultPerformanceSettings,

      updateTheme: (theme) => set((state) => ({
        theme: { ...state.theme, ...theme }
      })),

      updateGPATargets: (targets) => set((state) => ({
        gpaTargets: { ...state.gpaTargets, ...targets }
      })),

      updateDisplayPreferences: (prefs) => set((state) => ({
        display: { ...state.display, ...prefs }
      })),

      updateNotificationSettings: (settings) => set((state) => ({
        notifications: { ...state.notifications, ...settings }
      })),

      updateExportSettings: (settings) => set((state) => ({
        export: { ...state.export, ...settings }
      })),

      updatePerformanceSettings: (settings) => set((state) => ({
        performance: { ...state.performance, ...settings }
      })),

      resetToDefaults: () => set({
        theme: defaultTheme,
        gpaTargets: defaultGPATargets,
        display: defaultDisplayPreferences,
        notifications: defaultNotificationSettings,
        export: defaultExportSettings,
        performance: defaultPerformanceSettings
      }),

      exportSettings: () => {
        const state = get();
        return JSON.stringify({
          theme: state.theme,
          gpaTargets: state.gpaTargets,
          display: state.display,
          notifications: state.notifications,
          export: state.export,
          performance: state.performance
        }, null, 2);
      },

      importSettings: (settingsJson: string) => {
        try {
          const settings = JSON.parse(settingsJson);
          set({
            theme: { ...defaultTheme, ...settings.theme },
            gpaTargets: { ...defaultGPATargets, ...settings.gpaTargets },
            display: { ...defaultDisplayPreferences, ...settings.display },
            notifications: { ...defaultNotificationSettings, ...settings.notifications },
            export: { ...defaultExportSettings, ...settings.export },
            performance: { ...defaultPerformanceSettings, ...settings.performance }
          });
          return true;
        } catch (error) {
          console.error('Failed to import settings:', error);
          return false;
        }
      }
    }),
    {
      name: 'pondera-settings',
      version: 1
    }
  )
);

// Optimized selectors for specific settings
export const useThemeSettings = () => useSettingsStore(state => state.theme);
export const useGPATargets = () => useSettingsStore(state => state.gpaTargets);
export const useDisplaySettings = () => useSettingsStore(state => state.display);
export const useNotificationSettings = () => useSettingsStore(state => state.notifications);
export const useExportSettings = () => useSettingsStore(state => state.export);
export const usePerformanceSettings = () => useSettingsStore(state => state.performance);

// Actions selectors
export const useSettingsActions = () => useSettingsStore(state => ({
  updateTheme: state.updateTheme,
  updateGPATargets: state.updateGPATargets,
  updateDisplayPreferences: state.updateDisplayPreferences,
  updateNotificationSettings: state.updateNotificationSettings,
  updateExportSettings: state.updateExportSettings,
  updatePerformanceSettings: state.updatePerformanceSettings,
  resetToDefaults: state.resetToDefaults,
  exportSettings: state.exportSettings,
  importSettings: state.importSettings
}));

export default useSettingsStore;