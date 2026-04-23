// =============================================
// COMPONENTE DE NAVEGACIÃ“N SIDEBAR - GOSTCAM
// =============================================

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useLogger } from '@/lib/logger';
import { useKeyboardNavigation, useAriaAnnouncements } from '@/hooks/useAccessibility';
import { useSidebar } from '@/contexts/SidebarContext';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const { state, logout, setSection, getUserRoleColor } = useApp();
  const logger = useLogger();
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { focusElement } = useKeyboardNavigation();
  const { announcePageChange, announceSuccess } = useAriaAnnouncements();

  const navItems = useMemo(() => [
    { id: 'dashboard',   label: 'Inicio',      icon: 'fas fa-home',                 shortcut: 'H', href: '/inicio' },
    { id: 'equipos',     label: 'Equipos',     icon: 'fas fa-desktop',              shortcut: 'E', href: '/equipos' },
    { id: 'sucursales',  label: 'Sucursales',  icon: 'fas fa-building',             shortcut: 'S', href: '/sucursales' },
    { id: 'fallas',      label: 'Fallas',      icon: 'fas fa-exclamation-triangle', shortcut: 'F', href: '/fallas' },
    { id: 'tecnicos',    label: 'Técnicos',    icon: 'fas fa-user-check',           shortcut: 'T', href: '/tecnicos' },
  ], []);

  // Keyboard shortcuts
  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); }
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const shortcuts: Record<string, string> = { h: 'dashboard', e: 'equipos', s: 'sucursales', f: 'fallas', t: 'tecnicos' };
        const sectionId = shortcuts[e.key.toLowerCase()];
        if (sectionId) {
          e.preventDefault();
          const navItem = navItems.find(i => i.id === sectionId);
          if (navItem) handleSectionClick(navItem);
        }
      }
      if (e.ctrlKey && e.key === 'q') { e.preventDefault(); handleLogout(); }
    };

    window.addEventListener('keydown', handleKeyDown, { signal });
    return () => abortControllerRef.current?.abort();
  }, [setSection, announcePageChange, navItems]);

  const handleSectionClick = (item: { id: string; href: string }) => {
    if (item.href !== pathname) {
      router.push(item.href);
    }
    setSection(item.id);
    setMobileOpen(false);
    announcePageChange(navItems.find(i => i.id === item.id)?.label || '');
  };

  const handleLogout = () => {
    announceSuccess('SesiÃ³n cerrada correctamente');
    logout();
  };

  const sidebarWidth = collapsed ? 'w-16' : 'w-60';

  return (
    <>
      {/* Overlay mÃ³vil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* BotÃ³n hamburguesa mÃ³vil */}
      <button
        className="fixed top-3 left-3 z-50 md:hidden bg-blue-800 text-white p-2 rounded-lg shadow"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menÃº"
      >
        <i className="fas fa-bars" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-blue-900 text-white flex flex-col z-50 shadow-xl
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        role="navigation"
        aria-label="MenÃº lateral"
      >
        {/* Logo */}
        <div className={`flex items-center h-16 px-4 border-b border-blue-800 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 p-1">
                <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M 10,70 L 10,45 Q 10,10 50,10 Q 90,10 90,45 L 90,70 Q 77,85 63,70 Q 50,55 37,70 Q 23,85 10,70 Z" fill="white" />
                  <circle cx="34" cy="43" r="9" fill="#1e3a8a" />
                  <circle cx="37" cy="46" r="5" fill="white" />
                  <circle cx="66" cy="43" r="9" fill="#1e3a8a" />
                  <circle cx="69" cy="46" r="5" fill="white" />
                </svg>
              </div>
              <span className="font-bold text-lg truncate">GostCAM</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center p-1">
                <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M 10,70 L 10,45 Q 10,10 50,10 Q 90,10 90,45 L 90,70 Q 77,85 63,70 Q 50,55 37,70 Q 23,85 10,70 Z" fill="white" />
                  <circle cx="34" cy="43" r="9" fill="#1e3a8a" />
                  <circle cx="37" cy="46" r="5" fill="white" />
                  <circle cx="66" cy="43" r="9" fill="#1e3a8a" />
                  <circle cx="69" cy="46" r="5" fill="white" />
                </svg>
              </div>
          )}
          {/* Toggle collapse - solo desktop */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded hover:bg-blue-800 transition shrink-0 ml-1"
            aria-label={collapsed ? 'Expandir menÃº' : 'Contraer menÃº'}
          >
            <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'} text-xs text-blue-300`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {navItems.map(item => {
            // Activo si la sección actual coincide O si estamos en su ruta dedicada
            const active = state.currentSection === item.id || pathname === item.href && item.href !== '/';
            return (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item)}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group
                  ${active
                    ? 'bg-white text-blue-900 shadow'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'}
                  ${collapsed ? 'justify-center' : ''}
                `}
                aria-current={active ? 'page' : undefined}
              >
                <i className={`${item.icon} text-base shrink-0 ${active ? 'text-blue-800' : 'text-blue-300 group-hover:text-white'}`} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && (
                  <span className="ml-auto text-[10px] text-blue-400 group-hover:text-blue-200">
                    Alt+{item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Usuario y logout */}
        <div className="border-t border-blue-800 p-3 shrink-0">
          {!collapsed && (
            <div className="mb-3 px-1">
              <p className="text-sm font-medium text-white truncate">{state.user?.NombreUsuario || 'Usuario'}</p>
              <p className="text-xs text-blue-300 truncate">{state.user?.NivelNombre || `Nivel ${state.user?.NivelUsuario || 1}`}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors ${collapsed ? 'justify-center' : ''}`}
            aria-label="Cerrar sesión"
          >
            <i className="fas fa-sign-out-alt shrink-0" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
