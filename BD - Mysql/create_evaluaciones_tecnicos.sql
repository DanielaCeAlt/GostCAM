-- =============================================
-- TABLA: evaluaciones_tecnicos
-- Encuesta de desempeño por técnico para GostCAM
-- =============================================

CREATE TABLE IF NOT EXISTS GostCAM.evaluaciones_tecnicos (
    id                          INT AUTO_INCREMENT PRIMARY KEY,

    -- Quién y cuándo
    id_tecnico                  INT NOT NULL,
    nombre_tecnico              VARCHAR(100) NOT NULL,
    evaluador                   VARCHAR(100) NOT NULL,
    fecha_evaluacion            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ticket / falla asociada (opcional)
    id_falla                    INT NULL,
    no_serie_equipo             VARCHAR(50) NULL,

    -- ¿Realizó el trabajo completo?
    realizo_trabajo_completo    TINYINT(1) NOT NULL DEFAULT 0,
    porcentaje_trabajo          TINYINT UNSIGNED NOT NULL DEFAULT 100 COMMENT '0-100',

    -- Tiempo
    tiempo_solucion_horas       DECIMAL(5,2) DEFAULT 0,
    cerro_antes_tiempo          TINYINT(1) NOT NULL DEFAULT 0,

    -- Conocimiento y calidad
    nivel_conocimiento          TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '1=Muy bajo 2=Bajo 3=Regular 4=Bueno 5=Excelente',
    realizo_pruebas_correctas   TINYINT(1) NOT NULL DEFAULT 0,
    calidad_solucion            TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '1-5',

    -- Operativo
    num_hammys_atendidos        INT NOT NULL DEFAULT 0 COMMENT 'Número de hammys (equipos/llamadas) atendidos',
    programo_visita             TINYINT(1) NOT NULL DEFAULT 0,
    visita_efectiva             TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Si programó visita, ¿fue efectiva?',

    -- Seguimiento y documentación
    seguimiento_correcto        TINYINT(1) NOT NULL DEFAULT 0,
    entrego_reporte             TINYINT(1) NOT NULL DEFAULT 0,
    comunico_avances            TINYINT(1) NOT NULL DEFAULT 0,

    -- Calificación general (calculada o manual)
    calificacion_general        TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '1-5',

    -- Observaciones libres
    observaciones               TEXT NULL,

    -- Metadatos
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- FK usuario/técnico
    CONSTRAINT fk_eval_tecnico FOREIGN KEY (id_tecnico)
        REFERENCES GostCAM.Usuarios(idUsuarios) ON DELETE RESTRICT ON UPDATE CASCADE,

    INDEX idx_eval_tecnico      (id_tecnico),
    INDEX idx_eval_fecha        (fecha_evaluacion),
    INDEX idx_eval_falla        (id_falla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Encuestas de desempeño de técnicos';
