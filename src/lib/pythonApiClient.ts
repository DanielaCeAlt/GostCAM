// =============================================
// SERVICIO: CLIENTE API PYTHON
// =============================================

// Configuración para conectar con tu API Python existente
const API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';

class PythonApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
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
    const url = `${this.baseUrl}${endpoint}`;
    
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