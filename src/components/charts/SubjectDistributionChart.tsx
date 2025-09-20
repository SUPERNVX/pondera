import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { lightColors } from '../../styles/colors';
import type { YearlyRecord } from '../../utils/gpaTypes';
import { processSubjectDistributionData } from '../../utils/gpaCalculator';

interface SubjectDistributionChartProps {
  yearlyRecords: YearlyRecord[];
  colors: typeof lightColors;
}

// Define a specific interface for the tooltip payload
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const SubjectDistributionChart: React.FC<SubjectDistributionChartProps> = ({ yearlyRecords, colors }) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Process data based on selected year using the centralized utility
  const chartData = processSubjectDistributionData(yearlyRecords, selectedYear);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="chart-tooltip"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
          }}
        >
          <p 
            className="chart-tooltip-title"
            style={{ color: colors.text }}
          >
            📊 {label}
          </p>
          {payload.map((entry, index: number) => {
            if (entry.value > 0) {
              return (
                <p 
                  key={index} 
                  className="chart-tooltip-entry"
                  style={{ color: entry.color }}
                >
                  {entry.dataKey}: <strong>{entry.value.toFixed(1)}</strong>
                  <span style={{ color: colors.mutedForeground, fontSize: '0.8rem' }}>
                    {' '}(nota média)
                  </span>
                </p>
              );
            }
            return null;
          })}
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
      <div className="chart-header">
        <h3 
          className="chart-title"
          style={{
            color: colors.primary,
            margin: 0
          }}
        >
          📊 Distribuição por Tipo de Disciplina
        </h3>
        
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          className="chart-select"
          style={{
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.background,
            color: colors.text,
          }}
        >
          <option value="all">📚 Todos os Anos</option>
          <option value={1}>1️⃣ 1º Ano</option>
          <option value={2}>2️⃣ 2º Ano</option>
          <option value={3}>3️⃣ 3º Ano</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis 
            dataKey="category" 
            stroke={colors.mutedForeground}
            fontSize={12}
          />
          <YAxis 
            domain={[0, 10]}
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
          
          {/* Type bars */}
          <Bar dataKey="Principais" fill={colors.primary} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Eletivas" fill={colors.secondary} radius={[4, 4, 0, 0]} />
          
          {/* Level bars */}
          <Bar dataKey="Regular" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Honras" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="AP" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      
      <div 
        className="chart-info-tip"
        style={{
          backgroundColor: colors.mutedBackground,
          color: colors.mutedForeground
        }}
      >
        💡 <strong>Análise:</strong> Compare seu desempenho entre matérias principais vs eletivas, 
        e entre diferentes níveis de dificuldade. Use o filtro para focar em anos específicos.
      </div>
    </div>
  );
};

export default SubjectDistributionChart;
