import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { lightColors } from '../../styles/colors';
import type { YearlyRecord } from '../../utils/gpaTypes';
import { calculateAnnualPerformanceMetrics } from '../../utils/gpaCalculator';

interface AnnualComparisonChartProps {
  yearlyRecords: YearlyRecord[];
  colors: typeof lightColors;
}

// Define a specific interface for the tooltip payload
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload: {
    year: string;
    yearNumber: number;
    'Média de Notas': number;
    'GPA Médio': number;
    'Créditos Cursados': number;
    'Total de Créditos': number;
    'Matérias Concluídas': number;
    'Total de Matérias': number;
    'Excelente (9-10)': number;
    'Bom (7-8.9)': number;
    'Regular (6-6.9)': number;
    'Insuficiente (<6)': number;
    completionRate: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const AnnualComparisonChart: React.FC<AnnualComparisonChartProps> = ({ yearlyRecords, colors }) => {
  // Process data for annual comparison using the centralized utility
  const chartData = yearlyRecords.map(record => {
    const metrics = calculateAnnualPerformanceMetrics(record);
    return {
      year: `${record.year}º Ano`,
      yearNumber: record.year,
      'Média de Notas': metrics.avgGrade,
      'GPA Médio': metrics.avgGPA,
      'Créditos Cursados': metrics.earnedCredits,
      'Total de Créditos': metrics.totalCredits,
      'Matérias Concluídas': metrics.completedSubjectsCount,
      'Total de Matérias': metrics.totalSubjectsCount,
      'Excelente (9-10)': metrics.excellentGrades,
      'Bom (7-8.9)': metrics.goodGrades,
      'Regular (6-6.9)': metrics.averageGrades,
      'Insuficiente (<6)': metrics.poorGrades,
      completionRate: metrics.completionRate
    };
  });

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div 
          className="chart-tooltip"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            minWidth: '200px'
          }}
        >
          <p 
            className="chart-tooltip-title"
            style={{ 
              color: colors.text,
              fontSize: '1rem'
            }}
          >
            📚 {label}
          </p>
          
          {payload.map((entry, index: number) => (
            <p 
              key={index} 
              className="chart-tooltip-entry"
              style={{ color: entry.color }}
            >
              {entry.name}: <strong>{entry.value.toFixed(1)}</strong>
            </p>
          ))}
          
          {data && (
            <div 
              className="chart-tooltip-footer"
              style={{
                borderTop: `1px solid ${colors.border}`,
                color: colors.mutedForeground
              }}
            >
              <p>📊 Matérias: {data['Matérias Concluídas']}/{data['Total de Matérias']}</p>
              <p>🎓 Créditos: {data['Créditos Cursados']}/{data['Total de Créditos']}</p>
              <p>📈 Taxa de Conclusão: {data.completionRate.toFixed(1)}%</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="chart-container"
      style={{
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      <h3 
        className="chart-title"
        style={{ color: colors.primary }}
      >
        📊 Comparação Anual de Performance
      </h3>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis 
            dataKey="year" 
            stroke={colors.mutedForeground}
            fontSize={12}
          />
          <YAxis 
            stroke={colors.mutedForeground}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '1rem',
              fontSize: '0.9rem'
            }}
          />
          
          <Bar 
            dataKey="Média de Notas" 
            fill={colors.primary} 
            radius={[4, 4, 0, 0]}
            name="Média de Notas (0-10)"
          />
          <Bar 
            dataKey="GPA Médio" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            name="GPA Médio (0-4)"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Performance breakdown */}
      <div className="chart-year-grid">
        {chartData.map((yearData) => (
          <div 
            key={yearData.year} 
            className="chart-year-card"
            style={{
              backgroundColor: colors.mutedBackground,
              border: `1px solid ${colors.border}`
            }}
          >
            <h4 
              className="chart-year-title"
              style={{ color: colors.primary }}
            >
              {yearData.year}
            </h4>
            
            <div 
              className="chart-grade-stats"
              style={{ color: colors.text }}
            >
              <div className="chart-grade-item">
                <span>🌟 Excelente:</span>
                <strong style={{ color: colors.primary }}>{yearData['Excelente (9-10)']}</strong>
              </div>
              <div className="chart-grade-item">
                <span>✅ Bom:</span>
                <strong style={{ color: '#10b981' }}>{yearData['Bom (7-8.9)']}</strong>
              </div>
              <div className="chart-grade-item">
                <span>⚠️ Regular:</span>
                <strong style={{ color: '#f59e0b' }}>{yearData['Regular (6-6.9)']}</strong>
              </div>
              <div className="chart-grade-item">
                <span>❌ Insuficiente:</span>
                <strong style={{ color: '#ef4444' }}>{yearData['Insuficiente (<6)']}</strong>
              </div>
            </div>
            
            <div 
              className="chart-completion-rate"
              style={{
                borderTop: `1px solid ${colors.border}`,
                color: colors.mutedForeground
              }}
            >
              Taxa de Conclusão: <strong>{yearData.completionRate.toFixed(1)}%</strong>
            </div>
          </div>
        ))}
      </div>
      
      <div 
        className="chart-info-tip"
        style={{
          backgroundColor: colors.mutedBackground,
          color: colors.mutedForeground
        }}
      >
        💡 <strong>Insights:</strong> Analise sua evolução ao longo dos anos. 
        Identifique padrões de melhoria ou áreas que precisam de mais atenção.
      </div>
    </div>
  );
};

export default AnnualComparisonChart;
