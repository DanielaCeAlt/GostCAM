import React, { useState } from 'react';
import GostCamButton from '@/components/ui/GostCamButton';
import { MESSAGES } from '@/lib/messages';

interface LoginScreenImprovedProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export default function LoginScreenImproved({
  onLogin,
  isLoading = false,
  error
}: LoginScreenImprovedProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;
    
    try {
      await onLogin(email, password);
    } catch (err) {
      // Error handling se hace en el componente padre
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gostcam-primary via-blue-700 to-gostcam-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* ===== ELEMENTOS DECORATIVOS ===== */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gostcam-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* ===== CONTENEDOR PRINCIPAL ===== */}
      <div className="relative z-10 w-full max-w-md">
        {/* ===== HEADER CON BRANDING ===== */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <i className="fas fa-video text-3xl text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            GostCAM
          </h1>
          
          <p className="text-blue-100 text-lg font-medium">
            Sistema de Gestión de Seguridad
          </p>
          
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-white/50 to-transparent mx-auto rounded-full" />
        </div>

        {/* ===== FORMULARIO ===== */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título del formulario */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gostcam-text-primary mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gostcam-text-secondary">
                Accede a tu panel de control
              </p>
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gostcam-text-primary">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gostcam-text-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={MESSAGES.placeholders.email}
                  className="w-full pl-11 pr-4 py-4 bg-gostcam-gray-50 border border-gostcam-border-light rounded-xl focus:ring-2 focus:ring-gostcam-primary focus:border-gostcam-primary transition-all duration-200 text-gostcam-text-primary placeholder-gostcam-text-muted"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gostcam-text-primary">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gostcam-text-muted" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={MESSAGES.placeholders.password}
                  className="w-full pl-11 pr-12 py-4 bg-gostcam-gray-50 border border-gostcam-border-light rounded-xl focus:ring-2 focus:ring-gostcam-primary focus:border-gostcam-primary transition-all duration-200 text-gostcam-text-primary placeholder-gostcam-text-muted"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gostcam-text-muted hover:text-gostcam-text-secondary transition-colors"
                  disabled={isLoading}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-gostcam-danger-light border border-gostcam-danger/20 rounded-xl p-4 flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-gostcam-danger" />
                <p className="text-sm text-gostcam-danger font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-gostcam-primary focus:ring-gostcam-primary border-gostcam-border-medium rounded transition-colors"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-3 text-sm text-gostcam-text-secondary">
                Recordar sesión
              </label>
            </div>

            {/* Botón de Login */}
            <GostCamButton
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              loadingText={MESSAGES.loading.login}
              disabled={!isFormValid || isLoading}
              className="w-full"
              hapticFeedback="medium"
            >
              {MESSAGES.buttons.login}
            </GostCamButton>

            {/* Enlaces de ayuda */}
            <div className="text-center space-y-3 pt-4">
              <button
                type="button"
                className="text-sm text-gostcam-primary hover:text-gostcam-primary-hover font-medium transition-colors"
                disabled={isLoading}
              >
                ¿Olvidaste tu contraseña?
              </button>
              
              <div className="text-xs text-gostcam-text-muted">
                ¿Necesitas ayuda?{' '}
                <button
                  type="button"
                  className="text-gostcam-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  Contacta soporte
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="text-center mt-8">
          <p className="text-blue-100/80 text-sm">
            © 2024 GostCAM. Protegiendo lo que más importa.
          </p>
        </div>
      </div>
    </div>
  );
}