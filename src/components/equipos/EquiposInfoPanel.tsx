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
  marca?: string;
  ubicacion?: string;
  observaciones?: string;
}

interface EquiposInfoPanelProps {
  equipo: Equipo | null;
  onEdit?: (noSerie: string) => void;
  onDelete?: (noSerie: string) => void;
  onTransfer?: (noSerie: string) => void;
  onMaintenance?: (noSerie: string) => void;
  onReportFault?: (noSerie: string) => void;
  showActions?: boolean;
  loading?: boolean;
}

const EquiposInfoPanel: React.FC<EquiposInfoPanelProps> = ({
  equipo,
  onEdit,
  onDelete,
  onTransfer,
  onMaintenance,
  onReportFault,
  showActions = true,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <i className="fas fa-desktop text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Selecciona un equipo
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Elige un equipo de la lista para ver su información detallada
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (fecha: string | undefined) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Activo': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Mantenimiento': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Fuera de Servicio': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'En Traslado': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };

    return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-info-circle text-2xl text-blue-600 dark:text-blue-400 mr-3"></i>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información del Equipo
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {equipo.no_serie}
              </p>
            </div>
          </div>
          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(equipo.EstatusEquipo)}`}>
            {equipo.EstatusEquipo}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Información Básica
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nombre del Equipo
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {equipo.nombreEquipo}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo de Equipo
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {equipo.TipoEquipo}
                </p>
              </div>

              {equipo.marca && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Marca
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {equipo.marca}
                  </p>
                </div>
              )}

              {equipo.modelo && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Modelo
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {equipo.modelo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location and Assignment */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Ubicación y Asignación
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sucursal Actual
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {equipo.SucursalActual}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuario Asignado
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {equipo.UsuarioAsignado || 'Sin asignar'}
                </p>
              </div>

              {equipo.ubicacion && (
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ubicación Específica
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {equipo.ubicacion}
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha de Alta
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {formatDate(equipo.fechaAlta)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Observations */}
        {equipo.observaciones && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Observaciones
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              {equipo.observaciones}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Acciones Disponibles
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {onEdit && (
                <button
                  onClick={() => onEdit(equipo.no_serie)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Editar
                </button>
              )}

              {onTransfer && (
                <button
                  onClick={() => onTransfer(equipo.no_serie)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 rounded-md hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
                >
                  <i className="fas fa-exchange-alt mr-2"></i>
                  Trasladar
                </button>
              )}

              {onMaintenance && (
                <button
                  onClick={() => onMaintenance(equipo.no_serie)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors duration-200"
                >
                  <i className="fas fa-wrench mr-2"></i>
                  Mantenimiento
                </button>
              )}

              {onReportFault && (
                <button
                  onClick={() => onReportFault(equipo.no_serie)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                >
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Reportar Falla
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(equipo.no_serie)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Eliminar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquiposInfoPanel;