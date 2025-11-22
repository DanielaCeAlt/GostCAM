'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useEquipos } from '@/hooks/useEquipos';
import { useApp } from '@/contexts/AppContext';

interface EquiposListProps {
  onEquipoSelect?: (noSerie: string) => void;
  onVerDetalles?: (noSerie: string) => void;
  onEditarEquipo?: (noSerie: string) => void;
  onEliminarEquipo?: (noSerie: string) => void;
  onVerHistorial?: (noSerie: string) => void;
  onCambiarUbicacion?: (noSerie: string) => void;
  onMantenimiento?: (noSerie: string) => void;
  refreshList?: number; // Para forzar recarga cuando cambia
}

const EquiposListSimple: React.FC<EquiposListProps> = React.memo(({ 
  onEquipoSelect, 
  onVerDetalles, 
  onEditarEquipo,
  onEliminarEquipo,
  onVerHistorial,
  onCambiarUbicacion,
  onMantenimiento,
  refreshList
}) => {
  const { getStatusColor } = useApp();
  const { equipos, loading, cargarEquipos } = useEquipos();
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<string[]>([]);

  // Cargar equipos al montar el componente
  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  // Recargar equipos cuando se solicite refrescar
  useEffect(() => {
    if (refreshList !== undefined && refreshList > 0) {
      console.log('🔄 Recargando lista de equipos por refresh:', refreshList);
      cargarEquipos();
    }
  }, [refreshList, cargarEquipos]);

  const handleSeleccionEquipo = useCallback((noSerie: string, seleccionado: boolean) => {
    setEquiposSeleccionados(prev => 
      seleccionado 
        ? [...prev, noSerie]
        : prev.filter(id => id !== noSerie)
    );
  }, []);

  const handleSeleccionarTodos = useCallback((seleccionarTodos: boolean) => {
    setEquiposSeleccionados(
      seleccionarTodos ? equipos.map(equipo => equipo.no_serie) : []
    );
  }, [equipos]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabla de equipos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={equiposSeleccionados.length === equipos.length && equipos.length > 0}
                    onChange={(e) => handleSeleccionarTodos(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Serie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Cargando equipos...
                  </td>
                </tr>
              ) : equipos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-center">
                      <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                      <p>No se encontraron equipos</p>
                    </div>
                  </td>
                </tr>
              ) : (
                equipos.map((equipo) => (
                  <tr key={equipo.no_serie} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={equiposSeleccionados.includes(equipo.no_serie)}
                        onChange={(e) => handleSeleccionEquipo(equipo.no_serie, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {equipo.no_serie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipo.nombreEquipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {equipo.TipoEquipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(equipo.EstatusEquipo)}`}>
                        {equipo.EstatusEquipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipo.SucursalActual}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onVerDetalles?.(equipo.no_serie)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => onEditarEquipo?.(equipo.no_serie)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => onCambiarUbicacion?.(equipo.no_serie)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Cambiar ubicación"
                        >
                          <i className="fas fa-exchange-alt"></i>
                        </button>
                        <button
                          onClick={() => onEliminarEquipo?.(equipo.no_serie)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información de equipos seleccionados */}
      {equiposSeleccionados.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {equiposSeleccionados.length} equipo(s) seleccionado(s)
            </span>
            <button
              onClick={() => setEquiposSeleccionados([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Limpiar selección
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

EquiposListSimple.displayName = 'EquiposListSimple';

export default EquiposListSimple;