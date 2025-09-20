import type { Subject, SubjectGrade } from './gpaTypes';
import { gradeToGPA } from './gradeUtils';

// Base list of core subjects, without year-specific IDs
const coreSubjectTemplates: Omit<Subject, 'id'>[] = [
  { name: 'Língua Portuguesa', type: 'core', level: 'regular', credits: 1 },
  { name: 'Matemática', type: 'core', level: 'regular', credits: 1 },
  { name: 'História', type: 'core', level: 'regular', credits: 1 },
  { name: 'Geografia', type: 'core', level: 'regular', credits: 1 },
  { name: 'Física', type: 'core', level: 'regular', credits: 1 },
  { name: 'Química', type: 'core', level: 'regular', credits: 1 },
  { name: 'Biologia', type: 'core', level: 'regular', credits: 1 },
  { name: 'Língua Inglesa', type: 'core', level: 'regular', credits: 1 },
  { name: 'Educação Física', type: 'core', level: 'regular', credits: 1 },
  { name: 'Artes', type: 'core', level: 'regular', credits: 1 },
  { name: 'Filosofia', type: 'core', level: 'regular', credits: 1 },
  { name: 'Sociologia', type: 'core', level: 'regular', credits: 1 },
];

// Elective and Advanced Placement (AP) subjects
const otherSubjects: Subject[] = [
  { id: 'espanhol', name: 'Língua Espanhola', type: 'elective', level: 'regular', credits: 1 },
  { id: 'frances', name: 'Língua Francesa', type: 'elective', level: 'regular', credits: 1 },
  { id: 'alemao', name: 'Língua Alemã', type: 'elective', level: 'regular', credits: 1 },
  { id: 'italiano', name: 'Língua Italiana', type: 'elective', level: 'regular', credits: 1 },
  { id: 'empreendedorismo', name: 'Empreendedorismo', type: 'elective', level: 'regular', credits: 1 },
  { id: 'robotica', name: 'Robótica', type: 'elective', level: 'regular', credits: 1 },
  { id: 'teatro', name: 'Teatro', type: 'elective', level: 'regular', credits: 1 },
  { id: 'musica', name: 'Música', type: 'elective', level: 'regular', credits: 1 },
  { id: 'matematica-ap', name: 'Matemática (AP)', type: 'core', level: 'ap', credits: 1 },
  { id: 'fisica-ap', name: 'Física (AP)', type: 'core', level: 'ap', credits: 1 },
  { id: 'quimica-ap', name: 'Química (AP)', type: 'core', level: 'ap', credits: 1 },
  { id: 'biologia-ap', name: 'Biologia (AP)', type: 'core', level: 'ap', credits: 1 },
  { id: 'historia-ap', name: 'História (AP)', type: 'core', level: 'ap', credits: 1 },
  { id: 'ingles-ap', name: 'Língua Inglesa (AP)', type: 'core', level: 'ap', credits: 1 },
];

/**
 * Dynamically generates the full list of default subjects for all three years.
 * This avoids repetition and makes the subject list easier to maintain.
 */
const generateAllDefaultSubjects = (): Subject[] => {
  const allSubjects: Subject[] = [];
  const years: (1 | 2 | 3)[] = [1, 2, 3];

  years.forEach(year => {
    coreSubjectTemplates.forEach(template => {
      allSubjects.push({
        ...template,
        id: `${year}-${template.name.toLowerCase().replace(/ /g, '-')}`,
      });
    });
  });

  return allSubjects.concat(otherSubjects);
};

export const defaultSubjects: Subject[] = generateAllDefaultSubjects();

/**
 * Gets a filtered list of subjects for a specific high school year.
 * Includes all core subjects for that year, plus all elective and AP subjects.
 * @param year The high school year (1, 2, or 3).
 * @returns An array of Subject objects.
 */
export const getSubjectsForYear = (year: 1 | 2 | 3): Subject[] => {
  const yearPrefix = `${year}-`;
  return defaultSubjects.filter(subject => 
    subject.id.startsWith(yearPrefix) || subject.type === 'elective' || subject.level === 'ap'
  );
};

/**
 * Creates an array of SubjectGrade objects from a given list of subjects.
 * Initializes grades to 0.
 * @param subjects An array of Subject objects.
 * @returns An array of SubjectGrade objects.
 */
export const createSubjectGrades = (subjects: Subject[]): SubjectGrade[] => {
  return subjects.map(subject => ({
    subject,
    grades: [],
    finalGrade: 0,
    gpaPoints: gradeToGPA(0),
  }));
};
