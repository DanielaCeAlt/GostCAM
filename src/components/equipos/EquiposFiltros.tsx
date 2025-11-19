'use client';

import React, { useState } from 'react';

interface Filtros {
  texto: string;
  limite: number;
  pagina: number;
}

interface EquiposFiltrosProps {
  filtros: Filtros;
  loading: boolean;
  onFiltroChange: (campo: string, valor: string) => void;
  onBuscar: () => void;
  onLimpiarFiltros: () => void;
}

const EquiposFiltros: React.FC<EquiposFiltrosProps> = ({
  filtros,
  loading,
  onFiltroChange,
  onBuscar,
  onLimpiarFiltros
}) => {
  const [expandedMobile, setExpandedMobile] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 transition-all">
      {/* Header con toggle para móvil */}
      <div className="flex items-center justify-between md:mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          <i className="fas fa-filter mr-2"></i>
          Filtros de Búsqueda
        </h3>
        <button
          onClick={() => setExpandedMobile(!expandedMobile)}
          className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Alternar filtros"
          aria-expanded={expandedMobile}
        >
          <i className={`fas fa-chevron-${expandedMobile ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {/* Contenedor de filtros - colapsable en móvil */}
      <div className={`${expandedMobile ? 'block' : 'hidden'} md:block transition-all`}>
        {/* Fila principal: búsqueda compacta y botones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Búsqueda de texto - principal */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Búsqueda
            </label>
            <input
              type="text"
              value={filtros.texto}
              onChange={(e) => onFiltroChange('texto', e.target.value)}
              placeholder="Serie, nombre, modelo..."
              className="w-full h-10 md:h-11 border border-gray-300 dark:border-gray-600 rounded-md px-3 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-150"
            />
          </div>

          {/* Límite de resultados */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Por página
            </label>
            <select
              value={filtros.limite}
              onChange={(e) => onFiltroChange('limite', e.target.value)}
              className="w-full h-10 md:h-11 border border-gray-300 dark:border-gray-600 rounded-md px-3 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-150 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Filtros adicionales - colapsables/menos visibles en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Estado
            </label>
            <select
              className="w-full h-10 md:h-11 border border-gray-300 dark:border-gray-600 rounded-md px-3 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-150 cursor-not-allowed opacity-60"
              disabled
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
              Tipo de Equipo
            </label>
            <select
              className="w-full h-10 md:h-11 border border-gray-300 dark:border-gray-600 rounded-md px-3 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-colors duration-150 cursor-not-allowed opacity-60"
              disabled
            >
              <option value="">Todos los tipos</option>
              <option value="Cámara">Cámara</option>
              <option value="Sensor">Sensor</option>
              <option value="Dispositivo">Dispositivo</option>
            </select>
          </div>
        </div>

        {/* Botones de acción - touch-friendly (44px mín) */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onBuscar}
            disabled={loading}
            className="flex-1 sm:flex-none h-11 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-md 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center space-x-2 transition-colors duration-150 focus-visible-ring"
            aria-busy={loading}
          >
            <i className="fas fa-search"></i>
            <span>{loading ? 'Buscando...' : 'Buscar'}</span>
          </button>
          
          <button
            onClick={onLimpiarFiltros}
            disabled={loading}
            className="flex-1 sm:flex-none h-11 px-5 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-medium rounded-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center space-x-2 transition-colors duration-150 focus-visible-ring"
          >
            <i className="fas fa-times"></i>
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Información de búsqueda activa */}
      {filtros.texto && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md fade-in">
          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium flex items-center">
            <i className="fas fa-info-circle mr-2"></i>
            Búsqueda activa: <strong className="ml-1">"{filtros.texto}"</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default EquiposFiltros;