import React, { useState } from 'react';
import useGPAStore from '../../stores/gpaStore';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

const StudentConfigStep: React.FC = () => {
  const { t } = useTranslation();
  const { student, setStudent, gradingSystem, setGradingSystem, gradeScale, setGradeScale } = useGPAStore();
  
  // Estado para controlar erro de validação do nome
  const [nameError, setNameError] = useState(false);

  const handleStudentChange = (field: string, value: string | number) => {
    // Validar nome do estudante
    if (field === 'name') {
      const nameValue = value as string;
      setNameError(nameValue.trim().length < 2);
    }
    
    setStudent({
      ...student,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Student Information */}
      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-text dark:text-text-dark">{t('student_info_title')}</h2>
        <p className="text-text/80 dark:text-text-dark/80 mb-6">
          {t('student_info_description')}
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-text dark:text-text-dark font-medium mb-1">{t('full_name')}</label>
            <input
              id="name"
              value={student.name}
              onChange={(e) => handleStudentChange('name', e.target.value)}
              placeholder={t('full_name_placeholder')}
              className={cn(
                "w-full p-3 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark",
                nameError && 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
              )}
            />
            {nameError && (
              <div className="text-red-500 text-sm mt-1">
                {t('name_error_min_length')}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="school" className="block text-text dark:text-text-dark font-medium mb-1">{t('school_optional')}</label>
            <input
              id="school"
              value={student.school || ''}
              onChange={(e) => handleStudentChange('school', e.target.value)}
              placeholder={t('school_placeholder')}
              className="w-full p-3 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            />
          </div>
          
          <div>
            <label htmlFor="graduationYear" className="block text-text dark:text-text-dark font-medium mb-1">{t('graduation_year')}</label>
            <select 
              id="graduationYear"
              value={student.graduationYear.toString()} 
              onChange={(e) => handleStudentChange('graduationYear', parseInt(e.target.value))}
              className="w-full p-3 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            >
              <option value="">{t('select_year')}</option>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      
      {/* Academic Configuration */}
      <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-text dark:text-text-dark">{t('academic_config_title')}</h2>
        <p className="text-text/80 dark:text-text-dark/80 mb-6">
          {t('academic_config_description')}
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="gradingSystem" className="block text-text dark:text-text-dark font-medium mb-1">{t('grading_system')}</label>
            <select 
              id="gradingSystem"
              value={gradingSystem} 
              onChange={(e) => setGradingSystem(e.target.value as 'trimestral' | 'semestral' | 'annual')}
              className="w-full p-3 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            >
              <option value="trimestral">{t('trimestral_system')}</option>
              <option value="semestral">{t('semestral_system')}</option>
              <option value="annual">{t('annual_system')}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="gradeScale" className="block text-text dark:text-text-dark font-medium mb-1">{t('grade_scale')}</label>
            <select 
              id="gradeScale"
              value={gradeScale} 
              onChange={(e) => setGradeScale(e.target.value as '0-10' | '0-100' | 'A-F' | 'conceitos')}
              className="w-full p-3 bg-white/70 dark:bg-black/40 border border-secondary-foreground/30 dark:border-secondary-dark/30 rounded-md text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
            >
              <option value="0-10">{t('scale_0_10')}</option>
              <option value="0-100">{t('scale_0_100')}</option>
              <option value="A-F">{t('scale_a_f')}</option>
              <option value="conceitos">{t('scale_concepts')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentConfigStep;