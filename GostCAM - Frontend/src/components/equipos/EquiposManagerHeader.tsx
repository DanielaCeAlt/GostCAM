'use client';

import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface EquiposManagerHeaderProps {
  title?: string;
  onCreateNew?: () => void;
  onRefresh?: () => void;
  showCreateButton?: boolean;
  showRefreshButton?: boolean;
  loading?: boolean;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const EquiposManagerHeader: React.FC<EquiposManagerHeaderProps> = ({
  title = "Gestión de Equipos",
  onCreateNew,
  onRefresh,
  showCreateButton = true,
  showRefreshButton = true,
  loading = false,
  tabs = [],
  activeTab = '',
  onTabChange
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Título a la izquierda */}
        <div className="flex items-center">
          <i className="fas fa-desktop text-2xl text-blue-600 mr-3"></i>
          <h1 className="text-xl font-bold text-gray-900">
            {title}
          </h1>
        </div>

        {/* Todos los botones agrupados a la derecha */}
        <div className="flex items-center space-x-2">
          {/* Navegación por pestañas como botones */}
          {tabs.length > 0 && (
            <>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-white bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <i className={`fas ${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </>
          )}

          {/* Botón Actualizar */}
          {showRefreshButton && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
              <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquiposManagerHeader;
