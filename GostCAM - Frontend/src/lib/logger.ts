// =============================================
// SISTEMA DE LOGGING PROFESIONAL
// =============================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = this.getLogPrefix(level);
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `${prefix} [${timestamp}] ${message}${contextStr}`;
  }

  private getLogPrefix(level: LogLevel): string {
    const prefixes = {
      debug: '🔍',
      info: '📝',
      warn: '⚠️',
      error: '❌'
    };
    return prefixes[level];
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && level === 'debug') return false;
    return true;
  }

  private sendToExternalService(level: LogLevel, message: string, context?: LogContext): void {
    if (this.isDevelopment || !this.isClient) return;
    
    // En producción, enviar a servicio de logging (ej: Sentry, LogRocket)
    // TODO: Implementar integración con servicio de logging
    try {
      // Example: Sentry.captureMessage(message, level as SeverityLevel);
    } catch (error) {
      // Evitar errores en el logging que rompan la app
    }
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return;
    const formatted = this.formatMessage('debug', message, context);
    if (this.isDevelopment) {
      console.debug(formatted);
    }
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return;
    const formatted = this.formatMessage('info', message, context);
    if (this.isDevelopment) {
      console.info(formatted);
    }
    this.sendToExternalService('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return;
    const formatted = this.formatMessage('warn', message, context);
    console.warn(formatted);
    this.sendToExternalService('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    };
    const formatted = this.formatMessage('error', message, errorContext);
    console.error(formatted);
    this.sendToExternalService('error', message, errorContext);
  }

  // Métodos específicos para el dominio de la aplicación
  apiRequest(method: string, url: string, status?: number): void {
    this.debug(`API ${method} ${url}`, { method, url, status });
  }

  apiError(method: string, url: string, error: Error, status?: number): void {
    this.error(`API ${method} ${url} failed`, error, { method, url, status });
  }

  userAction(action: string, userId?: string, details?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, { action, userId, ...details });
  }

  performance(operation: string, duration: number): void {
    if (duration > 1000) {
      this.warn(`Slow operation: ${operation} took ${duration}ms`, { operation, duration });
    } else {
      this.debug(`Performance: ${operation} took ${duration}ms`, { operation, duration });
    }
  }
}

// Instancia singleton
export const logger = new Logger();

// Hook para uso en componentes
export function useLogger() {
  return logger;
}