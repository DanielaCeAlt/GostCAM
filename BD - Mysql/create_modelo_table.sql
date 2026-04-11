-- =============================================
-- GOSTCAM - Tabla Modelo
-- =============================================
USE `GostCAM`;

-- Tabla: Modelo
CREATE TABLE IF NOT EXISTS `GostCAM`.`Modelo` (
  `idModelo` INT NOT NULL AUTO_INCREMENT,
  `nombreModelo` VARCHAR(80) NOT NULL,
  `marca` VARCHAR(45) NULL DEFAULT NULL,
  `idTipoEquipo` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idModelo`),
  INDEX `fk_Modelo_TipoEquipo_idx` (`idTipoEquipo` ASC),
  CONSTRAINT `fk_Modelo_TipoEquipo`
    FOREIGN KEY (`idTipoEquipo`)
    REFERENCES `GostCAM`.`TipoEquipo` (`idTipoEquipo`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- Datos iniciales - modelos registrados
INSERT IGNORE INTO `GostCAM`.`Modelo` (`nombreModelo`, `marca`) VALUES
-- NVR / Grabadores
('NVR4432-16P-EI',    'Dahua'),
-- Switches
('PFS3218-16ET-135',  'Dahua'),
-- Cámaras PTZ
('DH-SD6CE445GB-HNR', 'Dahua'),
('SD8A840N-HNF',      'Dahua'),
-- Alarma DSC / NEO
('PG9945',            'DSC'),
('SM226Q',            'DSC'),
('SM852LQ',           'DSC'),
('PG9914',            'DSC'),
('PG9872',            'DSC'),
('PG9994',            'DSC'),
('PG9984P',           'DSC'),
('PG9938',            'DSC'),
('PG9920',            'DSC'),
('PG9935',            'DSC'),
('H264',              'DSC'),
('PG9922',            'DSC'),
('PG9924',            'DSC'),
('DSC PG9922',        'DSC'),
('SMAHY210',          'DSC'),
('TL880LEAT-LAT-N',   'DSC'),
('NEO HS20 PCBSPA',   'DSC'),
('DSC PCL-422',       'DSC'),
('UB-1250',           'DSC'),
('DSC PTC16400',      'DSC'),
('PC5003C-TDL',       'DSC'),
('TDL GS-001',        'DSC'),
('HS2LCDWFP9',        'DSC'),
('NEO HS2LCDRF9N',    'DSC'),
('HSM2HOST9',         'DSC'),
('SS072Q',            'DSC'),
('DSC SD30W',         'DSC'),
('DSC PG9911BBATT',   'DSC');
