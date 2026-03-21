import React, { useState, useEffect, useCallback } from 'react';
import FallasManagerHeader from './FallasManagerHeader';

interface FallaData {
  id: number;
  no_serie: string;
  nombreEquipo: string;
  tipoEquipo: string;
  sucursal: string;
  tipo_falla: 'HARDWARE' | 'SOFTWARE' | 'CONECTIVIDAD' | 'SUMINISTROS' | 'MECANICA' | 'ELECTRICA' | 'OTRA';
  descripcion_problema: string;
  sintomas: string;
  prioridad: 'BAJA' | 'NORMAL' | 'ALTA' | 'CRITICA';
  usuario_reporta: string;
  fecha_reporte: string;
  fecha_solucion?: string;
  tecnico_asignado?: string;
  solucion_aplicada?: string;
  estatus: 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CANCELADA';
  tiempo_solucion_horas?: number;
  observaciones?: string;
  ubicacion_falla: string;
  impacto: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  requiere_repuestos: boolean;
  repuestos_utilizados?: string;
  costo_reparacion?: number;
  diasAbierta: number;
}

interface EstadisticasFallas {
  total: number;
  abiertas: number;
  en_proceso: number;
  resueltas: number;
  promedio_solucion_horas: number;
  por_tipo: any;
  por_prioridad: any;
  por_tecnico: any[];
}

interface FormularioFalla {
  no_serie: string;
  tipo_falla: 'HARDWARE' | 'SOFTWARE' | 'CONECTIVIDAD' | 'SUMINISTROS' | 'MECANICA' | 'ELECTRICA' | 'OTRA';
  descripcion_problema: string;
  sintomas: string;
  prioridad: 'BAJA' | 'NORMAL' | 'ALTA' | 'CRITICA';
  usuario_reporta: string;
  tecnico_asignado: string;
  ubicacion_falla: string;
  impacto: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  requiere_repuestos: boolean;
  observaciones: string;
}

const EquiposFallas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultar' | 'reportar' | 'estadisticas'>('consultar');
  
  // Estados para consulta
  const [fallas, setFallas] = useState<FallaData[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasFallas | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    estatus: 'ABIERTA',
    prioridad: '',
    tipo: '',
    tecnico: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Estados para reportar falla
  const [equiposBusqueda, setEquiposBusqueda] = useState<any[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<any>(null);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormularioFalla>({
    no_serie: '',
    tipo_falla: 'HARDWARE',
    descripcion_problema: '',
    sintomas: '',
    prioridad: 'NORMAL',
    usuario_reporta: '',
    tecnico_asignado: '',
    ubicacion_falla: '',
    impacto: 'MEDIO',
    requiere_repuestos: false,
    observaciones: ''
  });

  const [busquedaTerm, setBusquedaTerm] = useState('');
  const [fallaSeleccionada, setFallaSeleccionada] = useState<FallaData | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [errorEquipos, setErrorEquipos] = useState('');

  const buscarEquipos = useCallback(async (termino: string) => {
    setLoadingEquipos(true);
    setErrorEquipos('');
    try {
      const response = await fetch(`/api/equipos/search?q=${encodeURIComponent(termino)}&limit=50`);
      const data = await response.json();
      if (data.success) {
        setEquiposBusqueda(data.data || []);
      } else {
        setErrorEquipos('No se pudieron cargar los equipos');
      }
    } catch (error) {
      console.error('Error buscando equipos:', error);
      setErrorEquipos('Error de conexión al cargar equipos');
    } finally {
      setLoadingEquipos(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'consultar') {
      cargarFallas();
    }
    if (activeTab === 'reportar') {
      cargarTecnicos();
      buscarEquipos('');
    }
  }, [activeTab, buscarEquipos]);

  const cargarFallas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.estatus) params.append('estatus', filtros.estatus);
      if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
      if (filtros.tipo) params.append('tipo_falla', filtros.tipo);
      if (filtros.tecnico) params.append('tecnico_asignado', filtros.tecnico);

      const response = await fetch(`/api/equipos/fallas?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setFallas(data.data.fallas || []);
        setEstadisticas(data.data.estadisticas || null);
      } else {
        setFallas([]);
        setEstadisticas(null);
      }
    } catch (error) {
      console.error('Error cargando fallas:', error);
      setFallas([]);
      setEstadisticas(null);
    }
    setLoading(false);
  };

  const cargarTecnicos = async () => {
    try {
      const response = await fetch('/api/catalogos?tipo=tecnicos');
      const data = await response.json();
      if (data.success && data.data) {
        setTecnicos(data.data.map((u: any) => ({ id: u.id, nombre: u.nombre })));
      }
    } catch (error) {
      console.error('Error cargando técnicos:', error);
    }
  };

  const seleccionarEquipo = (equipo: any) => {
    setEquipoSeleccionado(equipo);
    setFormData(prev => ({
      ...prev,
      no_serie: equipo.no_serie,
      ubicacion_falla: `${equipo.SucursalActual} - ${equipo.AreaActual || 'Sin especificar'}`
    }));
    setBusquedaTerm(`${equipo.no_serie} - ${equipo.nombreEquipo}`);
    setDropdownVisible(false);
  };

  const reportarFalla = async () => {
    if (!equipoSeleccionado) {
      alert('Debe seleccionar un equipo');
      return;
    }

    if (!formData.descripcion_problema.trim()) {
      alert('Debe describir el problema');
      return;
    }

    if (!formData.usuario_reporta.trim()) {
      alert('Debe especificar quién reporta la falla');
      return;
    }

    try {
      setLoading(true);
      
      const fallaData = {
        no_serie: equipoSeleccionado.no_serie,
        tipo_falla: formData.tipo_falla,
        descripcion_problema: formData.descripcion_problema,
        sintomas: formData.sintomas || '',
        prioridad: formData.prioridad,
        usuario_reporta: formData.usuario_reporta,
        tecnico_asignado: formData.tecnico_asignado || '',
        ubicacion_falla: formData.ubicacion_falla || equipoSeleccionado.SucursalActual,
        impacto: formData.impacto,
        requiere_repuestos: formData.requiere_repuestos,
        observaciones: formData.observaciones || ''
      };

      console.log('Enviando falla:', fallaData);

      const response = await fetch('/api/equipos/fallas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fallaData)
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Falla reportada exitosamente');
        
        // Limpiar formulario
        setFormData({
          no_serie: '',
          tipo_falla: 'HARDWARE',
          descripcion_problema: '',
          sintomas: '',
          prioridad: 'NORMAL',
          usuario_reporta: '',
          tecnico_asignado: '',
          ubicacion_falla: '',
          impacto: 'MEDIO',
          requiere_repuestos: false,
          observaciones: ''
        });
        setEquipoSeleccionado(null);
        setBusquedaTerm('');
        
        // Cambiar a la pestaña de consultar para ver la falla creada
        setActiveTab('consultar');
        
        // Recargar la lista de fallas
        cargarFallas();
        
      } else {
        alert(`❌ Error: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Error reportando falla:', error);
      alert('❌ Error interno del servidor');
    } finally {
      setLoading(false);
    }
  };

  const actualizarFalla = async (updateData: any) => {
    if (!fallaSeleccionada) return;
    try {
      const response = await fetch('/api/equipos/fallas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fallaSeleccionada.id, ...updateData })
      });
      const result = await response.json();
      if (result.success) {
        setShowUpdateModal(false);
        setFallaSeleccionada(null);
        cargarFallas();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error actualizando falla:', error);
      alert('Error interno del servidor');
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'CRITICA': return 'bg-red-100 text-red-800 border-red-200';
      case 'ALTA': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NORMAL': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BAJA': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'ABIERTA': return 'bg-red-100 text-red-800';
      case 'EN_PROCESO': return 'bg-yellow-100 text-yellow-800';
      case 'RESUELTA': return 'bg-green-100 text-green-800';
      case 'CANCELADA': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoFallaLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'HARDWARE': 'Hardware',
      'SOFTWARE': 'Software',
      'CONECTIVIDAD': 'Conectividad',
      'SUMINISTROS': 'Suministros',
      'MECANICA': 'Mecánica',
      'ELECTRICA': 'Eléctrica',
      'OTRA': 'Otra'
    };
    return tipos[tipo] || tipo;
  };

  // Configuración de tabs para navegación
  const navigationTabs = [
    { id: 'consultar', label: 'Consultar Fallas', icon: 'fas fa-search' },
    { id: 'reportar', label: 'Reportar Falla', icon: 'fas fa-plus-circle' },
    { id: 'estadisticas', label: 'Estadísticas', icon: 'fas fa-chart-bar' }
  ];

  return (
    <div className="space-y-1">
      {/* Header unificado */}
      <FallasManagerHeader
        title="Gestión de Fallas"
        onRefresh={() => cargarFallas()}
        showRefreshButton={activeTab === 'consultar'}
        loading={loading}
        tabs={navigationTabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as any)}
      />

      {/* Contenido de las tabs */}
      <div className="bg-white shadow rounded-lg p-6">
          {/* Tab Content: Consultar */}
          {activeTab === 'consultar' && (
            <div className="space-y-6">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estatus
                  </label>
                  <select
                    value={filtros.estatus}
                    onChange={(e) => setFiltros({...filtros, estatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             bg-white text-gray-900 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="ABIERTA">Abierta</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="RESUELTA">Resuelta</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={filtros.prioridad}
                    onChange={(e) => setFiltros({...filtros, prioridad: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             bg-white text-gray-900 text-sm"
                  >
                    <option value="">Todas</option>
                    <option value="CRITICA">Crítica</option>
                    <option value="ALTA">Alta</option>
                    <option value="NORMAL">Normal</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={filtros.tipo}
                    onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             bg-white text-gray-900 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="HARDWARE">Hardware</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="CONECTIVIDAD">Conectividad</option>
                    <option value="SUMINISTROS">Suministros</option>
                    <option value="MECANICA">Mecánica</option>
                    <option value="ELECTRICA">Eléctrica</option>
                    <option value="OTRA">Otra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaDesde}
                    onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             bg-white text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaHasta}
                    onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             bg-white text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Técnico
                  </label>
                  <input
                    type="text"
                    value={filtros.tecnico}
                    onChange={(e) => setFiltros({...filtros, tecnico: e.target.value})}
                    placeholder="Nombre del técnico"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                             bg-white text-gray-900 text-sm"
                  />
                </div>
              </div>

              {/* Lista de Fallas */}
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Cargando fallas...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 ">
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
                        <tr key={falla.id} className="hover:bg-gray-50">
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
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {getTipoFallaLabel(falla.tipo_falla)}
                              </span>
                              <br />
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPrioridadColor(falla.prioridad)}`}>
                                {falla.prioridad}
                              </span>
                              <br />
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstatusColor(falla.estatus)}`}>
                                {falla.estatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {falla.tecnico_asignado || 'Sin asignar'}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setFallaSeleccionada(falla);
                                setShowUpdateModal(true);
                              }}
                              className="text-gray-700 hover:text-gray-900 mr-3"
                            >
                              <i className="fas fa-edit"></i> Actualizar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {fallas.length === 0 && (
                    <div className="text-center py-8 text-gray-700">
                      No se encontraron fallas con los filtros aplicados
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Reportar */}
          {activeTab === 'reportar' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Selección de Equipo */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Seleccionar Equipo
                  </h3>

                  {/* Si ya hay equipo seleccionado */}
                  {equipoSeleccionado ? (
                    <div className="p-3 bg-green-50 border border-green-300 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-green-800">
                          ✓ {equipoSeleccionado.no_serie} — {equipoSeleccionado.nombreEquipo}
                        </div>
                        <div className="text-xs text-green-600">
                          {equipoSeleccionado.TipoEquipo} | {equipoSeleccionado.SucursalActual}
                        </div>
                      </div>
                      <button
                        onClick={() => { setEquipoSeleccionado(null); setBusquedaTerm(''); buscarEquipos(''); }}
                        className="text-xs text-red-500 hover:text-red-700 underline ml-3"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Campo de búsqueda */}
                      <input
                        type="text"
                        value={busquedaTerm}
                        onChange={(e) => {
                          setBusquedaTerm(e.target.value);
                          buscarEquipos(e.target.value);
                        }}
                        placeholder="Filtrar por nombre o número de serie..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />

                      {/* Lista siempre visible */}
                      <div className="border border-gray-200 rounded-lg overflow-y-auto max-h-64 bg-white">
                        {loadingEquipos ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-400">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Cargando equipos...
                          </div>
                        ) : errorEquipos ? (
                          <div className="px-4 py-6 text-center">
                            <p className="text-sm text-red-500 mb-2">{errorEquipos}</p>
                            <button onClick={() => buscarEquipos('')} className="text-sm text-blue-600 underline">Reintentar</button>
                          </div>
                        ) : equiposBusqueda.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-400">
                            No se encontraron equipos
                          </div>
                        ) : (
                          equiposBusqueda.map((equipo) => (
                            <button
                              key={equipo.no_serie}
                              onClick={() => seleccionarEquipo(equipo)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                            >
                              <div className="text-sm font-medium text-gray-900">
                                {equipo.no_serie} — {equipo.nombreEquipo}
                              </div>
                              <div className="text-xs text-gray-500">
                                {equipo.TipoEquipo} | {equipo.SucursalActual}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Formulario de Falla */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 ">
                    Detalles de la Falla
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Falla *
                      </label>
                      <select
                        value={formData.tipo_falla}
                        onChange={(e) => setFormData({...formData, tipo_falla: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                                 bg-white  text-gray-900 "
                      >
                        <option value="HARDWARE">Hardware</option>
                        <option value="SOFTWARE">Software</option>
                        <option value="CONECTIVIDAD">Conectividad</option>
                        <option value="SUMINISTROS">Suministros</option>
                        <option value="MECANICA">Mecánica</option>
                        <option value="ELECTRICA">Eléctrica</option>
                        <option value="OTRA">Otra</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prioridad *
                      </label>
                      <select
                        value={formData.prioridad}
                        onChange={(e) => setFormData({...formData, prioridad: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                                 bg-white  text-gray-900 "
                      >
                        <option value="BAJA">Baja</option>
                        <option value="NORMAL">Normal</option>
                        <option value="ALTA">Alta</option>
                        <option value="CRITICA">Crítica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Impacto
                      </label>
                      <select
                        value={formData.impacto}
                        onChange={(e) => setFormData({...formData, impacto: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                                 bg-white  text-gray-900 "
                      >
                        <option value="BAJO">Bajo</option>
                        <option value="MEDIO">Medio</option>
                        <option value="ALTO">Alto</option>
                        <option value="CRITICO">Crítico</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Técnico Asignado
                      </label>
                      <select
                        value={formData.tecnico_asignado}
                        onChange={(e) => setFormData({...formData, tecnico_asignado: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                                 bg-white  text-gray-900 "
                      >
                        <option value="">Asignar después...</option>
                        {tecnicos.map((tecnico) => (
                          <option key={tecnico.id} value={tecnico.nombre}>
                            {tecnico.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Usuario que Reporta *
                      </label>
                      <input
                        type="text"
                        value={formData.usuario_reporta}
                        onChange={(e) => setFormData({...formData, usuario_reporta: e.target.value})}
                        placeholder="Nombre del usuario que reporta la falla"
                        className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                                 bg-white  text-gray-900 "
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción del Problema *
                    </label>
                    <textarea
                      value={formData.descripcion_problema}
                      onChange={(e) => setFormData({...formData, descripcion_problema: e.target.value})}
                      rows={3}
                      placeholder="Describe detalladamente el problema..."
                      className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                               bg-white  text-gray-900 "
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Síntomas Observados
                    </label>
                    <textarea
                      value={formData.sintomas}
                      onChange={(e) => setFormData({...formData, sintomas: e.target.value})}
                      rows={2}
                      placeholder="Síntomas específicos que presenta el equipo..."
                      className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                               bg-white  text-gray-900 "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Observaciones Adicionales
                    </label>
                    <textarea
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      rows={2}
                      placeholder="Información adicional relevante..."
                      className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                               bg-white  text-gray-900 "
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiere_repuestos"
                      checked={formData.requiere_repuestos}
                      onChange={(e) => setFormData({...formData, requiere_repuestos: e.target.checked})}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="requiere_repuestos" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Requiere repuestos
                    </label>
                  </div>

                  <button
                    onClick={reportarFalla}
                    disabled={loading || !equipoSeleccionado || !formData.descripcion_problema || !formData.usuario_reporta}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 
                             disabled:bg-gray-400 disabled:cursor-not-allowed
                             flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Reportando...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>Reportar Falla</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Estadísticas */}
          {activeTab === 'estadisticas' && estadisticas && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Fallas Abiertas</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">{estadisticas.abiertas}</p>
                    </div>
                    <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">En Proceso</p>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{estadisticas.en_proceso}</p>
                    </div>
                    <i className="fas fa-tools text-2xl text-yellow-600"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Resueltas</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{estadisticas.resueltas}</p>
                    </div>
                    <i className="fas fa-check-circle text-2xl text-green-600"></i>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{estadisticas.total}</p>
                    </div>
                    <i className="fas fa-clipboard-list text-2xl text-blue-600"></i>
                  </div>
                </div>
              </div>

              {/* Distribución por Tipo */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Distribución por Tipo de Falla
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{estadisticas.por_tipo.hardware}</div>
                    <div className="text-sm text-gray-600 ">Hardware</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{estadisticas.por_tipo.software}</div>
                    <div className="text-sm text-gray-600 ">Software</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{estadisticas.por_tipo.conectividad}</div>
                    <div className="text-sm text-gray-600 ">Conectividad</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{estadisticas.por_tipo.suministros}</div>
                    <div className="text-sm text-gray-600 ">Suministros</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{estadisticas.por_tipo.mecanica}</div>
                    <div className="text-sm text-gray-600 ">Mecánica</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{estadisticas.por_tipo.electrica}</div>
                    <div className="text-sm text-gray-600 ">Eléctrica</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{estadisticas.por_tipo.otra}</div>
                    <div className="text-sm text-gray-600 ">Otra</div>
                  </div>
                </div>
              </div>

              {/* Distribución por Prioridad */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Distribución por Prioridad
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{estadisticas.por_prioridad.critica}</div>
                    <div className="text-sm text-gray-600">Crítica</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{estadisticas.por_prioridad.alta}</div>
                    <div className="text-sm text-gray-600 ">Alta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{estadisticas.por_prioridad.normal}</div>
                    <div className="text-sm text-gray-600 ">Normal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{estadisticas.por_prioridad.baja}</div>
                    <div className="text-sm text-gray-600 ">Baja</div>
                  </div>
                </div>
              </div>

              {/* Promedio de Solución */}
              {estadisticas.promedio_solucion_horas > 0 && (
                <div className="bg-white  p-6 rounded-lg border border-gray-200 ">
                  <h3 className="text-lg font-medium text-gray-900  mb-4">
                    Tiempo Promedio de Solución
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{estadisticas.promedio_solucion_horas}h</div>
                    <div className="text-sm text-gray-600 ">Promedio para fallas resueltas</div>
                  </div>
                </div>
              )}

              {/* Estadísticas por Técnico */}
              {estadisticas.por_tecnico.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Rendimiento por Técnico
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 ">
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
                        {estadisticas.por_tecnico.map((tecnico, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                              {tecnico.tecnico}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                              {tecnico.total_asignadas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                              {tecnico.resueltas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                              {tecnico.en_proceso}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
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
          )}
        </div>

        {/* Modal de Actualización */}
        {showUpdateModal && fallaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900  mb-4">
                Actualizar Falla #{fallaSeleccionada?.id}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nuevo Estatus
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                             bg-white  text-gray-900 "
                    onChange={(e) => {
                      const estatus = e.target.value;
                      if (estatus === 'RESUELTA') {
                        const horas = prompt('Ingrese las horas de solución:');
                        const solucion = prompt('Ingrese la solución aplicada:');
                        actualizarFalla({
                          estatus,
                          tiempo_solucion_horas: horas ? parseFloat(horas) : undefined,
                          solucion_aplicada: solucion || undefined
                        });
                      } else {
                        actualizarFalla({ estatus });
                      }
                    }}
                  >
                    <option value="">Seleccionar nuevo estatus...</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="RESUELTA">Resuelta</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Asignar Técnico
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300  rounded-lg 
                             bg-white  text-gray-900 "
                    onChange={(e) => {
                      if (e.target.value) {
                        actualizarFalla({ tecnico_asignado: e.target.value });
                      }
                    }}
                  >
                    <option value="">Asignar técnico...</option>
                    {tecnicos.map((tecnico) => (
                      <option key={tecnico.id} value={tecnico.nombre}>
                        {tecnico.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default EquiposFallas;
