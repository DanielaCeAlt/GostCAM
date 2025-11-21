// ===== SISTEMA DE MENSAJES GOSTCAM =====

export const MESSAGES = {
  // ===== TEXTOS DE CARGA =====
  loading: {
    dashboard: 'Preparando tu panel de control...',
    equipos: 'Cargando equipos de seguridad...',
    sucursales: 'Actualizando información de sucursales...',
    statistics: 'Calculando estadísticas en tiempo real...',
    login: 'Verificando credenciales...',
    search: 'Buscando en tu red de seguridad...',
    upload: 'Subiendo información...',
    delete: 'Procesando solicitud...',
    export: 'Generando reporte...'
  },

  // ===== MENSAJES DE ÉXITO =====
  success: {
    login: '¡Bienvenido a GostCAM! 📹',
    equipoCreated: 'Equipo registrado correctamente en tu red',
    equipoUpdated: 'Información del equipo actualizada',
    equipoDeleted: 'Equipo removido de tu sistema',
    traslado: 'Equipo trasladado exitosamente',
    mantenimiento: 'Mantenimiento programado correctamente',
    export: 'Reporte generado y descargado',
    settings: 'Configuración guardada'
  },

  // ===== MENSAJES DE ERROR (EMPÁTICOS) =====
  error: {
    connection: 'Hmm, parece que hay un problema de conexión. Verificando...',
    login: 'Credenciales incorrectas. ¿Necesitas ayuda?',
    notFound: 'No encontramos ese equipo. ¿Quizás lo buscas con otro nombre?',
    server: 'Nuestros servidores están ocupados. Intenta en un momento',
    permission: 'No tienes permisos para esta acción. Contacta a tu administrador',
    validation: 'Algunos campos necesitan tu atención',
    upload: 'Error al subir archivo. Verifica el formato',
    timeout: 'La operación está tomando más tiempo del esperado'
  },

  // ===== CONFIRMACIONES =====
  confirm: {
    delete: '¿Estás seguro de eliminar este equipo de tu red?',
    deleteMultiple: '¿Eliminar {count} equipos seleccionados?',
    logout: '¿Cerrar sesión en GostCAM?',
    reset: '¿Restaurar configuración por defecto?',
    transfer: '¿Trasladar este equipo a otra ubicación?'
  },

  // ===== ESTADOS DE EQUIPOS =====
  equipmentStatus: {
    connected: 'Conectado y funcionando',
    disconnected: 'Sin conexión - Verificar red',
    error: 'Requiere atención técnica',
    maintenance: 'En mantenimiento programado',
    installing: 'Instalándose...'
  },

  // ===== PLACEHOLDERS ÚTILES =====
  placeholders: {
    search: 'Buscar por nombre, número de serie o ubicación...',
    email: 'usuario@empresa.com',
    password: 'Tu contraseña segura',
    equipName: 'Ej: Cámara Principal Entrada',
    location: 'Ej: Recepción - Planta Baja'
  },

  // ===== TEXTOS DE BOTONES =====
  buttons: {
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    save: 'Guardar Cambios',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver Detalles',
    add: 'Agregar Equipo',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar Datos',
    transfer: 'Trasladar',
    maintenance: 'Mantenimiento',
    retry: 'Reintentar',
    continue: 'Continuar',
    back: 'Regresar'
  },

  // ===== TÍTULOS Y SECCIONES =====
  titles: {
    dashboard: 'Panel de Control',
    equipments: 'Mis Equipos',
    branches: 'Red de Sucursales',
    settings: 'Configuración',
    profile: 'Mi Perfil',
    reports: 'Reportes y Análisis'
  },

  // ===== ESTADOS VACÍOS =====
  empty: {
    equipos: '¡Tu primera red de seguridad te está esperando!',
    search: 'No encontramos equipos con esos criterios',
    sucursales: 'Agrega tu primera sucursal para comenzar',
    notifications: 'Todo tranquilo por aquí 😊'
  },

  // ===== TOOLTIPS ÚTILES =====
  tooltips: {
    refresh: 'Actualizar información',
    filter: 'Filtrar equipos',
    sort: 'Ordenar lista',
    view: 'Cambiar vista',
    help: 'Ayuda y soporte',
    settings: 'Configuración',
    notifications: 'Notificaciones'
  }
};

// ===== UTILIDADES PARA MENSAJES DINÁMICOS =====
export const formatMessage = (template: string, params: Record<string, any>) => {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
};

export const getStatusMessage = (status: string): string => {
  return MESSAGES.equipmentStatus[status as keyof typeof MESSAGES.equipmentStatus] || status;
};

export const getLoadingMessage = (context: string): string => {
  return MESSAGES.loading[context as keyof typeof MESSAGES.loading] || 'Cargando...';
};