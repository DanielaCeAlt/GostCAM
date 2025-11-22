// =============================================
// HOOK PERSONALIZADO: useFallasState
// =============================================

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

// ========================
// TIPOS OPTIMIZADOS
// ========================
export interface FallaData {
  id: number;
  no_serie: string;
  nombreEquipo: string;
  sucursal: string;
  tipoEquipo: string;
  descripcion_problema: string;
  sintomas?: string;
  tipo_falla: 'HARDWARE' | 'SOFTWARE' | 'CONECTIVIDAD' | 'SEGURIDAD';
  prioridad: 'BAJA' | 'NORMAL' | 'ALTA' | 'CRITICA';
  estatus: 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA';
  fecha_reporte: string;
  fecha_solucion?: string;
  usuario_reporta: string;
  tecnico_asignado?: string;
  tiempo_solucion_horas?: number;
  diasAbierta: number;
  ubicacion_falla: string;
  impacto: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  requiere_repuestos: boolean;
  observaciones?: string;
}

export interface FormularioFalla {
  no_serie: string;
  tipo_falla: 'HARDWARE' | 'SOFTWARE' | 'CONECTIVIDAD' | 'SEGURIDAD';
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

export interface FiltrosFallas {
  estatus: string;
  prioridad: string;
  tipo: string;
  tecnico: string;
  fechaDesde: string;
  fechaHasta: string;
}

export interface EstadisticasFallas {
  total_fallas: number;
  abiertas: number;
  en_proceso: number;
  resueltas: number;
  por_prioridad: Array<{ prioridad: string; cantidad: number }>;
  por_tipo: Array<{ tipo: string; cantidad: number }>;
  por_tecnico: Array<{ tecnico: string; asignadas: number; resueltas: number; en_proceso: number; promedio_horas: number }>;
  tiempo_promedio_resolucion: number;
}

// ========================
// ESTADO CONSOLIDADO
// ========================
interface FallasState {
  // Data
  fallas: FallaData[];
  estadisticas: EstadisticasFallas | null;
  tecnicos: any[];
  equiposBusqueda: any[];
  
  // UI State
  activeTab: 'consultar' | 'reportar' | 'estadisticas';
  loading: boolean;
  equipoSeleccionado: any | null;
  fallaSeleccionada: FallaData | null;
  showUpdateModal: boolean;
  
  // Form State
  filtros: FiltrosFallas;
  formData: FormularioFalla;
  busquedaTerm: string;
}

// ========================
// ACCIONES DEL REDUCER
// ========================
type FallasAction = 
  | { type: 'SET_ACTIVE_TAB'; payload: 'consultar' | 'reportar' | 'estadisticas' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FALLAS'; payload: FallaData[] }
  | { type: 'SET_ESTADISTICAS'; payload: EstadisticasFallas }
  | { type: 'SET_TECNICOS'; payload: any[] }
  | { type: 'SET_EQUIPOS_BUSQUEDA'; payload: any[] }
  | { type: 'SET_EQUIPO_SELECCIONADO'; payload: any | null }
  | { type: 'SET_FALLA_SELECCIONADA'; payload: FallaData | null }
  | { type: 'SET_SHOW_UPDATE_MODAL'; payload: boolean }
  | { type: 'UPDATE_FILTROS'; payload: Partial<FiltrosFallas> }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<FormularioFalla> }
  | { type: 'RESET_FORM_DATA' }
  | { type: 'SET_BUSQUEDA_TERM'; payload: string };

// ========================
// ESTADO INICIAL
// ========================
const initialFormData: FormularioFalla = {
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
};

const initialState: FallasState = {
  // Data
  fallas: [],
  estadisticas: null,
  tecnicos: [],
  equiposBusqueda: [],
  
  // UI State
  activeTab: 'consultar',
  loading: false,
  equipoSeleccionado: null,
  fallaSeleccionada: null,
  showUpdateModal: false,
  
  // Form State
  filtros: {
    estatus: 'ABIERTA',
    prioridad: '',
    tipo: '',
    tecnico: '',
    fechaDesde: '',
    fechaHasta: ''
  },
  formData: initialFormData,
  busquedaTerm: ''
};

// ========================
// REDUCER OPTIMIZADO
// ========================
function fallasReducer(state: FallasState, action: FallasAction): FallasState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_FALLAS':
      return { ...state, fallas: action.payload };
    
    case 'SET_ESTADISTICAS':
      return { ...state, estadisticas: action.payload };
    
    case 'SET_TECNICOS':
      return { ...state, tecnicos: action.payload };
    
    case 'SET_EQUIPOS_BUSQUEDA':
      return { ...state, equiposBusqueda: action.payload };
    
    case 'SET_EQUIPO_SELECCIONADO':
      return { 
        ...state, 
        equipoSeleccionado: action.payload,
        formData: action.payload 
          ? { ...state.formData, no_serie: action.payload.no_serie }
          : state.formData
      };
    
    case 'SET_FALLA_SELECCIONADA':
      return { ...state, fallaSeleccionada: action.payload };
    
    case 'SET_SHOW_UPDATE_MODAL':
      return { ...state, showUpdateModal: action.payload };
    
    case 'UPDATE_FILTROS':
      return { 
        ...state, 
        filtros: { ...state.filtros, ...action.payload } 
      };
    
    case 'UPDATE_FORM_DATA':
      return { 
        ...state, 
        formData: { ...state.formData, ...action.payload } 
      };
    
    case 'RESET_FORM_DATA':
      return { 
        ...state, 
        formData: initialFormData,
        equipoSeleccionado: null 
      };
    
    case 'SET_BUSQUEDA_TERM':
      return { ...state, busquedaTerm: action.payload };
    
    default:
      return state;
  }
}

// ========================
// HOOK PRINCIPAL OPTIMIZADO
// ========================
export function useFallasState() {
  const [state, dispatch] = useState(initialState);

  // ========================
  // FUNCIONES OPTIMIZADAS
  // ========================
  
  // Cargar fallas con memoización
  const cargarFallas = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock data optimizada
      const fallasData: FallaData[] = [
        {
          id: 1,
          no_serie: 'CAM-001',
          nombreEquipo: 'Cámara Principal',
          sucursal: 'Centro Principal',
          tipoEquipo: 'Cámara',
          descripcion_problema: 'La cámara no transmite video',
          sintomas: 'Pantalla negra, sin señal',
          tipo_falla: 'HARDWARE',
          prioridad: 'ALTA',
          estatus: 'ABIERTA',
          fecha_reporte: '2024-11-15T10:00:00',
          usuario_reporta: 'Juan Pérez',
          tecnico_asignado: 'Carlos Mendoza',
          diasAbierta: 4,
          ubicacion_falla: 'Entrada principal',
          impacto: 'ALTO',
          requiere_repuestos: true,
          observaciones: 'Posible falla en el sensor'
        },
        {
          id: 2,
          no_serie: 'CAM-002',
          nombreEquipo: 'Cámara Entrada',
          sucursal: 'Sucursal Norte',
          tipoEquipo: 'Cámara',
          descripcion_problema: 'Imagen borrosa y desenfocada',
          sintomas: 'Calidad de imagen deficiente',
          tipo_falla: 'HARDWARE',
          prioridad: 'NORMAL',
          estatus: 'EN_PROCESO',
          fecha_reporte: '2024-11-16T14:30:00',
          usuario_reporta: 'María García',
          tecnico_asignado: 'Ana López',
          diasAbierta: 3,
          ubicacion_falla: 'Pasillo principal',
          impacto: 'MEDIO',
          requiere_repuestos: false,
          observaciones: 'Lente sucio, requiere limpieza'
        },
        {
          id: 3,
          no_serie: 'CAM-003',
          nombreEquipo: 'Cámara Pasillo',
          sucursal: 'Centro Principal',
          tipoEquipo: 'Cámara',
          descripcion_problema: 'Cámara se desconecta intermitentemente',
          sintomas: 'Pérdida de conexión cada 2 horas',
          tipo_falla: 'CONECTIVIDAD',
          prioridad: 'NORMAL',
          estatus: 'RESUELTA',
          fecha_reporte: '2024-11-10T09:15:00',
          fecha_solucion: '2024-11-12T16:45:00',
          usuario_reporta: 'Pedro Santos',
          tecnico_asignado: 'Carlos Mendoza',
          tiempo_solucion_horas: 55.5,
          diasAbierta: 0,
          ubicacion_falla: 'Pasillo Este',
          impacto: 'BAJO',
          requiere_repuestos: false,
          observaciones: 'Cable de red reemplazado'
        }
      ];

      dispatch({ type: 'SET_FALLAS', payload: fallasData });
    } catch (error) {
      console.error('Error cargando fallas:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Cargar estadísticas con memoización
  const cargarEstadisticas = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const estadisticasData: EstadisticasFallas = {
        total_fallas: 15,
        abiertas: 5,
        en_proceso: 3,
        resueltas: 7,
        por_prioridad: [
          { prioridad: 'CRITICA', cantidad: 2 },
          { prioridad: 'ALTA', cantidad: 4 },
          { prioridad: 'NORMAL', cantidad: 7 },
          { prioridad: 'BAJA', cantidad: 2 }
        ],
        por_tipo: [
          { tipo: 'HARDWARE', cantidad: 8 },
          { tipo: 'SOFTWARE', cantidad: 3 },
          { tipo: 'CONECTIVIDAD', cantidad: 3 },
          { tipo: 'SEGURIDAD', cantidad: 1 }
        ],
        por_tecnico: [
          { tecnico: 'Carlos Mendoza', asignadas: 8, resueltas: 5, en_proceso: 2, promedio_horas: 24.5 },
          { tecnico: 'Ana López', asignadas: 5, resueltas: 2, en_proceso: 1, promedio_horas: 18.2 },
          { tecnico: 'Roberto Silva', asignadas: 2, resueltas: 0, en_proceso: 0, promedio_horas: 0 }
        ],
        tiempo_promedio_resolucion: 21.3
      };

      dispatch({ type: 'SET_ESTADISTICAS', payload: estadisticasData });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Cargar técnicos con memoización
  const cargarTecnicos = useCallback(async () => {
    try {
      const tecnicosData = [
        { id: 1, nombre: 'Carlos Mendoza', especialidad: 'Hardware' },
        { id: 2, nombre: 'Ana López', especialidad: 'Software' },
        { id: 3, nombre: 'Roberto Silva', especialidad: 'Redes' }
      ];
      
      dispatch({ type: 'SET_TECNICOS', payload: tecnicosData });
    } catch (error) {
      console.error('Error cargando técnicos:', error);
    }
  }, []);

  // Buscar equipos con debounce optimizado
  const buscarEquipos = useCallback(async (termino: string) => {
    if (!termino.trim()) {
      dispatch({ type: 'SET_EQUIPOS_BUSQUEDA', payload: [] });
      return;
    }

    try {
      // Simulación de búsqueda de equipos
      const equiposEncontrados = [
        {
          no_serie: 'CAM-001',
          nombreEquipo: 'Cámara Principal',
          TipoEquipo: 'Cámara',
          SucursalActual: 'Centro Principal'
        },
        {
          no_serie: 'CAM-002', 
          nombreEquipo: 'Cámara Entrada',
          TipoEquipo: 'Cámara',
          SucursalActual: 'Sucursal Norte'
        }
      ].filter(equipo => 
        equipo.no_serie.toLowerCase().includes(termino.toLowerCase()) ||
        equipo.nombreEquipo.toLowerCase().includes(termino.toLowerCase())
      );

      dispatch({ type: 'SET_EQUIPOS_BUSQUEDA', payload: equiposEncontrados });
    } catch (error) {
      console.error('Error buscando equipos:', error);
    }
  }, []);

  // Reportar falla optimizada
  const reportarFalla = useCallback(async () => {
    if (!state.equipoSeleccionado || !state.formData.descripcion_problema.trim()) {
      alert('Por favor selecciona un equipo y describe el problema');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Falla reportada exitosamente');
      dispatch({ type: 'RESET_FORM_DATA' });
      dispatch({ type: 'SET_EQUIPOS_BUSQUEDA', payload: [] });
      
      // Recargar fallas
      await cargarFallas();
    } catch (error) {
      console.error('Error reportando falla:', error);
      alert('Error al reportar la falla');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.equipoSeleccionado, state.formData.descripcion_problema, cargarFallas]);

  // ========================
  // VALORES COMPUTADOS CON useMemo
  // ========================
  
  // Fallas filtradas
  const fallasFiltradas = useMemo(() => {
    return state.fallas.filter(falla => {
      const cumpleFiltros = 
        (state.filtros.estatus === '' || falla.estatus === state.filtros.estatus) &&
        (state.filtros.prioridad === '' || falla.prioridad === state.filtros.prioridad) &&
        (state.filtros.tipo === '' || falla.tipo_falla === state.filtros.tipo) &&
        (state.filtros.tecnico === '' || falla.tecnico_asignado === state.filtros.tecnico);
      
      const cumpleBusqueda = state.busquedaTerm === '' || 
        falla.no_serie.toLowerCase().includes(state.busquedaTerm.toLowerCase()) ||
        falla.nombreEquipo.toLowerCase().includes(state.busquedaTerm.toLowerCase()) ||
        falla.descripcion_problema.toLowerCase().includes(state.busquedaTerm.toLowerCase());
      
      return cumpleFiltros && cumpleBusqueda;
    });
  }, [state.fallas, state.filtros, state.busquedaTerm]);

  // Validación del formulario
  const formularioValido = useMemo(() => {
    return state.equipoSeleccionado && 
           state.formData.descripcion_problema.trim() !== '' &&
           state.formData.usuario_reporta.trim() !== '';
  }, [state.equipoSeleccionado, state.formData.descripcion_problema, state.formData.usuario_reporta]);

  // ========================
  // EFECTOS OPTIMIZADOS
  // ========================
  
  // Cargar datos según tab activo
  useEffect(() => {
    switch (state.activeTab) {
      case 'consultar':
        cargarFallas();
        break;
      case 'reportar':
        cargarTecnicos();
        break;
      case 'estadisticas':
        cargarEstadisticas();
        break;
    }
  }, [state.activeTab, cargarFallas, cargarTecnicos, cargarEstadisticas]);

  // ========================
  // API PÚBLICA DEL HOOK
  // ========================
  return {
    // Estado
    ...state,
    fallasFiltradas,
    formularioValido,
    
    // Acciones
    dispatch,
    cargarFallas,
    cargarEstadisticas,
    cargarTecnicos,
    buscarEquipos,
    reportarFalla,
    
    // Helpers
    setActiveTab: (tab: 'consultar' | 'reportar' | 'estadisticas') => 
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    
    updateFiltros: (filtros: Partial<FiltrosFallas>) =>
      dispatch({ type: 'UPDATE_FILTROS', payload: filtros }),
    
    updateFormData: (data: Partial<FormularioFalla>) =>
      dispatch({ type: 'UPDATE_FORM_DATA', payload: data }),
    
    seleccionarEquipo: (equipo: any) =>
      dispatch({ type: 'SET_EQUIPO_SELECCIONADO', payload: equipo }),
    
    setBusquedaTerm: (term: string) =>
      dispatch({ type: 'SET_BUSQUEDA_TERM', payload: term })
  };
}