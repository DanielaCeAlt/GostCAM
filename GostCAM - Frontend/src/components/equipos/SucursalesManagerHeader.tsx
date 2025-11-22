'use client';

import React from 'react';

interface SucursalesManagerHeaderProps {
  vistaActual: 'lista' | 'detalle';
  vistaSucursales: 'tarjetas' | 'lista';
  sucursalSeleccionada?: {
    nombre: string;
    id: number;
  } | null;
  searchTerm: string;
  onVistaChange: (vista: 'lista' | 'detalle') => void;
  onVistaSucursalesChange: (vista: 'tarjetas' | 'lista') => void;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
  loading?: boolean; // Nuevo prop para mostrar estado de carga
}

export default function SucursalesManagerHeader({ 
  vistaActual, 
  vistaSucursales,
  sucursalSeleccionada,
  searchTerm,
  onVistaChange,
  onVistaSucursalesChange,
  onSearchChange,
  onRefresh,
  loading = false
}: SucursalesManagerHeaderProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        {/* Título y descripción a la izquierda */}
        <div className="flex items-center space-x-3">
          <i className="fas fa-building text-2xl text-blue-600"></i>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {vistaActual === 'detalle' && sucursalSeleccionada 
                ? `${sucursalSeleccionada.nombre}` 
                : 'Gestión de Sucursales'
              }
            </h1>
            <p className="text-gray-600">
              {vistaActual === 'detalle' && sucursalSeleccionada
                ? 'Detalles y equipos de la sucursal'
                : 'Administra todas las sucursales y sus equipos'
              }
            </p>
          </div>
        </div>

        {/* Navegación y controles a la derecha */}
        <div className="flex items-center space-x-4">
          {/* Campo de búsqueda - solo mostrar en vista lista */}
          {vistaActual === 'lista' && (
            <div className="flex items-center space-x-2">
              <i className="fas fa-search text-gray-400"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar..."
                className="w-64 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          )}

          {/* Controles de vista - solo mostrar en vista lista */}
          {vistaActual === 'lista' && (
            <div className="flex space-x-2">
              <button
                onClick={() => onVistaSucursalesChange('tarjetas')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  vistaSucursales === 'tarjetas'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <span>🗂️ Tarjetas</span>
              </button>
              <button
                onClick={() => onVistaSucursalesChange('lista')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  vistaSucursales === 'lista'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <span>📋 Lista</span>
              </button>
            </div>
          )}

          {/* Navegación de detalle */}
          {vistaActual === 'detalle' && sucursalSeleccionada && (
            <button
              onClick={() => onVistaChange('lista')}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600"
            >
              <span>📋 Volver a Lista</span>
            </button>
          )}

          {/* Separador visual */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Botón de actualizar */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            <span>{loading ? 'Actualizando...' : 'Actualizar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}