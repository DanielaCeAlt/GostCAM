// =============================================
// COMPONENTE: GRÁFICO DE DONA REUTILIZABLE
// =============================================

'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { commonChartOptions } from '@/lib/chartConfig';

interface DoughnutChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth?: number;
      borderColor?: string | string[];
    }[];
  };
  options?: any;
  height?: string;
  emptyMessage?: string;
}

export default function DoughnutChart({ 
  data, 
  options, 
  height = 'h-64',
  emptyMessage = 'Sin datos disponibles'
}: DoughnutChartProps) {
  const hasData = data.datasets.some(dataset => dataset.data.length > 0);

  return (
    <div className={height}>
      {hasData ? (
        <Doughnut data={data} options={options || commonChartOptions} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
