// =============================================
// COMPONENTE: GRÁFICO DE LÍNEAS REUTILIZABLE
// =============================================

'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { commonChartOptions } from '@/lib/chartConfig';

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor?: string;
      tension?: number;
      fill?: boolean;
    }[];
  };
  options?: any;
  height?: string;
  emptyMessage?: string;
}

export default function LineChart({ 
  data, 
  options, 
  height = 'h-64',
  emptyMessage = 'Sin datos disponibles'
}: LineChartProps) {
  const hasData = data.datasets.some(dataset => dataset.data.length > 0);

  return (
    <div className={height}>
      {hasData ? (
        <Line data={data} options={options || commonChartOptions} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
