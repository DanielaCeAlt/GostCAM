// Stub temporal para EquiposFallasOptimized
'use client';
import React from 'react';

export interface EquiposFallasOptimizedProps {
  [key: string]: any;
}

export default function EquiposFallasOptimized(props: EquiposFallasOptimizedProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-exclamation-triangle text-4xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Componente de Fallas Optimizado
        </h3>
        <p className="text-gray-600">
          Temporalmente deshabilitado para resolver build
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Use el componente EquiposFallas estándar
        </p>
      </div>
    </div>
  );
}

EquiposFallasOptimized.displayName = 'EquiposFallasOptimized';