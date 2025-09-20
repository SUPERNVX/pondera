import type { SubjectGrade, YearlyGPA, GPACalculation, YearlyRecord } from './gpaTypes';
import { gradeToGPA } from './gradeUtils';

// Calculate weighted GPA for a single subject
export function calculateSubjectWeightedGPA(subjectGrade: SubjectGrade): number {
  let gpa = gradeToGPA(subjectGrade.finalGrade);
  
  // Apply bonuses for advanced levels
  if (subjectGrade.subject.level === 'honors') {
    gpa += 0.5;
  } else if (subjectGrade.subject.level === 'ap') {
    gpa += 1.0;
  }
  
  // Cap at 4.0 for unweighted, but allow higher for weighted
  return Math.max(gpa, 0); // Ensure non-negative
}

// Calculate GPA for a year
export function calculateYearlyGPA(subjects: SubjectGrade[]): YearlyGPA {
  let totalUnweightedPoints = 0;
  let totalWeightedPoints = 0;
  let totalCorePoints = 0;
  let totalCredits = 0;
  let totalCoreCredits = 0;
  
  subjects.forEach(subject => {
    const unweightedGPA = gradeToGPA(subject.finalGrade);
    const weightedGPA = calculateSubjectWeightedGPA(subject);
    
    totalUnweightedPoints += unweightedGPA * subject.subject.credits;
    totalWeightedPoints += weightedGPA * subject.subject.credits;
    totalCredits += subject.subject.credits;
    
    // Only count core subjects for core GPA
    if (subject.subject.type === 'core') {
      totalCorePoints += unweightedGPA * subject.subject.credits;
      totalCoreCredits += subject.subject.credits;
    }
  });
  
  return {
    year: 1 as const, // This will be set by the caller
    unweighted: totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0,
    weighted: totalCredits > 0 ? totalWeightedPoints / totalCredits : 0,
    coreOnly: totalCoreCredits > 0 ? totalCorePoints / totalCoreCredits : 0,
    totalCredits: totalCredits
  };
}

// Calculate cumulative GPA across all years
export function calculateCumulativeGPA(yearlyRecords: YearlyRecord[]): GPACalculation {
  let totalUnweightedPoints = 0;
  let totalWeightedPoints = 0;
  let totalCorePoints = 0;
  let totalCredits = 0;
  let totalCoreCredits = 0;
  const yearlyBreakdown: YearlyGPA[] = [];
  
  // Process each year
  yearlyRecords.forEach((record) => {
    const yearlyGPA = calculateYearlyGPA(record.subjects);
    yearlyGPA.year = record.year;
    yearlyBreakdown.push(yearlyGPA);

    // Accumulate for cumulative calculation
    totalUnweightedPoints += yearlyGPA.unweighted * yearlyGPA.totalCredits;
    totalWeightedPoints += yearlyGPA.weighted * yearlyGPA.totalCredits;
    totalCredits += yearlyGPA.totalCredits;

    // Correctly calculate core points and credits by iterating through subjects
    record.subjects.forEach(subject => {
      if (subject.subject.type === 'core') {
        const unweightedGPA = gradeToGPA(subject.finalGrade);
        totalCorePoints += unweightedGPA * subject.subject.credits;
        totalCoreCredits += subject.subject.credits;
      }
    });
  });
  
  return {
    unweighted: totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0,
    weighted: totalCredits > 0 ? totalWeightedPoints / totalCredits : 0,
    coreOnly: totalCoreCredits > 0 ? totalCorePoints / totalCoreCredits : 0,
    yearlyBreakdown,
    totalCredits,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Calculates the final grade (average) from a list of period grades.
 * @param grades An array of numerical grades for periods.
 * @returns The calculated final grade.
 */
export function calculateFinalGrade(grades: number[]): number {
  if (grades.length === 0) return 0;
  
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return sum / grades.length;
}

/**
 * Calculates the final grade and GPA points for a subject based on its period grades.
 * @param periodGrades An array of numerical grades for periods.
 * @returns An object containing the finalGrade and gpaPoints.
 */
export function calculateSubjectGradesAndGPA(periodGrades: number[]): { finalGrade: number; gpaPoints: number } {
  const finalGrade = calculateFinalGrade(periodGrades);
  const gpaPoints = gradeToGPA(finalGrade);
  return { finalGrade, gpaPoints };
}

export interface AnnualPerformanceMetrics {
  avgGrade: number;
  avgGPA: number;
  completedSubjectsCount: number;
  totalSubjectsCount: number;
  earnedCredits: number;
  totalCredits: number;
  excellentGrades: number;
  goodGrades: number;
  averageGrades: number;
  poorGrades: number;
  completionRate: number;
}

/**
 * Calculates annual performance metrics for a given yearly record.
 * @param record The YearlyRecord to calculate metrics for.
 * @returns An object containing various annual performance metrics.
 */
export function calculateAnnualPerformanceMetrics(record: YearlyRecord): AnnualPerformanceMetrics {
  const completedSubjects = record.subjects.filter(s => s.finalGrade > 0);
  const totalCredits = record.subjects.reduce((sum, s) => sum + s.subject.credits, 0);
  const earnedCredits = completedSubjects.reduce((sum, s) => sum + s.subject.credits, 0);
  const avgGrade = completedSubjects.length > 0 
    ? completedSubjects.reduce((sum, s) => sum + s.finalGrade, 0) / completedSubjects.length 
    : 0;
  const avgGPA = completedSubjects.length > 0 
    ? completedSubjects.reduce((sum, s) => sum + s.gpaPoints, 0) / completedSubjects.length 
    : 0;

  const excellentGrades = completedSubjects.filter(s => s.finalGrade >= 9).length;
  const goodGrades = completedSubjects.filter(s => s.finalGrade >= 7 && s.finalGrade < 9).length;
  const averageGrades = completedSubjects.filter(s => s.finalGrade >= 6 && s.finalGrade < 7).length;
  const poorGrades = completedSubjects.filter(s => s.finalGrade < 6).length;

  return {
    avgGrade,
    avgGPA,
    completedSubjectsCount: completedSubjects.length,
    totalSubjectsCount: record.subjects.length,
    earnedCredits,
    totalCredits,
    excellentGrades,
    goodGrades,
    averageGrades,
    poorGrades,
    completionRate: (completedSubjects.length / record.subjects.length) * 100
  };
}

export interface SubjectDistributionData {
  category: string;
  Principais?: number;
  Eletivas?: number;
  creditsCore?: number;
  creditsElective?: number;
  Regular?: number;
  Honras?: number;
  AP?: number;
  creditsRegular?: number;
  creditsHonors?: number;
  creditsAP?: number;
}

/**
 * Processes yearly records to generate data for subject distribution charts.
 * Aggregates average grades and credits by subject type (core/elective) and level (regular/honors/AP).
 * @param yearlyRecords The array of YearlyRecord objects.
 * @param selectedYear The year to filter by, or 'all' for all years.
 * @returns An array of SubjectDistributionData objects formatted for charting.
 */
export function processSubjectDistributionData(yearlyRecords: YearlyRecord[], selectedYear: number | 'all'): SubjectDistributionData[] {
  const records = selectedYear === 'all' ? yearlyRecords : yearlyRecords.filter(r => r.year === selectedYear);
    
  const subjectTypes = {
    'Principais': { total: 0, credits: 0, avgGrade: 0, count: 0 },
    'Eletivas': { total: 0, credits: 0, avgGrade: 0, count: 0 },
    'Regular': { total: 0, credits: 0, avgGrade: 0, count: 0 },
    'Honras': { total: 0, credits: 0, avgGrade: 0, count: 0 },
    'AP': { total: 0, credits: 0, avgGrade: 0, count: 0 }
  };

  records.forEach(record => {
    record.subjects.forEach(subjectGrade => {
      if (subjectGrade.finalGrade > 0) {
        // By type
        const typeKey = subjectGrade.subject.type === 'core' ? 'Principais' : 'Eletivas';
        subjectTypes[typeKey].total += subjectGrade.finalGrade;
        subjectTypes[typeKey].credits += subjectGrade.subject.credits;
        subjectTypes[typeKey].count += 1;

        // By level
        const levelKey = subjectGrade.subject.level === 'regular' ? 'Regular' : 
                        subjectGrade.subject.level === 'honors' ? 'Honras' : 'AP';
        subjectTypes[levelKey].total += subjectGrade.finalGrade;
        subjectTypes[levelKey].credits += subjectGrade.subject.credits;
        subjectTypes[levelKey].count += 1;
      }
    });
  });

  // Calculate averages
  Object.keys(subjectTypes).forEach(key => {
    const data = subjectTypes[key as keyof typeof subjectTypes];
    data.avgGrade = data.count > 0 ? data.total / data.count : 0;
  });

  return [
    {
      category: 'Por Tipo',
      'Principais': subjectTypes.Principais.avgGrade,
      'Eletivas': subjectTypes.Eletivas.avgGrade,
      creditsCore: subjectTypes.Principais.credits,
      creditsElective: subjectTypes.Eletivas.credits
    },
    {
      category: 'Por Nível',
      'Regular': subjectTypes.Regular.avgGrade,
      'Honras': subjectTypes.Honras.avgGrade,
      'AP': subjectTypes.AP.avgGrade,
      creditsRegular: subjectTypes.Regular.credits,
      creditsHonors: subjectTypes.Honras.credits,
      creditsAP: subjectTypes.AP.credits
    }
  ];
}