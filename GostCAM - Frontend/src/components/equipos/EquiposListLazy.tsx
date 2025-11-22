'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { SkeletonTable } from '@/components/ui';

// Lazy loading del componente principal con código dividido
const EquiposList = dynamic(
  () => import('./EquiposList'),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <SkeletonTable />
      </div>
    ),
    ssr: false // Evitar SSR para mejor performance inicial
  }
);

// Lazy loading de componentes relacionados
const EquiposFiltros = dynamic(
  () => import('./EquiposFiltros'),
  {
    loading: () => (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);

const EquiposAlta = dynamic(
  () => import('./EquiposAlta'),
  {
    loading: () => (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    ),
    ssr: false
  }
);

export interface LazyEquiposComponentsProps {
  component: 'list' | 'filters' | 'alta';
  [key: string]: any;
}

/**
 * Componente wrapper para carga lazy de componentes de equipos
 * Optimiza la performance mediante code splitting
 */
export default function LazyEquiposComponents({ 
  component, 
  ...props 
}: LazyEquiposComponentsProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando componente...</span>
      </div>
    }>
      {component === 'list' && <EquiposList {...(props as any)} />}
      {component === 'filters' && <EquiposFiltros {...(props as any)} />}
      {component === 'alta' && <EquiposAlta {...(props as any)} />}
    </Suspense>
  );
}

// Exportaciones adicionales para uso directo
export const LazyEquiposList = EquiposList;
export const LazyEquiposFiltros = EquiposFiltros;
export const LazyEquiposAlta = EquiposAlta;

// Preload functions para cargar componentes anticipadamente
export const preloadEquiposList = () => {
  const componentImport = () => import('./EquiposList');
  return componentImport;
};

export const preloadEquiposFiltros = () => {
  const componentImport = () => import('./EquiposFiltros');
  return componentImport;
};

export const preloadEquiposAlta = () => {
  const componentImport = () => import('./EquiposAlta');
  return componentImport;
};