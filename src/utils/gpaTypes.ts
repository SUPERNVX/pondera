// Data structures for the GPA calculator

export interface Student {
  name: string;
  school?: string;
  graduationYear: number;
  studentId?: string;
}

export interface Subject {
  id: string;
  name: string;
  type: 'core' | 'elective';
  level: 'regular' | 'honors' | 'ap';
  credits: number;
}

export interface YearlyRecord {
  year: 1 | 2 | 3;
  subjects: SubjectGrade[];
}

export interface SubjectGrade {
  subject: Subject;
  grades: number[]; // by period
  finalGrade: number;
  gpaPoints: number;
}

export interface GPACalculation {
  unweighted: number;
  weighted: number;
  coreOnly: number;
  yearlyBreakdown: YearlyGPA[];
  totalCredits: number;
  calculatedAt: string;
}

export interface YearlyGPA {
  year: 1 | 2 | 3;
  unweighted: number;
  weighted: number;
  coreOnly: number;
  totalCredits: number;
}