// Utility functions for grade conversion

// Define a clear mapping for grade-to-GPA conversion
const gpaScaleMap = new Map<number, number>([
  [90, 4.0],
  [80, 3.0],
  [70, 2.0],
  [60, 1.0],
  [0, 0.0], // Base case for grades below 60
]);

export interface GPAClassification {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}

// Data-driven map for GPA classifications
const gpaClassificationMap = new Map<number, GPAClassification>([
  [3.7, { label: 'Excelente', color: '#10b981', bgColor: '#10b98120', icon: '🌟', description: 'Summa Cum Laude' }],
  [3.3, { label: 'Muito Bom', color: '#059669', bgColor: '#05966920', icon: '⭐', description: 'Magna Cum Laude' }],
  [3.0, { label: 'Bom', color: '#0d9488', bgColor: '#0d948820', icon: '✅', description: 'Cum Laude' }],
  [2.7, { label: 'Satisfatório', color: '#f59e0b', bgColor: '#f59e0b20', icon: '👍', description: 'Aprovado' }],
  [2.0, { label: 'Regular', color: '#d97706', bgColor: '#d9770620', icon: '⚠️', description: 'Precisa Melhorar' }],
  [0.0, { label: 'Insuficiente', color: '#ef4444', bgColor: '#ef444420', icon: '❌', description: 'Abaixo da Média' }],
]);

/**
 * Converts a numerical grade to the corresponding GPA point on a 4.0 scale.
 * @param grade The numerical grade.
 * @param scale The scale of the grade (e.g., 10 or 100). Defaults to 10.
 * @returns The GPA point (e.g., 4.0, 3.0).
 */
export function gradeToGPA(grade: number, scale: number = 10): number {
  const percentage = scale === 100 ? grade : (grade / scale) * 100;
  for (const [threshold, gpaPoint] of gpaScaleMap.entries()) {
    if (percentage >= threshold) {
      return gpaPoint;
    }
  }
  return 0.0;
}

/**
 * Returns the classification details for a given GPA on a 4.0 scale.
 * @param gpa The GPA value (0.0 to 4.0+).
 * @returns An object with classification details (label, color, icon, etc.).
 */
export function getGPAClassification(gpa: number): GPAClassification {
  for (const [threshold, classification] of gpaClassificationMap.entries()) {
    if (gpa >= threshold) {
      return classification;
    }
  }
  // Fallback to the lowest classification if no match is found (should not happen with a 0.0 threshold)
  return gpaClassificationMap.get(0.0)!;
}

/**
 * Validates a numerical grade based on the specified grade scale.
 * @param value The numerical grade to validate.
 * @param gradeScale The grading scale being used ('0-10' or '0-100').
 * @returns True if the grade is valid for the scale, false otherwise.
 */
export const validateGrade = (value: number, gradeScale: '0-10' | '0-100' | 'A-F' | 'conceitos'): boolean => {
  if (gradeScale === '0-10') {
    return value >= 0 && value <= 10;
  } else if (gradeScale === '0-100') {
    return value >= 0 && value <= 100;
  }
  // For non-numeric scales, or if scale is not 0-10/0-100, consider valid for now
  return true;
};