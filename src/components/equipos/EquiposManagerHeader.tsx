'use client';

import React from 'react';

interface EquiposManagerHeaderProps {
  title?: string;
  subtitle?: string;
  onCreateNew?: () => void;
  onRefresh?: () => void;
  showCreateButton?: boolean;
  showRefreshButton?: boolean;
  equiposCount?: number;
  loading?: boolean;
}

const EquiposManagerHeader: React.FC<EquiposManagerHeaderProps> = ({
  title = "Gestión de Equipos",
  subtitle = "Administra todos los equipos del sistema",
  onCreateNew,
  onRefresh,
  showCreateButton = true,
  showRefreshButton = true,
  equiposCount,
  loading = false
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Title and subtitle */}
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-desktop text-3xl text-blue-600 dark:text-blue-400"></i>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
              {equiposCount !== undefined && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {equiposCount} {equiposCount === 1 ? 'equipo registrado' : 'equipos registrados'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {showRefreshButton && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <i className={`fas fa-sync-alt mr-2 ${loading ? 'animate-spin' : ''}`}></i>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          )}

          {showCreateButton && onCreateNew && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <i className="fas fa-plus mr-2"></i>
              Nuevo Equipo
            </button>
          )}
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Sistema Operativo</span>
            </div>
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <i className="fas fa-database mr-2"></i>
              <span>Base de Datos Conectada</span>
            </div>
          </div>
          
          <div className="text-gray-500 dark:text-gray-400">
            <i className="fas fa-clock mr-1"></i>
            <span>Última actualización: {new Date().toLocaleTimeString('es-ES')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquiposManagerHeader;