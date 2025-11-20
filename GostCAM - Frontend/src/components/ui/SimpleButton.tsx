import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

interface SimpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const SimpleButton = forwardRef<HTMLButtonElement, SimpleButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      onClick,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm',
      secondary: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm',
      success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
      ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700',
      outline: 'border border-blue-600 bg-transparent hover:bg-blue-600 text-blue-600 hover:text-white'
    };

    const sizeClasses = {
      sm: 'min-h-[44px] min-w-[44px] px-3 py-2 text-sm',
      md: 'min-h-[48px] min-w-[48px] px-4 py-3 text-base',
      lg: 'min-h-[52px] min-w-[52px] px-6 py-3 text-lg',
      xl: 'min-h-[56px] min-w-[56px] px-8 py-4 text-xl'
    };

    const baseClasses = [
      'relative inline-flex items-center justify-center gap-2',
      'font-medium rounded-xl transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none touch-manipulation active:scale-[0.98] transform',
      variantClasses[variant],
      sizeClasses[size],
      className
    ].join(' ');

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      if (onClick) onClick(event);
    };

    return (
      <button
        ref={ref}
        className={baseClasses}
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="truncate">{isLoading ? 'Cargando...' : children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

SimpleButton.displayName = 'SimpleButton';

export default SimpleButton;