// =============================================
// COMPONENTE: GRÁFICO DE BARRAS REUTILIZABLE
// =============================================

'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { barChartOptions } from '@/lib/chartConfig';

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: any;
  height?: string;
  emptyMessage?: string;
}

export default function BarChart({ 
  data, 
  options, 
  height = 'h-64',
  emptyMessage = 'Sin datos disponibles'
}: BarChartProps) {
  const hasData = data.datasets.some(dataset => dataset.data.length > 0);

  return (
    <div className={height}>
      {hasData ? (
        <Bar data={data} options={options || barChartOptions} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
