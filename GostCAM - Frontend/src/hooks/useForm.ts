'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDebounce } from './usePerformance';

// Tipos para validaciones
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  dependencies?: string[]; // Campos de los que depende esta validación
}

export interface FormField {
  value: any;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  rules: ValidationRule;
}

export interface FormState {
  [key: string]: FormField;
}

export interface UseFormOptions {
  initialValues: Record<string, any>;
  validationRules: Record<string, ValidationRule>;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onAutoSave?: (values: Record<string, any>) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
}

/**
 * Hook principal para manejo avanzado de formularios
 * Incluye validación en tiempo real, auto-save, dependencias entre campos
 */
export function useForm({
  initialValues,
  validationRules,
  autoSave = false,
  autoSaveDelay = 2000,
  onAutoSave,
  validateOnChange = true,
  validateOnBlur = true,
  resetOnSubmit = false
}: UseFormOptions) {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        dirty: false,
        rules: validationRules[key] || {}
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const lastSavedRef = useRef<Record<string, any>>(initialValues);

  // Valores actuales del formulario
  const values = useMemo(() => {
    const vals: Record<string, any> = {};
    Object.keys(formState).forEach(key => {
      vals[key] = formState[key].value;
    });
    return vals;
  }, [formState]);

  // Auto-save con debounce
  const debouncedValues = useDebounce(values, autoSaveDelay);
  
  useEffect(() => {
    if (autoSave && onAutoSave && debouncedValues !== lastSavedRef.current) {
      const hasChanges = Object.keys(debouncedValues).some(
        key => debouncedValues[key] !== lastSavedRef.current[key]
      );
      
      if (hasChanges && Object.keys(debouncedValues).some(key => formState[key]?.dirty)) {
        onAutoSave(debouncedValues);
        lastSavedRef.current = { ...debouncedValues };
      }
    }
  }, [debouncedValues, autoSave, onAutoSave, formState]);

  // Validar un campo individual
  const validateField = useCallback((fieldName: string, value: any, allValues: Record<string, any>) => {
    const field = formState[fieldName];
    if (!field) return null;

    const { rules } = field;

    // Required validation
    if (rules.required && (value === '' || value == null)) {
      return 'Este campo es obligatorio';
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Mínimo ${rules.minLength} caracteres`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Máximo ${rules.maxLength} caracteres`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Formato inválido';
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return null;
  }, [formState]);

  // Validar campos con dependencias
  const validateWithDependencies = useCallback((fieldName: string, allValues: Record<string, any>) => {
    const field = formState[fieldName];
    if (!field) return null;

    // Validar el campo principal
    let error = validateField(fieldName, allValues[fieldName], allValues);

    // Validar dependencias
    if (field.rules.dependencies) {
      field.rules.dependencies.forEach(depField => {
        const depError = validateField(depField, allValues[depField], allValues);
        if (depError && !error) {
          // Si hay error en dependencia, puede afectar este campo
          error = `Dependiente de ${depField}`;
        }
      });
    }

    return error;
  }, [formState, validateField]);

  // Establecer valor de campo
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setFormState(prev => {
      const newState = { ...prev };
      const field = newState[fieldName];
      
      if (field) {
        const wasChanged = field.value !== value;
        field.value = value;
        field.dirty = field.dirty || wasChanged;
        
        // Validar en tiempo real si está habilitado
        if (validateOnChange && field.touched) {
          field.error = validateWithDependencies(fieldName, { ...values, [fieldName]: value });
        }
      }

      return newState;
    });
  }, [validateOnChange, validateWithDependencies, values]);

  // Marcar campo como tocado
  const setFieldTouched = useCallback((fieldName: string, touched = true) => {
    setFormState(prev => {
      const newState = { ...prev };
      const field = newState[fieldName];
      
      if (field) {
        field.touched = touched;
        
        // Validar al perder foco si está habilitado
        if (validateOnBlur && touched) {
          field.error = validateWithDependencies(fieldName, values);
        }
      }

      return newState;
    });
  }, [validateOnBlur, validateWithDependencies, values]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formState).forEach(fieldName => {
      const error = validateWithDependencies(fieldName, values);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    });

    // Actualizar errores en el estado
    setFormState(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(fieldName => {
        newState[fieldName].error = errors[fieldName] || null;
        newState[fieldName].touched = true;
      });
      return newState;
    });

    return { isValid, errors };
  }, [formState, validateWithDependencies, values]);

  // Reset del formulario
  const resetForm = useCallback((newValues?: Record<string, any>) => {
    const resetValues = newValues || initialValues;
    setFormState(prev => {
      const newState: FormState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = {
          value: resetValues[key] ?? '',
          error: null,
          touched: false,
          dirty: false,
          rules: prev[key].rules
        };
      });
      return newState;
    });
    lastSavedRef.current = resetValues;
  }, [initialValues]);

  // Submit del formulario
  const handleSubmit = useCallback((onSubmit: (values: Record<string, any>) => void | Promise<void>) => {
    return async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }

      setIsSubmitting(true);
      setSubmitCount(prev => prev + 1);

      try {
        const { isValid } = validateForm();
        
        if (isValid) {
          await onSubmit(values);
          
          if (resetOnSubmit) {
            resetForm();
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [validateForm, values, resetOnSubmit, resetForm]);

  // Estado derivado
  const formStatus = useMemo(() => {
    const hasErrors = Object.values(formState).some(field => field.error);
    const isDirty = Object.values(formState).some(field => field.dirty);
    const isTouched = Object.values(formState).some(field => field.touched);
    
    return {
      isValid: !hasErrors,
      isDirty,
      isTouched,
      isSubmitting,
      submitCount,
      hasUnsavedChanges: autoSave ? isDirty && debouncedValues !== lastSavedRef.current : isDirty
    };
  }, [formState, isSubmitting, submitCount, autoSave, debouncedValues]);

  return {
    values,
    formState,
    formStatus,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    handleSubmit,
    
    // Helpers para campos individuales
    getFieldProps: (fieldName: string) => ({
      value: formState[fieldName]?.value ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFieldValue(fieldName, e.target.value);
      },
      onBlur: () => setFieldTouched(fieldName, true),
      error: formState[fieldName]?.error,
      touched: formState[fieldName]?.touched
    })
  };
}

/**
 * Hook para formularios multi-paso
 */
export function useMultiStepForm(steps: string[], initialStep = 0) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepData, setStepData] = useState<Record<number, Record<string, any>>>({});

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const updateStepData = useCallback((step: number, data: Record<string, any>) => {
    setStepData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  }, []);

  const getAllData = useCallback(() => {
    return Object.values(stepData).reduce((acc, data) => ({ ...acc, ...data }), {});
  }, [stepData]);

  return {
    currentStep,
    steps,
    completedSteps: Array.from(completedSteps),
    stepData,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    progress: ((currentStep + 1) / steps.length) * 100,
    nextStep,
    prevStep,
    goToStep,
    setStepData: updateStepData,
    getAllData
  };
}

/**
 * Hook para auto-save con indicadores visuales
 */
export function useAutoSave(
  data: any,
  saveFunction: (data: any) => Promise<void>,
  delay = 2000
) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debouncedData = useDebounce(data, delay);

  useEffect(() => {
    if (debouncedData && Object.keys(debouncedData).length > 0) {
      setSaveStatus('saving');
      
      saveFunction(debouncedData)
        .then(() => {
          setSaveStatus('saved');
          setLastSaved(new Date());
        })
        .catch(() => {
          setSaveStatus('error');
        });
    }
  }, [debouncedData, saveFunction]);

  return { saveStatus, lastSaved };
}