// =============================================
// COMPONENTE: DASHBOARD PRINCIPAL CONSOLIDADO
// =============================================

'use client';

import React, { useEffect, useState } from 'react';
import '@/lib/chartConfig'; // Import centralized Chart.js config
import { useApp } from '@/contexts/AppContext';
import { StatCard, InfoCard } from './DashboardStats';
import { EquiposPorTipoChart, EstatusPorcentajesChart } from './DashboardCharts';

export default function Dashboard() {
  const { state, loadDashboardStats } = useApp();
  const [vistaActual, setVistaActual] = useState<'resumen'>('resumen');

  useEffect(() => {
    if (state.isAuthenticated) {
      loadDashboardStats();
    }
  }, [state.isAuthenticated]);

  if (state.isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <i className="fas fa-spinner fa-spin text-blue-600 text-xl"></i>
            <span className="text-gray-600">Cargando dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <i className="fas fa-exclamation-circle text-red-400 mt-0.5 mr-2"></i>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error cargando dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = state.dashboardStats;

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Contenido dinámico según la vista */}
      {vistaActual === 'resumen' && (
        <>
          {/* Controles de actualización */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Resumen del Sistema</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => loadDashboardStats()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Actualizar
              </button>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Equipos"
              value={stats.totalEquipos}
              icon="fa-desktop"
              iconBgColor="bg-blue-600"
            />
            <StatCard
              title="Disponibles"
              value={stats.equiposDisponibles}
              icon="fa-check-circle"
              iconBgColor="bg-green-600"
            />
            <StatCard
              title="En Uso"
              value={stats.equiposEnUso}
              icon="fa-play-circle"
              iconBgColor="bg-blue-600"
            />
            <StatCard
              title="Movimientos/Mes"
              value={stats.movimientosMes}
              icon="fa-exchange-alt"
              iconBgColor="bg-orange-600"
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EquiposPorTipoChart data={stats.equiposPorTipo} />
            <EstatusPorcentajesChart data={stats.estatusPorcentajes} />
          </div>

          {/* Resumen adicional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              title="En Mantenimiento"
              value={stats.equiposMantenimiento}
              icon="fa-tools"
              iconColor="text-yellow-500"
            />
            <InfoCard
              title="Dañados"
              value={stats.equiposDañados}
              icon="fa-exclamation-triangle"
              iconColor="text-red-500"
            />
            <InfoCard
              title="Movimientos Abiertos"
              value={stats.movimientosAbiertos}
              icon="fa-clock"
              iconColor="text-blue-500"
            />
          </div>
        </>
      )}
    </div>
  );
}
