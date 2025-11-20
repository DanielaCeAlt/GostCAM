// =============================================
// COMPONENTE OPTIMIZADO: EQUIPOS LIST
// =============================================

'use client';

import React, { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { useEquipos } from '@/hooks/useEquiposOptimized';
import { useApp } from '@/contexts/AppContext';
import { useLogger } from '@/lib/logger';
import { FixedSizeList as List } from 'react-window';

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
  const { equipos, loading, error, cargarEquipos, refrescarEquipos, isEmpty } = useEquipos();\n  const listRef = useRef<List>(null);\n\n  // Memoizar callbacks para evitar re-renders\n  const callbacks = useMemo(() => ({\n    onEquipoSelect,\n    onVerDetalles,\n    onEditarEquipo,\n    onEliminarEquipo,\n    onVerHistorial,\n    onCambiarUbicacion,\n    onMantenimiento\n  }), [\n    onEquipoSelect,\n    onVerDetalles,\n    onEditarEquipo,\n    onEliminarEquipo,\n    onVerHistorial,\n    onCambiarUbicacion,\n    onMantenimiento\n  ]);\n\n  // Data para react-window\n  const itemData = useMemo(() => ({\n    equipos,\n    callbacks,\n    getStatusColor\n  }), [equipos, callbacks, getStatusColor]);\n\n  // Manejar refresh\n  const handleRefresh = useCallback(() => {\n    logger.userAction('refresh_equipos_list');\n    refrescarEquipos();\n  }, [logger, refrescarEquipos]);\n\n  // Auto-scroll to top cuando cambia la lista\n  useEffect(() => {\n    if (listRef.current) {\n      listRef.current.scrollToItem(0, 'start');\n    }\n  }, [equipos.length]);\n\n  if (loading && equipos.length === 0) {\n    return (\n      <div className="bg-white rounded-lg shadow p-6">\n        <div className="text-center py-12">\n          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>\n          <p className="text-gray-600 mt-4">Cargando equipos...</p>\n        </div>\n      </div>\n    );\n  }\n\n  if (error) {\n    return (\n      <div className="bg-white rounded-lg shadow p-6">\n        <div className="text-center py-12">\n          <div className="text-red-500 mb-4">\n            <i className="fas fa-exclamation-triangle text-4xl"></i>\n          </div>\n          <p className="text-gray-900 font-medium mb-2">Error al cargar equipos</p>\n          <p className="text-gray-600 mb-4">{error}</p>\n          <button\n            onClick={handleRefresh}\n            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"\n          >\n            <i className="fas fa-sync mr-2"></i>\n            Reintentar\n          </button>\n        </div>\n      </div>\n    );\n  }\n\n  if (isEmpty) {\n    return (\n      <div className="bg-white rounded-lg shadow p-6">\n        <div className="text-center py-12">\n          <div className="text-gray-400 mb-4">\n            <i className="fas fa-box-open text-6xl"></i>\n          </div>\n          <p className="text-gray-900 font-medium mb-2">No se encontraron equipos</p>\n          <p className="text-gray-600 mb-4">No hay equipos registrados en el sistema</p>\n          <button\n            onClick={handleRefresh}\n            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"\n          >\n            <i className="fas fa-sync mr-2"></i>\n            Actualizar\n          </button>\n        </div>\n      </div>\n    );\n  }\n\n  return (\n    <div className="bg-white rounded-lg shadow overflow-hidden">\n      {/* Header */}\n      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">\n        <div className="flex items-center justify-between">\n          <div className="flex items-center space-x-4">\n            <h3 className="text-lg font-medium text-gray-900">\n              Equipos ({equipos.length})\n            </h3>\n            {loading && (\n              <div className="flex items-center text-blue-600">\n                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>\n                <span className="text-sm">Actualizando...</span>\n              </div>\n            )}\n          </div>\n          <button\n            onClick={handleRefresh}\n            disabled={loading}\n            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"\n          >\n            <i className="fas fa-sync mr-1"></i>\n            Actualizar\n          </button>\n        </div>\n      </div>\n\n      {/* Lista virtualizada */}\n      <div style={{ height: '600px' }}>\n        <List\n          ref={listRef}\n          height={600}\n          itemCount={equipos.length}\n          itemSize={80}\n          itemData={itemData}\n          overscanCount={5}\n        >\n          {EquipoRow}\n        </List>\n      </div>\n    </div>\n  );\n});\n\nEquiposListOptimized.displayName = 'EquiposListOptimized';\n\nexport default EquiposListOptimized;