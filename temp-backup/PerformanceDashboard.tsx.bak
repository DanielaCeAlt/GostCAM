'use client';

import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformance';
import PerformanceAnalyzer from './PerformanceAnalyzer';

interface PerformanceDashboardProps {
  /** Mostrar solo en modo desarrollo */
  devOnly?: boolean;
  /** Posición en la pantalla */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Minimizado por defecto */
  minimized?: boolean;
  /** Mostrar métricas detalladas */
  detailed?: boolean;
}

/**
 * Dashboard de performance en tiempo real para monitoreo durante desarrollo
 * Muestra Core Web Vitals, memoria, renders y otras métricas clave
 */
export default function PerformanceDashboard({
  devOnly = true,
  position = 'bottom-right',
  minimized = true,
  detailed = false
}: PerformanceDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(!minimized);
  const [showDetails, setShowDetails] = useState(detailed);
  const performanceMonitor = usePerformanceMonitor();

  // No mostrar en producción si devOnly está activo
  if (devOnly && process.env.NODE_ENV === 'production') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; needs_improvement: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.needs_improvement) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Versión minimizada */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-md hover:bg-opacity-90 transition-all duration-200 font-mono"
          title="Expandir Performance Monitor"
        >
          📊 Perf
          {performanceMonitor && (
            <span className="ml-1">
              {Math.round(performanceMonitor.memoryUsage)}MB
            </span>
          )}
        </button>
      )}

      {/* Versión expandida */}
      {isExpanded && (
        <div className="bg-black bg-opacity-90 text-white rounded-lg shadow-lg border border-gray-700 max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">📊 Performance</span>
              <span className="text-xs text-gray-400">Live</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title={showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
              >
                {showDetails ? '📊' : '📈'}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                title="Minimizar"
              >
                ➖
              </button>
            </div>
          </div>

          {/* Métricas básicas */}
          <div className="p-3 space-y-2 text-xs font-mono">
            {performanceMonitor && (
              <>
                <div className="flex justify-between">
                  <span>Memoria:</span>
                  <span className={getPerformanceColor(performanceMonitor.memoryUsage, { good: 50, needs_improvement: 100 })}>
                    {Math.round(performanceMonitor.memoryUsage)} MB
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Render:</span>
                  <span className={getPerformanceColor(performanceMonitor.renderTime, { good: 16, needs_improvement: 33 })}>
                    {performanceMonitor.renderTime} ms
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Re-renders:</span>
                  <span className={getPerformanceColor(performanceMonitor.componentRenders, { good: 5, needs_improvement: 10 })}>
                    {performanceMonitor.componentRenders}
                  </span>
                </div>

                {/* Detalles adicionales */}
                {showDetails && (
                  <div className="mt-3 pt-2 border-t border-gray-700 space-y-1">
                    <div className="flex justify-between">
                      <span>FPS:</span>
                      <span className={getPerformanceColor(60 - (performanceMonitor.renderTime * 60 / 1000), { good: 55, needs_improvement: 45 })}>
                        ~{Math.round(60 - (performanceMonitor.renderTime * 60 / 1000))}
                      </span>
                    </div>
                    
                    {navigator.connection && (
                      <div className="flex justify-between">
                        <span>Red:</span>
                        <span className="text-blue-400">
                          {(navigator.connection as any).effectiveType}
                        </span>
                      </div>
                    )}
                    
                    {performance.memory && (
                      <>
                        <div className="flex justify-between">
                          <span>JS Heap:</span>
                          <span className="text-purple-400">
                            {formatBytes((performance.memory as any).usedJSHeapSize)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Límite:</span>
                          <span className="text-purple-300">
                            {formatBytes((performance.memory as any).jsHeapSizeLimit)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Core Web Vitals si están disponibles */}
          {showDetails && (
            <div className="border-t border-gray-700 p-3">
              <PerformanceAnalyzer 
                compact={true}
                className="text-xs"
              />
            </div>
          )}

          {/* Controles */}
          <div className="border-t border-gray-700 p-2 flex justify-between text-xs">
            <button 
              onClick={() => window.location.reload()}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
            >
              🔄 Reload
            </button>
            <button 
              onClick={() => {
                if (window.gc) {
                  window.gc();
                  console.log('🗑️ Garbage collection triggered');
                }
              }}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded transition-colors"
              title="Forzar garbage collection (solo en desarrollo)"
            >
              🗑️ GC
            </button>
            <button 
              onClick={() => console.table(performanceMonitor)}
              className="px-2 py-1 bg-green-600 hover:bg-green-500 rounded transition-colors"
              title="Log performance data"
            >
              📋 Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook para facilitar el uso
export function usePerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl + Shift + P para mostrar/ocultar
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return { isVisible, setIsVisible };
}