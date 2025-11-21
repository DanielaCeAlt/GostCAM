// =============================================
// COMPONENTE DE NAVEGACIÓN OPTIMIZADO - GOSTCAM
// =============================================

'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useLogger } from '@/lib/logger';
import { useKeyboardNavigation, useAriaAnnouncements } from '@/hooks/useAccessibility';
import GostCamButton, { GostCamIconButton } from '@/components/ui/GostCamButton';
import { MESSAGES } from '@/lib/messages';

export default function Navigation() {
  const { state, logout, setSection, getUserRoleColor } = useApp();
  const logger = useLogger();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Hooks de accesibilidad
  const { focusElement } = useKeyboardNavigation();
  const { announcePageChange, announceSuccess } = useAriaAnnouncements();

  // Optimized keyboard shortcuts con cleanup
  useEffect(() => {
    // Crear nuevo AbortController para este efecto
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && e.target instanceof HTMLElement && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        setSearchFocused(true);
        announcePageChange('Modo búsqueda activado');
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
        logger.userAction('keyboard_shortcut', undefined, { action: 'search' });
      }
      
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setSearchFocused(false);
        if (isMobileMenuOpen) {
          focusElement('[aria-label="Abrir menú"]');
        }
      }

      // Shortcuts de navegación (Alt + letra)
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const shortcuts: Record<string, string> = {
          'h': 'dashboard',
          'e': 'equipos', 
          's': 'sucursales',
          'f': 'fallas'
        };
        
        const sectionId = shortcuts[e.key.toLowerCase()];
        if (sectionId) {
          e.preventDefault();
          setSection(sectionId);
          const navItem = navItems.find((item: any) => item.id === sectionId);
          if (navItem) {
            announcePageChange(navItem.label);
            logger.userAction('keyboard_navigation', undefined, { section: sectionId });
          }
        }
      }

      // Ctrl+Q para logout
      if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        handleLogout();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { signal });
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isMobileMenuOpen, focusElement, announcePageChange, setSection, logger]);

  // Memoized navigation items
  const navItems = useMemo(() => [
    { id: 'dashboard', label: 'Inicio', icon: 'fas fa-home', shortcut: 'H' },
    { id: 'equipos', label: 'Equipos', icon: 'fas fa-desktop', shortcut: 'E' },
    { id: 'sucursales', label: 'Sucursales', icon: 'fas fa-building', shortcut: 'S' },
    { id: 'fallas', label: 'Fallas', icon: 'fas fa-exclamation-triangle', shortcut: 'F' },
  ], []);

  const handleSectionClick = (sectionId: string) => {
    setSection(sectionId);
    setIsMobileMenuOpen(false);
    const selectedItem = navItems.find((item: any) => item.id === sectionId);
    if (selectedItem) {
      announcePageChange(selectedItem.label);
    }
  };

  const handleLogout = () => {
    announceSuccess('Sesión cerrada correctamente');
    logout();
  };

  return (
    <nav 
      className="bg-white shadow-lg border-b border-gray-200 transition-all duration-200 sticky top-0 z-50"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 md:h-16">
          {/* Logo y título */}
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 flex items-center">
              <div 
                className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2 md:mr-3 shadow-sm"
                role="img"
                aria-label="Logo de GostCAM"
              >
                <i className="fas fa-camera text-white text-xs md:text-sm" aria-hidden="true"></i>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">GostCAM</h1>
            </div>
          </div>

          {/* Navegación - Desktop */}
          <div 
            className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4"
            role="menubar"
            aria-label="Navegación por secciones"
          >
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`relative px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 group min-h-[44px] flex items-center ${
                  state.currentSection === item.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                role="menuitem"
                aria-current={state.currentSection === item.id ? 'page' : undefined}
                aria-describedby={`nav-hint-${item.id}`}
                tabIndex={index === 0 ? 0 : -1}
                title={`${item.label} (Alt+${item.shortcut})`}
              >
                <i className={`${item.icon} mr-1.5 lg:mr-2 transition-transform group-hover:scale-110`} aria-hidden="true"></i>
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden sr-only">{item.label}</span>
                <span className="lg:hidden" aria-hidden="true">{item.shortcut}</span>
                {state.currentSection === item.id && (
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                    aria-hidden="true"
                  ></div>
                )}
                
                {/* Tooltip oculto para screen readers */}
                <span id={`nav-hint-${item.id}`} className="sr-only">
                  Atajo de teclado: Alt + {item.shortcut}
                </span>
              </button>
            ))}
          </div>

          {/* User info y logout - Desktop */}
          <div 
            className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4"
            role="region"
            aria-label="Información de usuario y acciones"
          >
            {/* User info */}
            <div 
              className="flex items-center space-x-2 lg:space-x-3"
              role="region"
              aria-label="Información del usuario actual"
            >
              <div className="text-right hidden lg:block">
                <div 
                  className="text-sm font-medium text-gray-900 truncate max-w-32"
                  aria-label={`Usuario: ${state.user?.NombreUsuario || 'Usuario'}`}
                >
                  {state.user?.NombreUsuario || 'Usuario'}
                </div>
                <div 
                  className="text-xs text-gray-500 truncate"
                  aria-label={`Nivel de acceso: ${state.user?.NivelNombre || `Nivel ${state.user?.NivelUsuario || '1'}`}`}
                >
                  {state.user?.NivelNombre || `Nivel ${state.user?.NivelUsuario || '1'}`}
                </div>
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getUserRoleColor(state.user?.NivelUsuario || 1)} min-w-max`}
                role="status"
                aria-label="Rol de usuario: Administrador"
              >
                Administrador
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Cerrar Sesión (Ctrl+Q)"
              aria-label="Cerrar sesión"
              aria-describedby="logout-hint"
            >
              <i className="fas fa-sign-out-alt lg:mr-2" aria-hidden="true"></i>
              <span className="hidden lg:inline">Salir</span>
              <span id="logout-hint" className="sr-only">
                Atajo de teclado: Ctrl + Q
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2 rounded-md transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <i 
                className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        id="mobile-navigation-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        role="menu"
        aria-label="Menú de navegación móvil"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          {/* User info - Mobile */}
          <div 
            className="px-3 py-3 bg-white rounded-md mb-3 shadow-sm"
            role="region"
            aria-label="Información del usuario"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div 
                  className="text-sm font-medium text-gray-900 truncate"
                  aria-label={`Usuario: ${state.user?.NombreUsuario || 'Usuario'}`}
                >
                  {state.user?.NombreUsuario || 'Usuario'}
                </div>
                <div 
                  className="text-xs text-gray-500 truncate"
                  aria-label={`Correo: ${state.user?.Correo || 'Sin correo'}`}
                >
                  {state.user?.Correo || 'Sin correo'}
                </div>
              </div>
              <div 
                className={`px-2 py-1 rounded-full text-xs font-medium ${getUserRoleColor(state.user?.NivelUsuario || 1)} ml-2 flex-shrink-0`}
                role="status"
                aria-label="Rol: Administrador"
              >
                Admin
              </div>
            </div>
          </div>

          {/* Navigation items - Mobile */}
          <nav 
            role="menu"
            aria-label="Navegación principal móvil"
          >
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 min-h-[48px] flex items-center relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  state.currentSection === item.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
                role="menuitem"
                aria-current={state.currentSection === item.id ? 'page' : undefined}
                aria-describedby={`mobile-nav-hint-${item.id}`}
                tabIndex={index === 0 ? 0 : -1}
              >
                <i className={`${item.icon} mr-3 w-4 text-center transition-transform hover:scale-110`} aria-hidden="true"></i>
                <span>{item.label}</span>
                {state.currentSection === item.id && (
                  <div 
                    className="absolute right-3 w-2 h-2 bg-blue-500 rounded-full"
                    aria-hidden="true"
                  ></div>
                )}
                
                {/* Hint oculto para screen readers */}
                <span id={`mobile-nav-hint-${item.id}`} className="sr-only">
                  Sección {item.label}. Atajo: Alt + {item.shortcut}
                </span>
              </button>
            ))}
          </nav>

          {/* Logout button - Mobile */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-3 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 mt-3 min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            role="menuitem"
            aria-label="Cerrar sesión"
            aria-describedby="mobile-logout-hint"
          >
            <i className="fas fa-sign-out-alt mr-3 w-4 text-center" aria-hidden="true"></i>
            Cerrar Sesión
            <span id="mobile-logout-hint" className="sr-only">
              Atajo de teclado: Ctrl + Q
            </span>
          </button>

          {/* Instrucciones de accesibilidad */}
          <div 
            className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200 mt-2"
            role="region"
            aria-label="Ayuda de navegación"
          >
            <p className="mb-1">💡 Usa Tab para navegar</p>
            <p>⌨️ Alt + letra para ir a sección</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
