Write-Host "🔧 APLICANDO CORRECCIONES A BASE DE DATOS GOSTCAM" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$sqlFiles = @(
    "verify_equipo_table.sql",
    "create_fallas_table.sql"
)

Write-Host ""
Write-Host "Archivos SQL disponibles para ejecutar:" -ForegroundColor Yellow
foreach ($file in $sqlFiles) {
    $fullPath = "C:\Users\danie\OneDrive\Documentos\GostCAM\BD - Mysql\$file"
    if (Test-Path $fullPath) {
        Write-Host "✅ $file - ENCONTRADO" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - NO ENCONTRADO" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 INSTRUCCIONES:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "1. Abre tu cliente MySQL (Workbench, phpMyAdmin, etc.)" -ForegroundColor White
Write-Host "2. Conecta a tu base de datos GostCAM" -ForegroundColor White
Write-Host "3. Ejecuta los siguientes scripts en orden:" -ForegroundColor White
Write-Host ""

Write-Host "   📊 PRIMERO - Verificar problemas:" -ForegroundColor Yellow
Write-Host "   Archivo: verify_equipo_table.sql" -ForegroundColor Gray
Write-Host "   Propósito: Diagnosticar problemas en tabla equipo" -ForegroundColor Gray
Write-Host ""

Write-Host "   🔨 SEGUNDO - Crear tabla fallas:" -ForegroundColor Yellow  
Write-Host "   Archivo: create_fallas_table.sql" -ForegroundColor Gray
Write-Host "   Propósito: Crear tabla fallas_equipos con datos ejemplo" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 BENEFICIOS DESPUÉS DE APLICAR SCRIPTS:" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ Búsqueda de equipos funcionará con datos reales" -ForegroundColor Green
Write-Host "✅ Sistema de fallas tendrá tabla real" -ForegroundColor Green  
Write-Host "✅ No más datos de demostración" -ForegroundColor Green
Write-Host "✅ Errores de base de datos resueltos" -ForegroundColor Green

Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "=============" -ForegroundColor Yellow
Write-Host "- Haz backup de tu base de datos antes de aplicar cambios" -ForegroundColor Yellow
Write-Host "- Los scripts están diseñados para ser seguros (IF NOT EXISTS)" -ForegroundColor Yellow
Write-Host "- Después de aplicar, reinicia el frontend para ver cambios" -ForegroundColor Yellow

Write-Host ""
Write-Host "🔄 DESPUÉS DE APLICAR SCRIPTS:" -ForegroundColor Blue
Write-Host "=============================" -ForegroundColor Blue
Write-Host "1. Reinicia el servidor frontend (Ctrl+C y npm run dev)" -ForegroundColor Blue
Write-Host "2. Prueba la búsqueda de equipos" -ForegroundColor Blue
Write-Host "3. Verifica que las fallas muestren datos reales" -ForegroundColor Blue

Write-Host ""
Write-Host "¿Quieres que ejecute el script de prueba del sistema? (s/n): " -ForegroundColor Green -NoNewline
$respuesta = Read-Host

if ($respuesta -eq "s" -or $respuesta -eq "S") {
    Write-Host "Ejecutando prueba del sistema..." -ForegroundColor Blue
    & ".\test-simple.ps1"
} else {
    Write-Host "Scripts listos para aplicar manualmente." -ForegroundColor Gray
}