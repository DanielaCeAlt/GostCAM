'use client';

import React from 'react';

interface Equipo {
  no_serie: string;
  nombreEquipo: string;
  TipoEquipo: string;
  EstatusEquipo: string;
  SucursalActual: string;
  UsuarioAsignado: string;
  modelo?: string;
  fechaAlta?: string;
}

interface EquiposSearchResultsProps {
  resultados: Equipo[];
  onEquipoSelect?: (noSerie: string) => void;
  onVerDetalles?: (noSerie: string) => void;
  loading?: boolean;
}

const EquiposSearchResults: React.FC<EquiposSearchResultsProps> = ({
  resultados,
  onEquipoSelect,
  onVerDetalles,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Buscando equipos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (resultados.length === 0) {
    return (
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center py-8">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No se encontraron equipos
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Prueba modificando los filtros de búsqueda
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Resultados de Búsqueda
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {resultados.length} {resultados.length === 1 ? 'equipo encontrado' : 'equipos encontrados'}
          </span>
        </div>
        
        <div className="space-y-4">
          {resultados.map((equipo, index) => (
            <div 
              key={equipo.no_serie || index} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">No. Serie:</span>
                    <p className="text-gray-900 dark:text-white font-medium">{equipo.no_serie}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre:</span>
                    <p className="text-gray-900 dark:text-white">{equipo.nombreEquipo}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo:</span>
                    <p className="text-gray-900 dark:text-white">{equipo.TipoEquipo}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Estatus:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      equipo.EstatusEquipo === 'Activo' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : equipo.EstatusEquipo === 'Mantenimiento'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {equipo.EstatusEquipo}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sucursal:</span>
                    <p className="text-gray-900 dark:text-white">{equipo.SucursalActual}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Usuario:</span>
                    <p className="text-gray-900 dark:text-white">{equipo.UsuarioAsignado || 'Sin asignar'}</p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {onVerDetalles && (
                  <button
                    onClick={() => onVerDetalles(equipo.no_serie)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium"
                  >
                    <i className="fas fa-eye mr-1"></i>
                    Ver Detalles
                  </button>
                )}
                {onEquipoSelect && (
                  <button
                    onClick={() => onEquipoSelect(equipo.no_serie)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 text-sm font-medium"
                  >
                    <i className="fas fa-check-circle mr-1"></i>
                    Seleccionar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquiposSearchResults;