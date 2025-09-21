import React from 'react';
import useGPAStore from '../../stores/gpaStore';
import { useTranslation } from 'react-i18next';
import { getSystemLabel, getScaleLabel, getTypeLabel, getLevelLabel } from '../../utils/labelUtils';

const ReviewStep: React.FC = () => {
  const { t } = useTranslation();
  const { 
    student, 
    gradingSystem, 
    gradeScale, 
    yearlyRecords, 
    gpaCalculation, 
    calculateGPA 
  } = useGPAStore();

  const handleCalculate = () => {
    calculateGPA();
  };

  return (
    <div className="space-y-8">
      {/* Student Information */}
      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-text dark:text-text-dark">{t('student_info_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text dark:text-text-dark">
          <div>
            <p className="text-sm text-text/70 dark:text-text-dark/70">{t('name')}</p>
            <p className="font-medium">{student.name || t('not_informed')}</p>
          </div>
          <div>
            <p className="text-sm text-text/70 dark:text-text-dark/70">{t('school')}</p>
            <p className="font-medium">{student.school || t('not_informed')}</p>
          </div>
          <div>
            <p className="text-sm text-text/70 dark:text-text-dark/70">{t('graduation_year')}</p>
            <p className="font-medium">{student.graduationYear}</p>
          </div>
          <div>
            <p className="text-sm text-text/70 dark:text-text-dark/70">{t('grading_system')}</p>
            <p className="font-medium">{getSystemLabel(gradingSystem, t)}</p>
          </div>
          <div>
            <p className="text-sm text-text/70 dark:text-text-dark/70">{t('grade_scale')}</p>
            <p className="font-medium">{getScaleLabel(gradeScale, t)}</p>
          </div>
        </div>
      </div>

      {/* Summary of Grades */}
      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-text dark:text-text-dark">{t('grades_summary_title')}</h2>
        {yearlyRecords.map(record => (
          <div key={record.year} className="mb-6 last:mb-0">
            <h3 className="text-xl font-semibold mb-3 text-text dark:text-text-dark">{record.year}º {t('year')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="bg-secondary dark:bg-secondary-dark text-secondary-foreground dark:text-secondary-foreground">
                    <th className="p-3 rounded-tl-lg">{t('subject')}</th>
                    <th className="p-3">{t('type')}</th>
                    <th className="p-3">{t('level')}</th>
                    <th className="p-3 text-center">{t('credits')}</th>
                    <th className="p-3 rounded-tr-lg text-center">{t('final_grade')}</th>
                  </tr>
                </thead>
                <tbody>
                  {record.subjects.map(subjectGrade => (
                    <tr key={subjectGrade.subject.id} className="border-b border-secondary/30 dark:border-secondary-dark/30 last:border-b-0">
                      <td className="p-3 text-text dark:text-text-dark">{subjectGrade.subject.name}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-foreground">
                          {getTypeLabel(subjectGrade.subject.type, t)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-foreground">
                          {getLevelLabel(subjectGrade.subject.level, t)}
                        </span>
                      </td>
                      <td className="p-3 text-center text-text dark:text-text-dark">{subjectGrade.subject.credits}</td>
                      <td className="p-3 text-center font-medium text-text dark:text-text-dark">
                        {subjectGrade.finalGrade.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* GPA Calculation */}
      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-text dark:text-text-dark">{t('calculate_gpa_title')}</h2>
        {!gpaCalculation ? (
          <div className="text-center py-8">
            <p className="mb-4 text-text/80 dark:text-text-dark/80">
              {t('calculate_gpa_description')}
            </p>
            <button onClick={handleCalculate} className="px-8 py-3 font-bold text-lg bg-primary text-primary-foreground dark:bg-primary-dark dark:text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform">
              {t('calculate_gpa_button')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/50 dark:bg-secondary-dark/50 p-4 rounded-lg text-center">
                <p className="text-sm text-text/70 dark:text-text-dark/70">{t('unweighted_gpa')}</p>
                <p className="text-3xl font-bold text-primary dark:text-primary-dark">
                  {gpaCalculation.unweighted.toFixed(2)}
                </p>
              </div>
              <div className="bg-secondary/50 dark:bg-secondary-dark/50 p-4 rounded-lg text-center">
                <p className="text-sm text-text/70 dark:text-text-dark/70">{t('weighted_gpa')}</p>
                <p className="text-3xl font-bold text-primary dark:text-primary-dark">
                  {gpaCalculation.weighted.toFixed(2)}
                </p>
              </div>
              <div className="bg-secondary/50 dark:bg-secondary-dark/50 p-4 rounded-lg text-center">
                <p className="text-sm text-text/70 dark:text-text-dark/70">{t('core_gpa')}</p>
                <p className="text-3xl font-bold text-primary dark:text-primary-dark">
                  {gpaCalculation.coreOnly.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <button onClick={() => calculateGPA()} className="px-6 py-2 font-medium bg-secondary text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-foreground rounded-full shadow-md hover:scale-105 transition-transform">
                {t('recalculate_gpa')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
