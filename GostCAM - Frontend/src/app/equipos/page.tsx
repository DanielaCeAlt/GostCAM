'use client';

import React from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import LoginScreen from '@/components/LoginScreen';
import Navigation from '@/components/Navigation';
import EquiposManager from '@/components/equipos/EquiposManager';
import { ToastContainer, useToast } from '@/components/ui/ToastNotification';

function EquiposContent() {
  const { state } = useApp();
  const { collapsed } = useSidebar();
  const { toasts, removeToast } = useToast();
  const contentMargin = collapsed ? 'md:ml-16' : 'md:ml-60';

  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <>
      <div className="min-h-screen bg-gostcam-bg-primary flex">
        <Navigation />
        <div className={`flex-1 min-w-0 ${contentMargin} transition-all duration-300`}>
          <main className="flex-1 p-4">
            <EquiposManager />
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}

export default function EquiposPage() {
  return (
    <AppProvider initialSection="equipos">
      <SidebarProvider>
        <EquiposContent />
      </SidebarProvider>
    </AppProvider>
  );
}