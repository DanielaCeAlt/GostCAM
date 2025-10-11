// =============================================
// SERVICIO: UNIFIED API SERVICE
// =============================================

import { pythonApiClient } from './pythonApiClient';
import { DashboardStats, VistaEquipoCompleto, VistaMovimientoDetallado } from '@/types/database';

export type ApiMode = 'nextjs' | 'python';

class ApiService {
  private currentMode: ApiMode = 'nextjs';
  private token: string | null = null;

  // Configurar modo de API
  setMode(mode: ApiMode) {
    this.currentMode = mode;
    console.log(`API Service mode set to: ${mode}`);
  }

  // Configurar token
  setToken(token: string | null) {
    this.token = token;
    if (token && this.currentMode === 'python') {
      pythonApiClient.setToken(token);
    }
  }

  // ========================
  // MÉTODOS GENÉRICOS
  // ========================
  async get(url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error(`GET error (${url}):`, error);
      throw error;
    }
  }

  async post(url: string, data: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error(`POST error (${url}):`, error);
      throw error;
    }
  }

  async put(url: string, data: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error(`PUT error (${url}):`, error);
      throw error;
    }
  }

  async delete(url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      });
      
      return await response.json();
    } catch (error) {
      console.error(`DELETE error (${url}):`, error);
      throw error;
    }
  }

  // ========================
  // AUTENTICACIÓN
  // ========================
  async login(correo: string, contraseña: string) {
    try {
      if (this.currentMode === 'python') {
        const response = await pythonApiClient.login(correo, contraseña);
        return response;
      } else {
        // Next.js API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, contraseña }),
        });
        
        return await response.json();
      }
    } catch (error) {
      console.error(`Login error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // DASHBOARD
  // ========================
  async getDashboardStats(): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getDashboardStats();
      } else {
        // Next.js API
        const response = await fetch('/api/dashboard', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        
        return await response.json();
      }
    } catch (error) {
      console.error(`Dashboard stats error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // EQUIPOS
  // ========================
  async getEquipos(filters?: any): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getEquipos(filters);
      } else {
        // Next.js API
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.keys(filters).forEach(key => {
            if (filters[key]) {
              queryParams.append(key, filters[key]);
            }
          });
        }

        const response = await fetch(`/api/equipos?${queryParams.toString()}`, {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });

        return await response.json();
      }
    } catch (error) {
      console.error(`Equipos error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async createEquipo(equipoData: any): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.createEquipo(equipoData);
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
        
        return await response.json();
      }
    } catch (error) {
      console.error(`Create equipo error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async updateEquipo(noSerie: string, equipoData: any): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.updateEquipo(noSerie, equipoData);
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
        
        return await response.json();
      }
    } catch (error) {
      console.error(`Update equipo error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async deleteEquipo(noSerie: string): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.deleteEquipo(noSerie);
      } else {
        // Next.js API
        const response = await fetch(`/api/equipos/${noSerie}`, {
          method: 'DELETE',
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });
        
        return await response.json();
      }
    } catch (error) {
      console.error(`Delete equipo error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // MOVIMIENTOS
  // ========================
  async getMovimientos(filters?: any): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getMovimientos(filters);
      } else {
        // Next.js API
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.keys(filters).forEach(key => {
            if (filters[key]) {
              queryParams.append(key, filters[key]);
            }
          });
        }

        const response = await fetch(`/api/movimientos?${queryParams.toString()}`, {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });

        return await response.json();
      }
    } catch (error) {
      console.error(`Movimientos error (${this.currentMode}):`, error);
      throw error;
    }
  }

  async createMovimiento(movimientoData: any): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.createMovimiento(movimientoData);
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
        
        return await response.json();
      }
    } catch (error) {
      console.error(`Create movimiento error (${this.currentMode}):`, error);
      throw error;
    }
  }

  // ========================
  // CATÁLOGOS
  // ========================
  async getCatalogos(): Promise<any> {
    try {
      if (this.currentMode === 'python') {
        return await pythonApiClient.getCatalogos();
      } else {
        // Next.js API
        const response = await fetch('/api/catalogos', {
          headers: {
            ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          },
        });

        return await response.json();
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