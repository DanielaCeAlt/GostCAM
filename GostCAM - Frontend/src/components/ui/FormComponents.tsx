'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Tipos base para componentes de formulario
interface BaseFieldProps {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  fieldClassName?: string;
}

interface InputProps extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showCounter?: boolean;
  maxLength?: number;
}

interface TextAreaProps extends BaseFieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'size'> {
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  autoResize?: boolean;
  showCounter?: boolean;
  maxLength?: number;
}

interface SelectProps extends BaseFieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'size'> {
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Input mejorado con iconos, variantes y validación visual
 */
export const FormInput = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  touched,
  required,
  helpText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  showCounter,
  maxLength,
  className,
  labelClassName,
  fieldClassName,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && error;
  const currentLength = String(props.value || '').length;

  const sizeClasses = {
    sm: 'text-sm px-3 py-2 min-h-[36px]',
    md: 'text-sm px-4 py-3 min-h-[44px]',
    lg: 'text-base px-4 py-4 min-h-[52px]'
  };

  const variantClasses = {
    default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
    outline: 'border-2 border-gray-200 bg-transparent focus:border-blue-500'
  };

  const inputClasses = cn(
    'w-full rounded-lg transition-all duration-200 placeholder:text-gray-500',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    fieldClassName
  );

  return (
    <div className={cn('space-y-1', className)}>
      {/* Label */}
      {label && (
        <label className={cn(
          'block text-sm font-medium text-gray-700',
          required && 'after:content-["*"] after:text-red-500 after:ml-1',
          labelClassName
        )}>
          {label}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          className={inputClasses}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          maxLength={maxLength}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={
            hasError ? `${props.id}-error` : 
            helpText ? `${props.id}-help` : undefined
          }
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}

        {/* Focus indicator */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-20 pointer-events-none" />
        )}
      </div>

      {/* Counter */}
      {showCounter && maxLength && (
        <div className="flex justify-end">
          <span className={cn(
            'text-xs',
            currentLength > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500',
            currentLength >= maxLength ? 'text-red-500' : ''
          )}>
            {currentLength}/{maxLength}
          </span>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div id={`${props.id}-error`} className="flex items-center space-x-1 text-red-600">
          <i className="fas fa-exclamation-circle text-xs" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Help text */}
      {helpText && !hasError && (
        <p id={`${props.id}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

/**
 * TextArea mejorado con auto-resize y contador
 */
export const FormTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  touched,
  required,
  helpText,
  variant = 'default',
  size = 'md',
  autoResize = false,
  showCounter,
  maxLength,
  className,
  labelClassName,
  fieldClassName,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && error;
  const currentLength = String(props.value || '').length;

  const sizeClasses = {
    sm: 'text-sm px-3 py-2 min-h-[80px]',
    md: 'text-sm px-4 py-3 min-h-[100px]',
    lg: 'text-base px-4 py-4 min-h-[120px]'
  };

  const variantClasses = {
    default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
    outline: 'border-2 border-gray-200 bg-transparent focus:border-blue-500'
  };

  const textareaClasses = cn(
    'w-full rounded-lg transition-all duration-200 placeholder:text-gray-500 resize-none',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    autoResize && 'resize-none overflow-hidden',
    fieldClassName
  );

  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && ref && 'current' in ref && ref.current) {
      const textarea = ref.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [props.value, autoResize, ref]);

  return (
    <div className={cn('space-y-1', className)}>
      {/* Label */}
      {label && (
        <label className={cn(
          'block text-sm font-medium text-gray-700',
          required && 'after:content-["*"] after:text-red-500 after:ml-1',
          labelClassName
        )}>
          {label}
        </label>
      )}

      {/* TextArea container */}
      <div className="relative">
        <textarea
          ref={ref}
          className={textareaClasses}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          maxLength={maxLength}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={
            hasError ? `${props.id}-error` : 
            helpText ? `${props.id}-help` : undefined
          }
          {...props}
        />

        {/* Focus indicator */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-20 pointer-events-none" />
        )}
      </div>

      {/* Counter */}
      {showCounter && maxLength && (
        <div className="flex justify-end">
          <span className={cn(
            'text-xs',
            currentLength > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500',
            currentLength >= maxLength ? 'text-red-500' : ''
          )}>
            {currentLength}/{maxLength}
          </span>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div id={`${props.id}-error`} className="flex items-center space-x-1 text-red-600">
          <i className="fas fa-exclamation-circle text-xs" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Help text */}
      {helpText && !hasError && (
        <p id={`${props.id}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
});

FormTextArea.displayName = 'FormTextArea';

/**
 * Select mejorado con mejor UX
 */
export const FormSelect = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  touched,
  required,
  helpText,
  options,
  placeholder,
  variant = 'default',
  size = 'md',
  className,
  labelClassName,
  fieldClassName,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && error;

  const sizeClasses = {
    sm: 'text-sm px-3 py-2 min-h-[36px]',
    md: 'text-sm px-4 py-3 min-h-[44px]',
    lg: 'text-base px-4 py-4 min-h-[52px]'
  };

  const variantClasses = {
    default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
    filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
    outline: 'border-2 border-gray-200 bg-transparent focus:border-blue-500'
  };

  const selectClasses = cn(
    'w-full rounded-lg transition-all duration-200 appearance-none cursor-pointer pr-10',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
    sizeClasses[size],
    variantClasses[variant],
    hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    fieldClassName
  );

  return (
    <div className={cn('space-y-1', className)}>
      {/* Label */}
      {label && (
        <label className={cn(
          'block text-sm font-medium text-gray-700',
          required && 'after:content-["*"] after:text-red-500 after:ml-1',
          labelClassName
        )}>
          {label}
        </label>
      )}

      {/* Select container */}
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={
            hasError ? `${props.id}-error` : 
            helpText ? `${props.id}-help` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <i className="fas fa-chevron-down text-gray-400 text-xs" />
        </div>

        {/* Focus indicator */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-20 pointer-events-none" />
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div id={`${props.id}-error`} className="flex items-center space-x-1 text-red-600">
          <i className="fas fa-exclamation-circle text-xs" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Help text */}
      {helpText && !hasError && (
        <p id={`${props.id}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

/**
 * Checkbox con mejor UX
 */
interface CheckboxProps extends BaseFieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'className' | 'size'> {
  size?: 'sm' | 'md' | 'lg';
}

export const FormCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  touched,
  required,
  helpText,
  size = 'md',
  className,
  labelClassName,
  fieldClassName,
  ...props
}, ref) => {
  const hasError = touched && error;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const checkboxClasses = cn(
    'rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    sizeClasses[size],
    hasError && 'border-red-500 focus:ring-red-500',
    fieldClassName
  );

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="checkbox"
          className={checkboxClasses}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={
            hasError ? `${props.id}-error` : 
            helpText ? `${props.id}-help` : undefined
          }
          {...props}
        />
        
        {label && (
          <div className="flex-1 min-w-0">
            <label className={cn(
              'text-sm text-gray-700 cursor-pointer select-none',
              required && 'after:content-["*"] after:text-red-500 after:ml-1',
              labelClassName
            )}>
              {label}
            </label>
            
            {/* Help text */}
            {helpText && !hasError && (
              <p id={`${props.id}-help`} className="text-sm text-gray-500 mt-1">
                {helpText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div id={`${props.id}-error`} className="flex items-center space-x-1 text-red-600 ml-8">
          <i className="fas fa-exclamation-circle text-xs" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
});

FormCheckbox.displayName = 'FormCheckbox';
