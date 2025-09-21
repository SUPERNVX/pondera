import { create } from 'zustand';
import type { StateCreator } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import type { Student, SubjectGrade, YearlyRecord, GPACalculation } from '../utils/gpaTypes';
import { calculateCumulativeGPA } from '../utils/gpaCalculator';
import { gradeToGPA } from '../utils/gradeUtils';
import { getSubjectsForYear, createSubjectGrades } from '../utils/defaultSubjects';

// Performance cache interface
interface PerformanceCache {
  gpaCalculations: Map<string, GPACalculation>;
  clearCache: () => void;
  getCachedCalculation: (key: string) => GPACalculation | null;
  setCachedCalculation: (key: string, calculation: GPACalculation) => void;
}

// Student slice interface
interface StudentSlice {
  student: Student;
  setStudent: (student: Student) => void;
}

// Configuration slice interface
interface ConfigSlice {
  gradingSystem: 'trimestral' | 'semestral' | 'annual';
  gradeScale: '0-10' | '0-100' | 'A-F' | 'conceitos';
  setGradingSystem: (system: 'trimestral' | 'semestral' | 'annual') => void;
  setGradeScale: (scale: '0-10' | '0-100' | 'A-F' | 'conceitos') => void;
}

// Academic records slice interface
interface AcademicSlice {
  yearlyRecords: YearlyRecord[];
  addYearlyRecord: (record: YearlyRecord) => void;
  updateYearlyRecord: (year: 1 | 2 | 3, subjects: SubjectGrade[]) => void;
  getYearlyRecord: (year: 1 | 2 | 3) => YearlyRecord | undefined;
  initializeDefaultSubjects: () => void;
}

// Navigation slice interface
interface NavigationSlice {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedYear: 1 | 2 | 3;
  setSelectedYear: (year: 1 | 2 | 3) => void;
}

// GPA calculation slice interface
interface GPASlice {
  gpaCalculation: GPACalculation | null;
  calculateGPA: () => void;
  isCalculating: boolean;
  setIsCalculating: (calculating: boolean) => void;
}

// Utility slice interface
interface UtilitySlice {
  reset: () => void;
  cache: PerformanceCache;
}

// Combined store interface
export interface GPAStore extends StudentSlice, ConfigSlice, AcademicSlice, NavigationSlice, GPASlice, UtilitySlice {}

// Student slice implementation
const createStudentSlice: StateCreator<GPAStore, [], [], StudentSlice> = (set) => ({
  student: {
    name: '',
    graduationYear: new Date().getFullYear() + 1
  },
  setStudent: (student) => set({ student })
});

// Configuration slice implementation
const createConfigSlice: StateCreator<GPAStore, [], [], ConfigSlice> = (set) => ({
  gradingSystem: 'trimestral',
  gradeScale: '0-10',
  setGradingSystem: (system) => set({ gradingSystem: system }),
  setGradeScale: (scale) => set({ gradeScale: scale })
});

// Academic records slice implementation
const createAcademicSlice: StateCreator<GPAStore, [], [], AcademicSlice> = (set, get) => ({
  yearlyRecords: [],
  addYearlyRecord: (record) => set((state) => ({
    yearlyRecords: [...state.yearlyRecords, record]
  })),
  updateYearlyRecord: (year, subjects) => {
    set((state) => ({
      yearlyRecords: state.yearlyRecords.map(record => 
        record.year === year ? { 
          ...record, 
          subjects: subjects.map(subjectGrade => ({
            ...subjectGrade,
            gpaPoints: gradeToGPA(subjectGrade.finalGrade)
          }))
        } : record
      )
    }));
    // Clear cache when academic data changes
    get().cache.clearCache();
  },
  getYearlyRecord: (year) => {
    const { yearlyRecords } = get();
    return yearlyRecords.find(record => record.year === year);
  },
  initializeDefaultSubjects: () => {
    const years: (1 | 2 | 3)[] = [1, 2, 3];
    const newRecords: YearlyRecord[] = years.map(year => ({
      year,
      subjects: createSubjectGrades(getSubjectsForYear(year)).map(subjectGrade => ({
        ...subjectGrade,
        gpaPoints: gradeToGPA(subjectGrade.finalGrade)
      }))
    }));
    
    set({ yearlyRecords: newRecords });
    // Clear cache when reinitializing
    get().cache.clearCache();
  }
});

// Navigation slice implementation
const createNavigationSlice: StateCreator<GPAStore, [], [], NavigationSlice> = (set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  selectedYear: 1,
  setSelectedYear: (year) => set({ selectedYear: year })
});

// GPA calculation slice implementation with caching
const createGPASlice: StateCreator<GPAStore, [], [], GPASlice> = (set, get) => ({
  gpaCalculation: null,
  isCalculating: false,
  setIsCalculating: (calculating) => set({ isCalculating: calculating }),
  calculateGPA: async () => {
    const { yearlyRecords, cache } = get();
    
    // Verificar se há pelo menos uma nota válida
    const hasValidGrades = yearlyRecords.some(record => 
      record.subjects.some(subject => subject.finalGrade > 0)
    );
    
    if (!hasValidGrades) {
      throw new Error('Nenhuma nota válida encontrada para calcular o GPA');
    }
    
    // Create cache key based on current academic data
    const cacheKey = JSON.stringify(yearlyRecords.map(r => ({ 
      year: r.year, 
      subjects: r.subjects.map(s => ({ id: s.subject.id, finalGrade: s.finalGrade })) 
    })));
    
    // Check cache first
    const cachedResult = cache.getCachedCalculation(cacheKey);
    if (cachedResult) {
      set({ gpaCalculation: cachedResult });
      return;
    }
    
    // Set loading state
    set({ isCalculating: true });
    
    try {
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const calculation = calculateCumulativeGPA(yearlyRecords);
      
      // Cache the result
      cache.setCachedCalculation(cacheKey, calculation);
      
      set({ gpaCalculation: calculation });
    } finally {
      set({ isCalculating: false });
    }
  }
});

// Utility slice implementation with cache
const createUtilitySlice: StateCreator<GPAStore, [], [], UtilitySlice> = (set, get) => ({
  cache: {
    gpaCalculations: new Map(),
    clearCache: () => {
      get().cache.gpaCalculations.clear();
    },
    getCachedCalculation: (key: string) => {
      const { cache } = get();
      return cache.gpaCalculations.get(key) || null;
    },
    setCachedCalculation: (key: string, calculation: GPACalculation) => {
      get().cache.gpaCalculations.set(key, calculation);
    }
  },
  reset: () => {
    get().cache.clearCache();
    const studentInitialState = createStudentSlice(set, get, undefined as unknown as never).student;
    const configInitialState = createConfigSlice(set, get, undefined as unknown as never);
    const academicInitialState = createAcademicSlice(set, get, undefined as unknown as never);
    const navigationInitialState = createNavigationSlice(set, get, undefined as unknown as never);
    const gpaInitialState = createGPASlice(set, get, undefined as unknown as never);

    set({
      student: studentInitialState,
      gradingSystem: configInitialState.gradingSystem,
      gradeScale: configInitialState.gradeScale,
      yearlyRecords: academicInitialState.yearlyRecords,
      currentStep: navigationInitialState.currentStep,
      selectedYear: navigationInitialState.selectedYear,
      gpaCalculation: gpaInitialState.gpaCalculation,
      isCalculating: gpaInitialState.isCalculating,
    });
  }
});

// Create the store with slices pattern, subscribeWithSelector, and persistence
const useGPAStore = create<GPAStore>()(  
  persist(
    subscribeWithSelector((...a) => ({
      ...createStudentSlice(...a),
      ...createConfigSlice(...a),
      ...createAcademicSlice(...a),
      ...createNavigationSlice(...a),
      ...createGPASlice(...a),
      ...createUtilitySlice(...a)
    })),
    {
      name: 'pondera-gpa-store',
      // Only persist essential data, not cache or calculations
      partialize: (state) => ({
        student: state.student,
        gradingSystem: state.gradingSystem,
        gradeScale: state.gradeScale,
        yearlyRecords: state.yearlyRecords,
        currentStep: state.currentStep,
        selectedYear: state.selectedYear
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // Clear cache on rehydration
        if (state?.cache) {
          state.cache.clearCache();
        }
      }
    }
  )
);

// Optimized selectors for performance
export const useStudent = () => useGPAStore(state => state.student);
export const useGradingConfig = () => useGPAStore(state => ({ 
  gradingSystem: state.gradingSystem, 
  gradeScale: state.gradeScale 
}));
export const useYearlyRecords = () => useGPAStore(state => state.yearlyRecords);
export const useCurrentStep = () => useGPAStore(state => state.currentStep);
export const useSelectedYear = () => useGPAStore(state => state.selectedYear);
export const useGPACalculation = () => useGPAStore(state => ({ 
  gpaCalculation: state.gpaCalculation, 
  isCalculating: state.isCalculating 
}));
export const useGPAActions = () => useGPAStore(state => ({
  setStudent: state.setStudent,
  setGradingSystem: state.setGradingSystem,
  setGradeScale: state.setGradeScale,
  updateYearlyRecord: state.updateYearlyRecord,
  setCurrentStep: state.setCurrentStep,
  setSelectedYear: state.setSelectedYear,
  calculateGPA: state.calculateGPA,
  initializeDefaultSubjects: state.initializeDefaultSubjects,
  reset: state.reset
}));

export default useGPAStore;