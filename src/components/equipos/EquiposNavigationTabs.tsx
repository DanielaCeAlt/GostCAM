'use client';

import React from 'react';

type VistaActual = 'lista' | 'busqueda' | 'alta' | 'historial' | 'cambiarUbicacion' | 'mantenimientoEquipo' | 'dashboard' | 'editar';

interface TabItem {
  id: string;
  label: string;
  icon: string;
}

interface EquiposNavigationTabsProps {
  tabs: TabItem[];
  activeTab: VistaActual;
  onTabChange: (vista: VistaActual) => void;
}

const EquiposNavigationTabs: React.FC<EquiposNavigationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="-mb-px flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as VistaActual)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
            }`}
          >
            <i className={`fas ${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default EquiposNavigationTabs;