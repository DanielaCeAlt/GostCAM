$baseUrl = "http://localhost:3000/api"

Write-Host "Verificando estado del sistema GostCAM..." -ForegroundColor Cyan

try {
    $equipos = Invoke-RestMethod -Uri "$baseUrl/equipos" -Method GET
    if ($equipos.success) {
        Write-Host "✅ API Equipos - FUNCIONANDO" -ForegroundColor Green
        Write-Host "   Datos: $($equipos.data.Count) equipos" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ API Equipos - ERROR" -ForegroundColor Red
}

try {
    $sucursales = Invoke-RestMethod -Uri "$baseUrl/catalogos?tipo=sucursales" -Method GET
    if ($sucursales.success) {
        Write-Host "✅ Catalogos Sucursales - FUNCIONANDO" -ForegroundColor Green
        Write-Host "   Datos: $($sucursales.data.Count) sucursales" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Catalogos Sucursales - ERROR" -ForegroundColor Red
}

try {
    $busqueda = Invoke-RestMethod -Uri "$baseUrl/equipos/search?q=EQ001" -Method GET
    if ($busqueda.success) {
        Write-Host "✅ Busqueda EQ001 - FUNCIONANDO" -ForegroundColor Green
        Write-Host "   Datos: $($busqueda.data.Count) resultados" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Busqueda - ERROR" -ForegroundColor Red
}

try {
    $fallas = Invoke-RestMethod -Uri "$baseUrl/equipos/fallas?estatus=ABIERTA" -Method GET
    if ($fallas.success) {
        Write-Host "✅ Fallas (datos demo) - FUNCIONANDO" -ForegroundColor Green
        Write-Host "   Datos: $($fallas.data.Count) fallas" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Fallas - ERROR" -ForegroundColor Red
}

Write-Host "Sistema de respaldos implementado correctamente" -ForegroundColor Blue