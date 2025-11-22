-- =============================================
-- SCRIPT: CREAR TABLA FALLAS_EQUIPOS
-- =============================================

USE GostCAM;

-- Crear tabla fallas_equipos
CREATE TABLE IF NOT EXISTS `fallas_equipos` (
  `id_falla` INT NOT NULL AUTO_INCREMENT,
  `no_serie` VARCHAR(50) NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `tipo_falla` ENUM('HARDWARE', 'SOFTWARE', 'CONECTIVIDAD', 'MANTENIMIENTO') NOT NULL DEFAULT 'HARDWARE',
  `prioridad` ENUM('BAJA', 'NORMAL', 'ALTA', 'CRITICA') NOT NULL DEFAULT 'NORMAL',
  `estatus` ENUM('ABIERTA', 'EN_PROCESO', 'RESUELTA', 'CERRADA') NOT NULL DEFAULT 'ABIERTA',
  `fecha_reporte` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_resolucion` DATETIME NULL,
  `tecnico_asignado` VARCHAR(100) NULL,
  `costo_reparacion` DECIMAL(10,2) NULL DEFAULT 0.00,
  `observaciones` TEXT NULL,
  `reportado_por` VARCHAR(100) NULL,
  `area_afectada` VARCHAR(100) NULL,
  `tiempo_inactividad` INT NULL COMMENT 'Tiempo en minutos',
  `solucion_aplicada` TEXT NULL,
  PRIMARY KEY (`id_falla`),
  INDEX `idx_no_serie` (`no_serie`),
  INDEX `idx_estatus` (`estatus`),
  INDEX `idx_prioridad` (`prioridad`),
  INDEX `idx_fecha_reporte` (`fecha_reporte`),
  INDEX `idx_tecnico` (`tecnico_asignado`),
  CONSTRAINT `fk_fallas_equipos_equipo`
    FOREIGN KEY (`no_serie`)
    REFERENCES `equipo` (`no_serie`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Insertar algunos datos de ejemplo
INSERT INTO `fallas_equipos` (
  `no_serie`, `titulo`, `descripcion`, `tipo_falla`, `prioridad`, 
  `estatus`, `tecnico_asignado`, `reportado_por`, `area_afectada`
) VALUES
('EQ001', 'Monitor con líneas en pantalla', 'El monitor presenta líneas verticales intermitentes', 'HARDWARE', 'ALTA', 'ABIERTA', 'Juan Técnico', 'María García', 'Área de Sistemas'),
('EQ002', 'Cámara sin señal', 'La cámara de seguridad no está enviando señal', 'CONECTIVIDAD', 'CRITICA', 'EN_PROCESO', 'Carlos Méndez', 'Seguridad', 'Área Principal'),
('EQ003', 'Laptop muy lenta', 'El equipo presenta lentitud extrema al iniciar', 'SOFTWARE', 'NORMAL', 'ABIERTA', NULL, 'Pedro López', 'Área Administrativa');

-- Mostrar mensaje de confirmación
SELECT 'Tabla fallas_equipos creada exitosamente' AS mensaje;
SELECT COUNT(*) AS registros_insertados FROM fallas_equipos;