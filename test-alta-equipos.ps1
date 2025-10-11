# =============================================
# SCRIPT DE PRUEBA: ALTA DE EQUIPOS GOSTCAM
# =============================================

Write-Host "=== INICIANDO PRUEBAS DE ALTA DE EQUIPOS ===" -ForegroundColor Green

# Configuración
$baseUrl = "http://localhost:3000"
$loginUrl = "$baseUrl/api/auth/login"
$equiposUrl = "$baseUrl/api/equipos"

# Datos de login
$loginData = @{
    correo = "admin@gostcam.com"
    contrasena = "admin123"
} | ConvertTo-Json

Write-Host "`n1. PROBANDO LOGIN..." -ForegroundColor Yellow

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method POST -ContentType "application/json" -Body $loginData
    
    if ($loginResponse.success) {
        Write-Host "   ✓ Login exitoso" -ForegroundColor Green
        $token = $loginResponse.token
        Write-Host "   Token obtenido: $($token.Substring(0,20))..." -ForegroundColor Cyan
    } else {
        Write-Host "   ✗ Error en login: $($loginResponse.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Error de conexión en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. PROBANDO ALTA DE EQUIPO (Next.js API)..." -ForegroundColor Yellow

# Datos del equipo de prueba
$equipoData = @{
    no_serie = "TEST-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    nombreEquipo = "Equipo de Prueba - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
    modelo = "Modelo Test v1.0"
    idTipoEquipo = 1
    numeroActivo = "ACT-$(Get-Date -Format 'yyyyMMddHHmmss')"
    idUsuarios = 1
    idLayout = 1
    idEstatus = 1
    idCentro = 1
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $equipoResponse = Invoke-RestMethod -Uri $equiposUrl -Method POST -Headers $headers -Body $equipoData
    
    if ($equipoResponse.success) {
        Write-Host "   ✓ Equipo creado exitosamente" -ForegroundColor Green
        Write-Host "   Mensaje: $($equipoResponse.message)" -ForegroundColor Cyan
    } else {
        Write-Host "   ✗ Error creando equipo: $($equipoResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error de conexión creando equipo: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n3. VERIFICANDO LISTA DE EQUIPOS..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $equiposResponse = Invoke-RestMethod -Uri $equiposUrl -Method GET -Headers $headers
    
    if ($equiposResponse.success) {
        $totalEquipos = $equiposResponse.data.Count
        Write-Host "   ✓ Lista obtenida: $totalEquipos equipos en total" -ForegroundColor Green
        
        # Buscar el equipo recién creado
        $equipoCreado = $equiposResponse.data | Where-Object { $_.no_serie -like "TEST-*" } | Select-Object -Last 1
        if ($equipoCreado) {
            Write-Host "   ✓ Equipo de prueba encontrado:" -ForegroundColor Green
            Write-Host "     - No. Serie: $($equipoCreado.no_serie)" -ForegroundColor Cyan
            Write-Host "     - Nombre: $($equipoCreado.nombreEquipo)" -ForegroundColor Cyan
            Write-Host "     - Modelo: $($equipoCreado.modelo)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ✗ Error obteniendo equipos: $($equiposResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Error de conexión obteniendo equipos: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green
Write-Host "Revisa los resultados arriba para verificar el funcionamiento." -ForegroundColor White