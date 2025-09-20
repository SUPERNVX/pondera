import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SectionTitle, SectionSubtitle } from '../components/CommonComponents';
import { lightColors } from '../styles/colors';
import useGPAStore from '../stores/gpaStore';

interface DashboardPageProps {
  colors: typeof lightColors;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ colors }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gpaCalculation, yearlyRecords, student } = useGPAStore();
  
  const [sampleGrades] = useState<{ subject: string; grade: number }[]>([
    { subject: 'Matemática', grade: 9.5 },
    { subject: 'Biologia', grade: 9.0 },
    { subject: 'Língua Portuguesa', grade: 8.5 },
    { subject: 'Artes', grade: 10.0 },
  ]);
  
  const calculateSampleGPA = () => {
    if (sampleGrades.length === 0) return 0;
    const totalGrade = sampleGrades.reduce((sum, item) => sum + item.grade, 0);
    return (totalGrade / sampleGrades.length / 10 * 4.0).toFixed(2);
  };
  
  const hasRealData = gpaCalculation && yearlyRecords.length > 0;
  const displayGPA = hasRealData ? gpaCalculation.unweighted.toFixed(2) : calculateSampleGPA();

  // Adapt chart data for Recharts
  const chartData = hasRealData ? gpaCalculation.yearlyBreakdown.map(y => ({
    name: `${y.year}º Ano`,
    'GPA Não Ponderado': y.unweighted,
    'GPA Ponderado': y.weighted,
  })) : sampleGrades.map(g => ({
    name: g.subject,
    'Nota': g.grade,
  }));

  const sidebarStyles = {
    backgroundColor: colors.mutedBackground,
    padding: '1.5rem',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${colors.border}`,
    minHeight: '100vh'
  };

  const sectionStyles = {
    backgroundColor: colors.mutedBackground,
    borderRadius: '1.5rem',
    padding: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: `1px solid ${colors.border}`
  };

  const buttonStyles = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '1rem',
    marginTop: '1.5rem'
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

  const isLargeScreen = window.innerWidth >= 1024;
  
  if (isLargeScreen) {
    sectionStyles.padding = '3rem';
  }

  return (
    <section className="flex-lg-row">
      <aside style={{ ...sidebarStyles, width: isLargeScreen ? '25%' : '100%' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: colors.primary }}>
          Jornada GPA
        </h2>
        <div className="space-y-4">
          <p style={{ color: colors.text, marginBottom: '1rem' }}>
            {hasRealData ? `${t('hello')}, ${student.name || t('student')}!` : t('welcome_dashboard')}
          </p>
          <p style={{ color: colors.mutedForeground, fontSize: '0.9rem' }}>
            {hasRealData 
              ? t('gpa_summary_calculated')
              : t('start_calculating_gpa')
            }
          </p>
          {!hasRealData && (
            <button
              onClick={() => navigate('/calculator')}
              style={{
                ...primaryButtonStyles,
                width: '100%',
                marginTop: '1rem',
                marginRight: 0
              }}
            >
              🚀 Calcular Meu GPA
            </button>
          )}
          {hasRealData && (
            <div className="space-y-2">
              <button
                onClick={() => navigate('/results')}
                style={{
                  ...primaryButtonStyles,
                  width: '100%',
                  marginTop: '1rem',
                  marginRight: 0
                }}
              >
                📊 Ver Resultados Completos
              </button>
              <button
                onClick={() => navigate('/calculator')}
                style={{
                  ...secondaryButtonStyles,
                  width: '100%',
                  marginTop: '0.5rem',
                  marginRight: 0
                }}
              >
                ✏️ Editar Notas
              </button>
            </div>
          )}
        </div>
      </aside>

      <main style={{ width: isLargeScreen ? '75%' : '100%' }} className="space-y-16">
        {/* GPA Summary */}
        <div style={sectionStyles}>
          <SectionTitle colors={colors}>
            {hasRealData ? 'Seu GPA Atual' : 'Exemplo de GPA'}
          </SectionTitle>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: colors.background,
            borderRadius: '1rem',
            border: `1px solid ${colors.border}`,
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: colors.primary,
              margin: 0
            }}>
              {displayGPA}
            </h3>
            <p style={{
              color: colors.mutedForeground,
              fontSize: '1.1rem',
              marginTop: '0.5rem'
            }}>
              {hasRealData ? 'GPA Não Ponderado' : 'GPA de Exemplo (escala 4.0)'}
            </p>
            {hasRealData && gpaCalculation && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                <div>
                  <p style={{ color: colors.mutedForeground, fontSize: '0.9rem' }}>Ponderado</p>
                  <p style={{ color: colors.primary, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {gpaCalculation.weighted.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p style={{ color: colors.mutedForeground, fontSize: '0.9rem' }}>Matérias Principais</p>
                  <p style={{ color: colors.primary, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {gpaCalculation.coreOnly.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div style={sectionStyles}>
          <SectionTitle colors={colors}>
            {hasRealData ? 'Progresso por Ano' : 'Desempenho por Matéria'}
          </SectionTitle>
          <div style={{
            height: '400px',
            backgroundColor: colors.background,
            borderRadius: '1rem',
            border: `1px solid ${colors.border}`,
            padding: '1rem'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis dataKey="name" stroke={colors.mutedForeground} />
                <YAxis stroke={colors.mutedForeground} domain={hasRealData ? [0, 4.5] : [0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: colors.background, 
                    border: `1px solid ${colors.border}`
                  }} 
                />
                <Legend />
                {hasRealData ? (
                  <>
                    <Line type="monotone" dataKey="GPA Não Ponderado" stroke={colors.primary} strokeWidth={2} />
                    <Line type="monotone" dataKey="GPA Ponderado" stroke={colors.secondary} strokeWidth={2} />
                  </>
                ) : (
                  <Line type="monotone" dataKey="Nota" stroke={colors.primary} strokeWidth={2} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subjects Detail */}
        {hasRealData && yearlyRecords.length > 0 && (
          <div style={sectionStyles}>
            <SectionTitle colors={colors}>Suas Matérias</SectionTitle>
            <SectionSubtitle colors={colors}>
              Resumo das suas notas por ano letivo.
            </SectionSubtitle>
            <div className="space-y-4">
              {yearlyRecords.map((record) => (
                <div key={record.year} style={{
                  backgroundColor: colors.background,
                  borderRadius: '1rem',
                  border: `1px solid ${colors.border}`,
                  padding: '1.5rem'
                }}>
                  <h4 style={{
                    color: colors.primary,
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem'
                  }}>
                    {record.year}º Ano
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {record.subjects.slice(0, 6).map((subjectGrade) => (
                      <div key={subjectGrade.subject.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.mutedBackground
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: colors.text, fontWeight: 600, margin: 0 }}>
                            {subjectGrade.subject.name}
                          </p>
                          <p style={{ color: colors.mutedForeground, fontSize: '0.9rem', margin: 0 }}>
                            Nota: {subjectGrade.finalGrade.toFixed(1)} | GPA: {subjectGrade.gpaPoints.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {record.subjects.length > 6 && (
                    <p style={{
                      color: colors.mutedForeground,
                      fontSize: '0.9rem',
                      marginTop: '1rem',
                      textAlign: 'center'
                    }}>
                      E mais {record.subjects.length - 6} matérias...
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample subjects for non-real data */}
        {!hasRealData && (
          <div style={sectionStyles}>
            <SectionTitle colors={colors}>Exemplo de Notas</SectionTitle>
            <SectionSubtitle colors={colors}>
              Veja como suas notas aparecerão após o cálculo do GPA.
            </SectionSubtitle>
            <ul className="space-y-3">
              {sampleGrades.map((item, index) => (
                <li 
                  key={index} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ color: colors.text, fontWeight: 600, margin: 0 }}>
                      {item.subject}
                    </p>
                    <div className="progress-bar" style={{ marginTop: '0.25rem' }}>
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${item.grade * 10}%`,
                          backgroundColor: colors.primary 
                        }}
                      ></div>
                    </div>
                  </div>
                  <p style={{ 
                    marginLeft: '1rem', 
                    color: colors.primary, 
                    fontWeight: 700,
                    margin: 0
                  }}>
                    {item.grade.toFixed(1)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </section>
  );
};

export default DashboardPage;
