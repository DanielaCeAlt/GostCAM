'use client';

import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface FallasManagerHeaderProps {
  title?: string;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
  loading?: boolean;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const FallasManagerHeader: React.FC<FallasManagerHeaderProps> = ({
  title = "Gestión de Fallas",
  onRefresh,
  showRefreshButton = true,
  loading = false,
  tabs = [],
  activeTab = '',
  onTabChange
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between">
        {/* Título a la izquierda */}
        <div className="flex items-center">
          <i className="fas fa-exclamation-triangle text-2xl text-red-600 mr-3"></i>
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
                  <i className={`${tab.icon} mr-2`}></i>
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
              className="flex items-center px-3 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              <i className={`fas fa-sync-alt mr-2 ${loading ? 'animate-spin' : ''}`}></i>
              Actualizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FallasManagerHeader;
