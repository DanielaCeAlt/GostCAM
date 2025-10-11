// =============================================
// PÁGINA PRINCIPAL - GOSTCAM
// =============================================

'use client';

import React from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import LoginScreen from '@/components/LoginScreen';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

// Componente interno que usa el contexto
function AppContent() {
  const { state } = useApp();

  // Si no está autenticado, mostrar login
  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  // Renderizar contenido basado en la sección actual
  const renderContent = () => {
    switch (state.currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'equipos':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Equipos</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Sección de equipos en desarrollo...</p>
              <p className="text-sm text-gray-500 mt-2">
                Esta sección permitirá administrar todos los equipos del inventario.
              </p>
            </div>
          </div>
        );
      case 'movimientos':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Movimientos de Inventario</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Sección de movimientos en desarrollo...</p>
              <p className="text-sm text-gray-500 mt-2">
                Esta sección permitirá gestionar todos los movimientos de equipos.
              </p>
            </div>
          </div>
        );
      case 'reportes':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reportes</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Sección de reportes en desarrollo...</p>
              <p className="text-sm text-gray-500 mt-2">
                Esta sección permitirá generar y exportar reportes del inventario.
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
}

// Componente principal con Provider
export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}