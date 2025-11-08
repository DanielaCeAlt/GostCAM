'use client';

import React from 'react';

interface EquiposManagerHeaderProps {
  title?: string;
  onCreateNew?: () => void;
  onRefresh?: () => void;
  showCreateButton?: boolean;
  showRefreshButton?: boolean;
  loading?: boolean;
}

const EquiposManagerHeader: React.FC<EquiposManagerHeaderProps> = ({
  title = "Gestión de Equipos",
  onCreateNew,
  onRefresh,
  showCreateButton = true,
  showRefreshButton = true,
  loading = false
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <i className="fas fa-desktop text-2xl text-blue-600 dark:text-blue-400 mr-3"></i>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {showRefreshButton && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            </button>
          )}

          {showCreateButton && onCreateNew && (
            <button
              onClick={onCreateNew}
              className="px-3 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              Nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquiposManagerHeader;