# Guia de Reimplementação: Modo em Lote (Batch Mode)

Este documento descreve a funcionalidade e a estrutura da página de cálculo de GPA em lote, que foi removida para resolver um problema de build.

## Visão Geral da Funcionalidade

O objetivo do "Modo em Lote" é permitir que um usuário (provavelmente um administrador ou conselheiro escolar) faça o upload de um arquivo CSV contendo dados de múltiplos estudantes para calcular o GPA de todos de uma só vez.

O fluxo de trabalho do usuário é o seguinte:

1.  **Download do Template:** O usuário pode baixar um arquivo CSV de modelo para ver a estrutura de dados esperada.
2.  **Upload do Arquivo:** O usuário faz o upload do seu próprio arquivo CSV.
3.  **Mapeamento de Colunas:** A interface mostra uma prévia dos dados e permite que o usuário mapeie as colunas do seu arquivo (ex: "Nome do Aluno", "Escola") para os campos que o sistema espera (ex: `name`, `school`).
4.  **Processamento:** O sistema processa o arquivo, mostrando uma barra de progresso.
5.  **Exibição dos Resultados:** Uma tabela é exibida com o GPA calculado para cada estudante no arquivo.
6.  **Exportação (Futuro):** A interface inclui botões para exportar relatórios individuais ou consolidados (funcionalidade não implementada).

## Estrutura da Interface e Lógica

A página é um único componente React (`BatchPage.tsx`) que gerencia vários estados:

-   `file`: O arquivo CSV enviado pelo usuário (`useState<File | null>`).
-   `previewData`: Um subconjunto dos dados do CSV para pré-visualização e mapeamento (`useState<string[][]>`).
-   `columnMapping`: Um objeto que armazena o mapeamento das colunas (`useState<Record<string, number>>`).
-   `isProcessing`, `progress`: Para controlar a exibição da barra de progresso (`useState<boolean>`, `useState<number>`).
-   `results`: Um array para armazenar os resultados do cálculo para cada estudante (`useState<BatchResult[]>` - a interface `BatchResult` precisa ser definida).

### Componente Principal (`BatchPage.tsx`)

```jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// A interface para os resultados deve ser definida aqui
interface BatchResult {
  id: number;
  name: string;
  unweightedGPA: number; // Ou string, dependendo da implementação
  weightedGPA: number;   // Ou string
  status: string;
}

const BatchPage: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BatchResult[]>([]);

  // Lógica para lidar com a mudança de arquivo (handleFileChange)
  // Lógica para parsear o CSV (parseCSV) - FileReader API
  // Lógica para o mapeamento de colunas (handleColumnMapping)
  // Lógica para processar o lote (processBatch) - simula com setInterval
  // Lógica para baixar o template (downloadTemplate) - cria um Blob e link

  return (
    <div className="space-y-12">
      {/* Título da Página */}
      <div className="text-center">...</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seção de Upload */}
        <div className="... shadow-lg ...">
          {/* Botão para Download do Template */}
          {/* Input para Upload de Arquivo */}
          {/* Exibição do arquivo selecionado */}
        </div>

        {/* Seção de Instruções */}
        <div className="... shadow-lg ...">
          {/* Detalhes sobre formato, colunas, etc. */}
        </div>
      </div>

      {/* Pré-visualização e Mapeamento de Dados */}
      {previewData.length > 0 && (
        <div className="... shadow-lg ...">
          {/* Tabela para mapear colunas do sistema com colunas do arquivo */}
          {/* Tabela de pré-visualização dos dados do CSV */}
          {/* Botão para iniciar o processamento */}
        </div>
      )}

      {/* Barra de Progresso */}
      {isProcessing && (
        <div className="... shadow-lg ...">
          {/* Barra de progresso visual */}
        </div>
      )}

      {/* Tabela de Resultados */}
      {results.length > 0 && (
        <div className="... shadow-lg ...">
          {/* Tabela com ID, Nome, GPAs e Status para cada estudante */}
          {/* Botões para exportar resultados */}
        </div>
      )}
    </div>
  );
};

export default BatchPage;
```
