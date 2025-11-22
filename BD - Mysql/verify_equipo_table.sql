-- =============================================
-- SCRIPT: VERIFICAR Y CORREGIR PROBLEMAS DE BD
-- =============================================

USE GostCAM;

-- 1. Verificar estructura de tabla equipo
DESCRIBE equipo;

-- 2. Verificar si existen datos nulos problemáticos
SELECT 
  COUNT(*) as total_equipos,
  COUNT(no_serie) as con_no_serie,
  COUNT(nombreEquipo) as con_nombre,
  COUNT(modelo) as con_modelo,
  COUNT(numeroActivo) as con_numero_activo
FROM equipo;

-- 3. Verificar campos que podrían causar problemas en búsqueda
SELECT 
  no_serie, nombreEquipo, modelo, numeroActivo,
  LENGTH(no_serie) as len_no_serie,
  LENGTH(nombreEquipo) as len_nombre,
  LENGTH(modelo) as len_modelo,
  LENGTH(numeroActivo) as len_activo
FROM equipo 
WHERE 
  no_serie IS NULL OR 
  nombreEquipo IS NULL OR 
  modelo IS NULL OR 
  numeroActivo IS NULL
LIMIT 10;

-- 4. Verificar tipos de datos y charset
SELECT 
  COLUMN_NAME,
  DATA_TYPE,
  CHARACTER_MAXIMUM_LENGTH,
  IS_NULLABLE,
  COLLATION_NAME
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'GostCAM' 
  AND TABLE_NAME = 'equipo'
  AND COLUMN_NAME IN ('no_serie', 'nombreEquipo', 'modelo', 'numeroActivo');

-- 5. Mostrar algunos registros para verificar contenido
SELECT 
  no_serie, nombreEquipo, modelo, numeroActivo, fechaAlta
FROM equipo 
WHERE (eliminado IS NULL OR eliminado = 0)
ORDER BY fechaAlta DESC 
LIMIT 5;