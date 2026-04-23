-- =============================================
-- TABLA: Tecnicos
-- Catálogo dedicado de técnicos en GostCAM
-- =============================================

CREATE TABLE IF NOT EXISTS GostCAM.Tecnicos (
    idTecnico           INT AUTO_INCREMENT PRIMARY KEY,
    nombreTecnico       VARCHAR(100) NOT NULL,
    telefono            VARCHAR(20)  NULL,
    correo              VARCHAR(254) NULL,
    especialidad        VARCHAR(100) NULL COMMENT 'Ej: Cámaras, Redes, Alarmas, etc.',
    zona                VARCHAR(80)  NULL COMMENT 'Zona o región asignada',
    activo              TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '1=Activo 0=Inactivo',
    created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_tec_nombre  (nombreTecnico),
    INDEX idx_tec_activo  (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catálogo de técnicos de campo';

-- =============================================
-- Actualizar FK de evaluaciones_tecnicos
-- para que apunte a la nueva tabla Tecnicos
-- =============================================

-- Primero eliminamos la FK antigua si existe
SET @fk_exists = (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = 'GostCAM'
      AND TABLE_NAME        = 'evaluaciones_tecnicos'
      AND CONSTRAINT_NAME   = 'fk_eval_tecnico'
      AND CONSTRAINT_TYPE   = 'FOREIGN KEY'
);

SET @sql = IF(
    @fk_exists > 0,
    'ALTER TABLE GostCAM.evaluaciones_tecnicos DROP FOREIGN KEY fk_eval_tecnico',
    'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ahora agregamos la FK apuntando a Tecnicos
ALTER TABLE GostCAM.evaluaciones_tecnicos
    ADD CONSTRAINT fk_eval_tecnico
        FOREIGN KEY (id_tecnico)
        REFERENCES GostCAM.Tecnicos(idTecnico)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
