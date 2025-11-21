// =============================================
// COMPONENTE: DASHBOARD
// =============================================

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useApp } from '@/contexts/AppContext';
import GostCamLayout, { GostCamSection, GostCamGrid, GostCamCard } from '@/components/ui/GostCamLayout';
import GostCamButton from '@/components/ui/GostCamButton';
import { MESSAGES, getLoadingMessage } from '@/lib/messages';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const { state, loadDashboardStats, testAltaEquipo } = useApp();
  const [vistaActual, setVistaActual] = useState<'resumen'>('resumen');
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Función separada para el botón de actualizar manual
  const handleRefresh = useCallback(async () => {
    await loadDashboardStats();
  }, [loadDashboardStats]);

  // Memoizar la función de carga inicial para evitar re-renders innecesarios
  const handleInitialLoad = useCallback(async () => {
    if (state.isAuthenticated && !hasLoadedOnce && !state.dashboardStats) {
      await loadDashboardStats();
      setHasLoadedOnce(true);
    }
  }, [state.isAuthenticated, hasLoadedOnce, state.dashboardStats, loadDashboardStats]);

  useEffect(() => {
    handleInitialLoad();
  }, [handleInitialLoad]);

  if (state.isLoading) {
    return (
      <GostCamLayout 
        title={getLoadingMessage('dashboard')}
        padding="lg"
        maxWidth="6xl"
      >
        <div className="animate-pulse space-y-8">
          <GostCamGrid columns={4} gap="lg">
            {[...Array(4)].map((_, i) => (
              <GostCamCard key={i} className="h-24">
                <div className="h-full bg-gostcam-gray-200 rounded-lg animate-wave"></div>
              </GostCamCard>
            ))}
          </GostCamGrid>
        </div>
      </GostCamLayout>
    );
  }

  if (state.error) {
    return (
      <GostCamLayout padding="lg" maxWidth="4xl">
        <GostCamCard className="border-gostcam-danger bg-gostcam-danger-light">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gostcam-danger rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-white"></i>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gostcam-danger mb-2">
                Problema de conexión
              </h3>
              <p className="text-gostcam-danger-dark mb-4">
                {state.error}
              </p>
              <GostCamButton 
                variant="danger" 
                size="sm" 
                onClick={() => window.location.reload()}
                leftIcon={<i className="fas fa-redo" />}
              >
                {MESSAGES.buttons.retry || 'Reintentar'}
              </GostCamButton>
            </div>
          </div>
        </GostCamCard>
      </GostCamLayout>
    );
  }

  const stats = state.dashboardStats;

  if (!stats) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  // Configuración para el gráfico de barras (equipos por tipo)
  const equiposPorTipoData = {
    labels: stats.equiposPorTipo.map(item => item.tipo),
    datasets: [
      {
        label: 'Cantidad de Equipos',
        data: stats.equiposPorTipo.map(item => item.cantidad),
        backgroundColor: [
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
        borderColor: [
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
        borderWidth: 1,
      },
    ],
  };

  // Configuración para el gráfico de dona (estatus)
  const estatusData = {
    labels: stats.estatusPorcentajes.map(item => item.estatus),
    datasets: [
      {
        data: stats.estatusPorcentajes.map(item => item.porcentaje),
        backgroundColor: stats.estatusPorcentajes.map(item => item.color),
        borderWidth: 2,
        borderColor: '#bbbbbbff',
      },
    ],
  };

  const chartOptions = {
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

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <GostCamLayout 
      title={MESSAGES.titles.dashboard || 'Panel de Control'}
      subtitle={`Bienvenido, ${state.user?.NombreUsuario || 'Usuario'}, aquí tienes un resumen.`}
      actions={
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Actualizar
          </button>
        </div>
      }
      padding="lg"
      maxWidth="6xl"
    >
      <div className="space-y-2">
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total de equipos */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <i className="fas fa-desktop text-white text-sm"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Equipos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEquipos}</p>
                </div>
              </div>
            </div>

            {/* Equipos disponibles */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                    <i className="fas fa-check-circle text-white text-sm"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.equiposDisponibles}</p>
                </div>
              </div>
            </div>

            {/* Equipos en uso */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <i className="fas fa-play-circle text-white text-sm"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Uso</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.equiposEnUso}</p>
                </div>
              </div>
            </div>

            {/* Movimientos del mes */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center">
                    <i className="fas fa-exchange-alt text-white text-sm"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Movimientos/Mes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.movimientosMes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de equipos por tipo */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipos por Tipo</h3>
              <div className="h-64">
                {stats.equiposPorTipo.length > 0 ? (
                  <Bar data={equiposPorTipoData} options={barChartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Sin datos disponibles
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico de estatus */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estatus</h3>
              <div className="h-64">
                {stats.estatusPorcentajes.length > 0 ? (
                  <Doughnut data={estatusData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Sin datos disponibles
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Equipos en mantenimiento */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Mantenimiento</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.equiposMantenimiento}</p>
                </div>
                <i className="fas fa-tools text-yellow-500 text-2xl"></i>
              </div>
            </div>

            {/* Equipos dañados */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dañados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.equiposDañados}</p>
                </div>
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
            </div>

            {/* Movimientos abiertos */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Movimientos Abiertos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.movimientosAbiertos}</p>
                </div>
                <i className="fas fa-clock text-blue-500 text-2xl"></i>
              </div>
            </div>
          </div>
      </div>
    </GostCamLayout>
  );
}
