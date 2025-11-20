import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import GostCamButton, { GostCamIconButton } from './GostCamButton';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  }>;
}

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animar entrada
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close si tiene duración
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = 'border-l-4';
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-gostcam-success bg-gostcam-success-light`;
      case 'error':
        return `${baseStyles} border-gostcam-danger bg-gostcam-danger-light`;
      case 'warning':
        return `${baseStyles} border-gostcam-warning bg-gostcam-warning-light`;
      case 'info':
        return `${baseStyles} border-gostcam-info bg-gostcam-info-light`;
      default:
        return `${baseStyles} border-gostcam-info bg-gostcam-info-light`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'fas fa-check-circle text-gostcam-success';
      case 'error':
        return 'fas fa-exclamation-circle text-gostcam-danger';
      case 'warning':
        return 'fas fa-exclamation-triangle text-gostcam-warning';
      case 'info':
        return 'fas fa-info-circle text-gostcam-info';
      default:
        return 'fas fa-info-circle text-gostcam-info';
    }
  };

  const transformClass = isVisible && !isRemoving 
    ? 'translate-x-0' 
    : 'translate-x-full';

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${transformClass} mb-4 w-full max-w-md`}
      role="alert"
      aria-live="polite"
    >
      <div className={`rounded-xl shadow-lg overflow-hidden ${getToastStyles()}`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Ícono */}
            <div className="flex-shrink-0">
              <i className={`${getIcon()} text-xl`} />
            </div>
            
            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gostcam-text-primary mb-1">
                {toast.title}
              </h3>
              {toast.message && (
                <p className="text-sm text-gostcam-text-secondary">
                  {toast.message}
                </p>
              )}
              
              {/* Acciones */}
              {toast.actions && toast.actions.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {toast.actions.map((action, index) => (
                    <GostCamButton
                      key={index}
                      variant={action.variant || 'ghost'}
                      size="sm"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </GostCamButton>
                  ))}
                </div>
              )}
            </div>
            
            {/* Botón cerrar */}
            <div className="flex-shrink-0">
              <GostCamIconButton
                variant="ghost"
                size="sm"
                icon={<i className="fas fa-times" />}
                ariaLabel="Cerrar notificación"
                onClick={handleClose}
                className="text-gostcam-text-muted hover:text-gostcam-text-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CONTENEDOR DE TOASTS =====
interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col-reverse space-y-reverse space-y-4 max-h-screen overflow-hidden"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>,
    document.body
  );
}

// ===== HOOK PARA MANEJAR TOASTS =====
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000 // 5 segundos por defecto
    };
    
    setToasts(prev => [newToast, ...prev]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string, actions?: Toast['actions']) => {
    return addToast({ type: 'success', title, message, actions });
  };

  const error = (title: string, message?: string, actions?: Toast['actions']) => {
    return addToast({ type: 'error', title, message, actions, duration: 8000 });
  };

  const warning = (title: string, message?: string, actions?: Toast['actions']) => {
    return addToast({ type: 'warning', title, message, actions, duration: 6000 });
  };

  const info = (title: string, message?: string, actions?: Toast['actions']) => {
    return addToast({ type: 'info', title, message, actions });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}