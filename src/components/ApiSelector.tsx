// =============================================
// COMPONENTE: SELECTOR DE API
// =============================================

'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';

export default function ApiSelector() {
  const { state, setApiMode } = useApp();

  if (!state.isAuthenticated || state.user?.NivelUsuario !== 1) {
    return null; // Solo mostrar para administradores
  }

  const handleApiChange = (mode: string) => {
    if (typeof setApiMode === 'function') {
      setApiMode(mode);
      // Recargar la página para aplicar cambios
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Configuración de API</h3>
          <p className="text-xs text-gray-500">Selecciona el backend a utilizar</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleApiChange('nextjs')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              state.apiMode === 'nextjs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-server mr-1"></i>
            Next.js API
          </button>
          <button
            onClick={() => handleApiChange('python')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              state.apiMode === 'python'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fab fa-python mr-1"></i>
            Python API
          </button>
          <button
            onClick={() => handleApiChange('hybrid')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              state.apiMode === 'hybrid'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-layer-group mr-1"></i>
            Híbrido
          </button>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-600">
        <span className="font-medium">Modo actual:</span> {state.apiMode}
        {state.apiMode === 'nextjs' && ' (Usando APIs locales de Next.js)'}
        {state.apiMode === 'python' && ' (Conectando a API Python existente)'}
        {state.apiMode === 'hybrid' && ' (Usando ambas APIs según configuración)'}
      </div>
    </div>
  );
}