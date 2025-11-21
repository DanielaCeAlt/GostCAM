@echo off
echo Aplicando optimizaciones de indices para GostCAM...
echo.

REM Configurar ruta de MySQL
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"

REM Verificar que el archivo SQL existe
if not exist "optimizaciones_indices.sql" (
    echo Error: No se encuentra el archivo optimizaciones_indices.sql
    pause
    exit /b 1
)

echo Conectando a MySQL...
echo Por favor, ingrese la contraseña de root cuando se solicite
echo.

REM Ejecutar script SQL
%MYSQL_PATH% -u root -p -e "USE GostCAM; SOURCE optimizaciones_indices.sql;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Indices aplicados exitosamente!
    echo.
    echo Verificando indices creados...
    %MYSQL_PATH% -u root -p -e "USE GostCAM; SELECT DISTINCT TABLE_NAME, INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = 'GostCAM' AND INDEX_NAME LIKE 'idx_%%' ORDER BY TABLE_NAME, INDEX_NAME;"
) else (
    echo.
    echo ❌ Error al aplicar indices
    echo Verifique la conexión a la base de datos y que existe la base GostCAM
)

echo.
pause