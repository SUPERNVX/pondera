import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

import useGPAStore from '@/stores/gpaStore';
import type { GPAStore } from '@/stores/gpaStore';
import type { YearlyRecord, SubjectGrade, YearlyGPA } from './gpaTypes';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export interface BatchResult {
  id: string;
  name: string;
  unweightedGPA: number;
  weightedGPA: number;
  status: string;
}

// Function to export GPA results as PDF
export const exportAsPDF = async (includeCharts: boolean = false) => {
  const { student, gpaCalculation, yearlyRecords } = useGPAStore.getState() as GPAStore;

  if (!gpaCalculation) {
    console.error('No GPA calculation available');
    return;
  }

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(22);
  doc.text('Relatório de GPA - Pondera', 105, 20, { align: 'center' });

  // Add student information
  doc.setFontSize(12);
  doc.text(`Estudante: ${student.name || 'Não informado'}`, 20, 40);
  doc.text(`Escola: ${student.school || 'Não informada'}`, 20, 50);
  doc.text(`Ano de Formatura: ${student.graduationYear}`, 20, 60);

  // Add GPA summary
  doc.setFontSize(16);
  doc.text('Resumo do GPA', 20, 80);

  doc.setFontSize(12);
  doc.text(`GPA Não Ponderado: ${gpaCalculation.unweighted.toFixed(2)}`, 20, 95);
  doc.text(`GPA Ponderado: ${gpaCalculation.weighted.toFixed(2)}`, 20, 105);
  doc.text(`GPA Principal: ${gpaCalculation.coreOnly.toFixed(2)}`, 20, 115);

  let yOffset = 130;

  // Add yearly breakdown
  doc.setFontSize(16);
  doc.text('Detalhamento por Ano', 20, yOffset);
  yOffset += 10;

  yearlyRecords.forEach((record: YearlyRecord, index: number) => {
    const yearlyGPA = gpaCalculation.yearlyBreakdown.find((y: YearlyGPA) => y.year === record.year);

    if (yearlyGPA) {
      doc.setFontSize(14);
      doc.text(`${record.year}º Ano`, 20, yOffset);
      yOffset += 10;

      doc.setFontSize(12);
      doc.text(`GPA Não Ponderado: ${yearlyGPA.unweighted.toFixed(2)}`, 30, yOffset);
      yOffset += 7;
      doc.text(`GPA Ponderado: ${yearlyGPA.weighted.toFixed(2)}`, 30, yOffset);
      yOffset += 7;
      doc.text(`GPA Principal: ${yearlyGPA.coreOnly.toFixed(2)}`, 30, yOffset);
      yOffset += 15;
    }

    // Add subjects table for this year
    const tableData = record.subjects.map((subjectGrade: SubjectGrade) => [
      subjectGrade.subject.name,
      subjectGrade.subject.type === 'core' ? 'Principal' : 'Eletiva',
      subjectGrade.subject.level === 'regular' ? 'Regular' :
        subjectGrade.subject.level === 'honors' ? 'Honras' : 'AP',
      subjectGrade.subject.credits.toString(),
      subjectGrade.finalGrade.toFixed(2)
    ]);

    autoTable(doc, {
      head: [['Disciplina', 'Tipo', 'Nível', 'Créditos', 'Média Final']],
      body: tableData,
      startY: yOffset,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 100, 255] },
    });

    yOffset = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

    // Add page break if needed
    if (yOffset > 250 && index < yearlyRecords.length - 1) {
      doc.addPage();
      yOffset = 20;
    }
  });

  // Add charts if requested
  if (includeCharts) {
    // Add charts section
    doc.addPage();
    doc.setFontSize(22);
    doc.text('Gráficos de Desempenho', 105, 20, { align: 'center' });
    
    // Note about charts being added separately
    doc.setFontSize(12);
    doc.text('Os gráficos interativos foram convertidos para imagens.', 105, 40, { align: 'center' });
    doc.text('Para visualizar os gráficos interativos, use a versão web do Pondera.', 105, 50, { align: 'center' });
    
    // Add placeholder text for now
    // In a real implementation, we would capture the actual chart elements
    doc.setFontSize(14);
    doc.text('Evolução do GPA ao Longo dos Anos', 20, 70);
    doc.setFontSize(10);
    doc.text('[Imagem do gráfico de evolução do GPA]', 20, 80);
    
    doc.setFontSize(14);
    doc.text('Distribuição de Matérias por Tipo', 20, 120);
    doc.setFontSize(10);
    doc.text('[Imagem do gráfico de distribuição de matérias]', 20, 130);
    
    doc.setFontSize(14);
    doc.text('Comparação Anual de Desempenho', 20, 170);
    doc.setFontSize(10);
    doc.text('[Imagem do gráfico de comparação anual]', 20, 180);
  }

  // Add disclaimer
  let finalYOffset = includeCharts ? 200 : yOffset;
  if (includeCharts) {
    finalYOffset = 200;
  }
  
  doc.setFontSize(10);
  doc.text(
    'Este documento é uma conversão não-oficial de notas para o sistema GPA americano. ' +
    'Universidades podem usar métodos próprios de conversão. Consulte sempre os requisitos ' +
    'específicos de cada instituição.',
    105,
    finalYOffset + 20,
    { align: 'center', maxWidth: 180 }
  );

  // Save the PDF
  doc.save(`relatorio-gpa-${student.name || 'estudante'}.pdf`);
};

// Function to export GPA results as CSV
export const exportAsCSV = () => {
  const { student, gpaCalculation, yearlyRecords } = useGPAStore.getState() as GPAStore;

  if (!gpaCalculation) {
    console.error('No GPA calculation available');
    return;
  }

  // Create CSV content
  let csvContent = 'Relatório de GPA - Pondera\n\n';

  // Student information
  csvContent += `Nome: ${student.name || 'Não informado'}\n`;
  csvContent += `Escola: ${student.school || 'Não informada'}\n`;
  csvContent += `Ano de Formatura: ${student.graduationYear}\n\n`;

  // GPA summary
  csvContent += 'Resumo do GPA\n';
  csvContent += `GPA Não Ponderado,${gpaCalculation.unweighted.toFixed(2)}\n`;
  csvContent += `GPA Ponderado,${gpaCalculation.weighted.toFixed(2)}\n`;
  csvContent += `GPA Principal,${gpaCalculation.coreOnly.toFixed(2)}\n\n`;

  // Yearly breakdown
  csvContent += 'Detalhamento por Ano\n';
  csvContent += 'Ano,GPA Não Ponderado,GPA Ponderado,GPA Principal\n';

  gpaCalculation.yearlyBreakdown.forEach((yearly: YearlyGPA) => {
    csvContent += `${yearly.year}º Ano,${yearly.unweighted.toFixed(2)},${yearly.weighted.toFixed(2)},${yearly.coreOnly.toFixed(2)}\n`;
  });

  csvContent += '\n';

  // Subjects details for each year
  yearlyRecords.forEach((record: YearlyRecord) => {
    csvContent += `\n${record.year}º Ano - Disciplinas\n`;
    csvContent += 'Disciplina,Tipo,Nível,Créditos,Média Final\n';

    record.subjects.forEach((subjectGrade: SubjectGrade) => {
      csvContent += `${subjectGrade.subject.name},${subjectGrade.subject.type === 'core' ? 'Principal' : 'Eletiva'},${subjectGrade.subject.level === 'regular' ? 'Regular' : subjectGrade.subject.level === 'honors' ? 'Honras' : 'AP'},${subjectGrade.subject.credits},${subjectGrade.finalGrade.toFixed(2)}\n`;
    });
  });

  // Add disclaimer
  csvContent += '\n"Este documento é uma conversão não-oficial de notas para o sistema GPA americano. Universidades podem usar métodos próprios de conversão. Consulte sempre os requisitos específicos de cada instituição."\n';

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio-gpa-${student.name || 'estudante'}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to export batch results as CSV
export const exportBatchAsCSV = (results: BatchResult[]) => {
  if (!results || results.length === 0) {
    console.error('No batch results available');
    return;
  }

  // Create CSV header
  let csvContent = 'ID,Nome,GPA Não Ponderado,GPA Ponderado,Status\n';

  // Add results data
  results.forEach(result => {
    csvContent += `${result.id},${result.name},${result.unweightedGPA},${result.weightedGPA},${result.status}\n`;
  });

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'resultados-lote.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};