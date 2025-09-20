import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGPAStore from '../stores/gpaStore';
import { useTranslation } from 'react-i18next';
import { exportAsPDF, exportAsCSV } from '../utils/exportUtils';
import { lightColors } from '../styles/colors';

// Import new chart components
import GPAEvolutionChart from '../components/charts/GPAEvolutionChart';
import SubjectDistributionChart from '../components/charts/SubjectDistributionChart';
import AnnualComparisonChart from '../components/charts/AnnualComparisonChart';

// Import new UI components
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import GPABadge from '../components/ui/GPABadge';
import TrendIndicator from '../components/ui/TrendIndicator';

interface ResultsPageProps {
  colors?: typeof lightColors;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ colors = lightColors }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { student, gpaCalculation, yearlyRecords } = useGPAStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'details'>('overview');
  const [includeChartsInPDF, setIncludeChartsInPDF] = useState<boolean>(true);

  if (!gpaCalculation) {
    navigate('/calculator');
    return null;
  }

  // Calculate additional statistics
  const totalSubjects = yearlyRecords.reduce((sum, record) => sum + record.subjects.length, 0);
  const completedSubjects = yearlyRecords.reduce((sum, record) => 
    sum + record.subjects.filter(s => s.finalGrade > 0).length, 0
  );
  const totalCredits = yearlyRecords.reduce((sum, record) => 
    sum + record.subjects.reduce((subSum, s) => subSum + s.subject.credits, 0), 0
  );
  const earnedCredits = yearlyRecords.reduce((sum, record) => 
    sum + record.subjects.filter(s => s.finalGrade > 0).reduce((subSum, s) => subSum + s.subject.credits, 0), 0
  );

  // Calculate trends (comparing last year with previous)
  const lastYearGPA = gpaCalculation.yearlyBreakdown[gpaCalculation.yearlyBreakdown.length - 1];
  const previousYearGPA = gpaCalculation.yearlyBreakdown[gpaCalculation.yearlyBreakdown.length - 2];

  // Get subject type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'core': return t('core_subject');
      case 'elective': return t('elective_subject');
      default: return type;
    }
  };

  // Get subject level label
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'regular': return t('regular_level');
      case 'honors': return t('honors_level');
      case 'ap': return t('ap_level');
      default: return level;
    }
  };

  const handleExportPDF = async () => {
    await exportAsPDF(includeChartsInPDF);
  };

  const handleExportCSV = () => {
    exportAsCSV();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.background,
      color: colors.text,
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: colors.primary,
            marginBottom: '1rem'
          }}>
            📊 {t('gpa_results_title') || 'Resultados do GPA'}
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: colors.mutedForeground,
            marginBottom: '2rem'
          }}>
            {student.name ? 
              `Resultados para ${student.name}` : 
              t('your_gpa_results')
            }
          </p>
          
          {/* GPA Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <GPABadge 
              gpa={gpaCalculation.unweighted}
              colors={colors}
              variant="detailed"
              size="large"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '3rem',
          borderBottom: `1px solid ${colors.border}`
        }}>
          {[
            { key: 'overview', label: '📊 Visão Geral', icon: '📊' },
            { key: 'charts', label: '📈 Gráficos', icon: '📈' },
            { key: 'details', label: '📋 Detalhes', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'overview' | 'charts' | 'details')}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab.key ? colors.primary : colors.mutedForeground,
                fontSize: '1rem',
                fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: 'pointer',
                borderBottom: activeTab === tab.key ? `3px solid ${colors.primary}` : '3px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Summary Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              <StatCard
                title={t('unweighted_gpa')}
                value={gpaCalculation.unweighted.toFixed(2)}
                subtitle={t('unweighted_gpa_desc')}
                icon="📚"
                colors={colors}
                variant="primary"
                trend={previousYearGPA ? (lastYearGPA.unweighted > previousYearGPA.unweighted ? 'up' : 
                       lastYearGPA.unweighted < previousYearGPA.unweighted ? 'down' : 'stable') : undefined}
                trendValue={previousYearGPA ? 
                  `${(lastYearGPA.unweighted - previousYearGPA.unweighted).toFixed(2)}` : undefined}
              />
              
              <StatCard
                title={t('weighted_gpa')}
                value={gpaCalculation.weighted.toFixed(2)}
                subtitle={t('weighted_gpa_desc')}
                icon="⭐"
                colors={colors}
                variant="success"
                trend={previousYearGPA ? (lastYearGPA.weighted > previousYearGPA.weighted ? 'up' : 
                       lastYearGPA.weighted < previousYearGPA.weighted ? 'down' : 'stable') : undefined}
                trendValue={previousYearGPA ? 
                  `${(lastYearGPA.weighted - previousYearGPA.weighted).toFixed(2)}` : undefined}
              />
              
              <StatCard
                title={t('core_gpa')}
                value={gpaCalculation.coreOnly.toFixed(2)}
                subtitle={t('core_gpa_desc')}
                icon="🎯"
                colors={colors}
                variant="warning"
                trend={previousYearGPA ? (lastYearGPA.coreOnly > previousYearGPA.coreOnly ? 'up' : 
                       lastYearGPA.coreOnly < previousYearGPA.coreOnly ? 'down' : 'stable') : undefined}
                trendValue={previousYearGPA ? 
                  `${(lastYearGPA.coreOnly - previousYearGPA.coreOnly).toFixed(2)}` : undefined}
              />
              
              <StatCard
                title="Total de Créditos"
                value={earnedCredits}
                subtitle={`de ${totalCredits} possíveis`}
                icon="🎓"
                colors={colors}
              />
            </div>

            {/* Progress Indicators */}
            <div style={{
              backgroundColor: colors.mutedBackground,
              borderRadius: '1rem',
              border: `1px solid ${colors.border}`,
              padding: '2rem'
            }}>
              <h3 style={{
                color: colors.primary,
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1.5rem'
              }}>
                📈 Progresso Acadêmico
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <ProgressBar
                  value={completedSubjects}
                  max={totalSubjects}
                  label={t('completed_subjects')}
                  colors={colors}
                  variant="success"
                  showValue
                  size="large"
                />
                
                <ProgressBar
                  value={earnedCredits}
                  max={totalCredits}
                  label={t('credits_obtained')}
                  colors={colors}
                  variant="default"
                  showValue
                  size="large"
                />
                
                <ProgressBar
                  value={gpaCalculation.unweighted}
                  max={4}
                  label="GPA Progress (Meta: 3.5)"
                  colors={colors}
                  variant={gpaCalculation.unweighted >= 3.5 ? 'success' : 'warning'}
                  showValue
                  size="large"
                />
              </div>
            </div>

            {/* Trends */}
            {previousYearGPA && (
              <div style={{
                backgroundColor: colors.mutedBackground,
                borderRadius: '1rem',
                border: `1px solid ${colors.border}`,
                padding: '2rem'
              }}>
                <h3 style={{
                  color: colors.primary,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem'
                }}>
                  📊 Tendências de Performance
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  <TrendIndicator
                    value={lastYearGPA.unweighted}
                    previousValue={previousYearGPA.unweighted}
                    label="GPA Não Ponderado"
                    colors={colors}
                    size="large"
                  />
                  
                  <TrendIndicator
                    value={lastYearGPA.weighted}
                    previousValue={previousYearGPA.weighted}
                    label="GPA Ponderado"
                    colors={colors}
                    size="large"
                  />
                  
                  <TrendIndicator
                    value={lastYearGPA.coreOnly}
                    previousValue={previousYearGPA.coreOnly}
                    label="GPA Principal"
                    colors={colors}
                    size="large"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <GPAEvolutionChart 
              data={gpaCalculation.yearlyBreakdown}
              colors={colors}
            />
            
            <SubjectDistributionChart 
              yearlyRecords={yearlyRecords}
              colors={colors}
            />
            
            <AnnualComparisonChart 
              yearlyRecords={yearlyRecords}
              colors={colors}
            />
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Student Information */}
            <div style={{
              backgroundColor: colors.mutedBackground,
              borderRadius: '1rem',
              border: `1px solid ${colors.border}`,
              padding: '2rem'
            }}>
              <h3 style={{
                color: colors.primary,
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1.5rem'
              }}>
                👤 Informações do Estudante
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <strong style={{ color: colors.text }}>{t('name')}:</strong>
                  <p style={{ color: colors.mutedForeground, margin: '0.25rem 0' }}>
                    {student.name || t('not_informed')}
                  </p>
                </div>
                <div>
                  <strong style={{ color: colors.text }}>{t('school')}:</strong>
                  <p style={{ color: colors.mutedForeground, margin: '0.25rem 0' }}>
                    {student.school || t('not_informed')}
                  </p>
                </div>
                <div>
                  <strong style={{ color: colors.text }}>Ano de Formatura:</strong>
                  <p style={{ color: colors.mutedForeground, margin: '0.25rem 0' }}>
                    {student.graduationYear}
                  </p>
                </div>
                <div>
                  <strong style={{ color: colors.text }}>Data do Cálculo:</strong>
                  <p style={{ color: colors.mutedForeground, margin: '0.25rem 0' }}>
                    {new Date(gpaCalculation.calculatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown by Year */}
            {yearlyRecords.map((record) => {
              const yearlyGPA = gpaCalculation.yearlyBreakdown.find(y => y.year === record.year);
              
              return (
                <div key={record.year} style={{
                  backgroundColor: colors.mutedBackground,
                  borderRadius: '1rem',
                  border: `1px solid ${colors.border}`,
                  padding: '2rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{
                      color: colors.primary,
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      margin: 0
                    }}>
                      📚 {record.year}º Ano
                    </h3>
                    
                    {yearlyGPA && (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <GPABadge 
                          gpa={yearlyGPA.unweighted}
                          colors={colors}
                          size="small"
                          showLabel={false}
                        />
                      </div>
                    )}
                  </div>

                  {yearlyGPA && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <StatCard
                        title="GPA Não Ponderado"
                        value={yearlyGPA.unweighted.toFixed(2)}
                        colors={colors}
                        size="small"
                      />
                      <StatCard
                        title="GPA Ponderado"
                        value={yearlyGPA.weighted.toFixed(2)}
                        colors={colors}
                        size="small"
                        variant="success"
                      />
                      <StatCard
                        title="GPA Principal"
                        value={yearlyGPA.coreOnly.toFixed(2)}
                        colors={colors}
                        size="small"
                        variant="warning"
                      />
                      <StatCard
                        title="Total de Créditos"
                        value={yearlyGPA.totalCredits}
                        colors={colors}
                        size="small"
                      />
                    </div>
                  )}
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: colors.secondary }}>
                          <th style={{ padding: '0.75rem', textAlign: 'left', color: colors.secondaryForeground, borderRadius: '0.5rem 0 0 0.5rem' }}>
                            {t('subject')}
                          </th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground }}>
                            {t('type')}
                          </th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground }}>
                            {t('level')}
                          </th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground }}>
                            {t('credits')}
                          </th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground }}>
                            Nota Final
                          </th>
                          <th style={{ padding: '0.75rem', textAlign: 'center', color: colors.secondaryForeground, borderRadius: '0 0.5rem 0.5rem 0' }}>
                            Pontos GPA
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.subjects.map((subjectGrade) => (
                          <tr key={subjectGrade.subject.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                            <td style={{ padding: '0.75rem', color: colors.text, fontWeight: 500 }}>
                              {subjectGrade.subject.name}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: subjectGrade.subject.type === 'core' ? colors.primary : colors.secondary,
                                color: subjectGrade.subject.type === 'core' ? colors.primaryForeground : colors.secondaryForeground
                              }}>
                                {getTypeLabel(subjectGrade.subject.type)}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: colors.mutedBackground,
                                color: colors.mutedForeground
                              }}>
                                {getLevelLabel(subjectGrade.subject.level)}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center', color: colors.text }}>
                              {subjectGrade.subject.credits}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
                              <GPABadge 
                                gpa={subjectGrade.finalGrade}
                                scale={10}
                                colors={colors}
                                size="small"
                                showLabel={false}
                              />
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center', color: colors.primary, fontWeight: 600 }}>
                              {subjectGrade.gpaPoints.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: colors.mutedBackground,
          borderRadius: '1rem',
          border: `1px solid ${colors.border}`
        }}>
          <h3 style={{
            color: colors.primary,
            fontSize: '1.25rem',
            fontWeight: 600,
            margin: 0
          }}>
            📤 Exportar Resultados
          </h3>
          
          {/* PDF Chart Inclusion Option */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: colors.background,
            borderRadius: '0.5rem',
            border: `1px solid ${colors.border}`
          }}>
            <input
              type="checkbox"
              id="includeCharts"
              checked={includeChartsInPDF}
              onChange={(e) => setIncludeChartsInPDF(e.target.checked)}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                accentColor: colors.primary
              }}
            />
            <label 
              htmlFor="includeCharts"
              style={{
                color: colors.text,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Incluir gráficos no PDF
            </label>
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button 
              onClick={() => navigate('/calculator')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: colors.secondary,
                color: colors.secondaryForeground,
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              ← Voltar ao Editor
            </button>
            
            <button 
              onClick={handleExportPDF}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: colors.primary,
                color: colors.primaryForeground,
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              📄 {t('export_pdf')}
            </button>
            
            <button 
              onClick={handleExportCSV}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              📊 {t('export_csv')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;