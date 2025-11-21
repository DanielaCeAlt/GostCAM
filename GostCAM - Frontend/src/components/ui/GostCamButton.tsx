import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { useHapticFeedback } from '@/utils/hapticFeedback';

interface GostCamButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';
  touchFriendly?: boolean;
  loadingText?: string;
  children: ReactNode;
}

const GostCamButton = forwardRef<HTMLButtonElement, GostCamButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      hapticFeedback = 'light',
      touchFriendly = true,
      loadingText = 'Procesando...',
      className = '',
      onClick,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const { buttonPress } = useHapticFeedback();

    // ===== VARIANTES CON COLORES GOSTCAM =====
    const variantClasses = {
      primary: [
        'bg-gostcam-primary hover:bg-gostcam-primary-hover active:bg-gostcam-primary-active',
        'text-white font-semibold',
        'shadow-sm hover:shadow-md transition-shadow',
        'focus:ring-2 focus:ring-gostcam-primary focus:ring-offset-2'
      ].join(' '),
      
      secondary: [
        'bg-gostcam-secondary hover:bg-gostcam-secondary-hover active:bg-gostcam-secondary-active',
        'text-white font-semibold',
        'shadow-sm hover:shadow-md transition-shadow',
        'focus:ring-2 focus:ring-gostcam-secondary focus:ring-offset-2'
      ].join(' '),
      
      success: [
        'bg-gostcam-success hover:bg-gostcam-success-dark',
        'text-white font-medium',
        'shadow-sm hover:shadow-md',
        'focus:ring-2 focus:ring-gostcam-success focus:ring-offset-2'
      ].join(' '),
      
      warning: [
        'bg-gostcam-warning hover:bg-gostcam-warning-dark',
        'text-white font-medium',
        'shadow-sm hover:shadow-md',
        'focus:ring-2 focus:ring-gostcam-warning focus:ring-offset-2'
      ].join(' '),
      
      danger: [
        'bg-gostcam-danger hover:bg-gostcam-danger-dark',
        'text-white font-medium',
        'shadow-sm hover:shadow-md',
        'focus:ring-2 focus:ring-gostcam-danger focus:ring-offset-2'
      ].join(' '),
      
      ghost: [
        'bg-transparent hover:bg-gostcam-gray-100 active:bg-gostcam-gray-200',
        'text-gostcam-text-primary font-medium',
        'focus:ring-2 focus:ring-gostcam-primary focus:ring-offset-2'
      ].join(' '),
      
      outline: [
        'border-2 border-gostcam-primary bg-transparent',
        'hover:bg-gostcam-primary active:bg-gostcam-primary-hover',
        'text-gostcam-primary hover:text-white',
        'font-medium transition-all duration-200',
        'focus:ring-2 focus:ring-gostcam-primary focus:ring-offset-2'
      ].join(' ')
    };

    // ===== TAMAÑOS OPTIMIZADOS PARA TOUCH =====
    const sizeClasses = {
      sm: touchFriendly 
        ? 'min-h-[44px] min-w-[44px] px-4 py-3 text-sm gap-2' 
        : 'h-9 px-3 py-2 text-sm gap-1.5',
      md: touchFriendly 
        ? 'min-h-[48px] min-w-[48px] px-6 py-3.5 text-base gap-2.5' 
        : 'h-10 px-4 py-2 text-base gap-2',
      lg: touchFriendly 
        ? 'min-h-[52px] min-w-[52px] px-8 py-4 text-lg gap-3' 
        : 'h-12 px-6 py-3 text-lg gap-2.5',
      xl: touchFriendly 
        ? 'min-h-[56px] min-w-[56px] px-10 py-5 text-xl gap-3.5' 
        : 'h-14 px-8 py-4 text-xl gap-3'
    };

    // ===== CLASES BASE MEJORADAS =====
    const baseClasses = [
      'relative inline-flex items-center justify-center',
      'font-medium rounded-xl', // Bordes más suaves
      'transition-all duration-200 ease-in-out',
      'focus:outline-none',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      'disabled:transform-none', // Prevenir animaciones cuando disabled
      'select-none touch-manipulation',
      // Animación de feedback mejorada
      'active:scale-[0.97] transform',
      // Mejora visual
      'relative overflow-hidden',
    ].join(' ');

    const combinedClassName = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    ].join(' ');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      // Feedback háptico
      if (hapticFeedback !== 'none') {
        buttonPress(hapticFeedback);
      }

      // Ejecutar callback
      if (onClick) {
        onClick(event);
      }
    };

    const renderLoadingSpinner = () => (
      <div className="flex items-center justify-center">
        <svg
          className="animate-spin h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>{loadingText}</span>
      </div>
    );

    const renderContent = () => {
      if (isLoading) {
        return renderLoadingSpinner();
      }

      return (
        <>
          {leftIcon && (
            <span className="flex-shrink-0 flex items-center">
              {leftIcon}
            </span>
          )}
          <span className={`flex-1 truncate ${leftIcon || rightIcon ? 'text-center' : ''}`}>
            {children}
          </span>
          {rightIcon && (
            <span className="flex-shrink-0 flex items-center">
              {rightIcon}
            </span>
          )}
        </>
      );
    };

    return (
      <button
        ref={ref}
        className={combinedClassName}
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-label={isLoading ? loadingText : undefined}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

GostCamButton.displayName = 'GostCamButton';

// ===== BOTÓN DE ÍCONO ESPECIALIZADO =====
export const GostCamIconButton = forwardRef<
  HTMLButtonElement,
  Omit<GostCamButtonProps, 'children'> & { 
    icon: ReactNode; 
    ariaLabel: string;
    tooltip?: string;
  }
>(({ icon, ariaLabel, tooltip, size = 'md', variant = 'ghost', ...props }, ref) => {
  const squareClasses = {
    sm: 'min-h-[44px] min-w-[44px] w-11 h-11',
    md: 'min-h-[48px] min-w-[48px] w-12 h-12',
    lg: 'min-h-[52px] min-w-[52px] w-14 h-14',
    xl: 'min-h-[56px] min-w-[56px] w-16 h-16'
  };

  return (
    <GostCamButton
      ref={ref}
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
      className={`${squareClasses[size]} p-0`}
      {...props}
    >
      {icon}
    </GostCamButton>
  );
});

GostCamIconButton.displayName = 'GostCamIconButton';

export default GostCamButton;