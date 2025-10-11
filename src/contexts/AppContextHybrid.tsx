// =============================================
// CONTEXTO: CONFIGURACIÓN HÍBRIDA
// =============================================

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DashboardStats, LoginResponse, VistaEquipoCompleto, VistaMovimientoDetallado } from '@/types/database';
import { pythonApiClient } from '@/lib/pythonApiClient';

// Configuración de API
const USE_PYTHON_API = process.env.NEXT_PUBLIC_USE_PYTHON_API === 'true';
const API_MODE = process.env.NEXT_PUBLIC_API_MODE || 'nextjs'; // 'nextjs' | 'python' | 'hybrid'

interface User {
  idUsuarios: number;
  NombreUsuario: string;
  NivelUsuario: number;
  Correo: string;
  Estatus: number;
  NivelNombre?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  currentSection: string;
  dashboardStats: DashboardStats | null;
  equipos: VistaEquipoCompleto[];
  movimientos: VistaMovimientoDetallado[];
  catalogos: any;
  apiMode: string;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_SECTION'; payload: string }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_EQUIPOS'; payload: VistaEquipoCompleto[] }
  | { type: 'SET_MOVIMIENTOS'; payload: VistaMovimientoDetallado[] }
  | { type: 'SET_CATALOGOS'; payload: any }
  | { type: 'SET_API_MODE'; payload: string };

const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  currentSection: 'dashboard',
  dashboardStats: null,
  equipos: [],
  movimientos: [],
  catalogos: null,
  apiMode: API_MODE
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
        isLoading: false
      };
    case 'LOGOUT':
      return { ...initialState, apiMode: state.apiMode };
    case 'SET_SECTION':
      return { ...state, currentSection: action.payload };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    case 'SET_EQUIPOS':
      return { ...state, equipos: action.payload };
    case 'SET_MOVIMIENTOS':
      return { ...state, movimientos: action.payload };
    case 'SET_CATALOGOS':
      return { ...state, catalogos: action.payload };
    case 'SET_API_MODE':
      return { ...state, apiMode: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  login: (correo: string, contraseña: string) => Promise<boolean>;
  logout: () => void;
  setSection: (section: string) => void;
  setApiMode: (mode: string) => void;
  loadDashboardStats: () => Promise<void>;
  loadEquipos: (filters?: any) => Promise<void>;
  loadMovimientos: (filters?: any) => Promise<void>;
  loadCatalogos: () => Promise<void>;
  getStatusColor: (status: string) => string;
  getUserRoleColor: (level: number) => string;
} | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedToken = localStorage.getItem('gostcam_token');
    const savedUser = localStorage.getItem('gostcam_user');
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: savedToken } });
        
        // Configurar token en cliente Python
        if (state.apiMode === 'python' || state.apiMode === 'hybrid') {
          pythonApiClient.setToken(savedToken);
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('gostcam_token');
        localStorage.removeItem('gostcam_user');
      }
    }
  }, []);

  // Funciones que determinan qué API usar
  const getApiEndpoint = (endpoint: string) => {
    if (state.apiMode === 'python') {
      return endpoint; // El cliente Python maneja la URL base
    }
    return `/api${endpoint}`; // Next.js API
  };

  const makeApiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (state.apiMode === 'python') {
      // Usar cliente Python directamente
      return pythonApiClient.request(endpoint, options);
    } else {
      // Usar APIs de Next.js
      const response = await fetch(getApiEndpoint(endpoint), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(state.token && { 'Authorization': `Bearer ${state.token}` }),
          ...options.headers,
        },
      });
      return response.json();
    }
  };

  const login = async (correo: string, contraseña: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      let data: LoginResponse;

      if (state.apiMode === 'python') {
        data = await pythonApiClient.login(correo, contraseña) as LoginResponse;
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, contraseña }),
        });
        data = await response.json() as LoginResponse;
      }

      if (data.success && data.user && data.token) {
        localStorage.setItem('gostcam_token', data.token);
        localStorage.setItem('gostcam_user', JSON.stringify(data.user));
        
        if (state.apiMode === 'python') {
          pythonApiClient.setToken(data.token);
        }
        
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: data.user, token: data.token } 
        });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message || 'Error de autenticación' });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('gostcam_token');
    localStorage.removeItem('gostcam_user');
    dispatch({ type: 'LOGOUT' });
  };

  const setApiMode = (mode: string) => {
    dispatch({ type: 'SET_API_MODE', payload: mode });
    localStorage.setItem('gostcam_api_mode', mode);
  };

  const loadDashboardStats = async () => {
    if (!state.token) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const data = await makeApiCall('/dashboard');

      if (data.success) {
        dispatch({ type: 'SET_DASHBOARD_STATS', payload: data.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Error cargando dashboard' });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadEquipos = async (filters?: any) => {
    if (!state.token) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            queryParams.append(key, filters[key]);
          }
        });
      }

      const data = await makeApiCall(`/equipos?${queryParams.toString()}`);

      if (data.success) {
        dispatch({ type: 'SET_EQUIPOS', payload: data.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Error cargando equipos' });
      }
    } catch (error) {
      console.error('Error loading equipos:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadMovimientos = async (filters?: any) => {
    if (!state.token) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            queryParams.append(key, filters[key]);
          }
        });
      }

      const data = await makeApiCall(`/movimientos?${queryParams.toString()}`);

      if (data.success) {
        dispatch({ type: 'SET_MOVIMIENTOS', payload: data.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Error cargando movimientos' });
      }
    } catch (error) {
      console.error('Error loading movimientos:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadCatalogos = async () => {
    if (!state.token) return;
    
    try {
      const data = await makeApiCall('/catalogos');

      if (data.success) {
        dispatch({ type: 'SET_CATALOGOS', payload: data.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.error || 'Error cargando catálogos' });
      }
    } catch (error) {
      console.error('Error loading catalogos:', error);
    }
  };

  const setSection = (section: string) => {
    dispatch({ type: 'SET_SECTION', payload: section });
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'Disponible': 'bg-green-100 text-green-800',
      'En uso': 'bg-blue-100 text-blue-800',
      'Mantenimiento': 'bg-yellow-100 text-yellow-800',
      'En reparación': 'bg-yellow-100 text-yellow-800',
      'Baja': 'bg-gray-100 text-gray-800',
      'Extraviado': 'bg-red-100 text-red-800',
      'Dañado': 'bg-red-100 text-red-800',
      'Obsoleto': 'bg-gray-100 text-gray-800',
      'ABIERTO': 'bg-blue-100 text-blue-800',
      'CERRADO': 'bg-green-100 text-green-800',
      'CANCELADO': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getUserRoleColor = (level: number): string => {
    const colors: { [key: number]: string } = {
      1: 'bg-purple-100 text-purple-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-yellow-100 text-yellow-800',
      5: 'bg-gray-100 text-gray-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const value = {
    state,
    login,
    logout,
    setSection,
    setApiMode,
    loadDashboardStats,
    loadEquipos,
    loadMovimientos,
    loadCatalogos,
    getStatusColor,
    getUserRoleColor
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}