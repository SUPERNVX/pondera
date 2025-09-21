import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useGPAStore from '../stores/gpaStore';
import { SectionTitle, SectionSubtitle } from '../components/CommonComponents';
import { lightColors } from '../styles/colors';
import { LoadingWrapper } from '../components/ui/loading';
import { usePerformanceSettings } from '../stores/settingsStore';
import { useOptimizedYearRecord, useYearStatistics, useFilteredSubjects } from '../hooks/useOptimizedSelectors';
import { getSubjectsForYear, createSubjectGrades } from '../utils/defaultSubjects';
import { useAnimations } from '../hooks/useAnimations';
import type { SubjectGrade } from '../utils/gpaTypes';

interface CalculatorPageProps {
  colors?: typeof lightColors;
}

const CalculatorPage: React.FC<CalculatorPageProps> = ({ colors = lightColors }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const performanceSettings = usePerformanceSettings();
  
  const { 
    currentStep, 
    setCurrentStep, 
    initializeDefaultSubjects, 
    calculateGPA,
    student,
    setStudent,
    gradingSystem,
    setGradingSystem,
    gradeScale,
    setGradeScale,
    selectedYear,
    setSelectedYear,
    getYearlyRecord,
    updateYearlyRecord,
    yearlyRecords,
    gpaCalculation,
    isCalculating,
    setIsCalculating
  } = useGPAStore();
  
  // Animation hooks
  const { bounceIn } = useAnimations({ autoInitialize: false });

  // Initialize default subjects when the page loads
  useEffect(() => {
    if (yearlyRecords.length === 0) {
      initializeDefaultSubjects();
    }
  }, [initializeDefaultSubjects, yearlyRecords.length]);

  const steps = [t('step_configuration'), t('step_grades'), t('step_review')];

  // Função para verificar se os dados da etapa atual são válidos
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      // Validar nome do estudante (mínimo 2 caracteres)
      return student.name && student.name.trim().length >= 2;
    }
    // Para outras etapas, considerar como válidas por enquanto
    return true;
  };

  const handleNext = () => {
    // Verificar se a etapa atual é válida antes de avançar
    if (!isCurrentStepValid()) {
      return;
    }
    
    if (currentStep === steps.length) {
      handleCalculateGPA();
      navigate('/results');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleStudentChange = (field: string, value: string | number) => {
    setStudent({
      ...student,
      [field]: value
    });
  };

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    type: 'core' as 'core' | 'elective',
    level: 'regular' as 'regular' | 'honors' | 'ap',
    credits: 1
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [localCalculating, setLocalCalculating] = useState(false);

  // Optimized data using custom hooks
  const currentYearRecord = useOptimizedYearRecord(selectedYear);
  const yearStats = useYearStatistics(selectedYear);
  const filteredSubjects = useFilteredSubjects(selectedYear, searchTerm);

  const handleGradeChange = (subjectId: string, periodIndex: number, value: string) => {
    const currentRecord = getYearlyRecord(selectedYear);
    if (!currentRecord) return;
    
    const updatedSubjects = currentRecord.subjects.map(subjectGrade => {
      if (subjectGrade.subject.id === subjectId) {
        const newGrades = [...subjectGrade.grades];
        const numericValue = value === '' ? 0 : parseFloat(value);
        newGrades[periodIndex] = isNaN(numericValue) ? 0 : numericValue;
        
        // Calculate final grade (average)
        const validGrades = newGrades.filter(g => g > 0);
        const finalGrade = validGrades.length > 0 ? validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length : 0;
        
        // Calculate GPA points based on grade scale
        let gpaPoints = 0;
        if (gradeScale === '0-10') {
          gpaPoints = finalGrade >= 9 ? 4.0 : finalGrade >= 8 ? 3.0 : finalGrade >= 7 ? 2.0 : finalGrade >= 6 ? 1.0 : 0.0;
        } else if (gradeScale === '0-100') {
          gpaPoints = finalGrade >= 90 ? 4.0 : finalGrade >= 80 ? 3.0 : finalGrade >= 70 ? 2.0 : finalGrade >= 60 ? 1.0 : 0.0;
        }
        
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
    
    // Auto-calculate if enabled
    if (performanceSettings.autoSave) {
      const debounceDelay = performanceSettings.enableDebouncing ? performanceSettings.debounceDelay : 0;
      setTimeout(() => {
        if (performanceSettings.enableCache) {
          calculateGPA();
        }
      }, debounceDelay);
    }
  };

  const handleAddSubject = () => {
    if (!newSubject.name.trim()) {
      showNotification(t('subject_name_required') || 'Nome da matéria é obrigatório', 'error');
      return;
    }

    const currentRecord = getYearlyRecord(selectedYear);
    if (!currentRecord) return;

    const newSubjectGrade: SubjectGrade = {
      subject: {
        id: `custom-${selectedYear}-${Date.now()}`,
        name: newSubject.name,
        type: newSubject.type,
        level: newSubject.level,
        credits: newSubject.credits
      },
      grades: Array(gradingSystem === 'trimestral' ? 3 : gradingSystem === 'semestral' ? 2 : 1).fill(0),
      finalGrade: 0,
      gpaPoints: 0
    };

    const updatedSubjects = [...currentRecord.subjects, newSubjectGrade];
    updateYearlyRecord(selectedYear, updatedSubjects);
    
    setNewSubject({ name: '', type: 'core', level: 'regular', credits: 1 });
    setShowAddSubjectModal(false);
    showNotification(t('subject_added_success') || 'Matéria adicionada com sucesso!', 'success');
  };

  const handleRemoveSubject = (subjectId: string) => {
    const currentRecord = getYearlyRecord(selectedYear);
    if (!currentRecord) return;

    const updatedSubjects = currentRecord.subjects.filter(s => s.subject.id !== subjectId);
    updateYearlyRecord(selectedYear, updatedSubjects);
    showNotification(t('subject_removed_success') || 'Matéria removida com sucesso!', 'success');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    
    // Animate notification entrance
    setTimeout(() => {
      const notificationElement = document.querySelector('[data-notification]');
      if (notificationElement) {
        bounceIn(notificationElement);
      }
    }, 50);
    
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCalculateGPA = async () => {
    setLocalCalculating(true);
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      calculateGPA();
      showNotification(t('gpa_calculated_success') || 'GPA calculado com sucesso!', 'success');
      
      // Auto-redirect to results page after 1 second
      setTimeout(() => {
        navigate('/results');
      }, 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : (t('gpa_calculation_error') || 'Erro ao calcular GPA. Tente novamente.');
      showNotification(errorMessage, 'error');
    } finally {
      setLocalCalculating(false);
      setIsCalculating(false);
    }
  };

  // Styles
  const sidebarStyles = {
    backgroundColor: colors.mutedBackground,
    padding: '1.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${colors.border}`,
    height: 'fit-content',
    alignSelf: 'flex-start'
  };

  const sectionStyles = {
    backgroundColor: colors.mutedBackground,
    borderRadius: '1.5rem',
    padding: '2rem 2.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${colors.border}`,
    marginBottom: '2rem'
  };

  const buttonStyles = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '1rem'
  };

  const primaryButtonStyles = {
    ...buttonStyles,
    backgroundColor: colors.primary,
    color: colors.primaryForeground
  };

  const secondaryButtonStyles = {
    ...buttonStyles,
    backgroundColor: colors.secondary,
    color: colors.secondaryForeground
  };

  const inputStyles = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: '1rem',
    width: '100%'
  };

  const navLinkStyles = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? colors.secondary : 'transparent',
    color: isActive ? colors.secondaryForeground : colors.mutedForeground,
    marginBottom: '0.5rem'
  });

  // Media query adjustments
  const isLargeScreen = window.innerWidth >= 1024;

  // Essential subjects list
  const essentialSubjects = [
    'Português', 'Matemática', 'Física', 'Química', 'História', 
    'Biologia', 'Geografia', 'Língua Inglesa', 'Educação Física', 
    'Artes', 'Filosofia', 'Sociologia'
  ];

  const handleSetEssentialSubjects = () => {
    const currentRecord = getYearlyRecord(selectedYear);
    if (!currentRecord) return;

    // Filter only essential subjects
    const essentialSubjectGrades = currentRecord.subjects.filter(subjectGrade => 
      essentialSubjects.includes(subjectGrade.subject.name)
    );

    updateYearlyRecord(selectedYear, essentialSubjectGrades);
    showNotification(t('essential_subjects_loaded') || 'Matérias essenciais carregadas!', 'success');
  };

  const handleSetAllSubjects = () => {
    // Get all subjects for the selected year
    const allSubjects = getSubjectsForYear(selectedYear);
    const allSubjectGrades = createSubjectGrades(allSubjects);
    
    updateYearlyRecord(selectedYear, allSubjectGrades);
    showNotification(t('all_subjects_loaded') || 'Todas as matérias carregadas!', 'success');
  };

  const handleClearAllGrades = () => {
    const currentRecord = getYearlyRecord(selectedYear);
    if (!currentRecord) return;

    // Limpa todas as notas do ano selecionado
    const clearedSubjects = currentRecord.subjects.map(subjectGrade => ({
      ...subjectGrade,
      grades: Array(gradingSystem === 'trimestral' ? 3 : gradingSystem === 'semestral' ? 2 : 1).fill(0),
      finalGrade: 0,
      gpaPoints: 0
    }));

    updateYearlyRecord(selectedYear, clearedSubjects);
    showNotification('🧹 Todas as notas foram limpas!', 'success');
  };

  const getPerformanceColor = (grade: number) => {
    if (grade >= 9) return colors.primary;
    if (grade >= 7) return '#10b981'; // green
    if (grade >= 6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getPerformanceIcon = (grade: number) => {
    if (grade >= 9) return '🌟';
    if (grade >= 7) return '✅';
    if (grade >= 6) return '⚠️';
    return '❌';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={sectionStyles}>
            <SectionTitle colors={colors}>Configuração Inicial</SectionTitle>
            <SectionSubtitle colors={colors}>
              Configure suas informações pessoais e sistema de avaliação.
            </SectionSubtitle>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '2rem' }}>
              <div>
                <h3 style={{ color: colors.text, marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>
                  Informações Pessoais
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                    Nome Completo
                  </label>
                  <input
                    value={student.name}
                    onChange={(e) => handleStudentChange('name', e.target.value)}
                    placeholder={t('full_name_placeholder')}
                    style={inputStyles}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                    Escola (opcional)
                  </label>
                  <input
                    value={student.school || ''}
                    onChange={(e) => handleStudentChange('school', e.target.value)}
                    placeholder={t('school_placeholder')}
                    style={inputStyles}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                    Ano de Formatura
                  </label>
                  <select 
                    value={student.graduationYear.toString()} 
                    onChange={(e) => handleStudentChange('graduationYear', parseInt(e.target.value))}
                    style={inputStyles}
                  >
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
              
              <div>
                <h3 style={{ color: colors.text, marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>
                  Sistema de Avaliação
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                    Sistema de Períodos
                  </label>
                  <select 
                    value={gradingSystem} 
                    onChange={(e) => setGradingSystem(e.target.value as 'trimestral' | 'semestral' | 'annual')}
                    style={inputStyles}
                  >
                    <option value="trimestral">Trimestral (3 períodos)</option>
                    <option value="semestral">Semestral (2 períodos)</option>
                    <option value="annual">Anual (1 período)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                    Escala de Notas
                  </label>
                  <select 
                    value={gradeScale} 
                    onChange={(e) => setGradeScale(e.target.value as '0-10' | '0-100' | 'A-F' | 'conceitos')}
                    style={inputStyles}
                  >
                    <option value="0-10">0 a 10</option>
                    <option value="0-100">0 a 100</option>
                    <option value="A-F">A, B, C, D, F</option>
                    <option value="conceitos">Conceitos</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2: {
        const periodLabels = gradingSystem === 'trimestral' ? ['1º Trimestre', '2º Trimestre', '3º Trimestre'] :
                           gradingSystem === 'semestral' ? ['1º Semestre', '2º Semestre'] : ['Nota Anual'];
        
        return (
          <div style={sectionStyles}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <SectionTitle colors={colors}>Inserir Notas</SectionTitle>
              <SectionSubtitle colors={colors}>
                Insira suas notas para cada matéria e período letivo.
              </SectionSubtitle>
            </div>
            
            {/* Year Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                Selecione o Ano
              </label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[1, 2, 3].map(year => {
                  const yearRecord = getYearlyRecord(year as 1 | 2 | 3);
                  const completedCount = yearRecord ? yearRecord.subjects.filter(s => s.finalGrade > 0).length : 0;
                  const totalCount = yearRecord ? yearRecord.subjects.length : 0;
                  
                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year as 1 | 2 | 3)}
                      style={{
                        ...buttonStyles,
                        backgroundColor: selectedYear === year ? colors.primary : colors.secondary,
                        color: selectedYear === year ? colors.primaryForeground : colors.secondaryForeground,
                        position: 'relative',
                        minWidth: '120px'
                      }}
                      title={`${completedCount}/${totalCount} matérias preenchidas`}
                    >
                      {year}º Ano
                      <div style={{
                        fontSize: '0.75rem',
                        opacity: 0.8,
                        marginTop: '0.25rem'
                      }}>
                        {completedCount}/{totalCount}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: colors.background,
                borderRadius: '0.5rem',
                border: `1px solid ${colors.border}`,
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.primary }}>
                  {yearStats.completedSubjects}/{yearStats.totalSubjects}
                </div>
                <div style={{ fontSize: '0.85rem', color: colors.mutedForeground }}>
                  Matérias Preenchidas
                </div>
              </div>
              
              <div style={{
                backgroundColor: colors.background,
                borderRadius: '0.5rem',
                border: `1px solid ${colors.border}`,
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getPerformanceColor(yearStats.averageGrade)
                }}>
                  {yearStats.averageGrade.toFixed(1)} {getPerformanceIcon(yearStats.averageGrade)}
                </div>
                <div style={{ fontSize: '0.85rem', color: colors.mutedForeground }}>
                  Média do Ano
                </div>
              </div>

              <div style={{
                backgroundColor: colors.background,
                borderRadius: '0.5rem',
                border: `1px solid ${colors.border}`,
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: colors.border,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: `${(yearStats.completedSubjects / Math.max(1, yearStats.totalSubjects)) * 100}%`,
                    height: '100%',
                    backgroundColor: colors.primary,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.85rem', color: colors.mutedForeground }}>
                  Progresso: {Math.round((yearStats.completedSubjects / Math.max(1, yearStats.totalSubjects)) * 100)}%
                </div>
              </div>
            </div>

            {/* Search and Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar matéria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    ...inputStyles,
                    maxWidth: '300px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSetEssentialSubjects}
                  style={{
                    ...secondaryButtonStyles,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                  title="Carregar apenas matérias essenciais do ensino médio"
                >
                  🎯 Essenciais
                </button>
                
                <button
                  onClick={handleSetAllSubjects}
                  style={{
                    ...secondaryButtonStyles,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                  title="Carregar todas as matérias disponíveis para este ano"
                >
                  📚 Todas as Matérias
                </button>

                <button
                  onClick={handleClearAllGrades}
                  style={{
                    ...buttonStyles,
                    backgroundColor: '#ef4444',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                  title="Limpar todas as notas do ano selecionado"
                >
                  🧹 Limpar Tudo
                </button>
                
                <button
                  onClick={() => setShowAddSubjectModal(true)}
                  style={{
                    ...primaryButtonStyles,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ➕ Adicionar Matéria
                </button>
              </div>
            </div>
            
            {/* Info about Essential Subjects */}
            <div style={{
              backgroundColor: colors.mutedBackground,
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`,
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: colors.mutedForeground
            }}>
              💡 <strong>Dica:</strong> Use "🎯 Essenciais" para carregar apenas as 12 matérias obrigatórias do ensino médio, 
              ou "📚 Todas as Matérias" para carregar o conjunto completo de disciplinas disponíveis para este ano.
            </div>

            {currentYearRecord && (
              <div style={{
                backgroundColor: colors.background,
                borderRadius: '1rem',
                border: `1px solid ${colors.border}`,
                padding: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ color: colors.primary, fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                    {selectedYear}º Ano - Matérias ({filteredSubjects.length})
                  </h4>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    fontSize: '0.85rem',
                    color: colors.mutedForeground
                  }}>
                    <span>📚 Principais: {filteredSubjects.filter(s => s.subject.type === 'core').length}</span>
                    <span>🎨 Eletivas: {filteredSubjects.filter(s => s.subject.type === 'elective').length}</span>
                  </div>
                </div>
                
                <div style={{ overflowX: 'auto', maxHeight: '60vh', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <thead>
                      <tr style={{ backgroundColor: colors.secondary }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: colors.secondaryForeground, borderRadius: '0.5rem 0 0 0.5rem', width: '35%' }}>
                          {t('subject')}
                          <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '0.5rem' }}>
                            📚 {t('type')} | 🎯 {t('level')}
                          </span>
                        </th>
                        {periodLabels.map((label, index) => (
                          <th key={index} style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground, width: gradingSystem === 'semestral' ? '20%' : gradingSystem === 'trimestral' ? '15%' : '25%' }}>
                            {label}
                            <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>0-10</div>
                          </th>
                        ))}
                        <th style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground, width: '15%' }}>
                          {t('final_grade')}
                          <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>GPA</div>
                        </th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground, borderRadius: '0 0.5rem 0.5rem 0', width: '10%' }}>
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((subjectGrade) => (
                        <tr key={subjectGrade.subject.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div>
                              <div style={{ color: colors.text, fontWeight: 500, marginBottom: '0.25rem' }}>
                                {subjectGrade.subject.name}
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{
                                  fontSize: '0.7rem',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  backgroundColor: subjectGrade.subject.type === 'core' ? colors.primary : colors.secondary,
                                  color: subjectGrade.subject.type === 'core' ? colors.primaryForeground : colors.secondaryForeground
                                }}>
                                  {subjectGrade.subject.type === 'core' ? '📚 Principal' : '🎨 Eletiva'}
                                </span>
                                <span style={{
                                  fontSize: '0.7rem',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  backgroundColor: colors.mutedBackground,
                                  color: colors.mutedForeground
                                }}>
                                  {subjectGrade.subject.level === 'regular' ? '🎯 Regular' : 
                                   subjectGrade.subject.level === 'honors' ? '⭐ Honras' : '🏆 AP'}
                                </span>
                              </div>
                            </div>
                          </td>
                          {periodLabels.map((_, periodIndex) => (
                            <td key={periodIndex} style={{ padding: '0.5rem', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={subjectGrade.grades[periodIndex] || ''}
                                onChange={(e) => handleGradeChange(subjectGrade.subject.id, periodIndex, e.target.value)}
                                style={{
                                  ...inputStyles,
                                  width: '90%',
                                  textAlign: 'center',
                                  padding: '0.75rem',
                                  borderColor: subjectGrade.grades[periodIndex] > 0 ? getPerformanceColor(subjectGrade.grades[periodIndex]) : colors.border
                                }}
                                placeholder="0.0"
                                title={`Nota do ${periodLabels[periodIndex]} para ${subjectGrade.subject.name}`}
                              />
                            </td>
                          ))}
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <div style={{ 
                              color: getPerformanceColor(subjectGrade.finalGrade), 
                              fontWeight: 600,
                              fontSize: '1rem'
                            }}>
                              {subjectGrade.finalGrade.toFixed(1)} {getPerformanceIcon(subjectGrade.finalGrade)}
                            </div>
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: colors.mutedForeground,
                              marginTop: '0.25rem'
                            }}>
                              GPA: {subjectGrade.gpaPoints.toFixed(1)}
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            {subjectGrade.subject.id.startsWith('custom-') && (
                              <button
                                onClick={() => handleRemoveSubject(subjectGrade.subject.id)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                                title="Remover matéria"
                              >
                                🗑️
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredSubjects.length === 0 && searchTerm && (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: colors.mutedForeground
                  }}>
                    🔍 Nenhuma matéria encontrada para "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        );}
        
      case 3:
        return (
          <div style={sectionStyles}>
            <SectionTitle colors={colors}>Revisar e Calcular</SectionTitle>
            <SectionSubtitle colors={colors}>
              Revise suas informações e calcule seu GPA.
            </SectionSubtitle>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
              <div style={{
                backgroundColor: colors.background,
                borderRadius: '1rem',
                border: `1px solid ${colors.border}`,
                padding: '1.5rem'
              }}>
                <h4 style={{ color: colors.primary, marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
                  {t('student_info_title')}
                </h4>
                <div style={{ color: colors.text }}>
                  <p><strong>{t('name')}:</strong> {student.name || t('not_informed')}</p>
                  <p><strong>{t('school')}:</strong> {student.school || t('not_informed')}</p>
                  <p><strong>Ano de Formatura:</strong> {student.graduationYear}</p>
                  <p><strong>Sistema:</strong> {gradingSystem}</p>
                  <p><strong>Escala:</strong> {gradeScale}</p>
                </div>
              </div>
              
              <div style={{
                backgroundColor: colors.background,
                borderRadius: '1rem',
                border: `1px solid ${colors.border}`,
                padding: '1.5rem'
              }}>
                <h4 style={{ color: colors.primary, marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>
                  Resumo das Notas
                </h4>
                <div style={{ color: colors.text }}>
                  {yearlyRecords.map(record => {
                    const validSubjects = record.subjects.filter(s => s.finalGrade > 0);
                    const avgGrade = validSubjects.length > 0 ? 
                      validSubjects.reduce((sum, s) => sum + s.finalGrade, 0) / validSubjects.length : 0;
                    
                    return (
                      <p key={record.year}>
                        <strong>{record.year}º Ano:</strong> {validSubjects.length} matérias, média {avgGrade.toFixed(1)}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {gpaCalculation && (
              <div style={{
                backgroundColor: colors.background,
                borderRadius: '1rem',
                border: `1px solid ${colors.border}`,
                padding: '2rem',
                textAlign: 'center'
              }}>
                <h3 style={{ color: colors.primary, marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>
                  Seu GPA Calculado
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                  <div>
                    <p style={{ color: colors.mutedForeground, fontSize: '0.9rem' }}>{t('unweighted_gpa')}</p>
                    <p style={{ color: colors.primary, fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                      {gpaCalculation.unweighted.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: colors.mutedForeground, fontSize: '0.9rem' }}>{t('weighted_gpa')}</p>
                    <p style={{ color: colors.primary, fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                      {gpaCalculation.weighted.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: colors.mutedForeground, fontSize: '0.9rem' }}>{t('core_gpa')}</p>
                    <p style={{ color: colors.primary, fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                      {gpaCalculation.coreOnly.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <LoadingWrapper 
                isLoading={localCalculating || isCalculating}
                message="Calculando GPA..."
                className="py-8"
              >
                <button 
                  onClick={handleCalculateGPA}
                  disabled={isCalculating || localCalculating}
                  style={{
                    ...primaryButtonStyles,
                    fontSize: '1.1rem',
                    padding: '1rem 2rem',
                    opacity: (isCalculating || localCalculating) ? 0.7 : 1,
                    cursor: (isCalculating || localCalculating) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {(isCalculating || localCalculating) ? '🔄 Calculando...' : '🧮 Calcular GPA'}
                </button>
              </LoadingWrapper>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section style={{ 
      minHeight: '100vh', 
      padding: '1rem',
      paddingLeft: '0.5rem',
      display: 'flex',
      flexDirection: isLargeScreen ? 'row' : 'column',
      gap: isLargeScreen ? '1.5rem' : '0',
      alignItems: 'flex-start'
    }}>
      <aside style={{ 
        ...sidebarStyles, 
        width: isLargeScreen ? '260px' : '100%',
        flexShrink: 0,
        marginBottom: isLargeScreen ? '0' : '2rem',
        position: 'sticky',
        top: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: colors.primary }}>
          Calculadora GPA
        </h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: colors.text, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Progresso: {currentStep} de {steps.length}
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: colors.border,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(currentStep / steps.length) * 100}%`,
              height: '100%',
              backgroundColor: colors.primary,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
        
        <nav style={{ marginBottom: '2rem' }}>
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => setCurrentStep(index + 1)}
              style={navLinkStyles(currentStep === index + 1)}
            >
              <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>
                {index + 1 < currentStep ? '✅' : index + 1 === currentStep ? '🔄' : '⭕'}
              </span>
              {step}
            </div>
          ))}
        </nav>
        
        <div style={{
          backgroundColor: colors.background,
          borderRadius: '1rem',
          border: `1px solid ${colors.border}`,
          padding: '1rem'
        }}>
          <h4 style={{ color: colors.primary, marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 600 }}>
            💡 Dica
          </h4>
          <p style={{ color: colors.mutedForeground, fontSize: '0.85rem', margin: 0 }}>
            {currentStep === 1 && t('step_1_help')}
            {currentStep === 2 && t('step_2_help')}
            {currentStep === 3 && t('step_3_help')}
          </p>
        </div>
      </aside>

      <main style={{ 
        flex: 1,
        minWidth: 0,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ 
          width: '100%'
        }}>
        {renderStepContent()}
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '2rem',
          borderTop: `1px solid ${colors.border}`
        }}>
          <button 
            onClick={handleBack}
            style={{
              ...secondaryButtonStyles,
              minWidth: '140px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {currentStep === 1 ? '🏠 Início' : '← Anterior'}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            style={{
              ...primaryButtonStyles,
              minWidth: '140px',
              opacity: !isCurrentStepValid() ? 0.6 : 1,
              cursor: !isCurrentStepValid() ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (isCurrentStepValid()) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (isCurrentStepValid()) {
                e.currentTarget.style.opacity = '1';
              }
            }}
          >
            {currentStep === steps.length ? `📊 ${t('view_results')}` : `${t('next')} →`}
          </button>
        </div>
        </div>
      </main>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: colors.background,
            borderRadius: '1rem',
            border: `1px solid ${colors.border}`,
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ color: colors.primary, marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 600 }}>
              ➕ Adicionar Nova Matéria
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                Nome da Matéria *
              </label>
              <input
                type="text"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                placeholder="Ex: Física Avançada"
                style={inputStyles}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                  Tipo da Matéria
                  <span style={{ fontSize: '0.8rem', color: colors.mutedForeground, marginLeft: '0.5rem' }}>
                    📚 Principal = obrigatória
                  </span>
                </label>
                <select
                  value={newSubject.type}
                  onChange={(e) => setNewSubject({ ...newSubject, type: e.target.value as 'core' | 'elective' })}
                  style={inputStyles}
                >
                  <option value="core">📚 Principal (Core)</option>
                  <option value="elective">🎨 Eletiva</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                  Nível da Matéria
                  <span style={{ fontSize: '0.8rem', color: colors.mutedForeground, marginLeft: '0.5rem' }}>
                    🏆 AP = +1.0 GPA
                  </span>
                </label>
                <select
                  value={newSubject.level}
                  onChange={(e) => setNewSubject({ ...newSubject, level: e.target.value as 'regular' | 'honors' | 'ap' })}
                  style={inputStyles}
                >
                  <option value="regular">🎯 Regular</option>
                  <option value="honors">⭐ Honras (+0.5)</option>
                  <option value="ap">🏆 AP (+1.0)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: colors.text, fontWeight: 500, marginBottom: '0.5rem' }}>
                Créditos
                <span style={{ fontSize: '0.8rem', color: colors.mutedForeground, marginLeft: '0.5rem' }}>
                  Peso da matéria no cálculo
                </span>
              </label>
              <select
                value={newSubject.credits}
                onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) })}
                style={inputStyles}
              >
                <option value={0.5}>0.5 créditos</option>
                <option value={1}>1 crédito (padrão)</option>
                <option value={1.5}>1.5 créditos</option>
                <option value={2}>2 créditos</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddSubjectModal(false);
                  setNewSubject({ name: '', type: 'core', level: 'regular', credits: 1 });
                }}
                style={secondaryButtonStyles}
              >
                ❌ Cancelar
              </button>
              <button
                onClick={handleAddSubject}
                disabled={!newSubject.name.trim()}
                style={{
                  ...primaryButtonStyles,
                  opacity: !newSubject.name.trim() ? 0.6 : 1,
                  cursor: !newSubject.name.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                ✅ Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1050,
          backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <span>{notification.type === 'success' ? '✅' : '❌'}</span>
          <span>{notification.message}</span>
        </div>
      )}
    </section>
  );
};

export default CalculatorPage;