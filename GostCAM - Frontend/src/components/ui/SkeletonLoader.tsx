import React from 'react';

// ===== SKELETON BASE =====
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

export function Skeleton({ 
  className = '', 
  width, 
  height, 
  rounded = 'md',
  animate = true 
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={[
        'bg-gostcam-gray-200',
        roundedClasses[rounded],
        animate ? 'animate-wave' : '',
        className
      ].join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
}

// ===== SKELETON PARA TEXTO =====
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === lines - 1 ? '75%' : '100%'}
          className="last:w-3/4"
        />
      ))}
    </div>
  );
}

// ===== SKELETON PARA TARJETAS =====
interface SkeletonCardProps {
  hasImage?: boolean;
  hasActions?: boolean;
  className?: string;
}

export function SkeletonCard({ 
  hasImage = false, 
  hasActions = false, 
  className = '' 
}: SkeletonCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gostcam-border-light p-6 space-y-4 ${className}`}>
      {hasImage && (
        <Skeleton height="12rem" className="w-full" />
      )}
      
      <div className="space-y-3">
        <Skeleton height="1.5rem" width="80%" />
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="60%" />
      </div>

      {hasActions && (
        <div className="flex gap-2 pt-2">
          <Skeleton height="2.5rem" width="5rem" />
          <Skeleton height="2.5rem" width="4rem" />
        </div>
      )}
    </div>
  );
}

// ===== SKELETON PARA TABLA =====
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

export function SkeletonTable({ 
  rows = 5, 
  columns = 4, 
  hasHeader = true, 
  className = '' 
}: SkeletonTableProps) {
  return (
    <div className={`bg-white rounded-xl border border-gostcam-border-light overflow-hidden ${className}`}>
      {hasHeader && (
        <div className="px-6 py-4 border-b border-gostcam-border-light">
          <div className="flex gap-4">
            {Array.from({ length: columns }, (_, i) => (
              <Skeleton key={i} height="1.25rem" width="6rem" />
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gostcam-border-light">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex gap-4 items-center">
              {Array.from({ length: columns }, (_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  height="1rem" 
                  width={colIndex === 0 ? '8rem' : '6rem'} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== SKELETON PARA LISTA =====
interface SkeletonListProps {
  items?: number;
  hasAvatar?: boolean;
  hasActions?: boolean;
  className?: string;
}

export function SkeletonList({ 
  items = 3, 
  hasAvatar = false, 
  hasActions = false, 
  className = '' 
}: SkeletonListProps) {
  return (
    <div className={`bg-white rounded-xl border border-gostcam-border-light divide-y divide-gostcam-border-light ${className}`}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="px-6 py-4">
          <div className="flex items-center gap-4">
            {hasAvatar && (
              <Skeleton width="3rem" height="3rem" rounded="full" />
            )}
            
            <div className="flex-1 space-y-2">
              <Skeleton height="1.25rem" width="60%" />
              <Skeleton height="1rem" width="40%" />
            </div>

            {hasActions && (
              <div className="flex gap-2">
                <Skeleton width="2rem" height="2rem" rounded="md" />
                <Skeleton width="2rem" height="2rem" rounded="md" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== SKELETON PARA ESTADÍSTICAS =====
interface SkeletonStatsProps {
  items?: number;
  className?: string;
}

export function SkeletonStats({ items = 4, className = '' }: SkeletonStatsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gostcam-border-light p-6">
          <div className="flex items-center gap-4">
            <Skeleton width="3rem" height="3rem" rounded="lg" />
            <div className="flex-1 space-y-2">
              <Skeleton height="1rem" width="70%" />
              <Skeleton height="2rem" width="50%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== SKELETON PARA DASHBOARD =====
export function SkeletonDashboard({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="space-y-4">
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="1rem" width="60%" />
      </div>

      {/* Stats */}
      <SkeletonStats />

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gostcam-border-light p-6">
        <div className="space-y-4">
          <Skeleton height="1.5rem" width="30%" />
          <Skeleton height="20rem" className="w-full" />
        </div>
      </div>

      {/* Table or List */}
      <SkeletonTable />
    </div>
  );
}

// ===== SKELETON PARA FORMULARIO =====
interface SkeletonFormProps {
  fields?: number;
  hasTitle?: boolean;
  hasActions?: boolean;
  className?: string;
}

export function SkeletonForm({ 
  fields = 5, 
  hasTitle = true, 
  hasActions = true, 
  className = '' 
}: SkeletonFormProps) {
  return (
    <div className={`bg-white rounded-xl border border-gostcam-border-light p-6 space-y-6 ${className}`}>
      {hasTitle && (
        <div className="space-y-2 pb-4 border-b border-gostcam-border-light">
          <Skeleton height="2rem" width="40%" />
          <Skeleton height="1rem" width="70%" />
        </div>
      )}

      <div className="space-y-6">
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton height="1.25rem" width="6rem" />
            <Skeleton height="3rem" className="w-full" />
          </div>
        ))}
      </div>

      {hasActions && (
        <div className="pt-4 border-t border-gostcam-border-light flex gap-3">
          <Skeleton height="2.75rem" width="6rem" />
          <Skeleton height="2.75rem" width="5rem" />
        </div>
      )}
    </div>
  );
}

// ===== COMPONENTE PAGE SKELETON =====
interface PageSkeletonProps {
  type: 'dashboard' | 'table' | 'form' | 'list' | 'cards';
  className?: string;
}

export function PageSkeleton({ type, className = '' }: PageSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return <SkeletonDashboard />;
      case 'table':
        return <SkeletonTable rows={8} columns={5} />;
      case 'form':
        return <SkeletonForm />;
      case 'list':
        return <SkeletonList items={6} hasAvatar hasActions />;
      case 'cards':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard key={i} hasImage hasActions />
            ))}
          </div>
        );
      default:
        return <SkeletonDashboard />;
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {renderSkeleton()}
    </div>
  );
}