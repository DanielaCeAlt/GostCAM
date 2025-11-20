import React from 'react';
import { getStatusMessage } from '@/lib/messages';

interface EquipmentStatusProps {
  status: 'connected' | 'disconnected' | 'error' | 'maintenance' | 'installing';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

interface StatusConfig {
  color: string;
  bgColor: string;
  icon: string;
  pulse?: boolean;
}

const statusConfigs: Record<string, StatusConfig> = {
  connected: {
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100 border-emerald-200',
    icon: 'fas fa-wifi',
    pulse: false
  },
  disconnected: {
    color: 'text-amber-700', 
    bgColor: 'bg-amber-100 border-amber-200',
    icon: 'fas fa-wifi-slash',
    pulse: false
  },
  error: {
    color: 'text-red-700',
    bgColor: 'bg-red-100 border-red-200', 
    icon: 'fas fa-exclamation-triangle',
    pulse: true
  },
  maintenance: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
    icon: 'fas fa-tools',
    pulse: false
  },
  installing: {
    color: 'text-purple-700',
    bgColor: 'bg-purple-100 border-purple-200',
    icon: 'fas fa-download',
    pulse: true
  }
};

export default function EquipmentStatus({
  status,
  size = 'md',
  showIcon = true,
  showText = true,
  className = ''
}: EquipmentStatusProps) {
  const config = statusConfigs[status] || statusConfigs.disconnected;
  
  // Tamaños responsivos
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1.5 rounded-md',
      icon: 'text-xs w-3 h-3',
      text: 'text-xs font-medium'
    },
    md: {
      container: 'px-3 py-1.5 text-sm gap-2 rounded-lg',
      icon: 'text-sm w-4 h-4',
      text: 'text-sm font-medium'
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2.5 rounded-lg',
      icon: 'text-base w-5 h-5',
      text: 'text-base font-semibold'
    }
  };

  const currentSize = sizeClasses[size];

  const containerClasses = [
    'inline-flex items-center border transition-all duration-200',
    currentSize.container,
    config.bgColor,
    config.color,
    className
  ].join(' ');

  const iconClasses = [
    currentSize.icon,
    config.pulse ? 'animate-pulse' : ''
  ].join(' ');

  const message = getStatusMessage(status);

  return (
    <div className={containerClasses}>
      {showIcon && (
        <i 
          className={`${config.icon} ${iconClasses}`}
          aria-hidden="true"
        />
      )}
      {showText && (
        <span className={currentSize.text}>
          {message}
        </span>
      )}
    </div>
  );
}

// ===== COMPONENTE PARA INDICADOR SIMPLE (Solo ícono con tooltip) =====
interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'error' | 'maintenance' | 'installing';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusIndicator({ status, size = 'md', className = '' }: StatusIndicatorProps) {
  const config = statusConfigs[status] || statusConfigs.disconnected;
  const message = getStatusMessage(status);
  
  const sizeClasses = {
    sm: 'w-3 h-3 text-xs',
    md: 'w-4 h-4 text-sm', 
    lg: 'w-5 h-5 text-base'
  };

  const dotClasses = [
    'rounded-full border-2 border-white shadow-sm',
    config.bgColor.replace('bg-', 'bg-').replace('-100', '-500'),
    sizeClasses[size],
    config.pulse ? 'animate-pulse' : '',
    className
  ].join(' ');

  return (
    <div
      className={dotClasses}
      title={message}
      aria-label={message}
      role="status"
    />
  );
}

// ===== COMPONENTE PARA LISTA DE ESTADOS =====
interface StatusListProps {
  statuses: Array<{
    status: 'connected' | 'disconnected' | 'error' | 'maintenance' | 'installing';
    count: number;
  }>;
  className?: string;
}

export function StatusList({ statuses, className = '' }: StatusListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {statuses.map(({ status, count }) => (
        <div key={status} className="flex items-center gap-1">
          <StatusIndicator status={status} size="sm" />
          <span className="text-sm text-gostcam-text-secondary">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}