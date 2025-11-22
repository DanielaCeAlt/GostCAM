// =============================================
// COMPONENTE OPTIMIZADO: EQUIPOS LIST
// =============================================

'use client';

import React, { memo, useMemo, useRef, useCallback, useEffect } from 'react';
import { useEquipos } from '@/hooks/useEquiposOptimized';
import { useApp } from '@/contexts/AppContext';
import { useLogger } from '@/lib/logger';
// Importación temporal sin react-window
// import { FixedSizeList as List } from 'react-window';

interface EquiposListProps {
  onEquipoSelect?: (noSerie: string) => void;
  onVerDetalles?: (noSerie: string) => void;
  onEditarEquipo?: (noSerie: string) => void;
  onEliminarEquipo?: (noSerie: string) => void;
  onVerHistorial?: (noSerie: string) => void;
  onCambiarUbicacion?: (noSerie: string) => void;
  onMantenimiento?: (noSerie: string) => void;
}

// Componente de fila optimizado con memo
const EquipoRow = memo(({ 
  index, 
  style, 
  data 
}: { 
  index: number; 
  style: React.CSSProperties; 
  data: any; 
}) => {
  const { equipos, callbacks, getStatusColor } = data;
  const equipo = equipos[index];
  const logger = useLogger();

  if (!equipo) return null;

  const handleAction = useCallback((action: string, callback?: (noSerie: string) => void) => {
    if (callback) {
      callback(equipo.no_serie);
      logger.userAction(`equipo_${action}`, undefined, { noSerie: equipo.no_serie });
    }
  }, [equipo.no_serie, logger]);

  return (
    <div style={style} className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <span className="text-sm font-medium text-gray-900">{equipo.no_serie}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{equipo.nombreEquipo}</p>
            <p className="text-sm text-gray-500">{equipo.TipoEquipo}</p>
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(equipo.EstatusEquipo)}`}>
              {equipo.EstatusEquipo}
            </span>
          </div>
          <div className="flex-shrink-0">
            <span className="text-sm text-gray-500">{equipo.SucursalActual}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => handleAction('ver_detalles', callbacks.onVerDetalles)}
          className="text-blue-600 hover:text-blue-900 p-1"
          title="Ver detalles"
          aria-label={`Ver detalles de ${equipo.nombreEquipo}`}
        >
          <i className="fas fa-eye"></i>
        </button>
        <button
          onClick={() => handleAction('editar', callbacks.onEditarEquipo)}
          className="text-yellow-600 hover:text-yellow-900 p-1"
          title="Editar"
          aria-label={`Editar ${equipo.nombreEquipo}`}
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          onClick={() => handleAction('cambiar_ubicacion', callbacks.onCambiarUbicacion)}
          className="text-purple-600 hover:text-purple-900 p-1"
          title="Cambiar ubicación"
          aria-label={`Cambiar ubicación de ${equipo.nombreEquipo}`}
        >
          <i className="fas fa-exchange-alt"></i>
        </button>
        <button
          onClick={() => handleAction('eliminar', callbacks.onEliminarEquipo)}
          className="text-red-600 hover:text-red-900 p-1"
          title="Eliminar"
          aria-label={`Eliminar ${equipo.nombreEquipo}`}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
});

EquipoRow.displayName = 'EquipoRow';

const EquiposListOptimized: React.FC<EquiposListProps> = memo(({ 
  onEquipoSelect, 
  onVerDetalles, 
  onEditarEquipo,
  onEliminarEquipo,
  onVerHistorial,
  onCambiarUbicacion,
  onMantenimiento
}) => {
  const { getStatusColor } = useApp();
  const logger = useLogger();
  const { equipos, loading, error, cargarEquipos, refrescarEquipos, isEmpty } = useEquipos();
  // const listRef = useRef<List>(null); // Temporal sin react-window

  // Memoizar callbacks para evitar re-renders
  const callbacks = useMemo(() => ({
    onEquipoSelect,
    onVerDetalles,
    onEditarEquipo,
    onEliminarEquipo,
    onVerHistorial,
    onCambiarUbicacion,
    onMantenimiento
  }), [
    onEquipoSelect,
    onVerDetalles,
    onEditarEquipo,
    onEliminarEquipo,
    onVerHistorial,
    onCambiarUbicacion,
    onMantenimiento
  ]);

  // Data para react-window
  const itemData = useMemo(() => ({
    equipos,
    callbacks,
    getStatusColor
  }), [equipos, callbacks, getStatusColor]);

  // Manejar refresh
  const handleRefresh = useCallback(() => {
    logger.userAction('refresh_equipos_list');
    refrescarEquipos();
  }, [logger, refrescarEquipos]);

  // Auto-scroll to top cuando cambia la lista
  useEffect(() => {
    // Temporal sin react-window
    // if (listRef.current) {
    //   listRef.current.scrollToItem(0, 'start');
    // }
  }, [equipos.length]);

  if (loading && equipos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <i className="fas fa-exclamation-triangle text-4xl"></i>
          </div>
          <p className="text-gray-900 font-medium mb-2">Error al cargar equipos</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-sync mr-2"></i>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-box-open text-6xl"></i>
          </div>
          <p className="text-gray-900 font-medium mb-2">No se encontraron equipos</p>
          <p className="text-gray-600 mb-4">No hay equipos registrados en el sistema</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-sync mr-2"></i>
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">
              Equipos ({equipos.length})
            </h3>
            {loading && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Actualizando...</span>
              </div>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            <i className="fas fa-sync mr-1"></i>
            Actualizar
          </button>
        </div>
      </div>

      {/* Lista virtualizada - Temporalmente deshabilitada */}
      <div className="p-4">
        <p className="text-gray-600 text-center">
          Componente optimizado temporalmente deshabilitado
        </p>
        <p className="text-sm text-gray-500 text-center mt-2">
          Usar componente EquiposList estándar
        </p>
      </div>
      {/* 
      <div style={{ height: '600px' }}>
        <List
          ref={listRef}
          height={600}
          itemCount={equipos.length}
          itemSize={80}
          itemData={itemData}
          overscanCount={5}
        >
          {EquipoRow}
        </List>
      </div>
      */}
    </div>
  );
});

EquiposListOptimized.displayName = 'EquiposListOptimized';

export default EquiposListOptimized;