'use client';

import React from 'react';

interface HistorialItem {
  fecha: string;
  accion: string;
  detalles: string;
  usuario?: string;
  sucursal?: string;
}

interface EquiposHistorialViewProps {
  historial: HistorialItem[];
  loading?: boolean;
  onRefresh?: () => void;
}

const EquiposHistorialView: React.FC<EquiposHistorialViewProps> = ({
  historial,
  loading = false,
  onRefresh
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando historial...</p>
        </div>
      </div>
    );
  }

  const formatDate = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fecha;
    }
  };

  const getActionIcon = (accion: string) => {
    const action = accion.toLowerCase();
    if (action.includes('alta') || action.includes('crear')) return 'fas fa-plus-circle';
    if (action.includes('editar') || action.includes('actualizar')) return 'fas fa-edit';
    if (action.includes('traslado') || action.includes('mover')) return 'fas fa-exchange-alt';
    if (action.includes('mantenimiento')) return 'fas fa-wrench';
    if (action.includes('falla') || action.includes('reporte')) return 'fas fa-exclamation-triangle';
    if (action.includes('eliminar') || action.includes('baja')) return 'fas fa-trash';
    return 'fas fa-info-circle';
  };

  const getActionColor = (accion: string) => {
    const action = accion.toLowerCase();
    if (action.includes('alta') || action.includes('crear')) return 'text-green-600 dark:text-green-400';
    if (action.includes('editar') || action.includes('actualizar')) return 'text-blue-600 dark:text-blue-400';
    if (action.includes('traslado') || action.includes('mover')) return 'text-purple-600 dark:text-purple-400';
    if (action.includes('mantenimiento')) return 'text-yellow-600 dark:text-yellow-400';
    if (action.includes('falla') || action.includes('reporte')) return 'text-red-600 dark:text-red-400';
    if (action.includes('eliminar') || action.includes('baja')) return 'text-red-700 dark:text-red-500';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <i className="fas fa-history text-2xl text-gray-600 dark:text-gray-400 mr-3"></i>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Historial de Movimientos
          </h3>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Actualizar
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {historial.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-clock text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hay historial disponible
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Los movimientos aparecerán aquí una vez que se realicen acciones
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {historial.map((item, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${getActionColor(item.accion)}`}>
                    <i className={`${getActionIcon(item.accion)} text-lg mt-1`}></i>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.accion}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(item.fecha)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {item.detalles}
                    </p>

                    {/* Additional info */}
                    {(item.usuario || item.sucursal) && (
                      <div className="flex items-center space-x-4 mt-2">
                        {item.usuario && (
                          <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <i className="fas fa-user mr-1"></i>
                            {item.usuario}
                          </span>
                        )}
                        {item.sucursal && (
                          <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <i className="fas fa-building mr-1"></i>
                            {item.sucursal}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquiposHistorialView;