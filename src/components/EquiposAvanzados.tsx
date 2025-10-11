'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/lib/apiService';

interface Equipo {
  no_serie: string;
  nombreEquipo: string;
  modelo: string;
  numeroActivo: string;
  TipoEquipo: string;
  EstatusEquipo: string;
  SucursalActual: string;
  AreaActual: string;
  UsuarioAsignado: string;
  fechaAlta: string;
  diasEnSistema?: number;
  valorEstimado?: number;
}

interface FiltrosBusqueda {
  texto: string;
  tipoEquipo: string;
  estatus: string;
  sucursal: string;
  fechaAltaDesde: string;
  fechaAltaHasta: string;
  limite: number;
  pagina: number;
}

export default function EquiposAvanzados() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    texto: '',
    tipoEquipo: '',
    estatus: '',
    sucursal: '',
    fechaAltaDesde: '',
    fechaAltaHasta: '',
    limite: 20,
    pagina: 1
  });
  const [paginacion, setPaginacion] = useState({
    paginaActual: 1,
    totalPaginas: 1,
    totalRegistros: 0,
    hayAnterior: false,
    haySiguiente: false
  });
  const [vistaActual, setVistaActual] = useState<'lista' | 'busqueda' | 'transferencias' | 'mantenimiento' | 'reportes'>('lista');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null);
  const [detallesEquipo, setDetallesEquipo] = useState<any>(null);

  // Estados para transferencias
  const [transferencias, setTransferencias] = useState<any[]>([]);
  const [formTransferencia, setFormTransferencia] = useState({
    equipos: [] as string[],
    sucursalDestino: '',
    areaDestino: '',
    motivoTransferencia: '',
    fechaTransferencia: '',
    observaciones: ''
  });

  // Estados para mantenimiento
  const [mantenimientos, setMantenimientos] = useState<any[]>([]);
  const [formMantenimiento, setFormMantenimiento] = useState({
    equipos: [] as string[],
    tipoMantenimiento: 'preventivo',
    prioridad: 'media',
    descripcion: '',
    fechaProgramada: '',
    tecnicoAsignado: '',
    observaciones: ''
  });

  // Estados para reportes
  const [reportes, setReportes] = useState<any[]>([]);
  const [parametrosReporte, setParametrosReporte] = useState({
    tipoReporte: 'inventario-general',
    fechaDesde: '',
    fechaHasta: '',
    filtros: {} as any
  });

  // Estados para catálogos
  const [tiposEquipo, setTiposEquipo] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    cargarEquipos();
    cargarCatalogos();
    cargarTransferencias();
    cargarMantenimientos();
  }, []);

  const cargarEquipos = async () => {
    setLoading(true);
    try {
      if ((await apiService.get('/api/equipos')).success) {
        setEquipos((await apiService.get('/api/equipos')).data || []);
      }
    } catch (error) {
      console.error('Error cargando equipos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCatalogos = async () => {
    try {
      const [tiposResp, sucursalesResp, usuariosResp] = await Promise.all([
        apiService.get('/api/catalogos?tipo=tiposequipo'),
        apiService.get('/api/catalogos?tipo=sucursales'),
        apiService.get('/api/catalogos?tipo=usuarios')
      ]);

      if (tiposResp.success) setTiposEquipo(tiposResp.data || []);
      if (sucursalesResp.success) setSucursales(sucursalesResp.data || []);
      if (usuariosResp.success) setUsuarios(usuariosResp.data || []);
    } catch (error) {
      console.error('Error cargando catálogos:', error);
    }
  };

  const buscarEquipos = async () => {
    setLoading(true);
    try {
      const response = await apiService.post('/api/equipos/search', filtros);
      if (response.success) {
        setEquipos(response.data || []);
        setPaginacion(response.pagination || {
          paginaActual: 1,
          totalPaginas: 1,
          totalRegistros: 0,
          hayAnterior: false,
          haySiguiente: false
        });
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const verDetallesEquipo = async (noSerie: string) => {
    setLoading(true);
    try {
      const response = await apiService.get(`/api/equipos/${noSerie}`);
      if (response.success) {
        setDetallesEquipo(response.data);
        setEquipoSeleccionado(noSerie);
      }
    } catch (error) {
      console.error('Error cargando detalles:', error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros({ ...filtros, pagina: nuevaPagina });
    setTimeout(buscarEquipos, 100);
  };

  const cargarTransferencias = async () => {
    try {
      const response = await apiService.get('/api/equipos/transfer');
      if (response.success) {
        setTransferencias(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando transferencias:', error);
    }
  };

  const crearTransferencia = async () => {
    try {
      const response = await apiService.post('/api/equipos/transfer', formTransferencia);
      if (response.success) {
        alert('✅ Transferencia creada exitosamente');
        cargarTransferencias();
        setFormTransferencia({
          equipos: [],
          sucursalDestino: '',
          areaDestino: '',
          motivoTransferencia: '',
          fechaTransferencia: '',
          observaciones: ''
        });
      } else {
        alert('❌ Error: ' + response.error);
      }
    } catch (error) {
      console.error('Error creando transferencia:', error);
      alert('❌ Error de conexión');
    }
  };

  const cargarMantenimientos = async () => {
    try {
      const response = await apiService.get('/api/equipos/maintenance');
      if (response.success) {
        setMantenimientos(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando mantenimientos:', error);
    }
  };

  const crearMantenimiento = async () => {
    try {
      const response = await apiService.post('/api/equipos/maintenance', formMantenimiento);
      if (response.success) {
        alert('✅ Mantenimiento programado exitosamente');
        cargarMantenimientos();
        setFormMantenimiento({
          equipos: [],
          tipoMantenimiento: 'preventivo',
          prioridad: 'media',
          descripcion: '',
          fechaProgramada: '',
          tecnicoAsignado: '',
          observaciones: ''
        });
      } else {
        alert('❌ Error: ' + response.error);
      }
    } catch (error) {
      console.error('Error creando mantenimiento:', error);
      alert('❌ Error de conexión');
    }
  };

  const generarReporte = async () => {
    try {
      const response = await apiService.post('/api/equipos/reports', parametrosReporte);
      if (response.success) {
        setReportes(response.data || []);
        if (response.csvUrl) {
          // Descargar CSV si está disponible
          const link = document.createElement('a');
          link.href = response.csvUrl;
          link.download = `reporte_${parametrosReporte.tipoReporte}_${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
        }
      } else {
        alert('❌ Error: ' + response.error);
      }
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('❌ Error de conexión');
    }
  };

  const renderVistaTransferencias = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Gestión de Transferencias</h3>
          <button
            onClick={() => setVistaActual('lista')}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <i className="fas fa-arrow-left mr-2"></i>Volver a Lista
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario de nueva transferencia */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Nueva Transferencia</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipos a transferir
                </label>
                <select
                  multiple
                  value={formTransferencia.equipos}
                  onChange={(e) => setFormTransferencia({
                    ...formTransferencia,
                    equipos: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24"
                >
                  {equipos.map((equipo) => (
                    <option key={equipo.no_serie} value={equipo.no_serie}>
                      {equipo.no_serie} - {equipo.nombreEquipo}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl para seleccionar múltiples</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sucursal Destino
                  </label>
                  <select
                    value={formTransferencia.sucursalDestino}
                    onChange={(e) => setFormTransferencia({...formTransferencia, sucursalDestino: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar sucursal</option>
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.nombre}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área Destino
                  </label>
                  <input
                    type="text"
                    value={formTransferencia.areaDestino}
                    onChange={(e) => setFormTransferencia({...formTransferencia, areaDestino: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Área de destino"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de Transferencia
                </label>
                <select
                  value={formTransferencia.motivoTransferencia}
                  onChange={(e) => setFormTransferencia({...formTransferencia, motivoTransferencia: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar motivo</option>
                  <option value="Reubicación">Reubicación</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Actualización">Actualización</option>
                  <option value="Reemplazo">Reemplazo</option>
                  <option value="Optimización">Optimización</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Transferencia
                </label>
                <input
                  type="datetime-local"
                  value={formTransferencia.fechaTransferencia}
                  onChange={(e) => setFormTransferencia({...formTransferencia, fechaTransferencia: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={formTransferencia.observaciones}
                  onChange={(e) => setFormTransferencia({...formTransferencia, observaciones: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <button
                onClick={crearTransferencia}
                disabled={!formTransferencia.equipos.length || !formTransferencia.sucursalDestino}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                <i className="fas fa-exchange-alt mr-2"></i>Crear Transferencia
              </button>
            </div>
          </div>

          {/* Lista de transferencias recientes */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Transferencias Recientes</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transferencias.map((transfer: any) => (
                <div key={transfer.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">#{transfer.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transfer.estatus === 'completada' ? 'bg-green-100 text-green-800' :
                      transfer.estatus === 'en-proceso' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transfer.estatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <i className="fas fa-arrow-right mr-1"></i>
                    {transfer.sucursalOrigen} → {transfer.sucursalDestino}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transfer.equiposCount} equipo(s) - {transfer.motivo}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(transfer.fecha).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVistaMantenimiento = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Gestión de Mantenimiento</h3>
          <button
            onClick={() => setVistaActual('lista')}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <i className="fas fa-arrow-left mr-2"></i>Volver a Lista
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario de nuevo mantenimiento */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Programar Mantenimiento</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipos
                </label>
                <select
                  multiple
                  value={formMantenimiento.equipos}
                  onChange={(e) => setFormMantenimiento({
                    ...formMantenimiento,
                    equipos: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24"
                >
                  {equipos.map((equipo) => (
                    <option key={equipo.no_serie} value={equipo.no_serie}>
                      {equipo.no_serie} - {equipo.nombreEquipo}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl para seleccionar múltiples</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Mantenimiento
                  </label>
                  <select
                    value={formMantenimiento.tipoMantenimiento}
                    onChange={(e) => setFormMantenimiento({...formMantenimiento, tipoMantenimiento: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                    <option value="predictivo">Predictivo</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={formMantenimiento.prioridad}
                    onChange={(e) => setFormMantenimiento({...formMantenimiento, prioridad: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Mantenimiento
                </label>
                <textarea
                  value={formMantenimiento.descripcion}
                  onChange={(e) => setFormMantenimiento({...formMantenimiento, descripcion: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Describe las actividades de mantenimiento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Programada
                </label>
                <input
                  type="datetime-local"
                  value={formMantenimiento.fechaProgramada}
                  onChange={(e) => setFormMantenimiento({...formMantenimiento, fechaProgramada: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Técnico Asignado
                </label>
                <select
                  value={formMantenimiento.tecnicoAsignado}
                  onChange={(e) => setFormMantenimiento({...formMantenimiento, tecnicoAsignado: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar técnico</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.nombre}>
                      {usuario.nombre} - {usuario.area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={formMantenimiento.observaciones}
                  onChange={(e) => setFormMantenimiento({...formMantenimiento, observaciones: e.target.value})}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <button
                onClick={crearMantenimiento}
                disabled={!formMantenimiento.equipos.length || !formMantenimiento.descripcion}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
              >
                <i className="fas fa-tools mr-2"></i>Programar Mantenimiento
              </button>
            </div>
          </div>

          {/* Lista de mantenimientos */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Mantenimientos Programados</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mantenimientos.map((mant: any) => (
                <div key={mant.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">#{mant.id}</span>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        mant.prioridad === 'critica' ? 'bg-red-100 text-red-800' :
                        mant.prioridad === 'alta' ? 'bg-orange-100 text-orange-800' :
                        mant.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {mant.prioridad}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        mant.estatus === 'completado' ? 'bg-green-100 text-green-800' :
                        mant.estatus === 'en-proceso' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {mant.estatus}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {mant.tipoMantenimiento.toUpperCase()} - {mant.equiposCount} equipo(s)
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {mant.descripcion}
                  </p>
                  <p className="text-sm text-gray-600">
                    <i className="fas fa-user mr-1"></i>
                    {mant.tecnicoAsignado || 'Sin asignar'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Programado: {new Date(mant.fechaProgramada).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVistaReportes = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Sistema de Reportes</h3>
          <button
            onClick={() => setVistaActual('lista')}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <i className="fas fa-arrow-left mr-2"></i>Volver a Lista
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de configuración de reportes */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Generar Reporte</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Reporte
                </label>
                <select
                  value={parametrosReporte.tipoReporte}
                  onChange={(e) => setParametrosReporte({...parametrosReporte, tipoReporte: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="inventario-general">Inventario General</option>
                  <option value="equipos-por-ubicacion">Equipos por Ubicación</option>
                  <option value="equipos-por-tipo">Equipos por Tipo</option>
                  <option value="equipos-por-estatus">Equipos por Estatus</option>
                  <option value="movimientos-recientes">Movimientos Recientes</option>
                  <option value="mantenimientos-programados">Mantenimientos Programados</option>
                  <option value="equipos-sin-actividad">Equipos sin Actividad</option>
                  <option value="estadisticas-uso">Estadísticas de Uso</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={parametrosReporte.fechaDesde}
                    onChange={(e) => setParametrosReporte({...parametrosReporte, fechaDesde: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={parametrosReporte.fechaHasta}
                    onChange={(e) => setParametrosReporte({...parametrosReporte, fechaHasta: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={generarReporte}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-chart-bar mr-2"></i>Generar Reporte
                </button>
                <button
                  onClick={() => {
                    generarReporte();
                    setTimeout(() => {
                      alert('📥 Descargando reporte en formato CSV...');
                    }, 1000);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <i className="fas fa-download mr-2"></i>CSV
                </button>
              </div>
            </div>
          </div>

          {/* Vista previa del reporte */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Vista Previa del Reporte</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
              {reportes.length > 0 ? (
                <div className="space-y-3">
                  <div className="border-b border-gray-200 pb-2 mb-4">
                    <h5 className="font-semibold text-gray-900">
                      {parametrosReporte.tipoReporte.replace(/-/g, ' ').toUpperCase()}
                    </h5>
                    <p className="text-sm text-gray-600">
                      Generado: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  {reportes.map((item: any, index: number) => (
                    <div key={index} className="border border-gray-100 rounded p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.no_serie || item.nombre}</span>
                        <span className="text-xs text-gray-500">{item.valor}</span>
                      </div>
                      <p className="text-gray-600">{item.descripcion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <i className="fas fa-chart-bar text-4xl mb-4 text-gray-300"></i>
                    <p>Selecciona un tipo de reporte y haz clic en "Generar Reporte"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVistaLista = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Lista de Equipos</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setVistaActual('busqueda')}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <i className="fas fa-search mr-2"></i>Búsqueda Avanzada
            </button>
            <button
              onClick={() => setVistaActual('transferencias')}
              className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <i className="fas fa-exchange-alt mr-2"></i>Transferencias
            </button>
            <button
              onClick={() => setVistaActual('mantenimiento')}
              className="px-3 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              <i className="fas fa-tools mr-2"></i>Mantenimiento
            </button>
            <button
              onClick={() => setVistaActual('reportes')}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <i className="fas fa-chart-bar mr-2"></i>Reportes
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estatus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {equipos.map((equipo) => (
              <tr key={equipo.no_serie} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{equipo.no_serie}</div>
                    <div className="text-sm text-gray-500">{equipo.nombreEquipo}</div>
                    <div className="text-xs text-gray-400">{equipo.modelo}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {equipo.TipoEquipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{equipo.SucursalActual}</div>
                  <div className="text-xs text-gray-400">{equipo.AreaActual}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstatusColor(equipo.EstatusEquipo)}`}>
                    {equipo.EstatusEquipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => verDetallesEquipo(equipo.no_serie)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-purple-600 hover:text-purple-900">
                    <i className="fas fa-exchange-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="p-8 text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
          <p className="mt-2 text-gray-500">Cargando equipos...</p>
        </div>
      )}
    </div>
  );

  const renderVistaBusqueda = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Búsqueda Avanzada de Equipos</h3>
          <button
            onClick={() => setVistaActual('lista')}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <i className="fas fa-arrow-left mr-2"></i>Volver a Lista
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto de búsqueda
            </label>
            <input
              type="text"
              value={filtros.texto}
              onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
              placeholder="No. serie, nombre, modelo..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Equipo
            </label>
            <select
              value={filtros.tipoEquipo}
              onChange={(e) => setFiltros({ ...filtros, tipoEquipo: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Todos los tipos</option>
              {tiposEquipo.map((tipo) => (
                <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estatus
            </label>
            <select
              value={filtros.estatus}
              onChange={(e) => setFiltros({ ...filtros, estatus: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Todos los estatus</option>
              <option value="Disponible">Disponible</option>
              <option value="En uso">En uso</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Dañado">Dañado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sucursal
            </label>
            <select
              value={filtros.sucursal}
              onChange={(e) => setFiltros({ ...filtros, sucursal: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Todas las sucursales</option>
              {sucursales.map((sucursal) => (
                <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Alta Desde
            </label>
            <input
              type="date"
              value={filtros.fechaAltaDesde}
              onChange={(e) => setFiltros({ ...filtros, fechaAltaDesde: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Alta Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaAltaHasta}
              onChange={(e) => setFiltros({ ...filtros, fechaAltaHasta: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={buscarEquipos}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Buscando...
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-2"></i>Buscar
                </>
              )}
            </button>
            <button
              onClick={() => setFiltros({
                texto: '',
                tipoEquipo: '',
                estatus: '',
                sucursal: '',
                fechaAltaDesde: '',
                fechaAltaHasta: '',
                limite: 20,
                pagina: 1
              })}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              <i className="fas fa-times mr-2"></i>Limpiar
            </button>
          </div>

          <div className="text-sm text-gray-600">
            {paginacion.totalRegistros} equipos encontrados
          </div>
        </div>

        {/* Resultados de búsqueda */}
        {equipos.length > 0 && (
          <div className="mt-6">
            {renderVistaLista()}
            
            {/* Paginación mejorada */}
            {paginacion.totalPaginas > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Mostrando {((paginacion.paginaActual - 1) * filtros.limite) + 1} - {Math.min(paginacion.paginaActual * filtros.limite, paginacion.totalRegistros)} de {paginacion.totalRegistros} resultados
                </div>
                <nav className="flex space-x-1">
                  <button
                    onClick={() => cambiarPagina(1)}
                    disabled={paginacion.paginaActual === 1}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400"
                  >
                    <i className="fas fa-angle-double-left"></i>
                  </button>
                  <button
                    onClick={() => cambiarPagina(paginacion.paginaActual - 1)}
                    disabled={!paginacion.hayAnterior}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400"
                  >
                    <i className="fas fa-angle-left"></i>
                  </button>
                  
                  {/* Números de página */}
                  {Array.from({ length: Math.min(5, paginacion.totalPaginas) }, (_, i) => {
                    let pageNum;
                    if (paginacion.totalPaginas <= 5) {
                      pageNum = i + 1;
                    } else if (paginacion.paginaActual <= 3) {
                      pageNum = i + 1;
                    } else if (paginacion.paginaActual >= paginacion.totalPaginas - 2) {
                      pageNum = paginacion.totalPaginas - 4 + i;
                    } else {
                      pageNum = paginacion.paginaActual - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => cambiarPagina(pageNum)}
                        className={`px-3 py-2 rounded ${
                          pageNum === paginacion.paginaActual
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => cambiarPagina(paginacion.paginaActual + 1)}
                    disabled={!paginacion.haySiguiente}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400"
                  >
                    <i className="fas fa-angle-right"></i>
                  </button>
                  <button
                    onClick={() => cambiarPagina(paginacion.totalPaginas)}
                    disabled={paginacion.paginaActual === paginacion.totalPaginas}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400"
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetallesEquipo = () => {
    if (!detallesEquipo) return null;

    const { equipo, historial, estadisticas, equiposSimilares } = detallesEquipo;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Detalles del Equipo: {equipo.no_serie}
            </h3>
            <button
              onClick={() => {
                setEquipoSeleccionado(null);
                setDetallesEquipo(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información básica */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Información General</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Nombre:</span>
                    <p className="text-gray-900">{equipo.nombreEquipo}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Modelo:</span>
                    <p className="text-gray-900">{equipo.modelo}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Tipo:</span>
                    <p className="text-gray-900">{equipo.TipoEquipo}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">No. Activo:</span>
                    <p className="text-gray-900">{equipo.numeroActivo}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Estatus:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getEstatusColor(equipo.EstatusEquipo)}`}>
                      {equipo.EstatusEquipo}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Días en sistema:</span>
                    <p className="text-gray-900">{equipo.diasEnSistema}</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Ubicación</h4>
                <div className="text-sm">
                  <p><span className="font-medium">Sucursal:</span> {equipo.SucursalActual}</p>
                  <p><span className="font-medium">Área:</span> {equipo.AreaActual}</p>
                  <p><span className="font-medium">Zona:</span> {equipo.ZonaSucursal}</p>
                  <p><span className="font-medium">Estado:</span> {equipo.EstadoSucursal}</p>
                </div>
              </div>

              {/* Historial de movimientos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Historial Reciente</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {historial.map((mov: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <div>
                        <span className="font-medium text-sm">{mov.tipoMovimiento}</span>
                        <p className="text-xs text-gray-600">
                          {new Date(mov.fecha).toLocaleDateString()} - {mov.duracionDias} días
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-gray-600">{mov.sucursalOrigen} → {mov.sucursalDestino}</p>
                        <p className="text-gray-500">{mov.usuarioMovimiento}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel lateral */}
            <div className="space-y-4">
              {/* Estadísticas */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Estadísticas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total movimientos:</span>
                    <span className="font-medium">{estadisticas.totalMovimientos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Traslados:</span>
                    <span className="font-medium">{estadisticas.totalTraslados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mantenimientos:</span>
                    <span className="font-medium">{estadisticas.totalMantenimientos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Promedio días/mov:</span>
                    <span className="font-medium">{estadisticas.promedioDiasMovimiento}</span>
                  </div>
                </div>
              </div>

              {/* Equipos similares */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Equipos Similares</h4>
                <div className="space-y-2">
                  {equiposSimilares.map((eq: any, index: number) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{eq.no_serie}</p>
                      <p className="text-gray-600 text-xs">{eq.nombreEquipo}</p>
                      <span className={`px-1 py-0.5 rounded text-xs ${getEstatusColor(eq.estatus)}`}>
                        {eq.estatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  <i className="fas fa-edit mr-2"></i>Editar Equipo
                </button>
                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                  <i className="fas fa-exchange-alt mr-2"></i>Transferir
                </button>
                <button className="w-full px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                  <i className="fas fa-tools mr-2"></i>Mantenimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getEstatusColor = (estatus: string) => {
    const colores = {
      'Disponible': 'bg-green-100 text-green-800',
      'En uso': 'bg-blue-100 text-blue-800',
      'Mantenimiento': 'bg-yellow-100 text-yellow-800',
      'Dañado': 'bg-red-100 text-red-800',
      'Baja': 'bg-gray-100 text-gray-800'
    };
    return colores[estatus as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {vistaActual === 'lista' && renderVistaLista()}
      {vistaActual === 'busqueda' && renderVistaBusqueda()}
      {vistaActual === 'transferencias' && renderVistaTransferencias()}
      {vistaActual === 'mantenimiento' && renderVistaMantenimiento()}
      {vistaActual === 'reportes' && renderVistaReportes()}

      {equipoSeleccionado && renderDetallesEquipo()}
    </div>
  );
}