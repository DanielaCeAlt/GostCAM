'use client';

import React from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import LoginScreen from '@/components/LoginScreen';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import EquiposManager from '@/components/equipos/EquiposManager';
import Sucursales from '@/components/Sucursales';
import Fallas from '@/components/Fallas';
import { ToastContainer, useToast } from '@/components/ui/ToastNotification';
import { PageSkeleton } from '@/components/ui/SkeletonLoader';

// Componente interno que usa el contexto
function AppContent() {
  const { state } = useApp();
  const { toasts, removeToast } = useToast();

  // Si no está autenticado, mostrar login
  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  // Mostrar skeleton mientras carga
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gostcam-bg-primary">
        <Navigation />
        <main className="flex-1 p-6">
          <PageSkeleton type="dashboard" />
        </main>
      </div>
    );
  }

  // Renderizar contenido basado en la sección actual
  const renderContent = () => {
    switch (state.currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'equipos':
        return <EquiposManager />;
      case 'sucursales':
        return <Sucursales />;
      case 'fallas':
        return <Fallas />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gostcam-bg-primary">
        <Navigation />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer 
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </>
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