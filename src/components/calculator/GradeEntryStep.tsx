import React, { useState } from 'react';
import useGPAStore from '@/stores/gpaStore';
import { calculateSubjectGradesAndGPA } from '@/utils/gpaCalculator';
import { validateGrade } from '@/utils/gradeUtils';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { gradeToGPA } from '@/utils/gradeUtils';

const GradeEntryStep: React.FC = () => {
  const { t } = useTranslation();
  const { 
    selectedYear, 
    setSelectedYear, 
    gradingSystem, 
    getYearlyRecord, 
    updateYearlyRecord,
    gradeScale
  } = useGPAStore();
  
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    type: 'core' as 'core' | 'elective',
    level: 'regular' as 'regular' | 'honors' | 'ap',
    credits: 1
  });
  // Estados para controlar erros de validação
  const [gradeErrors, setGradeErrors] = useState<Record<string, boolean>>({});

  const currentRecord = getYearlyRecord(selectedYear);
  
  // Get period labels based on grading system
  const getPeriodLabels = () => {
    switch (gradingSystem) {
      case 'trimestral':
        return [t('period_1_trimester'), t('period_2_trimester'), t('period_3_trimester')];
      case 'semestral':
        return [t('period_1_semester'), t('period_2_semester')];
      case 'annual':
        return [t('period_annual')];
      default:
        return [t('period_1'), t('period_2'), t('period_3')];
    }
  };

  const periodLabels = getPeriodLabels();

  

  const handleGradeChange = (subjectId: string, periodIndex: number, value: string) => {
    if (!currentRecord) return;
    
    const numericValue = value === '' ? NaN : parseFloat(value);
    
    // Validar a nota usando a função centralizada
    const isValid = value === '' || isNaN(numericValue) || validateGrade(numericValue, gradeScale);
    
    // Atualizar estado de erro
    setGradeErrors(prev => ({
      ...prev,
      [`${subjectId}-${periodIndex}`]: !isValid
    }));
    
    // Se a nota não for válida, não atualizar o estado
    if (!isValid) return;
    
    const updatedSubjects = currentRecord.subjects.map(subjectGrade => {
      if (subjectGrade.subject.id === subjectId) {
        const newGrades = [...subjectGrade.grades];
        newGrades[periodIndex] = isNaN(numericValue) ? 0 : numericValue;
        
        // Recalculate final grade and GPA points using the centralized function
        const { finalGrade, gpaPoints } = calculateSubjectGradesAndGPA(newGrades);
        
        return {
          ...subjectGrade,
          grades: newGrades,
          finalGrade,
          gpaPoints
        };
      }
      return subjectGrade;
    });
    
    updateYearlyRecord(selectedYear, updatedSubjects);
  };

  const handleSubjectChange = (subjectId: string, field: string, value: string) => {
    if (!currentRecord) return;
    
    const updatedSubjects = currentRecord.subjects.map(subjectGrade => {
      if (subjectGrade.subject.id === subjectId) {
        return {
          ...subjectGrade,
          subject: {
            ...subjectGrade.subject,
            [field]: value
          }
        };
      }
      return subjectGrade;
    });
    
    updateYearlyRecord(selectedYear, updatedSubjects);
  };

  const addNewSubject = () => {
    if (!currentRecord || !newSubject.name.trim()) return;
    
    const newSubjectGrade = {
      subject: {
        id: `custom-${Date.now()}`,
        name: newSubject.name,
        type: newSubject.type,
        level: newSubject.level,
        credits: newSubject.credits
      },
      grades: Array(periodLabels.length).fill(0),
      finalGrade: 0,
      gpaPoints: gradeToGPA(0)
    };
    
    const updatedSubjects = [...currentRecord.subjects, newSubjectGrade];
    updateYearlyRecord(selectedYear, updatedSubjects);
    
    // Reset form
    setNewSubject({
      name: '',
      type: 'core',
      level: 'regular',
      credits: 1
    });
  };

  const removeSubject = (subjectId: string) => {
    if (!currentRecord) return;
    
    const updatedSubjects = currentRecord.subjects.filter(
      subjectGrade => subjectGrade.subject.id !== subjectId
    );
    
    updateYearlyRecord(selectedYear, updatedSubjects);
  };

  return (
    <div className="space-y-8">
      <div className="flex space-x-4 justify-center">
        {[1, 2, 3].map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year as 1 | 2 | 3)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedYear === year 
              ? 'bg-primary text-primary-foreground dark:bg-primary-dark dark:text-primary-foreground shadow-md' 
              : 'bg-secondary text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-foreground hover:bg-secondary-foreground/20 dark:hover:bg-secondary/20'
            }`}
          >
            {year}º {t('year')}
          </button>
        ))}
      </div>

      {currentRecord && (
        <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 text-text dark:text-text-dark">{t('subjects_for_year', { year: selectedYear })}</h2>
          <p className="text-text/80 dark:text-text-dark/80 mb-6">
            {t('subjects_for_year_description')}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-secondary dark:bg-secondary-dark text-secondary-foreground dark:text-secondary-foreground">
                  <th className="p-3 rounded-tl-lg w-[250px]">{t('subject')}</th>
                  <th className="p-3">{t('type')}</th>
                  <th className="p-3">{t('level')}</th>
                  <th className="p-3">{t('credits')}</th>
                  {periodLabels.map((label, index) => (
                    <th key={index} className="p-3 text-center">{label}</th>
                  ))}
                  <th className="p-3 text-center">{t('final_grade')}</th>
                  <th className="p-3 rounded-tr-lg text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentRecord.subjects.map((subjectGrade) => (
                  <tr key={subjectGrade.subject.id} className="border-b border-secondary/30 dark:border-secondary-dark/30 last:border-b-0">
                    <td className="p-3">
                      {editingSubject === subjectGrade.subject.id ? (
                        <input
                          value={subjectGrade.subject.name}
                          onChange={(e) => handleSubjectChange(subjectGrade.subject.id, 'name', e.target.value)}
                          onBlur={() => setEditingSubject(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingSubject(null)}
                          autoFocus
                          className="w-full p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                        />
                      ) : (
                        <div 
                          className="cursor-pointer text-text dark:text-text-dark"
                          onClick={() => setEditingSubject(subjectGrade.subject.id)}
                        >
                          {subjectGrade.subject.name}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={subjectGrade.subject.type}
                        onChange={(e) => 
                          handleSubjectChange(subjectGrade.subject.id, 'type', e.target.value)
                        }
                        className="w-[120px] p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                      >
                        <option value="core">{t('core_subject')}</option>
                        <option value="elective">{t('elective_subject')}</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={subjectGrade.subject.level}
                        onChange={(e) => 
                          handleSubjectChange(subjectGrade.subject.id, 'level', e.target.value)
                        }
                        className="w-[120px] p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                      >
                        <option value="regular">{t('regular_level')}</option>
                        <option value="honors">{t('honors_level')}</option>
                        <option value="ap">{t('ap_level')}</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={subjectGrade.subject.credits}
                        onChange={(e) => handleSubjectChange(subjectGrade.subject.id, 'credits', e.target.value)}
                        className="w-16 p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark text-center focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                      />
                    </td>
                    {periodLabels.map((_, periodIndex) => (
                      <td key={periodIndex} className="p-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={gradeScale === '0-100' ? "100" : "10"}
                          step="0.1"
                          value={subjectGrade.grades[periodIndex] || ''}
                          onChange={(e) => handleGradeChange(subjectGrade.subject.id, periodIndex, e.target.value)}
                          className={cn(
                            "w-20 p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark text-center focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark",
                            gradeErrors[`${subjectGrade.subject.id}-${periodIndex}`] && 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                          )}
                        />
                        {gradeErrors[`${subjectGrade.subject.id}-${periodIndex}`] && (
                          <div className="text-red-500 text-xs mt-1">
                            {gradeScale === '0-10' 
                              ? t('grade_error_0_10') 
                              : t('grade_error_0_100')}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="p-3 text-center font-medium text-text dark:text-text-dark">
                      {subjectGrade.finalGrade.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => removeSubject(subjectGrade.subject.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 transition-colors"
                      >
                        {t('remove')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-secondary/50 dark:bg-secondary-dark/50 rounded-lg">
            <h3 className="font-medium mb-3 text-text dark:text-text-dark">{t('add_new_subject')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-text dark:text-text-dark font-medium mb-1">{t('name')}</label>
                <input
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  placeholder={t('subject_name_placeholder')}
                  className="w-full p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                />
              </div>
              <div>
                <label className="block text-text dark:text-text-dark font-medium mb-1">{t('type')}</label>
                <select
                  value={newSubject.type}
                  onChange={(e) => 
                    setNewSubject({...newSubject, type: e.target.value as 'core' | 'elective'})
                  }
                  className="w-full p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                >
                  <option value="core">{t('core_subject')}</option>
                  <option value="elective">{t('elective_subject')}</option>
                </select>
              </div>
              <div>
                <label className="block text-text dark:text-text-dark font-medium mb-1">{t('level')}</label>
                <select
                  value={newSubject.level}
                  onChange={(e) => 
                    setNewSubject({...newSubject, level: e.target.value as 'regular' | 'honors' | 'ap'})
                  }
                  className="w-full p-2 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                >
                  <option value="regular">{t('regular_level')}</option>
                  <option value="honors">{t('honors_level')}</option>
                  <option value="ap">{t('ap_level')}</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={addNewSubject} className="w-full px-4 py-2 font-medium bg-primary text-primary-foreground dark:bg-primary-dark dark:text-primary-foreground rounded-full shadow-md hover:scale-105 transition-transform">
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeEntryStep;