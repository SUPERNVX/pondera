import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { lightColors } from '../../styles/colors';
import type { YearlyGPA } from '../../utils/gpaTypes';

interface GPAEvolutionChartProps {
  data: YearlyGPA[];
  colors: typeof lightColors;
}

// Define a specific interface for the tooltip payload
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload: {
    year: string;
    'GPA Não Ponderado': number;
    'GPA Ponderado': number;
    'GPA Principal': number;
    totalCredits: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const GPAEvolutionChart: React.FC<GPAEvolutionChartProps> = ({ data, colors }) => {
  // Transform data for the chart
  const chartData = data.map(yearly => ({
    year: `${yearly.year}º Ano`,
    'GPA Não Ponderado': yearly.unweighted,
    'GPA Ponderado': yearly.weighted,
    'GPA Principal': yearly.coreOnly,
    totalCredits: yearly.totalCredits
  }));

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
            📚 {label}
          </p>
          {payload.map((entry, index: number) => (
            <p 
              key={index} 
              className="chart-tooltip-entry"
              style={{ color: entry.color }}
            >
              {entry.name}: <strong>{entry.value.toFixed(2)}</strong>
            </p>
          ))}
          {payload[0]?.payload?.totalCredits && (
            <p 
              className="chart-tooltip-footer"
              style={{ 
                color: colors.mutedForeground,
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              🎓 Total de Créditos: {payload[0].payload.totalCredits}
            </p>
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
        📈 Evolução do GPA ao Longo dos Anos
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis 
            dataKey="year" 
            stroke={colors.mutedForeground}
            fontSize={12}
          />
          <YAxis 
            domain={[0, 4.5]}
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
          <Line 
            type="monotone" 
            dataKey="GPA Não Ponderado" 
            stroke={colors.primary}
            strokeWidth={3}
            dot={{ fill: colors.primary, strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: colors.primary, strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="GPA Ponderado" 
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="GPA Principal" 
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: "#f59e0b", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div 
        className="chart-info-tip"
        style={{
          backgroundColor: colors.mutedBackground,
          color: colors.mutedForeground
        }}
      >
        💡 <strong>Dica:</strong> Passe o mouse sobre os pontos para ver detalhes. 
        O GPA ponderado considera bônus para matérias Honras (+0.5) e AP (+1.0).
      </div>
    </div>
  );
};

export default GPAEvolutionChart;
