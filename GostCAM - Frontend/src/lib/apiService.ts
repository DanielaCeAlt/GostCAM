// apiService.ts - Servicio API unificado para manejar requests al backend
import { pythonApiClient } from './pythonApiClient';
import { logger } from './logger';

// Tipos principales
export type ApiMode = 'python' | 'nextjs';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Interfaces de datos (importadas desde types/)
interface Equipo {
  id?: number;
  tipo_equipo?: string;
  nombre_equipo?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  ubicacion_id?: number;
  estado?: string;
  fecha_adquisicion?: string;
  garantia_hasta?: string;
  imagen_url?: string;
}

interface Falla {
  id?: number;
  equipo_id?: number;
  tipo_falla?: string;
  descripcion?: string;
  estado?: string;
  fecha_reporte?: string;
  fecha_resolucion?: string;
  tecnico_id?: number;
}

interface Movimiento {
  id?: number;
  equipo_id?: number;
  ubicacion_origen_id?: number;
  ubicacion_destino_id?: number;
  fecha_movimiento?: string;
  responsable?: string;
  motivo?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ApiService {
  private currentMode: ApiMode = 'python';
  private token: string | null = null;
  private cache = new Map<string, CacheEntry<unknown>>();
  private requestQueue = new Map<string, Promise<ApiResponse<unknown>>>();

  constructor() {
    // Configuración inicial
    this.currentMode = this.detectApiMode();
  }

  private detectApiMode(): ApiMode {
    // En desarrollo, usar Python API por defecto
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'python';
      }
    }
    return 'nextjs';
  }

  // ========================
  // CONFIGURACIÓN
  // ========================
  setApiMode(mode: ApiMode): void {
    this.currentMode = mode;
    logger.info(`API mode changed to: ${mode}`);
  }

  // Alias para compatibilidad
  setMode(mode: ApiMode): void {
    this.setApiMode(mode);
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  // ========================
  // CACHE UTILITIES
  // ========================
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

  // ========================
  // REQUEST UTILITIES
  // ========================
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
        logger.warn(`Request failed (attempt ${attempt}/${maxRetries}): ${lastError?.message}`);
        
        if (attempt === maxRetries) break;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    logger.error(`Request failed after all retries: ${lastError?.message}`);
    throw lastError;
  }

  // ========================
  // GENERIC METHODS
  // ========================
  async get<T>(url: string, useCache = false, cacheTtl = 300000): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url);
    
    if (useCache) {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for ${url}`);
        return cached;
      }
    }

    return this.requestWithDeduplication(cacheKey, async () => {
      const start = performance.now();
      
      try {
        const result = await this.withRetry(async () => {
          // Para Python API, solo usar métodos específicos
          if (this.currentMode === 'python') {
            throw new Error(`Generic GET not supported for Python API. Use specific methods instead.`);
          } else {
            const response = await fetch(`/api${url}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
              },
            });
            return await response.json() as ApiResponse<T>;
          }
        });

        if (useCache && result.success) {
          this.setCache(cacheKey, result, cacheTtl);
        }

        const duration = performance.now() - start;
        logger.performance(`GET ${url}`, duration);
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.performance(`GET ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  async post<T>(url: string, data: unknown, useCache = false, cacheTtl = 300000): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url, data as Record<string, unknown>);
    
    if (useCache) {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for POST ${url}`);
        return cached;
      }
    }

    return this.requestWithDeduplication(cacheKey, async () => {
      const start = performance.now();
      
      try {
        const result = await this.withRetry(async () => {
          if (this.currentMode === 'python') {
            const response = await fetch(`http://localhost:8000${url}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
              },
              body: JSON.stringify(data),
            });
            return await response.json() as ApiResponse<T>;
          } else {
            const response = await fetch(`/api${url}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
              },
              body: JSON.stringify(data),
            });
            return await response.json() as ApiResponse<T>;
          }
        });

        if (useCache && result.success) {
          this.setCache(cacheKey, result, cacheTtl);
        }

        const duration = performance.now() - start;
        logger.performance(`POST ${url}`, duration);
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.performance(`POST ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url, data as Record<string, unknown>);
    
    return this.requestWithDeduplication(cacheKey, async () => {
      const start = performance.now();
      
      try {
        const result = await this.withRetry(async () => {
          if (this.currentMode === 'python') {
            const response = await fetch(`http://localhost:8000${url}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
              },
              body: JSON.stringify(data),
            });
            return await response.json() as ApiResponse<T>;
          } else {
            const response = await fetch(`/api${url}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
              },
              body: JSON.stringify(data),
            });
            return await response.json() as ApiResponse<T>;
          }
        });

        const duration = performance.now() - start;
        logger.performance(`PUT ${url}`, duration);
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.performance(`PUT ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(url);
    
    return this.requestWithDeduplication(cacheKey, async () => {
      const start = performance.now();
      
      try {
        const result = await this.withRetry(async () => {
          if (this.currentMode === 'python') {
            const response = await fetch(`http://localhost:8000${url}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
              },
            });
            return await response.json() as ApiResponse<T>;
          } else {
            const response = await fetch(`/api${url}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
              },
            });
            return await response.json() as ApiResponse<T>;
          }
        });

        const duration = performance.now() - start;
        logger.performance(`DELETE ${url}`, duration);
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        logger.performance(`DELETE ${url} (failed)`, duration);
        throw error;
      }
    });
  }

  // ========================
  // AUTHENTICATION
  // ========================
  async login(correo: string, contraseña: string): Promise<ApiResponse<any>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, contraseña }),
        });
        return await response.json() as ApiResponse<any>;
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, contraseña }),
        });
        return await response.json() as ApiResponse<any>;
      }
    } catch (error) {
      console.error(`Login error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<ApiResponse<any>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/dashboard/stats', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        return await response.json() as ApiResponse<any>;
      } else {
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        return await response.json() as ApiResponse<any>;
      }
    } catch (error) {
      console.error(`Dashboard stats error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // EQUIPOS
  // ========================
  async getEquipos(filters?: any): Promise<ApiResponse<any[]>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/equipos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(filters || {}),
        });
        return await response.json() as ApiResponse<any[]>;
      } else {
        let url = '/api/equipos';
        if (filters) {
          const queryParams = new URLSearchParams();
          Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
              queryParams.append(key, filters[key]);
            }
          });
          if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
          }
        }
        
        const response = await fetch(url, {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        return await response.json() as ApiResponse<any[]>;
      }
    } catch (error) {
      console.error(`Equipos error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async createEquipo(equipo: Partial<Equipo>): Promise<ApiResponse<Equipo>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/equipos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(equipo),
        });
        return await response.json() as ApiResponse<Equipo>;
      } else {
        const response = await fetch('/api/equipos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(equipo),
        });
        return await response.json() as ApiResponse<Equipo>;
      }
    } catch (error) {
      console.error(`Create equipo error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // MOVIMIENTOS
  // ========================
  async getMovimientos(filters?: any): Promise<ApiResponse<any[]>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/movimientos/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(filters || {}),
        });
        return await response.json() as ApiResponse<any[]>;
      } else {
        let url = '/api/movimientos';
        if (filters) {
          const queryParams = new URLSearchParams();
          Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
              queryParams.append(key, filters[key]);
            }
          });
          if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
          }
        }
        
        const response = await fetch(url, {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        return await response.json() as ApiResponse<any[]>;
      }
    } catch (error) {
      console.error(`Movimientos error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async createMovimiento(movimiento: Partial<Movimiento>): Promise<ApiResponse<Movimiento>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/movimientos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(movimiento),
        });
        return await response.json() as ApiResponse<Movimiento>;
      } else {
        const response = await fetch('/api/movimientos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
          body: JSON.stringify(movimiento),
        });
        return await response.json() as ApiResponse<Movimiento>;
      }
    } catch (error) {
      console.error(`Create movimiento error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // FALLAS
  // ========================
  async getFallas(): Promise<ApiResponse<Falla[]>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/fallas', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        return await response.json() as ApiResponse<Falla[]>;
      } else {
        const response = await fetch('/api/fallas', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        return await response.json() as ApiResponse<Falla[]>;
      }
    } catch (error) {
      console.error(`Fallas error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // CATÁLOGOS
  // ========================
  async getCatalogos(): Promise<ApiResponse<Record<string, unknown[]>>> {
    try {
      if (this.currentMode === 'python') {
        const response = await fetch('http://localhost:8000/catalogos', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        return await response.json() as ApiResponse<Record<string, unknown[]>>;
      } else {
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
  // UTILITIES
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

// Singleton instance
export const apiService = new ApiService();
export default apiService;