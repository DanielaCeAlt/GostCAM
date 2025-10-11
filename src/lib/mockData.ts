// Mock data based on the SQL structure
export const mockData = {
  usuarios: [
    { id: 1, nombre: 'Admin', nivel: 1, correo: 'admin@gostcam.com', contraseña: 'Pass123' },
    { id: 2, nombre: 'Admin Principal', nivel: 1, correo: 'admin1@gostcam.com', contraseña: 'password123' },
    { id: 3, nombre: 'Supervisor Centro', nivel: 2, correo: 'supervisor@gostcam.com', contraseña: 'password123' },
    { id: 4, nombre: 'Técnico Juan', nivel: 3, correo: 'tecnico@gostcam.com', contraseña: 'password123' },
    { id: 5, nombre: 'Técnico María', nivel: 3, correo: 'tecnico2@gostcam.com', contraseña: 'password123' },
    { id: 6, nombre: 'Usuario Carlos', nivel: 4, correo: 'usuario@gostcam.com', contraseña: 'password123' }
  ],
  
  estados: [
    { id: 1, nombre: 'Jalisco' },
    { id: 2, nombre: 'Nuevo León' },
    { id: 3, nombre: 'Oaxaca' },
    { id: 4, nombre: 'Ciudad de México' }
  ],
  
  municipios: [
    { id: 1, nombre: 'Guadalajara', idEstado: 1 },
    { id: 2, nombre: 'Monterrey', idEstado: 2 },
    { id: 3, nombre: 'Oaxaca de Juárez', idEstado: 3 },
    { id: 4, nombre: 'Miguel Hidalgo', idEstado: 4 }
  ],
  
  zonas: [
    { id: 1, nombre: 'Matriz' },
    { id: 2, nombre: 'OccidenteBajio' },
    { id: 3, nombre: 'PacificoSur' },
    { id: 4, nombre: 'OccidenteNorte' }
  ],
  
  sucursales: [
    { id: 'CENT', nombre: 'Sucursal Centro', zona: 1, zonaNombre: 'Matriz', estado: 1, estadoNombre: 'Jalisco', municipio: 1, municipioNombre: 'Guadalajara' },
    { id: 'NORT', nombre: 'Sucursal Norte', zona: 2, zonaNombre: 'OccidenteBajio', estado: 2, estadoNombre: 'Nuevo León', municipio: 2, municipioNombre: 'Monterrey' },
    { id: 'SUR', nombre: 'Sucursal Sur', zona: 3, zonaNombre: 'PacificoSur', estado: 3, estadoNombre: 'Oaxaca', municipio: 3, municipioNombre: 'Oaxaca de Juárez' },
    { id: 'ORI', nombre: 'Sucursal Oriente', zona: 4, zonaNombre: 'OccidenteNorte', estado: 4, estadoNombre: 'Ciudad de México', municipio: 4, municipioNombre: 'Miguel Hidalgo' }
  ],
  
  tiposEquipo: [
    { id: 1, nombre: 'Camara 360', descripcion: 'Cámara de 360 grados' },
    { id: 2, nombre: 'Camara Domo', descripcion: 'Cámara tipo domo' },
    { id: 3, nombre: 'Camara PTZ', descripcion: 'Cámara PTZ (Pan-Tilt-Zoom)' },
    { id: 4, nombre: 'NVR', descripcion: 'Network Video Recorder' },
    { id: 5, nombre: 'DVR', descripcion: 'Digital Video Recorder' },
    { id: 6, nombre: 'Switch', descripcion: 'Switch de red' },
    { id: 7, nombre: 'Disco Duro', descripcion: 'Disco duro para almacenamiento' },
    { id: 8, nombre: 'Transmisor', descripcion: 'Transmisor de señal' },
    { id: 9, nombre: 'OverHead', descripcion: 'Equipo overhead' },
    { id: 10, nombre: 'Sensor Movimiento', descripcion: 'Sensor de movimiento básico' },
    { id: 11, nombre: 'Sensor Movimiento 360', descripcion: 'Sensor de movimiento 360°' },
    { id: 12, nombre: 'Sensor Movimiento Doble Tecnologia', descripcion: 'Sensor doble tecnología' },
    { id: 13, nombre: 'Sensor Impacto', descripcion: 'Sensor de impacto' },
    { id: 14, nombre: 'Boton Panico', descripcion: 'Botón de pánico' },
    { id: 15, nombre: 'Sirena', descripcion: 'Sirena de alarma' },
    { id: 16, nombre: 'Detector Humo', descripcion: 'Detector de humo' },
    { id: 17, nombre: 'Transformador', descripcion: 'Transformador eléctrico' },
    { id: 18, nombre: 'Tarjeta', descripcion: 'Tarjeta electrónica' },
    { id: 19, nombre: 'Bateria', descripcion: 'Batería de respaldo' },
    { id: 20, nombre: 'Fotoceldas', descripcion: 'Fotoceldas de seguridad' },
    { id: 21, nombre: 'Teclados Alarma', descripcion: 'Teclados para alarmas' }
  ],
  
  estatusEquipo: [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'En uso' },
    { id: 3, nombre: 'Mantenimiento' },
    { id: 4, nombre: 'Baja' },
    { id: 5, nombre: 'Extraviado' },
    { id: 6, nombre: 'Dañado' },
    { id: 7, nombre: 'En reparación' },
    { id: 8, nombre: 'Obsoleto' }
  ],
  
  tiposMovimiento: [
    { id: 1, nombre: 'ALTA' },
    { id: 2, nombre: 'BAJA' },
    { id: 3, nombre: 'TRASLADO' },
    { id: 4, nombre: 'MANTENIMIENTO' },
    { id: 5, nombre: 'REPARACIÓN' }
  ],
  
  layouts: [
    { id: 1, centro: 'CENT', nombre: 'Recepción', descripcion: 'Área principal de recepción', longitud: -103.349609, latitud: 20.659698 },
    { id: 2, centro: 'CENT', nombre: 'Oficinas', descripcion: 'Oficinas administrativas', longitud: -103.349700, latitud: 20.659800 },
    { id: 3, centro: 'NORT', nombre: 'Almacén', descripcion: 'Área de almacenamiento', longitud: -101.259098, latitud: 21.018199 },
    { id: 4, centro: 'SUR', nombre: 'Sala Servidores', descripcion: 'Sala de equipos servidores', longitud: -99.823653, latitud: 16.853108 },
    { id: 5, centro: 'NORT', nombre: 'Taller', descripcion: 'Taller de mantenimiento', longitud: -101.259200, latitud: 21.018300 },
    { id: 6, centro: 'SUR', nombre: 'Almacén', descripcion: 'Almacén general', longitud: -99.823700, latitud: 16.853200 }
  ],
  
  // Vista VistaEquiposCompletos simulada
  equiposCompletos: [
    {
      no_serie: 'CAM001', nombreEquipo: 'Cámara Principal Recepción', modelo: 'DS-2CD2143G0-I',
      TipoEquipo: 'Camara 360', DescripcionTipo: 'Cámara de 360 grados', numeroActivo: 'ACT001',
      fechaAlta: '2024-01-15', UsuarioAsignado: 'Técnico Juan', EstatusEquipo: 'En uso',
      SucursalActual: 'Sucursal Centro', AreaActual: 'Recepción', ZonaSucursal: 'Matriz',
      EstadoSucursal: 'Jalisco', MunicipioSucursal: 'Guadalajara', idLayout: 1
    },
    {
      no_serie: 'CAM002', nombreEquipo: 'Cámara Entrada Principal', modelo: 'DS-2CD2543G0-I',
      TipoEquipo: 'Camara Domo', DescripcionTipo: 'Cámara tipo domo', numeroActivo: 'ACT002',
      fechaAlta: '2024-01-16', UsuarioAsignado: 'Técnico María', EstatusEquipo: 'Disponible',
      SucursalActual: 'Sucursal Centro', AreaActual: 'Recepción', ZonaSucursal: 'Matriz',
      EstadoSucursal: 'Jalisco', MunicipioSucursal: 'Guadalajara', idLayout: 1
    },
    {
      no_serie: 'NVR001', nombreEquipo: 'Grabador Principal Centro', modelo: 'DS-7608NI-I2',
      TipoEquipo: 'NVR', DescripcionTipo: 'Network Video Recorder', numeroActivo: 'ACT003',
      fechaAlta: '2024-01-17', UsuarioAsignado: 'Admin', EstatusEquipo: 'En uso',
      SucursalActual: 'Sucursal Sur', AreaActual: 'Sala Servidores', ZonaSucursal: 'PacificoSur',
      EstadoSucursal: 'Oaxaca', MunicipioSucursal: 'Oaxaca de Juárez', idLayout: 4
    },
    {
      no_serie: 'SEN001', nombreEquipo: 'Sensor Almacén Norte', modelo: 'PIR-100',
      TipoEquipo: 'Sensor Movimiento', DescripcionTipo: 'Sensor de movimiento básico', numeroActivo: 'ACT004',
      fechaAlta: '2024-01-18', UsuarioAsignado: 'Supervisor Centro', EstatusEquipo: 'Mantenimiento',
      SucursalActual: 'Sucursal Norte', AreaActual: 'Almacén', ZonaSucursal: 'OccidenteBajio',
      EstadoSucursal: 'Nuevo León', MunicipioSucursal: 'Monterrey', idLayout: 3
    },
    {
      no_serie: 'SIR001', nombreEquipo: 'Sirena Exterior Oficinas', modelo: 'SIR-200',
      TipoEquipo: 'Sirena', DescripcionTipo: 'Sirena de alarma', numeroActivo: 'ACT005',
      fechaAlta: '2024-01-19', UsuarioAsignado: 'Técnico Juan', EstatusEquipo: 'Disponible',
      SucursalActual: 'Sucursal Centro', AreaActual: 'Oficinas', ZonaSucursal: 'Matriz',
      EstadoSucursal: 'Jalisco', MunicipioSucursal: 'Guadalajara', idLayout: 2
    },
    {
      no_serie: 'CAM003', nombreEquipo: 'Cámara PTZ Taller', modelo: 'DS-2DE4A425IW-DE',
      TipoEquipo: 'Camara PTZ', DescripcionTipo: 'Cámara PTZ (Pan-Tilt-Zoom)', numeroActivo: 'ACT006',
      fechaAlta: '2024-01-20', UsuarioAsignado: 'Técnico María', EstatusEquipo: 'Dañado',
      SucursalActual: 'Sucursal Norte', AreaActual: 'Taller', ZonaSucursal: 'OccidenteBajio',
      EstadoSucursal: 'Nuevo León', MunicipioSucursal: 'Monterrey', idLayout: 5
    },
    {
      no_serie: 'SW001', nombreEquipo: 'Switch Principal Centro', modelo: 'DGS-1016D',
      TipoEquipo: 'Switch', DescripcionTipo: 'Switch de red', numeroActivo: 'ACT007',
      fechaAlta: '2024-01-21', UsuarioAsignado: 'Admin', EstatusEquipo: 'En uso',
      SucursalActual: 'Sucursal Centro', AreaActual: 'Oficinas', ZonaSucursal: 'Matriz',
      EstadoSucursal: 'Jalisco', MunicipioSucursal: 'Guadalajara', idLayout: 2
    },
    {
      no_serie: 'DET001', nombreEquipo: 'Detector Humo Almacén', modelo: 'SD-100',
      TipoEquipo: 'Detector Humo', DescripcionTipo: 'Detector de humo', numeroActivo: 'ACT008',
      fechaAlta: '2024-01-22', UsuarioAsignado: 'Supervisor Centro', EstatusEquipo: 'Disponible',
      SucursalActual: 'Sucursal Sur', AreaActual: 'Almacén', ZonaSucursal: 'PacificoSur',
      EstadoSucursal: 'Oaxaca', MunicipioSucursal: 'Oaxaca de Juárez', idLayout: 6
    }
  ],
  
  // Vista VistaMovimientosDetallados simulada
  movimientosDetallados: [
    {
      idMovimientoInv: 1, fecha: '2024-01-20', tipoMovimiento: 'TRASLADO', estatusMovimiento: 'ABIERTO',
      SucursalOrigen: 'Sucursal Centro', CentroOrigen: 'CENT', SucursalDestino: 'Sucursal Norte', CentroDestino: 'NORT',
      no_serie: 'CAM002', nombreEquipo: 'Cámara Entrada Principal', TipoEquipo: 'Camara Domo', cantidad: 1,
      fechaFin: null, ZonaOrigen: 'Matriz', ZonaDestino: 'OccidenteBajio'
    },
    {
      idMovimientoInv: 2, fecha: '2024-01-19', tipoMovimiento: 'MANTENIMIENTO', estatusMovimiento: 'CERRADO',
      SucursalOrigen: 'Sucursal Norte', CentroOrigen: 'NORT', SucursalDestino: 'Sucursal Centro', CentroDestino: 'CENT',
      no_serie: 'SEN001', nombreEquipo: 'Sensor Almacén Norte', TipoEquipo: 'Sensor Movimiento', cantidad: 1,
      fechaFin: '2024-01-21', ZonaOrigen: 'OccidenteBajio', ZonaDestino: 'Matriz'
    },
    {
      idMovimientoInv: 3, fecha: '2024-01-18', tipoMovimiento: 'ALTA', estatusMovimiento: 'CERRADO',
      SucursalOrigen: 'Sucursal Sur', CentroOrigen: 'SUR', SucursalDestino: 'Sucursal Sur', CentroDestino: 'SUR',
      no_serie: 'NVR001', nombreEquipo: 'Grabador Principal Centro', TipoEquipo: 'NVR', cantidad: 1,
      fechaFin: '2024-01-18', ZonaOrigen: 'PacificoSur', ZonaDestino: 'PacificoSur'
    },
    {
      idMovimientoInv: 4, fecha: '2024-01-22', tipoMovimiento: 'REPARACIÓN', estatusMovimiento: 'ABIERTO',
      SucursalOrigen: 'Sucursal Norte', CentroOrigen: 'NORT', SucursalDestino: 'Sucursal Centro', CentroDestino: 'CENT',
      no_serie: 'CAM003', nombreEquipo: 'Cámara PTZ Taller', TipoEquipo: 'Camara PTZ', cantidad: 1,
      fechaFin: null, ZonaOrigen: 'OccidenteBajio', ZonaDestino: 'Matriz'
    }
  ],
  
  // Vista VistaInventarioPorEstatus simulada
  inventarioPorEstatus: [
    {
      estatus: 'Disponible', TipoEquipo: 'Camara Domo', Cantidad: 1,
      Equipos: 'Cámara Entrada Principal', Disponibles: 1, EnUso: 0, EnMantenimiento: 0
    },
    {
      estatus: 'Disponible', TipoEquipo: 'Sirena', Cantidad: 1,
      Equipos: 'Sirena Exterior Oficinas', Disponibles: 1, EnUso: 0, EnMantenimiento: 0
    },
    {
      estatus: 'Disponible', TipoEquipo: 'Detector Humo', Cantidad: 1,
      Equipos: 'Detector Humo Almacén', Disponibles: 1, EnUso: 0, EnMantenimiento: 0
    },
    {
      estatus: 'En uso', TipoEquipo: 'Camara 360', Cantidad: 1,
      Equipos: 'Cámara Principal Recepción', Disponibles: 0, EnUso: 1, EnMantenimiento: 0
    },
    {
      estatus: 'En uso', TipoEquipo: 'NVR', Cantidad: 1,
      Equipos: 'Grabador Principal Centro', Disponibles: 0, EnUso: 1, EnMantenimiento: 0
    },
    {
      estatus: 'En uso', TipoEquipo: 'Switch', Cantidad: 1,
      Equipos: 'Switch Principal Centro', Disponibles: 0, EnUso: 1, EnMantenimiento: 0
    },
    {
      estatus: 'Mantenimiento', TipoEquipo: 'Sensor Movimiento', Cantidad: 1,
      Equipos: 'Sensor Almacén Norte', Disponibles: 0, EnUso: 0, EnMantenimiento: 1
    },
    {
      estatus: 'Dañado', TipoEquipo: 'Camara PTZ', Cantidad: 1,
      Equipos: 'Cámara PTZ Taller', Disponibles: 0, EnUso: 0, EnMantenimiento: 1
    }
  ],
  
  // Vista VistaHistorialMovimientos simulada
  historialMovimientos: [
    {
      no_serie: 'CAM001', nombreEquipo: 'Cámara Principal Recepción', idMovimientoInv: 5,
      tipoMovimiento: 'ALTA', fecha: '2024-01-15', Origen: 'Sucursal Centro', Destino: 'Sucursal Centro',
      estatusMovimiento: 'CERRADO', DiasDuracion: 8
    },
    {
      no_serie: 'CAM002', nombreEquipo: 'Cámara Entrada Principal', idMovimientoInv: 1,
      tipoMovimiento: 'TRASLADO', fecha: '2024-01-20', Origen: 'Sucursal Centro', Destino: 'Sucursal Norte',
      estatusMovimiento: 'ABIERTO', DiasDuracion: 3
    },
    {
      no_serie: 'CAM002', nombreEquipo: 'Cámara Entrada Principal', idMovimientoInv: 6,
      tipoMovimiento: 'ALTA', fecha: '2024-01-16', Origen: 'Sucursal Centro', Destino: 'Sucursal Centro',
      estatusMovimiento: 'CERRADO', DiasDuracion: 7
    },
    {
      no_serie: 'CAM003', nombreEquipo: 'Cámara PTZ Taller', idMovimientoInv: 4,
      tipoMovimiento: 'REPARACIÓN', fecha: '2024-01-22', Origen: 'Sucursal Norte', Destino: 'Sucursal Centro',
      estatusMovimiento: 'ABIERTO', DiasDuracion: 1
    },
    {
      no_serie: 'CAM003', nombreEquipo: 'Cámara PTZ Taller', idMovimientoInv: 7,
      tipoMovimiento: 'ALTA', fecha: '2024-01-20', Origen: 'Sucursal Norte', Destino: 'Sucursal Norte',
      estatusMovimiento: 'CERRADO', DiasDuracion: 3
    },
    {
      no_serie: 'NVR001', nombreEquipo: 'Grabador Principal Centro', idMovimientoInv: 3,
      tipoMovimiento: 'ALTA', fecha: '2024-01-18', Origen: 'Sucursal Sur', Destino: 'Sucursal Sur',
      estatusMovimiento: 'CERRADO', DiasDuracion: 5
    },
    {
      no_serie: 'SEN001', nombreEquipo: 'Sensor Almacén Norte', idMovimientoInv: 2,
      tipoMovimiento: 'MANTENIMIENTO', fecha: '2024-01-19', Origen: 'Sucursal Norte', Destino: 'Sucursal Centro',
      estatusMovimiento: 'CERRADO', DiasDuracion: 2
    },
    {
      no_serie: 'SEN001', nombreEquipo: 'Sensor Almacén Norte', idMovimientoInv: 8,
      tipoMovimiento: 'ALTA', fecha: '2024-01-18', Origen: 'Sucursal Norte', Destino: 'Sucursal Norte',
      estatusMovimiento: 'CERRADO', DiasDuracion: 5
    }
  ]
};

export type Usuario = {
  id: number;
  nombre: string;
  nivel: number;
  correo: string;
  contraseña: string;
};

export type Equipo = {
  no_serie: string;
  nombreEquipo: string;
  modelo: string;
  TipoEquipo: string;
  DescripcionTipo: string;
  numeroActivo: string;
  fechaAlta: string;
  UsuarioAsignado: string;
  EstatusEquipo: string;
  SucursalActual: string;
  AreaActual: string;
  ZonaSucursal: string;
  EstadoSucursal: string;
  MunicipioSucursal: string;
  idLayout: number;
};

export type Movimiento = {
  idMovimientoInv: number;
  fecha: string;
  tipoMovimiento: string;
  estatusMovimiento: string;
  SucursalOrigen: string;
  CentroOrigen: string;
  SucursalDestino: string;
  CentroDestino: string;
  no_serie: string;
  nombreEquipo: string;
  TipoEquipo: string;
  cantidad: number;
  fechaFin: string | null;
  ZonaOrigen: string;
  ZonaDestino: string;
};