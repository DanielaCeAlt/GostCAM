import React, { ReactNode } from 'react';

interface GostCamLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

export default function GostCamLayout({
  children,
  title,
  subtitle,
  actions,
  className = '',
  padding = 'lg',
  maxWidth = 'none'
}: GostCamLayoutProps) {
  // ===== CONFIGURACIONES DE ESPACIADO =====
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  };

  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  };

  const containerClasses = [
    'mx-auto',
    maxWidthClasses[maxWidth],
    paddingClasses[padding],
    className
  ].join(' ');

  return (
    <div className={containerClasses}>
      {/* ===== HEADER SECTION ===== */}
      {(title || subtitle || actions) && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Título y subtítulo */}
            {(title || subtitle) && (
              <div className="space-y-2">
                {title && (
                  <h1 className="text-3xl font-bold text-gostcam-text-primary tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-lg text-gostcam-text-secondary max-w-2xl">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            
            {/* Acciones */}
            {actions && (
              <div className="flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
}

// ===== SECCIÓN CON ESPACIADO CONSISTENTE =====
interface GostCamSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  background?: boolean;
}

export function GostCamSection({
  title,
  description,
  children,
  className = '',
  spacing = 'md',
  background = false
}: GostCamSectionProps) {
  const spacingClasses = {
    none: 'space-y-0',
    sm: 'space-y-4',
    md: 'space-y-6', 
    lg: 'space-y-8'
  };

  const sectionClasses = [
    spacingClasses[spacing],
    background ? 'bg-white rounded-2xl border border-gostcam-border-light p-6 shadow-sm' : '',
    className
  ].join(' ');

  return (
    <section className={sectionClasses}>
      {/* Header de la sección */}
      {(title || description) && (
        <div className="space-y-2 pb-4 border-b border-gostcam-border-light">
          {title && (
            <h2 className="text-xl font-semibold text-gostcam-text-primary">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gostcam-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Contenido de la sección */}
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

// ===== GRID RESPONSIVO PARA TARJETAS =====
interface GostCamGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function GostCamGrid({
  children,
  columns = 3,
  gap = 'lg',
  className = ''
}: GostCamGridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8', 
    xl: 'gap-12'
  };

  const gridClasses = [
    'grid',
    columnClasses[columns],
    gapClasses[gap],
    className
  ].join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// ===== TARJETA ESTÁNDAR =====
interface GostCamCardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function GostCamCard({
  children,
  padding = 'md',
  shadow = 'sm',
  hover = false,
  className = '',
  onClick
}: GostCamCardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const cardClasses = [
    'bg-white rounded-2xl border border-gostcam-border-light',
    paddingClasses[padding],
    shadowClasses[shadow],
    hover ? 'hover:shadow-lg hover:border-gostcam-border-medium transition-all duration-200 cursor-pointer' : '',
    onClick ? 'cursor-pointer' : '',
    className
  ].join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}