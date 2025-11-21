'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { usePaginationSwipe } from '@/hooks/useSwipeGestures';
import { useHapticFeedback } from '@/utils/hapticFeedback';
import { useDebounce, usePerformanceMonitor, useViewportOptimization } from '@/hooks/usePerformance';
import GostCamButton, { GostCamIconButton } from '../ui/GostCamButton';
import EquipmentStatus, { StatusIndicator } from '../ui/EquipmentStatus';
import GostCamLayout, { GostCamSection, GostCamCard } from '../ui/GostCamLayout';
import { VirtualizedEquipmentList } from '../ui/VirtualizedList';
import OptimizedImage from '../ui/OptimizedImage';
import { useEquipos } from '@/hooks/useEquipos';
import { useApp } from '@/contexts/AppContext';
import { SkeletonTable, SkeletonList } from '@/components/ui';
import EquiposFiltros from './EquiposFiltros';
import { MESSAGES, getStatusMessage } from '@/lib/messages';

interface EquiposListProps {
  onEquipoSelect?: (noSerie: string) => void;
  onVerDetalles?: (noSerie: string) => void;
  onEditarEquipo?: (noSerie: string) => void;
  onEliminarEquipo?: (noSerie: string, nombreEquipo?: string) => void;
  onVerHistorial?: (noSerie: string) => void;
  onCambiarUbicacion?: (noSerie: string) => void;
  onMantenimiento?: (noSerie: string) => void;
}

interface Equipo {
  no_serie: string;
  nombreEquipo: string;
  TipoEquipo: string;
  EstatusEquipo: string;
  SucursalActual: string;
  UsuarioAsignado: string;
}

export default function EquiposList({ 
  onEquipoSelect, 
  onVerDetalles, 
  onEditarEquipo,
  onEliminarEquipo,
  onVerHistorial,
  onCambiarUbicacion,
  onMantenimiento
}: EquiposListProps) {
  const { getStatusColor } = useApp();
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<string[]>([]);
  const { 
    equipos, 
    loading, 
    paginacion, 
    cargarEquipos, 
    buscarEquipos,
    verDetallesEquipo 
  } = useEquipos();
  
  const [filtros, setFiltros] = useState({
    texto: '',
    limite: 20,
    pagina: 1
  });

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [hoveredEquipo, setHoveredEquipo] = useState<string | null>(null);

  // Hooks para funcionalidades móviles
  const { navigationChange } = useHapticFeedback();
  
  // Performance optimization hooks
  const debouncedSearchTerm = useDebounce(filtros.texto, 300);
  const performanceMonitor = usePerformanceMonitor('EquiposList');
  const { isVisible } = useViewportOptimization();
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // Función para cambiar página (definida antes de usePaginationSwipe)
  const handleCambiarPagina = useCallback((nuevaPagina: number) => {
    const filtrosBusqueda = {
      ...filtros,
      pagina: nuevaPagina,
      tipoEquipo: '',
      estatus: '',
      sucursal: '',
      usuarioAsignado: '',
      fechaAltaDesde: '',
      fechaAltaHasta: ''
    };
    setFiltros(prev => ({ ...prev, pagina: nuevaPagina }));
    buscarEquipos(filtrosBusqueda);
  }, [filtros, buscarEquipos]);
  
  // Configurar gestos swipe para paginación
  const { elementRef: paginationSwipeRef, isSwipeDetected } = usePaginationSwipe(
    paginacion.paginaActual,
    paginacion.totalPaginas,
    (newPage) => {
      navigationChange(); // Feedback háptico
      handleCambiarPagina(newPage);
    }
  );

  // Memoized calculations
  const filteredEquipos = useMemo(() => {
    if (!equipos) return [];
    return equipos.filter(equipo => {
      if (!debouncedSearchTerm) return true;
      const searchLower = debouncedSearchTerm.toLowerCase();
      return equipo.no_serie.toLowerCase().includes(searchLower) ||
             equipo.nombreEquipo?.toLowerCase().includes(searchLower) ||
             equipo.TipoEquipo?.toLowerCase().includes(searchLower) ||
             equipo.SucursalActual?.toLowerCase().includes(searchLower);
    });
  }, [equipos, debouncedSearchTerm]);

  const handleFiltroChangeOptimized = useCallback((campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      pagina: 1 // Reset página al cambiar filtros
    }));
  }, []);

  const handleBuscarOptimized = useCallback(() => {
    const filtrosBusqueda = {
      ...filtros,
      tipoEquipo: '',
      estatus: '',
      sucursal: '',
      usuarioAsignado: '',
      fechaAltaDesde: '',
      fechaAltaHasta: ''
    };
    buscarEquipos(filtrosBusqueda);
  }, [filtros]);

  // Cargar equipos solo una vez al montar el componente
  useEffect(() => {
    if (equipos.length === 0) {
      cargarEquipos();
    }
  }, []); // Solo se ejecuta una vez

  const handleFiltroChange = (campo: string, valor: string) => {
    handleFiltroChangeOptimized(campo, valor);
  };

  const handleBuscar = () => {
    handleBuscarOptimized();
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      texto: '',
      limite: 20,
      pagina: 1
    });
    cargarEquipos();
  };

  // Función para manejar selección individual
  const handleSelectEquipo = (noSerie: string, checked: boolean) => {
    if (checked) {
      setEquiposSeleccionados(prev => [...prev, noSerie]);
    } else {
      setEquiposSeleccionados(prev => prev.filter(id => id !== noSerie));
    }
    onEquipoSelect?.(noSerie);
  };

  // Función para seleccionar/deseleccionar todos
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setEquiposSeleccionados(equipos.map(e => e.no_serie));
    } else {
      setEquiposSeleccionados([]);
    }
  };

  // Acciones masivas
  const handleBulkAction = (action: string) => {
    if (equiposSeleccionados.length === 0) return;
    
    console.log(`Bulk action: ${action}`, equiposSeleccionados);
    // Aquí iría la lógica para acciones masivas
  };

  // Componente de botón de más acciones
  const MoreActionsButton: React.FC<{ equipo: Equipo }> = ({ equipo }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="relative">
        <GostCamIconButton
          variant="ghost"
          size="sm"
          icon={<i className="fas fa-ellipsis-v" />}
          ariaLabel="Más acciones"
          onClick={() => setShowMenu(!showMenu)}
          hapticFeedback="light"
        />
        {showMenu && (
          <div className="absolute right-0 top-8 bg-white border border-gostcam-border-light rounded-xl shadow-lg z-20 min-w-48">
            <div className="py-2">
              {onCambiarUbicacion && (
                <button
                  onClick={() => {
                    onCambiarUbicacion(equipo.no_serie);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-gostcam-text-primary hover:bg-gostcam-gray-100 transition-colors"
                >
                  <i className="fas fa-exchange-alt mr-3 text-gostcam-secondary"></i>
                  {MESSAGES.buttons.transfer}
                </button>
              )}
              {onMantenimiento && (
                <button
                  onClick={() => {
                    onMantenimiento(equipo.no_serie);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i className="fas fa-wrench mr-2"></i>Mantenimiento
                </button>
              )}
              {onVerHistorial && (
                <button
                  onClick={() => {
                    onVerHistorial(equipo.no_serie);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <i className="fas fa-history mr-2"></i>Historial
                </button>
              )}
              {onEliminarEquipo && (
                <>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      onEliminarEquipo(equipo.no_serie, equipo.nombreEquipo);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <i className="fas fa-trash mr-2"></i>Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Componente de tarjeta para móvil - optimizado
  const EquipoCard: React.FC<{ equipo: Equipo }> = React.memo(({ equipo }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-150">
      {/* Header con checkbox y acciones */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
            checked={equiposSeleccionados.includes(equipo.no_serie)}
            onChange={(e) => handleSelectEquipo(equipo.no_serie, e.target.checked)}
          />
          <OptimizedImage
            src={'/placeholder-equipment.png'}
            alt={`${equipo.nombreEquipo || 'Equipo'} - ${equipo.no_serie}`}
            width={32}
            height={32}
            className="rounded object-cover border border-gray-200 mr-2"
            fallback="/placeholder-equipment.jpg"
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900">{equipo.no_serie}</h3>
            <p className="text-xs text-gray-500">{equipo.nombreEquipo || 'Sin nombre'}</p>
          </div>
        </div>
        <MoreActionsButton equipo={equipo} />
      </div>

      {/* Información del equipo */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Ubicación:</span>
          <span className="text-sm text-gray-900">{equipo.SucursalActual || 'Sin ubicación'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Tipo:</span>
          <span className="text-sm text-gray-900">{equipo.TipoEquipo || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Estado:</span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(equipo.EstatusEquipo)}`}>
            {equipo.EstatusEquipo}
          </span>
        </div>
        {equipo.UsuarioAsignado && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Asignado a:</span>
            <span className="text-sm text-gray-900">{equipo.UsuarioAsignado}</span>
          </div>
        )}
      </div>

      {/* Acciones principales */}
      <div className="mt-4 flex space-x-2">
        {onVerDetalles && (
          <button
            onClick={() => onVerDetalles(equipo.no_serie)}
            className="flex-1 bg-blue-50 text-blue-700 text-sm py-2 px-3 rounded-md hover:bg-blue-100 transition-colors duration-150"
          >
            <i className="fas fa-eye mr-2"></i>Ver
          </button>
        )}
        {onEditarEquipo && (
          <button
            onClick={() => onEditarEquipo(equipo.no_serie)}
            className="flex-1 bg-yellow-50 text-yellow-700 text-sm py-2 px-3 rounded-md hover:bg-yellow-100 transition-colors duration-150"
          >
            <i className="fas fa-edit mr-2"></i>Editar
          </button>
        )}
      </div>
    </div>
    );
  });



  return (
    <div className="space-y-6">
      {/* Performance monitoring en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4">
          <details className="bg-gray-50 p-2 rounded border">
            <summary className="cursor-pointer text-xs text-gray-600 font-mono">
              Performance Monitor (Dev Only)
            </summary>
            {isVisible && performanceMonitor && (
              <div className="mt-2 text-xs space-y-1">
                <div>Render Time: {performanceMonitor.renderTime}ms</div>
                <div>Render Time: {performanceMonitor.renderTime}ms</div>
                <div>Re-renders: {performanceMonitor.rerenders}</div>
                <div>Items Displayed: {filteredEquipos.length} / {equipos.length}</div>
                <div>Search Term: "{debouncedSearchTerm}"</div>
              </div>
            )}
          </details>
        </div>
      )}

      {/* Filtros */}
      <EquiposFiltros
        filtros={filtros}
        loading={loading}
        equipos={equipos}
        onFiltroChange={handleFiltroChange}
        onBuscar={handleBuscar}
        onLimpiarFiltros={handleLimpiarFiltros}
        onSearchResults={(results) => {
          // Manejar resultados de búsqueda aquí si es necesario
        }}
      />

      {/* Barra de herramientas y acciones masivas */}
      {equipos.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Resumen de equipos */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-center">
            <i className="fas fa-info-circle text-blue-500 mr-2"></i>
            <span className="text-sm text-blue-700">
              {equipos.length} equipos en la página actual
              {equiposSeleccionados.length > 0 && ` • ${equiposSeleccionados.length} seleccionados`}
            </span>
          </div>

          {/* Acciones masivas */}
          {equiposSeleccionados.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-900 min-h-[44px]"
                defaultValue=""
              >
                <option value="">Acciones masivas</option>
                <option value="trasladar">Trasladar seleccionados</option>
                <option value="mantenimiento">Agendar mantenimiento</option>
                <option value="eliminar">Eliminar seleccionados</option>
              </select>
              <button
                onClick={() => setEquiposSeleccionados([])}
                className="text-sm text-gray-500 hover:text-gray-700 min-h-[44px] px-2"
              >
                Limpiar selección
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lista de equipos con diseño responsivo */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6">
            <SkeletonTable />
          </div>
        ) : equipos.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <i className="fas fa-search text-gray-400 text-6xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron equipos</h3>
            <p className="text-gray-500">
              {filtros.texto ? 'No hay equipos que coincidan con tu búsqueda.' : 'No hay equipos registrados.'}
            </p>
            {filtros.texto && (
              <button
                onClick={handleLimpiarFiltros}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-150 min-h-[44px]"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Vista de escritorio - Tabla simple */}
            <div className="hidden lg:block" ref={viewportRef}>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipo
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ubicación
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEquipos.map((equipo, index) => (
                      <tr key={equipo.no_serie || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <OptimizedImage
                              src={'/placeholder-equipment.png'}
                              alt={`${equipo.nombreEquipo || 'Equipo'} - ${equipo.no_serie}`}
                              width={40}
                              height={40}
                              className="rounded object-cover border border-gray-200 mr-3"
                              fallback="/placeholder-equipment.jpg"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{equipo.nombreEquipo}</div>
                              <div className="text-sm text-gray-500">{equipo.no_serie}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {equipo.TipoEquipo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            equipo.EstatusEquipo === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {equipo.EstatusEquipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {equipo.SucursalActual}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {onVerDetalles && (
                              <button
                                onClick={() => onVerDetalles(equipo.no_serie)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Ver
                              </button>
                            )}
                            {onEditarEquipo && (
                              <button
                                onClick={() => onEditarEquipo(equipo.no_serie)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Editar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vista móvil/tablet - Cards optimizada */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredEquipos.map((equipo) => (
                <EquipoCard key={equipo.no_serie} equipo={equipo} />
              ))}
            </div>
          </>
        )}

        {/* Paginación con swipe mejorada */}
        {paginacion.totalPaginas > 1 && (
          <div 
            ref={paginationSwipeRef as React.RefObject<HTMLDivElement>}
            className={`bg-white px-4 py-3 border-t border-gray-200 sm:px-6 relative ${
              isSwipeDetected ? 'swipe-indicator swipe-detected' : 'swipe-indicator'
            }`}
          >
            {/* Indicador visual de swipe */}
            {isSwipeDetected && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            )}
            
            {/* Paginación móvil mejorada */}
            <div className="flex-1 flex justify-between sm:hidden">
              <GostCamButton
                onClick={() => handleCambiarPagina(paginacion.paginaActual - 1)}
                disabled={!paginacion.hayAnterior}
                variant="outline"
                size="md"
                leftIcon={<i className="fas fa-chevron-left"></i>}
                hapticFeedback="light"
              >
                Anterior
              </GostCamButton>
              
              {/* Indicador de página actual en móvil */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
                  {paginacion.paginaActual} / {paginacion.totalPaginas}
                </span>
              </div>
              
              <GostCamButton
                onClick={() => handleCambiarPagina(paginacion.paginaActual + 1)}
                disabled={!paginacion.haySiguiente}
                variant="outline"
                size="md"
                rightIcon={<i className="fas fa-chevron-right"></i>}
                hapticFeedback="light"
              >
                Siguiente
              </GostCamButton>
            </div>

            {/* Paginación desktop */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{' '}
                  <span className="font-medium">
                    {((paginacion.paginaActual - 1) * filtros.limite) + 1}
                  </span>{' '}
                  a{' '}
                  <span className="font-medium">
                    {Math.min(paginacion.paginaActual * filtros.limite, paginacion.totalRegistros)}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium">{paginacion.totalRegistros}</span>{' '}
                  resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <GostCamIconButton
                    onClick={() => handleCambiarPagina(paginacion.paginaActual - 1)}
                    disabled={!paginacion.hayAnterior}
                    variant="outline"
                    size="md"
                    icon={<i className="fas fa-chevron-left"></i>}
                    ariaLabel="Página anterior"
                    className="rounded-l-md"
                    hapticFeedback="light"
                  />
                  
                  {/* Números de página */}
                  {Array.from({ length: Math.min(5, paginacion.totalPaginas) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <GostCamButton
                        key={pageNum}
                        onClick={() => handleCambiarPagina(pageNum)}
                        variant={pageNum === paginacion.paginaActual ? "primary" : "outline"}
                        size="md"
                        className="rounded-none"
                        hapticFeedback="light"
                      >
                        {pageNum}
                      </GostCamButton>
                    );
                  })}
                  
                  <GostCamIconButton
                    onClick={() => handleCambiarPagina(paginacion.paginaActual + 1)}
                    disabled={!paginacion.haySiguiente}
                    variant="outline"
                    size="md"
                    icon={<i className="fas fa-chevron-right"></i>}
                    ariaLabel="Página siguiente"
                    className="rounded-r-md"
                    hapticFeedback="light"
                  />
                </nav>
              </div>
            </div>

            {/* Instrucciones de swipe para paginación */}
            <div className="sm:hidden text-center mt-2">
              <p className="text-xs text-gray-500 animate-fade-in-out">
                <i className="fas fa-hand-point-left mr-1"></i>
                Desliza para cambiar página
                <i className="fas fa-hand-point-right ml-1"></i>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}