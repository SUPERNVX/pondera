import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useGPAStore, { 
  useStudent, 
  useGradingConfig, 
  useYearlyRecords, 
  useCurrentStep, 
  useSelectedYear, 
  useGPACalculation,
  useGPAActions 
} from '../stores/gpaStore';

// Hook for optimized year record selection
export const useOptimizedYearRecord = (year: 1 | 2 | 3) => {
  return useGPAStore(
    useCallback(
      (state) => state.yearlyRecords.find(record => record.year === year),
      [year]
    )
  );
};

// Hook for filtered subjects with memoization
export const useFilteredSubjects = (year: 1 | 2 | 3, searchTerm: string = '') => {
  const yearRecord = useOptimizedYearRecord(year);
  
  return useMemo(() => {
    if (!yearRecord || !searchTerm) return yearRecord?.subjects || [];
    
    return yearRecord.subjects.filter(subjectGrade =>
      subjectGrade.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [yearRecord, searchTerm]);
};

// Hook for year statistics with shallow comparison
export const useYearStatistics = (year: 1 | 2 | 3) => {
  return useGPAStore(
    useShallow((state) => {
      const yearRecord = state.yearlyRecords.find(record => record.year === year);
      if (!yearRecord) {
        return {
          totalSubjects: 0,
          completedSubjects: 0,
          averageGrade: 0,
          progressPercentage: 0
        };
      }

      const totalSubjects = yearRecord.subjects.length;
      const completedSubjects = yearRecord.subjects.filter(s => s.finalGrade > 0).length;
      const validGrades = yearRecord.subjects.filter(s => s.finalGrade > 0);
      const averageGrade = validGrades.length > 0 
        ? validGrades.reduce((sum, s) => sum + s.finalGrade, 0) / validGrades.length 
        : 0;
      const progressPercentage = totalSubjects > 0 
        ? Math.round((completedSubjects / totalSubjects) * 100) 
        : 0;

      return {
        totalSubjects,
        completedSubjects,
        averageGrade,
        progressPercentage
      };
    })
  );
};

// Hook for all years statistics
export const useAllYearsStatistics = () => {
  return useGPAStore(
    useShallow((state) => {
      return [1, 2, 3].map(year => {
        const yearRecord = state.yearlyRecords.find(record => record.year === year);
        if (!yearRecord) {
          return { year, completedCount: 0, totalCount: 0 };
        }

        const completedCount = yearRecord.subjects.filter(s => s.finalGrade > 0).length;
        const totalCount = yearRecord.subjects.length;

        return { year, completedCount, totalCount };
      });
    })
  );
};

// Hook for performance indicators
export const usePerformanceIndicators = () => {
  return useGPAStore(
    useShallow((state) => {
      const allSubjects = state.yearlyRecords.flatMap(record => record.subjects);
      const completedSubjects = allSubjects.filter(s => s.finalGrade > 0);
      
      if (completedSubjects.length === 0) {
        return {
          overallAverage: 0,
          totalCompleted: 0,
          totalSubjects: allSubjects.length,
          trend: 'stable' as const
        };
      }

      const overallAverage = completedSubjects.reduce((sum, s) => sum + s.finalGrade, 0) / completedSubjects.length;
      
      // Calculate trend based on year progression
      const yearAverages = [1, 2, 3].map(year => {
        const yearSubjects = completedSubjects.filter(s => 
          state.yearlyRecords.find(r => r.year === year)?.subjects.includes(s)
        );
        return yearSubjects.length > 0 
          ? yearSubjects.reduce((sum, s) => sum + s.finalGrade, 0) / yearSubjects.length 
          : 0;
      });

      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (yearAverages[2] > yearAverages[1] && yearAverages[1] > yearAverages[0]) {
        trend = 'improving';
      } else if (yearAverages[2] < yearAverages[1] && yearAverages[1] < yearAverages[0]) {
        trend = 'declining';
      }

      return {
        overallAverage,
        totalCompleted: completedSubjects.length,
        totalSubjects: allSubjects.length,
        trend
      };
    })
  );
};

// Hook for debounced GPA calculation
export const useDebouncedGPACalculation = () => {
  const { calculateGPA } = useGPAActions();
  const { gpaCalculation, isCalculating } = useGPACalculation();

  const debouncedCalculate = useCallback(
    () => {
      const fn = debounce(() => {
        calculateGPA();
      }, 1000);
      return fn;
    },
    [calculateGPA]
  )();

  return {
    gpaCalculation,
    isCalculating,
    debouncedCalculate
  };
};

// Utility function for debouncing
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
}

// Export all optimized selectors
export {
  useStudent,
  useGradingConfig,
  useYearlyRecords,
  useCurrentStep,
  useSelectedYear,
  useGPACalculation,
  useGPAActions
};