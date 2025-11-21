import React, { useState, useCallback, CSSProperties } from 'react';
import { useLazyImage } from '@/hooks/usePerformance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkMyMC40MTgzIDE2IDI0IDE5LjU4MTcgMjQgMjRDMjQgMjguNDE4MyAyMC40MTgzIDMyIDE2IDMyQzExLjU4MTcgMzIgOCAyOC40MTgzIDggMjRDOCAxOS41ODE3IDExLjU4MTcgMTYgMTYgMTZaIiBmaWxsPSIjOUI5QkEzIi8+Cjwvc3ZnPgo=',
  fallback,
  className = '',
  style,
  width,
  height,
  loading = 'lazy',
  priority = false,
  sizes,
  quality = 75,
  onLoad,
  onError,
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Solo usar lazy loading si no es prioritario y loading es lazy
  const shouldUseLazyLoading = !priority && loading === 'lazy';
  
  const { 
    elementRef, 
    imageSrc, 
    isLoading, 
    error 
  } = useLazyImage(
    shouldUseLazyLoading ? src : '',
    placeholder
  );

  // Para imágenes prioritarias, usar src directamente
  const finalSrc = priority || loading === 'eager' ? src : imageSrc;

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.(error || 'Error al cargar la imagen');
  }, [error, onError]);

  // Función para generar srcSet optimizado
  const generateSrcSet = (baseSrc: string) => {
    if (!baseSrc || hasError) return undefined;
    
    // Generar diferentes resoluciones para responsive images
    const breakpoints = [480, 768, 1024, 1280, 1920];
    return breakpoints
      .map(bp => `${baseSrc}?w=${bp}&q=${quality} ${bp}w`)
      .join(', ');
  };

  // Estilos para el placeholder/loading
  const placeholderStyle: CSSProperties = {
    backgroundColor: '#f3f4f6',
    backgroundImage: `url(${placeholder})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width || '100%',
    height: height || 'auto',
    minHeight: height ? `${height}px` : '120px',
    ...style,
  };

  // Mostrar fallback si hay error
  if (hasError && fallback) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={placeholderStyle}
        aria-label={`Error cargando imagen: ${alt}`}
      >
        <img 
          src={fallback} 
          alt={alt}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  // Mostrar error placeholder si no hay fallback
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center text-gray-500 ${className}`}
        style={placeholderStyle}
        aria-label={`Error cargando imagen: ${alt}`}
        role="img"
      >
        <div className="text-center p-4">
          <i className="fas fa-image-slash text-2xl mb-2 block" aria-hidden="true"></i>
          <span className="text-sm">Error al cargar imagen</span>
        </div>
      </div>
    );
  }

  // Mostrar placeholder mientras carga
  if (shouldUseLazyLoading && (isLoading || !finalSrc)) {
    return (
      <div 
        ref={elementRef as React.RefObject<HTMLDivElement>}
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={placeholderStyle}
        aria-label={`Cargando imagen: ${alt}`}
        role="img"
      >
        {isLoading && finalSrc && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <span className="text-xs text-gray-500">Cargando...</span>
          </div>
        )}
      </div>
    );
  }

  // Renderizar imagen optimizada
  return (
    <img
      ref={shouldUseLazyLoading ? elementRef as React.RefObject<HTMLImageElement> : undefined}
      src={finalSrc}
      srcSet={generateSrcSet(finalSrc)}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      decoding="async"
      // Atributos de performance
      fetchPriority={priority ? 'high' : 'auto'}
      // Accesibilidad
      role="img"
      aria-describedby={alt ? undefined : 'image-description'}
    />
  );
};

// Componente de avatar optimizado
export const OptimizedAvatar: React.FC<{
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackInitials?: string;
  className?: string;
}> = ({ 
  src, 
  alt, 
  size = 'md', 
  fallbackInitials,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const fallbackContent = fallbackInitials || alt.split(' ').map(n => n[0]).join('').substring(0, 2);

  if (!src) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-gray-300 rounded-full flex items-center justify-center font-medium text-gray-600 ${className}`}
        aria-label={alt}
        role="img"
      >
        {fallbackContent}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      loading="lazy"
      fallback={`data:image/svg+xml;base64,${btoa(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" fill="#E5E7EB" rx="20"/>
          <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#6B7280" font-family="system-ui" font-size="14">${fallbackContent}</text>
        </svg>
      `)}`}
    />
  );
};

// Componente de imagen con zoom lazy
export const ZoomableImage: React.FC<OptimizedImageProps & {
  zoomSrc?: string;
  enableZoom?: boolean;
}> = ({ 
  zoomSrc, 
  enableZoom = true, 
  ...props 
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomClick = () => {
    if (enableZoom) {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <>
      <div 
        className={`relative ${enableZoom ? 'cursor-zoom-in' : ''}`}
        onClick={handleZoomClick}
      >
        <OptimizedImage {...props} />
        {enableZoom && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <i className="fas fa-search-plus text-white text-xl drop-shadow-lg"></i>
          </div>
        )}
      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-full max-h-full">
            <OptimizedImage
              src={zoomSrc || props.src}
              alt={props.alt}
              className="max-w-full max-h-full object-contain"
              priority={true}
              loading="eager"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
              onClick={() => setIsZoomed(false)}
              aria-label="Cerrar vista ampliada"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OptimizedImage;