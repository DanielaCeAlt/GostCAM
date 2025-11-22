// =============================================
// API SERVICE UNIFICADO - GOSTCAM
// Frontend Next.js + Backend FastAPI
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

export type ApiMode = 'nextjs' | 'fastapi' | 'hybrid';

interface RequestOptions {
  timeout?: number;
  cache?: boolean;
  skipCache?: boolean;
  retry?: boolean;
  retries?: number;
}

class UnifiedApiService {
  private readonly NEXTJS_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  private readonly FASTAPI_BASE = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
  private readonly API_MODE = (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || 'hybrid';
  
  private token: string | null = null;
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor() {
    console.log(`🚀 UnifiedApiService iniciado en modo: ${this.API_MODE}`);
    console.log(`📡 Next.js API: ${this.NEXTJS_BASE}`);
    console.log(`🐍 FastAPI: ${this.FASTAPI_BASE}`);
  }

  // ========================
  // CONFIGURACIÓN
  // ========================
  setToken(token: string | null) {
    this.token = token;
    console.log('🔐 Token configurado para autenticación');
  }

  // ========================
  // MÉTODOS INTERNOS
  // ========================
  private getCacheKey(method: string, url: string, params?: any): string {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.DEFAULT_CACHE_TTL) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  private async makeRequest<T>(
    url: string, 
    options: RequestInit & RequestOptions = {}
  ): Promise<T> {
    const { timeout = 10000, cache = true, skipCache = false, retry = true, retries = 3, ...fetchOptions } = options;

    // Verificar cache
    if (!skipCache && cache && fetchOptions.method !== 'POST') {
      const cacheKey = this.getCacheKey(fetchOptions.method || 'GET', url, fetchOptions.body);
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        console.log(`📦 Cache hit: ${url}`);
        return cached;
      }
    }

    // Headers por defecto
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };

    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...defaultHeaders,
        ...fetchOptions.headers,
      },
      signal: AbortSignal.timeout(timeout),
    };

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < (retry ? retries : 1)) {
      try {
        console.log(`🌐 ${fetchOptions.method || 'GET'} ${url} (intento ${attempt + 1})`);
        
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Guardar en cache si es exitoso
        if (cache && (fetchOptions.method || 'GET') === 'GET') {
          const cacheKey = this.getCacheKey('GET', url);
          this.setCache(cacheKey, data);
        }

        return data;

      } catch (error) {
        lastError = error as Error;
        attempt++;
        
        if (attempt < retries && retry) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff
          console.log(`⚠️ Error en intento ${attempt}, reintentando en ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`❌ Request falló después de ${attempt} intentos:`, lastError);
    throw lastError;
  }

  // ========================
  // MÉTODOS DE API - ROUTING INTELIGENTE
  // ========================

  private getApiUrl(endpoint: string, forceMode?: ApiMode): string {
    const mode = forceMode || this.API_MODE;
    
    switch (mode) {
      case 'fastapi':
        return `${this.FASTAPI_BASE}${endpoint}`;
      case 'nextjs':
        return `${this.NEXTJS_BASE}${endpoint}`;
      case 'hybrid':
        // Lógica híbrida: operaciones pesadas a FastAPI, ligeras a Next.js
        const heavyOperations = ['/equipos', '/movimientos', '/fallas', '/dashboard'];
        const isHeavy = heavyOperations.some(op => endpoint.startsWith(op));
        return isHeavy 
          ? `${this.FASTAPI_BASE}${endpoint}`
          : `${this.NEXTJS_BASE}${endpoint}`;
      default:
        return `${this.NEXTJS_BASE}${endpoint}`;
    }
  }

  // ========================
  // AUTENTICACIÓN
  // ========================
  async login(credentials: { usuario: string; password: string }): Promise<LoginResponse> {
    try {
      // Intentar primero con FastAPI
      const url = this.getApiUrl('/auth/login', 'fastapi');
      const response = await this.makeRequest<LoginResponse>(url, {
        method: 'POST',
        body: JSON.stringify(credentials),
        cache: false,
        retry: false
      });

      if (response.success && response.token) {
        this.setToken(response.token);
      }

      return response;
    } catch (error) {
      console.warn('⚠️ FastAPI login falló, intentando con Next.js...');
      
      // Fallback a Next.js
      const url = this.getApiUrl('/auth/login', 'nextjs');
      const response = await this.makeRequest<LoginResponse>(url, {
        method: 'POST',
        body: JSON.stringify(credentials),
        cache: false
      });

      if (response.success && response.token) {
        this.setToken(response.token);
      }

      return response;
    }
  }

  async logout(): Promise<void> {
    this.setToken(null);
    this.cache.clear();
    console.log('🚪 Sesión cerrada y cache limpiado');
  }

  // ========================
  // DASHBOARD
  // ========================
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const url = this.getApiUrl('/dashboard');
    return this.makeRequest<ApiResponse<DashboardStats>>(url, { 
      method: 'GET',
      cache: true 
    });
  }

  // ========================
  // EQUIPOS
  // ========================
  async getEquipos(filtros?: FiltrosEquipos): Promise<ApiResponse<VistaEquipoCompleto[]>> {
    let url = this.getApiUrl('/equipos');
    
    if (filtros) {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      url += `?${params.toString()}`;
    }

    return this.makeRequest<ApiResponse<VistaEquipoCompleto[]>>(url);
  }

  async getEquipo(noSerie: string): Promise<ApiResponse<VistaEquipoCompleto>> {
    const url = this.getApiUrl(`/equipos/${encodeURIComponent(noSerie)}`);
    return this.makeRequest<ApiResponse<VistaEquipoCompleto>>(url);
  }

  async createEquipo(equipo: EquipoCreateRequest): Promise<ApiResponse<any>> {
    const url = this.getApiUrl('/equipos');
    return this.makeRequest<ApiResponse<any>>(url, {
      method: 'POST',
      body: JSON.stringify(equipo),
      cache: false
    });
  }

  async updateEquipo(noSerie: string, equipo: Partial<EquipoCreateRequest>): Promise<ApiResponse<any>> {
    const url = this.getApiUrl(`/equipos/${encodeURIComponent(noSerie)}`);
    return this.makeRequest<ApiResponse<any>>(url, {
      method: 'PUT',
      body: JSON.stringify(equipo),
      cache: false
    });
  }

  async deleteEquipo(noSerie: string): Promise<ApiResponse<any>> {
    const url = this.getApiUrl(`/equipos/${encodeURIComponent(noSerie)}`);
    return this.makeRequest<ApiResponse<any>>(url, {
      method: 'DELETE',
      cache: false
    });
  }

  // ========================
  // MOVIMIENTOS
  // ========================
  async getMovimientos(filtros?: FiltrosMovimientos): Promise<ApiResponse<VistaMovimientoDetallado[]>> {
    let url = this.getApiUrl('/movimientos');
    
    if (filtros) {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      url += `?${params.toString()}`;
    }

    return this.makeRequest<ApiResponse<VistaMovimientoDetallado[]>>(url);
  }

  async createMovimiento(movimiento: MovimientoCreateRequest): Promise<ApiResponse<any>> {
    const url = this.getApiUrl('/movimientos');
    return this.makeRequest<ApiResponse<any>>(url, {
      method: 'POST',
      body: JSON.stringify(movimiento),
      cache: false
    });
  }

  // ========================
  // CATÁLOGOS
  // ========================
  async getCatalogos(): Promise<ApiResponse<any>> {
    const url = this.getApiUrl('/catalogos');
    return this.makeRequest<ApiResponse<any>>(url, { 
      cache: true 
    });
  }

  // ========================
  // UTILIDADES
  // ========================
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache limpiado manualmente');
  }

  getStatus(): { 
    mode: ApiMode; 
    authenticated: boolean; 
    cacheSize: number;
    endpoints: { nextjs: string; fastapi: string };
  } {
    return {
      mode: this.API_MODE,
      authenticated: !!this.token,
      cacheSize: this.cache.size,
      endpoints: {
        nextjs: this.NEXTJS_BASE,
        fastapi: this.FASTAPI_BASE
      }
    };
  }

  // ========================
  // TEST DE CONECTIVIDAD
  // ========================
  async testConnectivity(): Promise<{
    nextjs: boolean;
    fastapi: boolean;
    details: { nextjs: string; fastapi: string };
  }> {
    const results = {
      nextjs: false,
      fastapi: false,
      details: { nextjs: '', fastapi: '' }
    };

    // Test Next.js
    try {
      await fetch(`${this.NEXTJS_BASE}/health`, { 
        method: 'GET', 
        signal: AbortSignal.timeout(3000) 
      });
      results.nextjs = true;
      results.details.nextjs = '✅ Conectado';
    } catch (error) {
      results.details.nextjs = `❌ Error: ${(error as Error).message}`;
    }

    // Test FastAPI
    try {
      const response = await fetch(`${this.FASTAPI_BASE}/docs`, { 
        method: 'GET', 
        signal: AbortSignal.timeout(3000) 
      });
      results.fastapi = response.ok;
      results.details.fastapi = response.ok ? '✅ Conectado' : `❌ HTTP ${response.status}`;
    } catch (error) {
      results.details.fastapi = `❌ Error: ${(error as Error).message}`;
    }

    return results;
  }
}

// ========================
// EXPORTACIÓN SINGLETON
// ========================
export const unifiedApiService = new UnifiedApiService();
export default unifiedApiService;

// Compatibilidad con código existente
export { unifiedApiService as apiService };

// ========================
// FUNCIONES AUXILIARES
// ========================
export const setApiMode = (mode: ApiMode) => {
  unifiedApiService.setToken(null); // Reset token when changing mode
  console.log(`🔄 Cambiando modo de API a: ${mode}`);
};

export const testApiConnectivity = () => unifiedApiService.testConnectivity();

export const getApiStatus = () => unifiedApiService.getStatus();