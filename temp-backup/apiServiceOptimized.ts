// =============================================
// SERVICIO API OPTIMIZADO: Unified API Service
// =============================================

import { 
  DashboardStats, 
  VistaEquipoCompleto, 
  VistaMovimientoDetallado,
  ApiResponse,
  LoginResponse,
  EquipoCreateRequest,
  MovimientoCreateRequest,
  FiltrosEquipos,
  FiltrosMovimientos
} from '@/types/database';

export type ApiMode = 'nextjs' | 'python' | 'hybrid';

// ========================
// CONFIGURACIÓN Y TIPOS
// ========================
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface RequestConfig {
  retries?: number;
  timeout?: number;
  cache?: boolean;
  cacheTTL?: number;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// ========================
// CACHE MANAGER OPTIMIZADO
// ========================
class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_CACHE_SIZE = 100;

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + (ttl || this.DEFAULT_TTL)
    };

    // Limpiar cache si está lleno
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup();
    }

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const expired: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        expired.push(key);
      }
    }

    expired.forEach(key => this.cache.delete(key));

    // Si aún está lleno, eliminar los más antiguos
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, Math.ceil(this.MAX_CACHE_SIZE * 0.2));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      entries: Array.from(this.cache.keys())
    };
  }
}

// ========================
// RETRY MANAGER
// ========================
class RetryManager {
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError!;
  }
}

// ========================
// SERVICIO API OPTIMIZADO
// ========================
class OptimizedApiService {
  private currentMode: ApiMode = 'nextjs';
  private token: string | null = null;
  private cache = new CacheManager();
  private baseUrl: string;
  
  // Configuración por defecto
  private defaultConfig: RequestConfig = {
    retries: 3,
    timeout: 30000, // 30 segundos
    cache: true,
    cacheTTL: 5 * 60 * 1000 // 5 minutos
  };

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  // ========================
  // CONFIGURACIÓN
  // ========================
  setMode(mode: ApiMode): void {
    this.currentMode = mode;
    console.log(`🔄 API mode set to: ${mode}`);
    
    // Limpiar cache al cambiar modo
    this.cache.clear();
  }

  setToken(token: string | null): void {
    this.token = token;
    
    // Limpiar cache de datos autenticados
    this.cache.invalidatePattern('auth|dashboard|equipos|movimientos');
  }

  getCurrentMode(): ApiMode {
    return this.currentMode;
  }

  // ========================
  // MÉTODOS HTTP OPTIMIZADOS
  // ========================
  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const cacheKey = this.generateCacheKey(url, options);

    // Verificar cache
    if (finalConfig.cache && options.method === 'GET') {
      const cached = this.cache.get<ApiResponse<T>>(cacheKey);
      if (cached) {
        console.log(`📦 Cache hit: ${url}`);
        return cached;
      }
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      signal: AbortSignal.timeout(finalConfig.timeout!),
    };

    try {
      const result = await RetryManager.withRetry(async () => {
        console.log(`🌐 ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new ApiError({
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status
          });
        }
        
        return response.json() as Promise<ApiResponse<T>>;
      }, finalConfig.retries);

      // Cachear respuesta exitosa para GET requests
      if (finalConfig.cache && (!options.method || options.method === 'GET')) {
        this.cache.set(cacheKey, result, finalConfig.cacheTTL);
      }

      return result;

    } catch (error) {
      console.error(`❌ Request failed: ${url}`, error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError({
        message: 'Network error or timeout',
        details: error
      });
    }
  }

  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  // ========================
  // MÉTODOS HTTP PÚBLICOS
  // ========================
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.makeRequest<T>(url, { method: 'GET' }, config);
  }

  async post<T>(endpoint: string, data: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }, { ...config, cache: false }); // No cachear POST
  }

  async put<T>(endpoint: string, data: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, { ...config, cache: false });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.makeRequest<T>(url, { method: 'DELETE' }, { ...config, cache: false });
  }

  private buildUrl(endpoint: string): string {
    if (this.currentMode === 'python') {
      const pythonBase = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
      return `${pythonBase}${endpoint}`;
    }
    
    return `/api${endpoint}`;
  }

  // ========================
  // API METHODS OPTIMIZADAS
  // ========================
  
  // Autenticación
  async login(correo: string, contraseña: string): Promise<LoginResponse> {
    try {
      console.log(`🔐 Login attempt: ${correo} (${this.currentMode} mode)`);
      
      const endpoint = this.currentMode === 'python' 
        ? '/autenticacion/iniciar-sesion'
        : '/auth/login';

      const result = await this.post<LoginResponse>(endpoint, { correo, contraseña }, {
        retries: 1, // Solo 1 retry para login
        cache: false
      });

      if (result.success && result.token) {
        this.setToken(result.token);
        console.log('✅ Login successful');
      }

      return result as LoginResponse;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  // Dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>('/dashboard', {
      cacheTTL: 2 * 60 * 1000 // Cache por 2 minutos
    });
  }

  // Equipos
  async getEquipos(filters?: FiltrosEquipos): Promise<ApiResponse<VistaEquipoCompleto[]>> {
    const endpoint = filters 
      ? `/equipos?${new URLSearchParams(filters as any).toString()}`
      : '/equipos';
    
    return this.get<VistaEquipoCompleto[]>(endpoint, {
      cacheTTL: 1 * 60 * 1000 // Cache por 1 minuto
    });
  }

  async createEquipo(equipoData: EquipoCreateRequest): Promise<ApiResponse<VistaEquipoCompleto>> {
    const result = await this.post<VistaEquipoCompleto>('/equipos', equipoData);
    
    // Invalidar cache de equipos
    this.cache.invalidatePattern('equipos');
    this.cache.invalidatePattern('dashboard');
    
    return result;
  }

  async updateEquipo(noSerie: string, equipoData: Partial<EquipoCreateRequest>): Promise<ApiResponse<VistaEquipoCompleto>> {
    const result = await this.put<VistaEquipoCompleto>(`/equipos/${noSerie}`, equipoData);
    
    // Invalidar cache
    this.cache.invalidatePattern('equipos');
    this.cache.invalidatePattern('dashboard');
    
    return result;
  }

  async deleteEquipo(noSerie: string): Promise<ApiResponse<void>> {
    const result = await this.delete<void>(`/equipos/${noSerie}`);
    
    // Invalidar cache
    this.cache.invalidatePattern('equipos');
    this.cache.invalidatePattern('dashboard');
    
    return result;
  }

  // Movimientos
  async getMovimientos(filters?: FiltrosMovimientos): Promise<ApiResponse<VistaMovimientoDetallado[]>> {
    const endpoint = filters 
      ? `/movimientos?${new URLSearchParams(filters as any).toString()}`
      : '/movimientos';
    
    return this.get<VistaMovimientoDetallado[]>(endpoint, {
      cacheTTL: 30 * 1000 // Cache por 30 segundos (datos más dinámicos)
    });
  }

  async createMovimiento(movimientoData: MovimientoCreateRequest): Promise<ApiResponse<VistaMovimientoDetallado>> {
    const result = await this.post<VistaMovimientoDetallado>('/movimientos', movimientoData);
    
    // Invalidar cache
    this.cache.invalidatePattern('movimientos');
    this.cache.invalidatePattern('equipos');
    this.cache.invalidatePattern('dashboard');
    
    return result;
  }

  // Catálogos (datos estáticos, cache largo)
  async getCatalogos(): Promise<ApiResponse<Record<string, unknown[]>>> {
    return this.get<Record<string, unknown[]>>('/catalogos', {
      cacheTTL: 30 * 60 * 1000 // Cache por 30 minutos
    });
  }

  // ========================
  // UTILIDADES PARA TESTING
  // ========================
  async testConnection(): Promise<{ success: boolean; mode: string; latency?: number }> {
    const startTime = Date.now();
    
    try {
      const endpoint = this.currentMode === 'python' ? '/health' : '/test-conexion';
      
      await this.get(endpoint, { 
        cache: false, 
        timeout: 5000,
        retries: 1
      });
      
      const latency = Date.now() - startTime;
      
      return {
        success: true,
        mode: this.currentMode,
        latency
      };
    } catch (error) {
      return {
        success: false,
        mode: this.currentMode
      };
    }
  }

  async testAltaEquipo(): Promise<boolean> {
    try {
      const testData: EquipoCreateRequest = {
        no_serie: `TEST-${Date.now()}`,
        nombreEquipo: 'Test Equipment',
        TipoEquipo: 'Cámara',
        marca: 'Test',
        modelo: 'Test-1',
        EstatusEquipo: 'Activo',
        SucursalActual: 'Centro Principal',
        fechaInstalacion: new Date().toISOString(),
        observaciones: 'Equipo de prueba'
      };

      const result = await this.createEquipo(testData);
      
      // Si se creó exitosamente, eliminarlo
      if (result.success && result.data) {
        await this.deleteEquipo(testData.no_serie);
      }
      
      return result.success;
    } catch (error) {
      console.error('Test alta equipo failed:', error);
      return false;
    }
  }

  // ========================
  // DIAGNÓSTICOS Y MONITORING
  // ========================
  getStats() {
    return {
      mode: this.currentMode,
      hasToken: !!this.token,
      cache: this.cache.getStats()
    };
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache cleared');
  }

  // ========================
  // HEALTH CHECK
  // ========================
  async healthCheck(): Promise<{
    api: boolean;
    database?: boolean;
    cache: boolean;
    mode: string;
  }> {
    try {
      const connection = await this.testConnection();
      
      return {
        api: connection.success,
        cache: true,
        mode: this.currentMode
      };
    } catch (error) {
      return {
        api: false,
        cache: true,
        mode: this.currentMode
      };
    }
  }
}

// ========================
// ERROR CLASS OPTIMIZADA
// ========================
class ApiError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(options: { message: string; status?: number; code?: string; details?: any }) {
    super(options.message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details
    };
  }
}

// ========================
// INSTANCIA SINGLETON
// ========================
const optimizedApiService = new OptimizedApiService();

export { optimizedApiService, OptimizedApiService, ApiError, CacheManager };
export default optimizedApiService;