// =============================================
// CONFIGURACIÓN CENTRALIZADA DE CHART.JS
// =============================================

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  TimeScale
} from 'chart.js';

// Registrar componentes de Chart.js una sola vez
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  TimeScale
);

// Opciones de configuración comunes para gráficos
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
      },
    },
  },
};

// Opciones específicas para gráficos de barras
export const barChartOptions = {
  ...commonChartOptions,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
  },
};

// Paleta de colores estándar
export const chartColors = {
  primary: [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(16, 185, 129, 0.8)',   // green
    'rgba(245, 158, 11, 0.8)',   // yellow
    'rgba(239, 68, 68, 0.8)',    // red
    'rgba(139, 92, 246, 0.8)',   // purple
    'rgba(6, 182, 212, 0.8)',    // cyan
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(107, 114, 128, 0.8)',  // gray
    'rgba(34, 197, 94, 0.8)',    // emerald
    'rgba(251, 146, 60, 0.8)',   // orange
  ],
  borders: [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(107, 114, 128, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(251, 146, 60, 1)',
  ],
};

export default ChartJS;
