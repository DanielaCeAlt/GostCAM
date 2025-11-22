// Stub temporal para PerformanceDashboard
'use client';
import React from 'react';

export interface PerformanceDashboardProps {
  minimized?: boolean;
  detailed?: boolean;
  devOnly?: boolean;
  [key: string]: any;
}

export default function PerformanceDashboard(props: PerformanceDashboardProps) {
  const { devOnly = true } = props;
  
  // No mostrar en producción si devOnly está activo
  if (devOnly && process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-center py-4">
        <p className="text-gray-600 text-sm">PerformanceDashboard temporalmente deshabilitado</p>
      </div>
    </div>
  );
}