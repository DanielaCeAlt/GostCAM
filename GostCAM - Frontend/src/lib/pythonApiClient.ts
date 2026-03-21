// =============================================
// SERVICIO: CLIENTE API PYTHON
// =============================================

// En el navegador usamos la ruta proxy de Next.js (/api/python/...)
// para evitar que "localhost" se resuelva en el dispositivo del cliente.
// En SSR/servidor, llamamos directamente al backend Python.
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser: usar proxy interno de Next.js (mismo origen → sin problemas CORS/HTTPS)
    return '/api/python';
  }
  // Servidor Node: llamar directo al backend Python
  return process.env.PYTHON_API_URL || 'http://localhost:8000';
}

class PythonApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? getBaseUrl();
  }

  // Configurar token de autenticación
  setToken(token: string) {
    this.token = token;
  }

  // Método público para hacer requests
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    // Recalcular baseUrl en cada request para soportar SSR + browser correctamente
    const base = getBaseUrl();
    const url = `${base}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Métodos de autenticación
  async login(correo: string, contraseña: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contraseña }),
    });
  }

  // Métodos para dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Métodos para equipos
  async getEquipos(filters?: any) {
    const params = new URLSearchParams(filters || {});
    return this.request(`/equipos?${params.toString()}`);
  }

  async createEquipo(equipoData: any) {
    return this.request('/equipos', {
      method: 'POST',
      body: JSON.stringify(equipoData),
    });
  }

  async updateEquipo(noSerie: string, equipoData: any) {
    return this.request(`/equipos/${noSerie}`, {
      method: 'PUT',
      body: JSON.stringify(equipoData),
    });
  }

  async deleteEquipo(noSerie: string) {
    return this.request(`/equipos/${noSerie}`, {
      method: 'DELETE',
    });
  }

  // Métodos para movimientos
  async getMovimientos(filters?: any) {
    const params = new URLSearchParams(filters || {});
    return this.request(`/movimientos?${params.toString()}`);
  }

  async createMovimiento(movimientoData: any) {
    return this.request('/movimientos', {
      method: 'POST',
      body: JSON.stringify(movimientoData),
    });
  }

  async updateMovimiento(id: number, movimientoData: any) {
    return this.request(`/movimientos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movimientoData),
    });
  }

  // Métodos para catálogos
  async getCatalogos() {
    return this.request('/catalogos');
  }

  // Métodos para reportes
  async getReportes(tipo: string, filtros?: any) {
    const params = new URLSearchParams(filtros || {});
    return this.request(`/reportes/${tipo}?${params.toString()}`);
  }

  // Método para exportar datos
  async exportData(tipo: string, formato: string, filtros?: any) {
    const params = new URLSearchParams({ formato, ...filtros });
    return this.request(`/export/${tipo}?${params.toString()}`, {
      headers: {
        'Accept': formato === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf'
      }
    });
  }
}

// Instancia singleton del cliente
export const pythonApiClient = new PythonApiClient();
export default pythonApiClient;