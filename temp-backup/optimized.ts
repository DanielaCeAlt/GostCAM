// =============================================
// TIPOS OPTIMIZADOS Y CONSOLIDADOS
// =============================================

// ========================
// TIPOS BASE Y PRIMITIVOS
// ========================
export type ID = number | string;
export type Timestamp = string; // ISO 8601 format
export type Status = 'Activo' | 'Inactivo' | 'Mantenimiento' | 'Con Falla';
export type Priority = 'BAJA' | 'NORMAL' | 'ALTA' | 'CRITICA';

// ========================
// ENTIDADES PRINCIPALES
// ========================

// Usuario optimizado
export interface User {
  readonly idUsuarios: number;
  readonly NombreUsuario: string;
  readonly NivelUsuario: 1 | 2 | 3 | 4; // Específico para roles
  readonly Correo: string;
  readonly Estatus: 0 | 1; // Específico para status
  readonly NivelNombre?: 'Admin' | 'Manager' | 'Técnico' | 'Usuario';
  readonly fechaCreacion?: Timestamp;
  readonly ultimoAcceso?: Timestamp;
}

// Sucursal optimizada
export interface Sucursal {
  readonly id: number;
  readonly nombre: string;
  readonly direccion: string;
  readonly ciudad: string;
  readonly estado: string;
  readonly telefono?: string;
  readonly email?: string;
  readonly codigoPostal?: string;
  readonly coordenadas?: {
    lat: number;
    lng: number;
  };
  // Estadísticas calculadas
  readonly totalCamaras: number;
  readonly totalSensores: number;
  readonly camarasActivas: number;
  readonly sensoresActivos: number;
  readonly equiposTotal: number;
  readonly porcentajeOperativo: number;
}

// Equipo consolidado y optimizado
export interface Equipo {
  readonly no_serie: string; // Primary key
  readonly nombreEquipo: string;
  readonly TipoEquipo: 'Cámara' | 'Sensor' | 'Router' | 'Switch' | 'DVR' | 'NVR';
  readonly marca: string;
  readonly modelo: string;
  readonly EstatusEquipo: Status;
  readonly SucursalActual: string;
  readonly AreaActual?: string;
  readonly fechaInstalacion: Timestamp;
  readonly ultimoMantenimiento?: Timestamp;
  readonly proximoMantenimiento?: Timestamp;
  readonly estadoConexion?: 'Conectado' | 'Desconectado' | 'Error';
  readonly observaciones?: string;
  // Datos técnicos
  readonly especificaciones?: Record<string, unknown>;
  readonly configuracion?: Record<string, unknown>;
  readonly garantia?: {
    fechaInicio: Timestamp;
    fechaFin: Timestamp;
    proveedor: string;
  };
}

// Falla optimizada
export interface Falla {
  readonly id: number;
  readonly no_serie: string; // FK a Equipo
  readonly tipo_falla: 'HARDWARE' | 'SOFTWARE' | 'CONECTIVIDAD' | 'SEGURIDAD';
  readonly descripcion_problema: string;
  readonly sintomas?: string;
  readonly prioridad: Priority;
  readonly estatus: 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA';
  readonly fecha_reporte: Timestamp;
  readonly fecha_solucion?: Timestamp;
  readonly usuario_reporta: string;
  readonly tecnico_asignado?: string;
  readonly tiempo_solucion_horas?: number;
  readonly ubicacion_falla: string;
  readonly impacto: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  readonly requiere_repuestos: boolean;
  readonly observaciones?: string;
  readonly solucion_aplicada?: string;
  readonly costo_reparacion?: number;
  // Datos calculados
  readonly diasAbierta: number;
  readonly equipoInfo?: {
    nombreEquipo: string;
    sucursal: string;
    tipoEquipo: string;
  };
}

// Movimiento optimizado
export interface Movimiento {
  readonly id: number;
  readonly no_serie: string; // FK a Equipo
  readonly tipoMovimiento: 'TRASLADO' | 'INSTALACION' | 'RETIRO' | 'MANTENIMIENTO';
  readonly sucursalOrigen?: string;
  readonly sucursalDestino: string;
  readonly posicionOrigen?: string;
  readonly posicionDestino?: string;
  readonly fechaMovimiento: Timestamp;
  readonly fechaEjecucion?: Timestamp;
  readonly estatusMovimiento: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  readonly motivoMovimiento: string;
  readonly responsableMovimiento: string;
  readonly observaciones?: string;
  readonly urgencia: Priority;
  // Datos adicionales
  readonly equipoInfo?: Pick<Equipo, 'nombreEquipo' | 'TipoEquipo' | 'marca' | 'modelo'>;
  readonly distancia?: number; // En km
  readonly costoEstimado?: number;
}

// ========================
// FILTROS TIPADOS
// ========================
export interface FiltrosEquipos {
  readonly sucursal?: string;
  readonly tipoEquipo?: string;
  readonly estatusEquipo?: Status;
  readonly marca?: string;
  readonly fechaInstalacionDesde?: string;
  readonly fechaInstalacionHasta?: string;
  readonly estadoConexion?: 'Conectado' | 'Desconectado' | 'Error';
  readonly area?: string;
}

export interface FiltrosFallas {
  readonly estatus?: 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CERRADA' | '';
  readonly prioridad?: Priority | '';
  readonly tipo?: 'HARDWARE' | 'SOFTWARE' | 'CONECTIVIDAD' | 'SEGURIDAD' | '';
  readonly tecnico?: string;
  readonly fechaDesde?: string;
  readonly fechaHasta?: string;
  readonly sucursal?: string;
  readonly equipoTipo?: string;
}

export interface FiltrosMovimientos {
  readonly sucursalOrigen?: string;
  readonly sucursalDestino?: string;
  readonly tipoMovimiento?: 'TRASLADO' | 'INSTALACION' | 'RETIRO' | 'MANTENIMIENTO';
  readonly estatusMovimiento?: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  readonly fechaDesde?: string;
  readonly fechaHasta?: string;
  readonly urgencia?: Priority;
}

// ========================
// REQUESTS Y RESPONSES
// ========================

// Requests de creación/actualización
export interface EquipoCreateRequest {
  readonly no_serie: string;
  readonly nombreEquipo: string;
  readonly TipoEquipo: Equipo['TipoEquipo'];
  readonly marca: string;
  readonly modelo: string;
  readonly EstatusEquipo: Status;
  readonly SucursalActual: string;
  readonly fechaInstalacion: Timestamp;
  readonly observaciones?: string;
  readonly AreaActual?: string;
  readonly especificaciones?: Record<string, unknown>;
}

export interface FallaCreateRequest {
  readonly no_serie: string;
  readonly tipo_falla: Falla['tipo_falla'];
  readonly descripcion_problema: string;
  readonly sintomas?: string;
  readonly prioridad: Priority;
  readonly usuario_reporta: string;
  readonly tecnico_asignado?: string;
  readonly ubicacion_falla: string;
  readonly impacto: Falla['impacto'];
  readonly requiere_repuestos: boolean;
  readonly observaciones?: string;
}

export interface MovimientoCreateRequest {
  readonly no_serie: string;
  readonly tipoMovimiento: Movimiento['tipoMovimiento'];
  readonly sucursalDestino: string;
  readonly sucursalOrigen?: string;
  readonly posicionDestino?: string;
  readonly posicionOrigen?: string;
  readonly motivoMovimiento: string;
  readonly responsableMovimiento: string;
  readonly urgencia: Priority;
  readonly observaciones?: string;
  readonly fechaProgramada?: Timestamp;
}

// Response API genérica
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly message?: string;
  readonly code?: string;
  readonly timestamp?: Timestamp;
  readonly requestId?: string;
}

// Response de autenticación
export interface LoginResponse extends ApiResponse<{
  user: User;
  token: string;
  expiresAt: Timestamp;
}> {
  readonly user?: User;
  readonly token?: string;
  readonly expiresAt?: Timestamp;
}

// ========================
// ESTADÍSTICAS Y DASHBOARDS
// ========================
export interface DashboardStats {
  readonly resumen: {
    totalEquipos: number;
    equiposActivos: number;
    equiposInactivos: number;
    equiposMantenimiento: number;
    equiposConFalla: number;
    porcentajeOperativo: number;
  };
  readonly por_sucursal: Array<{
    sucursal: string;
    total: number;
    activos: number;
    inactivos: number;
    porcentaje: number;
  }>;
  readonly por_tipo: Array<{
    tipo: string;
    total: number;
    activos: number;
    inactivos: number;
  }>;
  readonly fallas: {
    total: number;
    abiertas: number;
    en_proceso: number;
    resueltas_hoy: number;
    criticas: number;
  };
  readonly movimientos: {
    pendientes: number;
    en_proceso: number;
    completados_hoy: number;
  };
  readonly alertas: Array<{
    id: string;
    tipo: 'warning' | 'error' | 'info';
    mensaje: string;
    timestamp: Timestamp;
  }>;
}

export interface EstadisticasFallas {
  readonly total_fallas: number;
  readonly abiertas: number;
  readonly en_proceso: number;
  readonly resueltas: number;
  readonly tiempo_promedio_resolucion: number;
  readonly por_prioridad: Array<{
    prioridad: Priority;
    cantidad: number;
    porcentaje: number;
  }>;
  readonly por_tipo: Array<{
    tipo: Falla['tipo_falla'];
    cantidad: number;
    porcentaje: number;
  }>;
  readonly por_tecnico: Array<{
    tecnico: string;
    asignadas: number;
    resueltas: number;
    en_proceso: number;
    promedio_horas: number;
    eficiencia: number; // porcentaje
  }>;
  readonly tendencias: {
    fallasUltimos30Dias: Array<{
      fecha: string;
      cantidad: number;
    }>;
    resolucionPromedio: Array<{
      semana: string;
      horas: number;
    }>;
  };
}

// ========================
// VISTAS COMPLEJAS (para compatibilidad)
// ========================
export interface VistaEquipoCompleto extends Equipo {
  readonly sucursalInfo?: Pick<Sucursal, 'nombre' | 'ciudad' | 'estado'>;
  readonly ultimaFalla?: Pick<Falla, 'id' | 'descripcion_problema' | 'fecha_reporte' | 'estatus'>;
  readonly historicoMovimientos?: number;
}

export interface VistaMovimientoDetallado extends Movimiento {
  readonly equipoCompleto?: VistaEquipoCompleto;
  readonly sucursalOrigenInfo?: Pick<Sucursal, 'nombre' | 'ciudad'>;
  readonly sucursalDestinoInfo?: Pick<Sucursal, 'nombre' | 'ciudad'>;
}

// ========================
// CATÁLOGOS Y CONFIGURACIÓN
// ========================
export interface CatalogosData {
  readonly sucursales: Array<Pick<Sucursal, 'id' | 'nombre' | 'ciudad' | 'estado'>>;
  readonly tiposEquipo: Array<{
    id: number;
    nombre: Equipo['TipoEquipo'];
    descripcion?: string;
  }>;
  readonly marcas: Array<{
    id: number;
    nombre: string;
    activa: boolean;
  }>;
  readonly usuarios: Array<Pick<User, 'idUsuarios' | 'NombreUsuario' | 'NivelUsuario'>>;
  readonly tecnicos: Array<{
    id: number;
    nombre: string;
    especialidad: string;
    activo: boolean;
  }>;
}

// ========================
// TIPOS DE ESTADO Y UI
// ========================
export interface LoadingState {
  readonly isLoading: boolean;
  readonly operation?: string;
  readonly progress?: number;
}

export interface ErrorState {
  readonly hasError: boolean;
  readonly message?: string;
  readonly code?: string;
  readonly details?: unknown;
  readonly timestamp?: Timestamp;
}

export interface PaginationState {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

export interface SortState {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}

// ========================
// TIPOS DE FORMULARIOS
// ========================
export interface FormState<T> {
  readonly data: T;
  readonly errors: Partial<Record<keyof T, string>>;
  readonly touched: Partial<Record<keyof T, boolean>>;
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
  readonly submitCount: number;
}

// ========================
// TIPOS DE CONFIGURACIÓN
// ========================
export interface AppConfig {
  readonly api: {
    mode: 'nextjs' | 'python' | 'hybrid';
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  readonly cache: {
    enabled: boolean;
    defaultTTL: number;
    maxSize: number;
  };
  readonly theme: {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
  };
  readonly features: {
    realTimeUpdates: boolean;
    offlineMode: boolean;
    analytics: boolean;
  };
}

// ========================
// UTILIDADES DE TIPOS
// ========================

// Hacer todos los campos opcionales excepto los especificados
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Hacer todos los campos requeridos excepto los especificados
export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

// Extraer tipos de arrays
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Tipos de eventos
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Tipos de estado de la aplicación
export interface AppState {
  readonly auth: {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    expiresAt: Timestamp | null;
  };
  readonly ui: {
    isLoading: boolean;
    error: string | null;
    currentSection: string;
    theme: 'light' | 'dark' | 'system';
  };
  readonly data: {
    dashboardStats: DashboardStats | null;
    equipos: VistaEquipoCompleto[];
    fallas: Falla[];
    movimientos: VistaMovimientoDetallado[];
    catalogos: CatalogosData | null;
  };
  readonly cache: {
    lastUpdate: Record<string, Timestamp>;
    invalidations: string[];
  };
}

// ========================
// TIPOS DE VALIDACIÓN
// ========================
export interface ValidationRule<T = any> {
  readonly test: (value: T) => boolean;
  readonly message: string;
}

export interface ValidationSchema<T> {
  readonly [K in keyof T]?: ValidationRule<T[K]>[];
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: Record<string, string>;
}

// ========================
// EXPORTACIONES CONSOLIDADAS
// ========================
export type {
  // Principales
  User,
  Equipo,
  Falla,
  Movimiento,
  Sucursal,
  
  // Vistas
  VistaEquipoCompleto,
  VistaMovimientoDetallado,
  
  // Requests
  EquipoCreateRequest,
  FallaCreateRequest,
  MovimientoCreateRequest,
  
  // Filtros
  FiltrosEquipos,
  FiltrosFallas,
  FiltrosMovimientos,
  
  // Responses
  ApiResponse,
  LoginResponse,
  
  // Estadísticas
  DashboardStats,
  EstadisticasFallas,
  
  // Estados
  AppState,
  LoadingState,
  ErrorState,
  FormState,
  
  // Configuración
  AppConfig,
  CatalogosData,
};

// ========================
// CONSTANTES ÚTILES
// ========================
export const EQUIPMENT_TYPES = [
  'Cámara',
  'Sensor', 
  'Router',
  'Switch',
  'DVR',
  'NVR'
] as const;

export const EQUIPMENT_STATUS = [
  'Activo',
  'Inactivo',
  'Mantenimiento',
  'Con Falla'
] as const;

export const PRIORITY_LEVELS = [
  'BAJA',
  'NORMAL', 
  'ALTA',
  'CRITICA'
] as const;

export const FAILURE_TYPES = [
  'HARDWARE',
  'SOFTWARE',
  'CONECTIVIDAD',
  'SEGURIDAD'
] as const;

export const MOVEMENT_TYPES = [
  'TRASLADO',
  'INSTALACION',
  'RETIRO',
  'MANTENIMIENTO'
] as const;

export const USER_ROLES = {
  1: 'Admin',
  2: 'Manager',
  3: 'Técnico',
  4: 'Usuario'
} as const;