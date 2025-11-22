// =============================================
// COMPONENTE: ADVANCED FILTERS (TEMPORAL STUB)
// =============================================

'use client';

import React from 'react';

// Stub temporal para evitar errores de build
export interface AdvancedFiltersProps {
  filters?: any;
  onFilterChange?: (filters: any) => void;
  onClearAll?: () => void;
  [key: string]: any;
}

/**
 * Componente temporal stub para AdvancedFilters
 * El componente original fue movido a /temp/ por problemas de tipos
 */
export default function AdvancedFilters({
  filters,
  onFilterChange,
  onClearAll,
  ...props
}: AdvancedFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <i className="fas fa-filter text-2xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Filtros Avanzados
        </h3>
        <p className="text-gray-600 text-sm">
          Componente temporalmente deshabilitado
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Use los filtros básicos por ahora
        </p>
        {onClearAll && (
          <button
            onClick={onClearAll}
            className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}

// Compatibilidad con exports
export const FormInput = ({ ...props }: any) => <input {...props} className="border rounded px-3 py-2" />;
export const FormSelect = ({ options, ...props }: any) => (
  <select {...props} className="border rounded px-3 py-2">
    <option value="">Seleccionar...</option>
    {options?.map((option: any, index: number) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
