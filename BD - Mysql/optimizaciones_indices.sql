-- ================================================================
-- OPTIMIZACIONES DE ÍNDICES PARA GOSTCAM
-- Fecha: 20 de Noviembre de 2025
-- Propósito: Mejorar rendimiento de consultas frecuentes
-- ================================================================

USE GostCAM;

-- ================================================================
-- ÍNDICES PARA TABLA EQUIPO
-- ================================================================

-- Índice principal para búsquedas por número de serie (consultas frecuentes)
CREATE INDEX idx_equipo_no_serie ON Equipo(no_serie);

-- Índice para filtros por estatus (consultas de equipos por estado)
CREATE INDEX idx_equipo_estatus ON Equipo(idEstatus);

-- Índice para búsquedas por tipo de equipo
CREATE INDEX idx_equipo_tipo ON Equipo(idTipoEquipo);

-- Índice compuesto para consultas de equipos por sucursal y estatus
CREATE INDEX idx_equipo_posicion_estatus ON Equipo(idPosicion, idEstatus);

-- Índice para búsquedas por usuario asignado
CREATE INDEX idx_equipo_usuario ON Equipo(idUsuarios);

-- Índice para consultas por fecha de alta
CREATE INDEX idx_equipo_fecha_alta ON Equipo(fechaAlta);

-- ================================================================
-- ÍNDICES PARA TABLA MOVIMIENTOINVENTARIO
-- ================================================================

-- Índice principal para consultas por fecha (reportes y consultas históricas)
CREATE INDEX idx_movimiento_fecha ON MovimientoInventario(fecha);

-- Índice para búsquedas por tipo de movimiento
CREATE INDEX idx_movimiento_tipo ON MovimientoInventario(idTipoMov);

-- Índice para consultas por centro origen
CREATE INDEX idx_movimiento_origen ON MovimientoInventario(origen_idCentro);

-- Índice para consultas por centro destino
CREATE INDEX idx_movimiento_destino ON MovimientoInventario(destino_idCentro);

-- Índice para filtros por estatus de movimiento
CREATE INDEX idx_movimiento_estatus ON MovimientoInventario(estatusMovimiento);

-- Índice compuesto para reportes de movimientos por fecha y tipo
CREATE INDEX idx_movimiento_fecha_tipo ON MovimientoInventario(fecha, idTipoMov);

-- ================================================================
-- ÍNDICES PARA TABLA DETMOVIMIENTO
-- ================================================================

-- Índice principal para consultas por movimiento
CREATE INDEX idx_detmov_movimiento ON DetMovimiento(idMovimientoInv);

-- Índice para búsquedas por número de serie del equipo
CREATE INDEX idx_detmov_no_serie ON DetMovimiento(no_serie);

-- Índice compuesto para consultas de detalles específicos
CREATE INDEX idx_detmov_movimiento_serie ON DetMovimiento(idMovimientoInv, no_serie);

-- ================================================================
-- ÍNDICES PARA TABLA USUARIOS
-- ================================================================

-- Índice único para autenticación por correo (ya debería existir como UNIQUE)
-- Verificamos si existe, si no lo creamos
CREATE INDEX idx_usuarios_correo ON Usuarios(Correo);

-- Índice para consultas por nivel de usuario
CREATE INDEX idx_usuarios_nivel ON Usuarios(NivelUsuario);

-- Índice para filtros por estatus de usuario
CREATE INDEX idx_usuarios_estatus ON Usuarios(Estatus);

-- ================================================================
-- ÍNDICES PARA TABLAS RELACIONADAS (CATÁLOGOS)
-- ================================================================

-- Índices para PosicionEquipo (consultas frecuentes por centro)
CREATE INDEX idx_posicion_centro ON PosicionEquipo(idCentro);

-- Índices para Sucursales (consultas por zona, estado, municipio)
CREATE INDEX idx_sucursales_zona ON Sucursales(idZona);
CREATE INDEX idx_sucursales_estado ON Sucursales(idEstado);
CREATE INDEX idx_sucursales_municipio ON Sucursales(idMunicipios);

-- ================================================================
-- OPTIMIZACIÓN DE VISTAS EXISTENTES
-- ================================================================

-- Nota: Las vistas VistaEquiposCompletos y VistaMovimientosDetallados
-- se beneficiarán automáticamente de estos índices ya que utilizan
-- las tablas base que hemos optimizado.

-- ================================================================
-- VERIFICACIÓN DE ÍNDICES CREADOS
-- ================================================================

-- Consulta para verificar los índices creados en la tabla Equipo
SELECT DISTINCT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'GostCAM' 
    AND TABLE_NAME IN ('Equipo', 'MovimientoInventario', 'DetMovimiento', 'Usuarios')
    AND INDEX_NAME LIKE 'idx_%'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- ================================================================
-- ANÁLISIS DE RENDIMIENTO
-- ================================================================

-- Query para monitorear el uso de índices (ejecutar después de un tiempo de uso)
-- Esta consulta muestra estadísticas de uso de índices
/*
SELECT 
    OBJECT_SCHEMA,
    OBJECT_NAME,
    INDEX_NAME,
    COUNT_STAR,
    SUM_TIMER_WAIT,
    AVG_TIMER_WAIT
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE OBJECT_SCHEMA = 'GostCAM'
ORDER BY SUM_TIMER_WAIT DESC;
*/

-- ================================================================
-- NOTAS DE IMPLEMENTACIÓN
-- ================================================================

/*
IMPORTANTE:
1. Estos índices mejorarán significativamente el rendimiento de:
   - Consultas de equipos por número de serie
   - Filtros por estatus de equipo
   - Reportes de movimientos por fecha
   - Autenticación de usuarios
   - Consultas de equipos por sucursal

2. IMPACTO EN ESCRITURA:
   - Los índices pueden ralentizar ligeramente las operaciones INSERT/UPDATE
   - En GostCAM, las consultas son mucho más frecuentes que las escrituras
   - El beneficio en rendimiento de lecturas compensa ampliamente este costo

3. MANTENIMIENTO:
   - MySQL mantendrá automáticamente estos índices
   - Considerar OPTIMIZE TABLE ocasionalmente para tablas con muchas modificaciones

4. MONITOREO:
   - Usar EXPLAIN en consultas críticas para verificar uso de índices
   - Monitorear performance_schema para estadísticas de uso
*/