// =============================================
// COMPONENTE OPTIMIZADO: EquiposFallas
// =============================================

'use client';

import React, { memo, useCallback } from 'react';
import { useFallasState, FallaData, FormularioFalla } from '@/hooks/useFallasState';

// ========================
// SUB-COMPONENTES MEMOIZADOS
// ========================

// Componente de filtros memoizado
const FiltrosSeccion = memo(({ 
  filtros, 
  onFiltrosChange, 
  tecnicos, 
  loading 
}: {
  filtros: any;
  onFiltrosChange: (filtros: any) => void;
  tecnicos: any[];
  loading: boolean;
}) => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">Estado</label>
        <select
          value={filtros.estatus}
          onChange={(e) => onFiltrosChange({ estatus: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="ABIERTA">Abierta</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="RESUELTA">Resuelta</option>
          <option value="CERRADA">Cerrada</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">Prioridad</label>
        <select
          value={filtros.prioridad}
          onChange={(e) => onFiltrosChange({ prioridad: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas</option>
          <option value="BAJA">Baja</option>
          <option value="NORMAL">Normal</option>
          <option value="ALTA">Alta</option>
          <option value="CRITICA">Crítica</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">Tipo</label>
        <select
          value={filtros.tipo}
          onChange={(e) => onFiltrosChange({ tipo: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="HARDWARE">Hardware</option>
          <option value="SOFTWARE">Software</option>
          <option value="CONECTIVIDAD">Conectividad</option>
          <option value="SEGURIDAD">Seguridad</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">Técnico</label>
        <select
          value={filtros.tecnico}
          onChange={(e) => onFiltrosChange({ tecnico: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          {tecnicos.map((tecnico) => (
            <option key={tecnico.id} value={tecnico.nombre}>
              {tecnico.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">Desde</label>
        <input
          type="date"
          value={filtros.fechaDesde}
          onChange={(e) => onFiltrosChange({ fechaDesde: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">Hasta</label>
        <input
          type="date"
          value={filtros.fechaHasta}
          onChange={(e) => onFiltrosChange({ fechaHasta: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
));

// Componente de tabla de fallas memoizado
const TablaFallas = memo(({ 
  fallas, 
  loading, 
  busquedaTerm, 
  onBusquedaChange 
}: {
  fallas: FallaData[];
  loading: boolean;
  busquedaTerm: string;
  onBusquedaChange: (term: string) => void;
}) => (
  <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Fallas Registradas ({fallas.length})
        </h3>
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Buscar por equipo, descripción..."
            value={busquedaTerm}
            onChange={(e) => onBusquedaChange(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    {loading ? (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando fallas...</span>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Tipo/Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Técnico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Fechas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fallas.map((falla) => (
              <FilaFalla key={falla.id} falla={falla} />
            ))}
          </tbody>
        </table>
      </div>
    )}

    {!loading && fallas.length === 0 && (
      <div className="text-center py-8 text-gray-700">
        No se encontraron fallas con los filtros aplicados
      </div>
    )}
  </div>
));

// Componente de fila individual memoizado
const FilaFalla = memo(({ falla }: { falla: FallaData }) => {
  const getPrioridadColor = useCallback((prioridad: string) => {
    switch (prioridad) {
      case 'CRITICA': return 'bg-red-100 text-red-800';
      case 'ALTA': return 'bg-orange-100 text-orange-800';
      case 'NORMAL': return 'bg-blue-100 text-blue-800';
      case 'BAJA': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getEstatusColor = useCallback((estatus: string) => {
    switch (estatus) {
      case 'ABIERTA': return 'bg-red-100 text-red-800';
      case 'EN_PROCESO': return 'bg-yellow-100 text-yellow-800';
      case 'RESUELTA': return 'bg-green-100 text-green-800';
      case 'CERRADA': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {falla.no_serie}
          </div>
          <div className="text-sm text-gray-700">
            {falla.nombreEquipo}
          </div>
          <div className="text-xs text-gray-400">
            {falla.sucursal}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadColor(falla.prioridad)}`}>
            {falla.prioridad}
          </span>
          <div className="text-xs text-gray-700">
            {falla.tipo_falla}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div>
          <div className="font-medium mb-1">
            {falla.descripcion_problema}
          </div>
          {falla.sintomas && (
            <div className="text-xs text-gray-700">
              Síntomas: {falla.sintomas}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            Reportado por: {falla.usuario_reporta}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm text-gray-900">
            {falla.tecnico_asignado || 'Sin asignar'}
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstatusColor(falla.estatus)}`}>
            {falla.estatus.replace('_', ' ')}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>
          <div>Reportado: {new Date(falla.fecha_reporte).toLocaleDateString()}</div>
          {falla.fecha_solucion && (
            <div>Resuelto: {new Date(falla.fecha_solucion).toLocaleDateString()}</div>
          )}
          <div className="text-xs text-gray-700">
            {falla.diasAbierta} días transcurridos
          </div>
          {falla.tiempo_solucion_horas && (
            <div className="text-xs text-green-600">
              Resuelto en {falla.tiempo_solucion_horas}h
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 mr-2">
          <i className="fas fa-eye"></i>
        </button>
        <button className="text-gray-600 hover:text-gray-900 mr-2">
          <i className="fas fa-edit"></i>
        </button>
        {falla.estatus === 'ABIERTA' && (
          <button className="text-green-600 hover:text-green-900">
            <i className="fas fa-check"></i>
          </button>
        )}
      </td>
    </tr>
  );
});

// Componente de formulario de reporte memoizado
const FormularioReporte = memo(({
  formData,
  equipoSeleccionado,
  equiposBusqueda,
  tecnicos,
  loading,
  formularioValido,
  onFormDataChange,
  onEquipoSelect,
  onBuscarEquipos,
  onReportarFalla
}: {
  formData: FormularioFalla;
  equipoSeleccionado: any;
  equiposBusqueda: any[];
  tecnicos: any[];
  loading: boolean;
  formularioValido: boolean;
  onFormDataChange: (data: Partial<FormularioFalla>) => void;
  onEquipoSelect: (equipo: any) => void;
  onBuscarEquipos: (term: string) => void;
  onReportarFalla: () => void;
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Reportar Nueva Falla</h3>
    
    {/* Selección de equipo */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Buscar Equipo
      </label>
      <input
        type="text"
        placeholder="Número de serie o nombre del equipo..."
        onChange={(e) => onBuscarEquipos(e.target.value)}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
      />
      
      {equiposBusqueda.length > 0 && (
        <div className="mt-2 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
          {equiposBusqueda.map((equipo) => (
            <button
              key={equipo.no_serie}
              onClick={() => onEquipoSelect(equipo)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900">
                {equipo.no_serie} - {equipo.nombreEquipo}
              </div>
              <div className="text-xs text-gray-700">
                {equipo.TipoEquipo} | {equipo.SucursalActual}
              </div>
            </button>
          ))}
        </div>
      )}

      {equipoSeleccionado && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Equipo Seleccionado
          </h4>
          <div className="text-sm font-medium text-gray-900">
            {equipoSeleccionado.no_serie} - {equipoSeleccionado.nombreEquipo}
          </div>
          <div className="text-xs text-gray-700">
            {equipoSeleccionado.TipoEquipo} | {equipoSeleccionado.SucursalActual}
          </div>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Tipo de Falla *
        </label>
        <select
          value={formData.tipo_falla}
          onChange={(e) => onFormDataChange({ tipo_falla: e.target.value as any })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="HARDWARE">Hardware</option>
          <option value="SOFTWARE">Software</option>
          <option value="CONECTIVIDAD">Conectividad</option>
          <option value="SEGURIDAD">Seguridad</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Prioridad *
        </label>
        <select
          value={formData.prioridad}
          onChange={(e) => onFormDataChange({ prioridad: e.target.value as any })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="BAJA">Baja</option>
          <option value="NORMAL">Normal</option>
          <option value="ALTA">Alta</option>
          <option value="CRITICA">Crítica</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Impacto *
        </label>
        <select
          value={formData.impacto}
          onChange={(e) => onFormDataChange({ impacto: e.target.value as any })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="BAJO">Bajo</option>
          <option value="MEDIO">Medio</option>
          <option value="ALTO">Alto</option>
          <option value="CRITICO">Crítico</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Técnico Asignado
        </label>
        <select
          value={formData.tecnico_asignado}
          onChange={(e) => onFormDataChange({ tecnico_asignado: e.target.value })}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sin asignar</option>
          {tecnicos.map((tecnico) => (
            <option key={tecnico.id} value={tecnico.nombre}>
              {tecnico.nombre} - {tecnico.especialidad}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Descripción del Problema *
      </label>
      <textarea
        value={formData.descripcion_problema}
        onChange={(e) => onFormDataChange({ descripcion_problema: e.target.value })}
        rows={3}
        placeholder="Describe detalladamente el problema..."
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Síntomas Observados
      </label>
      <textarea
        value={formData.sintomas}
        onChange={(e) => onFormDataChange({ sintomas: e.target.value })}
        rows={2}
        placeholder="Síntomas específicos del problema..."
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Usuario que Reporta *
      </label>
      <input
        type="text"
        value={formData.usuario_reporta}
        onChange={(e) => onFormDataChange({ usuario_reporta: e.target.value })}
        placeholder="Nombre del usuario que reporta"
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Ubicación de la Falla
      </label>
      <input
        type="text"
        value={formData.ubicacion_falla}
        onChange={(e) => onFormDataChange({ ubicacion_falla: e.target.value })}
        placeholder="Ubicación específica donde ocurre la falla"
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Observaciones Adicionales
      </label>
      <textarea
        value={formData.observaciones}
        onChange={(e) => onFormDataChange({ observaciones: e.target.value })}
        rows={2}
        placeholder="Información adicional relevante..."
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="mt-4 flex items-center">
      <input
        type="checkbox"
        id="requiere_repuestos"
        checked={formData.requiere_repuestos}
        onChange={(e) => onFormDataChange({ requiere_repuestos: e.target.checked })}
        disabled={loading}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor="requiere_repuestos" className="ml-2 block text-sm text-gray-800">
        Requiere repuestos
      </label>
    </div>

    <div className="mt-6 flex space-x-4">
      <button
        onClick={onReportarFalla}
        disabled={!formularioValido || loading}
        className={`flex-1 py-2 px-4 rounded-lg font-medium ${
          formularioValido && !loading
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Reportando...
          </>
        ) : (
          <>
            <i className="fas fa-plus mr-2"></i>
            Reportar Falla
          </>
        )}
      </button>
    </div>
  </div>
));

// Componente de estadísticas memoizado
const EstadisticasSeccion = memo(({ 
  estadisticas, 
  loading 
}: {
  estadisticas: any;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando estadísticas...</span>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="text-center py-8 text-gray-700">
        No hay estadísticas disponibles
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <i className="fas fa-list text-white text-sm"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="text-lg font-medium text-gray-900">{estadisticas.total_fallas}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
                <i className="fas fa-exclamation-circle text-white text-sm"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Abiertas</dt>
                <dd className="text-lg font-medium text-gray-900">{estadisticas.abiertas}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-600 rounded-md flex items-center justify-center">
                <i className="fas fa-clock text-white text-sm"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">En Proceso</dt>
                <dd className="text-lg font-medium text-gray-900">{estadisticas.en_proceso}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-sm"></i>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Resueltas</dt>
                <dd className="text-lg font-medium text-gray-900">{estadisticas.resueltas}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de técnicos */}
      {estadisticas.por_tecnico && estadisticas.por_tecnico.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Estadísticas por Técnico
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Técnico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Asignadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Resueltas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    En Proceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Promedio (h)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estadisticas.por_tecnico.map((tecnico: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tecnico.tecnico}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tecnico.asignadas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tecnico.resueltas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tecnico.en_proceso}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tecnico.promedio_horas}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

// ========================
// COMPONENTE PRINCIPAL OPTIMIZADO
// ========================
const EquiposFallas: React.FC = () => {
  const {
    // Estado
    activeTab,
    loading,
    fallas,
    fallasFiltradas,
    estadisticas,
    tecnicos,
    equiposBusqueda,
    equipoSeleccionado,
    filtros,
    formData,
    busquedaTerm,
    formularioValido,
    
    // Acciones
    setActiveTab,
    updateFiltros,
    updateFormData,
    seleccionarEquipo,
    setBusquedaTerm,
    buscarEquipos,
    reportarFalla,
    cargarFallas
  } = useFallasState();

  // Memoizar los handlers para evitar re-renders
  const handleFiltrosChange = useCallback((filtros: any) => {
    updateFiltros(filtros);
  }, [updateFiltros]);

  const handleFormDataChange = useCallback((data: Partial<FormularioFalla>) => {
    updateFormData(data);
  }, [updateFormData]);

  const handleBusquedaChange = useCallback((term: string) => {
    setBusquedaTerm(term);
  }, [setBusquedaTerm]);

  // Tabs de navegación
  const tabs = [
    { id: 'consultar', label: 'Consultar Fallas', icon: 'fas fa-search' },
    { id: 'reportar', label: 'Reportar Falla', icon: 'fas fa-plus' },
    { id: 'estadisticas', label: 'Estadísticas', icon: 'fas fa-chart-bar' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Fallas
              </h1>
              <p className="text-gray-600">
                Administra y da seguimiento a las fallas de equipos
              </p>
            </div>
          </div>
          <button
            onClick={cargarFallas}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Actualizar
          </button>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-gray-800'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} h-5 w-5`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'consultar' && (
            <>
              <FiltrosSeccion
                filtros={filtros}
                onFiltrosChange={handleFiltrosChange}
                tecnicos={tecnicos}
                loading={loading}
              />
              <TablaFallas
                fallas={fallasFiltradas}
                loading={loading}
                busquedaTerm={busquedaTerm}
                onBusquedaChange={handleBusquedaChange}
              />
            </>
          )}

          {activeTab === 'reportar' && (
            <FormularioReporte
              formData={formData}
              equipoSeleccionado={equipoSeleccionado}
              equiposBusqueda={equiposBusqueda}
              tecnicos={tecnicos}
              loading={loading}
              formularioValido={formularioValido}
              onFormDataChange={handleFormDataChange}
              onEquipoSelect={seleccionarEquipo}
              onBuscarEquipos={buscarEquipos}
              onReportarFalla={reportarFalla}
            />
          )}

          {activeTab === 'estadisticas' && (
            <EstadisticasSeccion
              estadisticas={estadisticas}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Exportar con display name para debugging
EquiposFallas.displayName = 'EquiposFallas';

export default memo(EquiposFallas);