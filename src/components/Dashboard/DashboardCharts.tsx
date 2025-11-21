// =============================================
// COMPONENTE: GRÁFICOS REUTILIZABLES PARA DASHBOARDS
// =============================================

'use client';

import React from 'react';
import BarChart from '@/components/ui/charts/BarChart';
import DoughnutChart from '@/components/ui/charts/DoughnutChart';
import LineChart from '@/components/ui/charts/LineChart';
import { chartColors } from '@/lib/chartConfig';

interface EquiposPorTipoChartProps {
  data: { tipo: string; cantidad: number }[];
}

export function EquiposPorTipoChart({ data }: EquiposPorTipoChartProps) {
  const chartData = {
    labels: data.map(item => item.tipo),
    datasets: [
      {
        label: 'Cantidad de Equipos',
        data: data.map(item => item.cantidad),
        backgroundColor: chartColors.primary,
        borderColor: chartColors.borders,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipos por Tipo</h3>
      <BarChart data={chartData} />
    </div>
  );
}

interface EstatusPorcentajesChartProps {
  data: { estatus: string; porcentaje: number; color: string }[];
}

export function EstatusPorcentajesChart({ data }: EstatusPorcentajesChartProps) {
  const chartData = {
    labels: data.map(item => item.estatus),
    datasets: [
      {
        data: data.map(item => item.porcentaje),
        backgroundColor: data.map(item => item.color),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estatus</h3>
      <DoughnutChart data={chartData} />
    </div>
  );
}

interface MovimientosPorTipoChartProps {
  totalTraslados: number;
  totalMantenimientos: number;
  totalReparaciones: number;
}

export function MovimientosPorTipoChart({ 
  totalTraslados, 
  totalMantenimientos, 
  totalReparaciones 
}: MovimientosPorTipoChartProps) {
  const chartData = {
    labels: ['Traslados', 'Mantenimientos', 'Reparaciones'],
    datasets: [
      {
        label: 'Cantidad',
        data: [totalTraslados, totalMantenimientos, totalReparaciones],
        backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444'],
        borderColor: ['#2563EB', '#D97706', '#DC2626'],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Movimientos por Tipo</h3>
      <BarChart data={chartData} options={options} />
    </div>
  );
}

interface ActividadMensualChartProps {
  movimientosPorMes: { [key: string]: number };
}

export function ActividadMensualChart({ movimientosPorMes }: ActividadMensualChartProps) {
  const meses = Object.keys(movimientosPorMes).sort();
  const valores = meses.map(mes => movimientosPorMes[mes]);

  const chartData = {
    labels: meses,
    datasets: [
      {
        label: 'Movimientos',
        data: valores,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Mensual (Últimos 6 meses)</h3>
      <LineChart data={chartData} options={options} />
    </div>
  );
}
