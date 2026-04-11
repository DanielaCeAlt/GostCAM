-- ============================================================
-- Migración: Layout visual de dispositivos por sucursal
-- ============================================================

-- 1. Agregar coordenadas a PosicionEquipo para saber dónde está
--    cada área/posición en el plano de la sucursal
ALTER TABLE `GostCAM`.`PosicionEquipo`
  ADD COLUMN `pos_x` FLOAT NULL DEFAULT NULL COMMENT 'Posición X en el layout (0-100%)',
  ADD COLUMN `pos_y` FLOAT NULL DEFAULT NULL COMMENT 'Posición Y en el layout (0-100%)';

-- 2. Tabla para guardar la imagen del plano por sucursal
CREATE TABLE IF NOT EXISTS `GostCAM`.`layout_sucursal` (
  `id`          INT           NOT NULL AUTO_INCREMENT,
  `idCentro`    VARCHAR(4)    NOT NULL,
  `nombre`      VARCHAR(100)  NOT NULL DEFAULT 'Plano principal',
  `imagen_url`  VARCHAR(500)  NULL     COMMENT 'URL/ruta de la imagen del plano',
  `imagen_data` LONGTEXT      NULL     COMMENT 'Base64 de la imagen (fallback)',
  `ancho`       INT           NOT NULL DEFAULT 800,
  `alto`        INT           NOT NULL DEFAULT 600,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_layout_centro` (`idCentro` ASC),
  CONSTRAINT `fk_layout_centro`
    FOREIGN KEY (`idCentro`)
    REFERENCES `GostCAM`.`Sucursales` (`idCentro`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
