// =============================================
// SERVICIO: UNIFIED API SERVICE OPTIMIZADO
// =============================================

import { pythonApiClient } from './pythonApiClient';
import { logger } from './logger';
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

export type ApiMode = 'nextjs' | 'python';

// Cache para mejorar performance
interface CacheEntry {
  data: unknown;
  timestamp: number;
  ttl: number;
}

class ApiService {
  private currentMode: ApiMode = 'nextjs';
  private token: string | null = null;
  private cache = new Map<string, CacheEntry>();
  private requestQueue = new Map<string, Promise<unknown>>();

  // Configurar modo de API
  setMode(mode: ApiMode): void {
    this.currentMode = mode;
    this.clearCache(); // Limpiar cache al cambiar modo
    logger.info(`API Service mode changed to: ${mode}`, { mode });
  }

  // Configurar token
  setToken(token: string | null): void {
    this.token = token;
    if (token && this.currentMode === 'python') {
      pythonApiClient.setToken(token);
    }
  }

  // Cache management
  private getCacheKey(url: string, params?: Record<string, unknown>): string {
    return `${url}_${JSON.stringify(params || {})}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl = 300000): void { // 5 min default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearCache(): void {
    this.cache.clear();
    logger.debug('API cache cleared');
  }

  // Request deduplication para evitar requests duplicados
  private async requestWithDeduplication<T>(
    key: string, 
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key) as Promise<ApiResponse<T>>;
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  // Retry logic para requests fallidos
  private async withRetry<T>(
    operation: () => Promise<ApiResponse<T>>,
    maxRetries = 3,
    delay = 1000
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Request failed (attempt ${attempt}/${maxRetries})`, lastError);
        
        if (attempt === maxRetries) break;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    logger.error('Request failed after all retries', lastError!);
    throw lastError;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // ========================
  // MÉTODOS GENÉRICOS OPTIMIZADOS
  // ========================
  async get<T>(
    url: string, 
    useCache = false, 
    cacheTtl = 300000
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url);
    
    // Verificar cache si está habilitado
    if (useCache) {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for ${url}`);
        return cached;
      }
    }

    return this.requestWithDeduplication(cacheKey, async () => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json() as ApiResponse<T>;
        
        // Cache si es exitoso
        if (useCache && result.success) {
          this.setCache(cacheKey, result, cacheTtl);
        }
        
        const duration = Date.now() - startTime;
        logger.apiRequest('GET', url, response.status);
        logger.performance(`GET ${url}`, duration);
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.apiError('GET', url, error as Error);
        logger.performance(`GET ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  // Los demás métodos se implementarán de forma similar...
  // [Continuaré en el siguiente archivo por limitaciones de espacio]

  getCurrentMode(): ApiMode {
    return this.currentMode;
  }

  isUsingNextjsApi(): boolean {
    return this.currentMode === 'nextjs';
  }
}

// Instancia singleton optimizada
export const apiService = new ApiService();
export default apiService;
    return `${url}_${JSON.stringify(params || {})}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl = 300000): void { // 5 min default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearCache(): void {
    this.cache.clear();
    logger.debug('API cache cleared');
  }

  // Request deduplication para evitar requests duplicados
  private async requestWithDeduplication<T>(
    key: string, 
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key) as Promise<ApiResponse<T>>;
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key);
    });

    this.requestQueue.set(key, promise);
    return promise;
  }

  // Retry logic para requests fallidos
  private async withRetry<T>(
    operation: () => Promise<ApiResponse<T>>,
    maxRetries = 3,
    delay = 1000
  ): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Request failed (attempt ${attempt}/${maxRetries})`, lastError);
        
        if (attempt === maxRetries) break;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    logger.error('Request failed after all retries', lastError!);
    throw lastError;
  }

  // ========================
  // MÉTODOS GENÉRICOS OPTIMIZADOS
  // ========================
  async get<T>(
    url: string, 
    useCache = false, 
    cacheTtl = 300000
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url);
    
    // Verificar cache si está habilitado
    if (useCache) {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for ${url}`);
        return cached;
      }
    }

    return this.requestWithDeduplication(cacheKey, async () => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json() as ApiResponse<T>;
        
        // Cache si es exitoso
        if (useCache && result.success) {
          this.setCache(cacheKey, result, cacheTtl);
        }
        
        const duration = Date.now() - startTime;
        logger.apiRequest('GET', url, response.status);
        logger.performance(`GET ${url}`, duration);
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.apiError('GET', url, error as Error);
        logger.performance(`GET ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  async post<T>(
    url: string, 
    data: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json() as ApiResponse<T>;
        
        const duration = Date.now() - startTime;
        logger.apiRequest('POST', url, response.status);
        logger.performance(`POST ${url}`, duration);
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.apiError('POST', url, error as Error);
        logger.performance(`POST ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  async put<T>(
    url: string, 
    data: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json() as ApiResponse<T>;
        
        const duration = Date.now() - startTime;
        logger.apiRequest('PUT', url, response.status);
        logger.performance(`PUT ${url}`, duration);
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.apiError('PUT', url, error as Error);
        logger.performance(`PUT ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json() as ApiResponse<T>;
        
        const duration = Date.now() - startTime;
        logger.apiRequest('DELETE', url, response.status);
        logger.performance(`DELETE ${url}`, duration);
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.apiError('DELETE', url, error as Error);
        logger.performance(`DELETE ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // ========================
  // AUTENTICACIÓN
  // ========================
  async login(correo: string, contraseña: string): Promise<LoginResponse> {
    try {
      if (this.currentMode === 'python') {
        const response = await pythonApiClient.login(correo, contraseña);
        return response as LoginResponse;
      } else {
        // Next.js API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, contraseña }),
        });
        
        return await response.json() as LoginResponse;
      }
    } catch (error) {
      console.error(`Login error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // DASHBOARD
  // ========================
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getDashboardStats() as ApiResponse<DashboardStats>;
      } else {
        // Next.js API
        const response = await fetch('/api/dashboard', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        
        return await response.json() as ApiResponse<DashboardStats>;
      }
    } catch (error) {
      console.error(`Dashboard stats error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // EQUIPOS
  // ========================
  async getEquipos(filters?: FiltrosEquipos): Promise<ApiResponse<VistaEquipoCompleto[]>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getEquipos(filters) as ApiResponse<VistaEquipoCompleto[]>;
      } else {
        // Next.js API
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.keys(filters).forEach(key => {
            const value = filters[key as keyof FiltrosEquipos];
            if (value) {
              queryParams.append(key, value);
            }
          });
        }

        const response = await fetch(`/api/equipos?${queryParams.toString()}`, {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });

        return await response.json() as ApiResponse<VistaEquipoCompleto[]>;
      }
    } catch (error) {
      console.error(`Equipos error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async createEquipo(equipoData: EquipoCreateRequest): Promise<ApiResponse<VistaEquipoCompleto>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.createEquipo(equipoData) as ApiResponse<VistaEquipoCompleto>;
      } else {
        // Next.js API
        const response = await fetch('/api/equipos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(equipoData),
        });

        return await response.json() as ApiResponse<VistaEquipoCompleto>;
      }
    } catch (error) {
      console.error(`Create equipo error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async updateEquipo(noSerie: string, equipoData: Partial<EquipoCreateRequest>): Promise<ApiResponse<VistaEquipoCompleto>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.updateEquipo(noSerie, equipoData) as ApiResponse<VistaEquipoCompleto>;
      } else {
        // Next.js API
        const response = await fetch(`/api/equipos/${noSerie}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(equipoData),
        });
        
        return await response.json() as ApiResponse<VistaEquipoCompleto>;
      }
    } catch (error) {
      console.error(`Update equipo error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async deleteEquipo(noSerie: string): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.deleteEquipo(noSerie) as ApiResponse<{ deleted: boolean }>;
      } else {
        // Next.js API
        const response = await fetch(`/api/equipos/${noSerie}`, {
          method: 'DELETE',
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        
        return await response.json() as ApiResponse<{ deleted: boolean }>;
      }
    } catch (error) {
      console.error(`Delete equipo error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // MOVIMIENTOS
  // ========================
  async getMovimientos(filters?: FiltrosMovimientos): Promise<ApiResponse<VistaMovimientoDetallado[]>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getMovimientos(filters) as ApiResponse<VistaMovimientoDetallado[]>;
      } else {
        // Next.js API
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.keys(filters).forEach(key => {
            const value = filters[key as keyof FiltrosMovimientos];
            if (value) {
              queryParams.append(key, value);
            }
          });
        }

        const response = await fetch(`/api/movimientos?${queryParams.toString()}`, {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });

        return await response.json() as ApiResponse<VistaMovimientoDetallado[]>;
      }
    } catch (error) {
      console.error(`Movimientos error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async createMovimiento(movimientoData: MovimientoCreateRequest): Promise<ApiResponse<VistaMovimientoDetallado>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.createMovimiento(movimientoData) as ApiResponse<VistaMovimientoDetallado>;
      } else {
        // Next.js API
        const response = await fetch('/api/movimientos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(movimientoData),
        });
        
        return await response.json() as ApiResponse<VistaMovimientoDetallado>;
      }
    } catch (error) {
      console.error(`Create movimiento error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // CATÁLOGOS
  // ========================
  async getCatalogos(): Promise<ApiResponse<Record<string, unknown[]>>> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getCatalogos() as ApiResponse<Record<string, unknown[]>>;
      } else {
        // Next.js API
        const response = await fetch('/api/catalogos', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });

        return await response.json() as ApiResponse<Record<string, unknown[]>>;
      }
    } catch (error) {
      console.error(`Catalogos error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // UTILIDADES
  // ========================
  getCurrentMode(): ApiMode {
    return this.currentMode;
  }

  isUsingPythonApi(): boolean {
    return this.currentMode === 'python';
  }

  isUsingNextjsApi(): boolean {
    return this.currentMode === 'nextjs';
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();
export default apiService;