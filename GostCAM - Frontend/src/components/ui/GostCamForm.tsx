import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

// ===== INPUT FIELD MEJORADO =====
interface GostCamInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
}

export const GostCamInput = forwardRef<HTMLInputElement, GostCamInputProps>(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      isLoading,
      variant = 'default',
      inputSize = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2)}`;

    const variantClasses = {
      default: 'bg-gostcam-gray-50 border border-gostcam-border-light focus:border-gostcam-primary',
      filled: 'bg-gostcam-gray-100 border-0 focus:bg-white focus:ring-1 focus:ring-gostcam-primary',
      outline: 'bg-transparent border-2 border-gostcam-border-medium focus:border-gostcam-primary'
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    };

    const baseClasses = [
      'w-full rounded-xl transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-gostcam-primary focus:ring-offset-2',
      'placeholder-gostcam-text-muted text-gostcam-text-primary',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      error ? 'border-gostcam-danger focus:border-gostcam-danger focus:ring-gostcam-danger' : '',
      variantClasses[variant],
      sizeClasses[inputSize],
      leftIcon ? 'pl-10' : '',
      rightIcon || isLoading ? 'pr-10' : '',
      className
    ].join(' ');

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gostcam-text-primary"
          >
            {label}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gostcam-text-muted">
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={baseClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
            }
            {...props}
          />

          {/* Right icon or loading */}
          {(rightIcon || isLoading) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gostcam-primary" />
              ) : (
                <span className="text-gostcam-text-muted">
                  {rightIcon}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p 
            id={`${inputId}-error`} 
            className="text-sm text-gostcam-danger flex items-center gap-1"
            role="alert"
          >
            <i className="fas fa-exclamation-circle" />
            {error}
          </p>
        )}

        {/* Help text */}
        {helpText && !error && (
          <p 
            id={`${inputId}-help`} 
            className="text-sm text-gostcam-text-secondary"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

GostCamInput.displayName = 'GostCamInput';

// ===== TEXTAREA MEJORADO =====
interface GostCamTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const GostCamTextarea = forwardRef<HTMLTextAreaElement, GostCamTextareaProps>(
  (
    {
      label,
      error,
      helpText,
      resize = 'vertical',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2)}`;

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const baseClasses = [
      'w-full px-4 py-3 rounded-xl transition-all duration-200',
      'bg-gostcam-gray-50 border border-gostcam-border-light',
      'focus:outline-none focus:ring-2 focus:ring-gostcam-primary focus:ring-offset-2 focus:border-gostcam-primary',
      'placeholder-gostcam-text-muted text-gostcam-text-primary',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      error ? 'border-gostcam-danger focus:border-gostcam-danger focus:ring-gostcam-danger' : '',
      resizeClasses[resize],
      className
    ].join(' ');

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={textareaId} 
            className="block text-sm font-medium text-gostcam-text-primary"
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          className={baseClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helpText ? `${textareaId}-help` : undefined
          }
          {...props}
        />

        {/* Error message */}
        {error && (
          <p 
            id={`${textareaId}-error`} 
            className="text-sm text-gostcam-danger flex items-center gap-1"
            role="alert"
          >
            <i className="fas fa-exclamation-circle" />
            {error}
          </p>
        )}

        {/* Help text */}
        {helpText && !error && (
          <p 
            id={`${textareaId}-help`} 
            className="text-sm text-gostcam-text-secondary"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

GostCamTextarea.displayName = 'GostCamTextarea';

// ===== SELECT MEJORADO =====
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface GostCamSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const GostCamSelect = forwardRef<HTMLSelectElement, GostCamSelectProps>(
  (
    {
      label,
      error,
      helpText,
      options,
      placeholder,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2)}`;

    const baseClasses = [
      'w-full px-4 py-3 pr-10 rounded-xl transition-all duration-200',
      'bg-gostcam-gray-50 border border-gostcam-border-light',
      'focus:outline-none focus:ring-2 focus:ring-gostcam-primary focus:ring-offset-2 focus:border-gostcam-primary',
      'text-gostcam-text-primary appearance-none',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      error ? 'border-gostcam-danger focus:border-gostcam-danger focus:ring-gostcam-danger' : '',
      className
    ].join(' ');

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium text-gostcam-text-primary"
          >
            {label}
          </label>
        )}

        {/* Select container */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={baseClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${selectId}-error` : helpText ? `${selectId}-help` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Arrow icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className="fas fa-chevron-down text-gostcam-text-muted" />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p 
            id={`${selectId}-error`} 
            className="text-sm text-gostcam-danger flex items-center gap-1"
            role="alert"
          >
            <i className="fas fa-exclamation-circle" />
            {error}
          </p>
        )}

        {/* Help text */}
        {helpText && !error && (
          <p 
            id={`${selectId}-help`} 
            className="text-sm text-gostcam-text-secondary"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

GostCamSelect.displayName = 'GostCamSelect';

// ===== FORM CONTAINER =====
interface GostCamFormProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  actions?: ReactNode;
}

export function GostCamForm({ 
  children, 
  title, 
  subtitle, 
  onSubmit, 
  className = '', 
  actions 
}: GostCamFormProps) {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="space-y-2 pb-4 border-b border-gostcam-border-light">
          {title && (
            <h2 className="text-2xl font-semibold text-gostcam-text-primary">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gostcam-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Form content */}
      <div className="space-y-6">
        {children}
      </div>

      {/* Actions */}
      {actions && (
        <div className="pt-4 border-t border-gostcam-border-light">
          {actions}
        </div>
      )}
    </form>
  );
}