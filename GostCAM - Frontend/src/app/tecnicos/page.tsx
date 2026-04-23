'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import LandingPage from '@/components/LandingPage';
import LoginScreen from '@/components/LoginScreen';
import Navigation from '@/components/Navigation';
import Tecnicos from '@/components/Tecnicos';
import { ToastContainer, useToast } from '@/components/ui/ToastNotification';
import { PageSkeleton } from '@/components/ui/SkeletonLoader';

function TecnicosContent() {
  const { state } = useApp();
  const { toasts, removeToast } = useToast();
  const { collapsed } = useSidebar();
  const [showLanding, setShowLanding] = useState(true);

  const contentMargin = collapsed ? 'md:ml-16' : 'md:ml-60';

  if (!state.isAuthenticated && showLanding) {
    return <LandingPage onAcceder={() => setShowLanding(false)} />;
  }

  if (!state.isAuthenticated) {
    return <LoginScreen />;
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gostcam-bg-primary flex">
        <Navigation />
        <div className={`flex-1 min-w-0 ${contentMargin} p-6 transition-all duration-300`}>
          <PageSkeleton type="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gostcam-bg-primary flex">
        <Navigation />
        <div className={`flex-1 min-w-0 ${contentMargin} transition-all duration-300`}>
          <main className="flex-1 p-4">
            <Tecnicos />
          </main>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}

export default function TecnicosPage() {
  return (
    <AppProvider initialSection="tecnicos">
      <SidebarProvider>
        <TecnicosContent />
      </SidebarProvider>
    </AppProvider>
  );
}
