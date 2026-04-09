# ===============================
# GOSTCAM - SCRIPT DE INICIO UNIFICADO
# ===============================

Write-Host "🚀 INICIANDO GOSTCAM - PROYECTO COMPLETO" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Yellow

# Función para verificar si un puerto está en uso
function Test-Port {
    param([int]$Port)
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
        $listener.Start()
        $listener.Stop()
        return $false  # Puerto disponible
    } catch {
        return $true   # Puerto en uso
    }       INSERT INTO GostCAM.Modelo (nombreModelo, marca, idTipoEquipo) 
    VALUES ('Inspiron 15 3000', 'Dell', NULL);
}

# Verificar puertos
Write-Host "`n📡 VERIFICANDO PUERTOS..." -ForegroundColor Cyan
if (Test-Port 8000) {
    Write-Host "❌ Puerto 8000 (FastAPI) ya está en uso" -ForegroundColor Red
    $continuar = Read-Host "¿Continuar de todas formas? (s/n)"
    if ($continuar -ne 's' -and $continuar -ne 'S') {
        exit
    }
}

if (Test-Port 3000) {
    Write-Host "❌ Puerto 3000 (Next.js) ya está en uso" -ForegroundColor Red
    $continuar = Read-Host "¿Continuar de todas formas? (s/n)"
    if ($continuar -ne 's' -and $continuar -ne 'S') {
        exit
    }
}

Write-Host "✅ Puertos verificados" -ForegroundColor Green

# ===============================
# 1. INICIAR BACKEND FASTAPI
# ===============================
Write-Host "`n🐍 INICIANDO BACKEND FASTAPI..." -ForegroundColor Yellow

# Cambiar al directorio del backend
Set-Location "GostCAM - BackendAPI"

# Activar entorno virtual si existe
if (Test-Path ".venv\Scripts\Activate.ps1") {
    Write-Host "🔧 Activando entorno virtual..." -ForegroundColor Cyan
    & ".\.venv\Scripts\Activate.ps1"
} else {
    Write-Host "⚠️ No se encontró entorno virtual en .venv" -ForegroundColor Yellow
    Write-Host "💡 Ejecuta: python -m venv .venv" -ForegroundColor Blue
}

# Verificar dependencias
if (Test-Path "requirements.txt") {
    Write-Host "📦 Verificando dependencias..." -ForegroundColor Cyan
    pip install -r requirements.txt --quiet
}

# Iniciar FastAPI en background
Write-Host "🚀 Iniciando servidor FastAPI en puerto 8000..." -ForegroundColor Green
try {
    Start-Process -FilePath "python" -ArgumentList "main.py" -WindowStyle Normal
    Write-Host "✅ Backend FastAPI iniciado" -ForegroundColor Green
    Start-Sleep -Seconds 3
} catch {
    Write-Host "❌ Error iniciando Backend: $($_.Exception.Message)" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Volver al directorio raíz
Set-Location ".."

# ===============================
# 2. INICIAR FRONTEND NEXT.JS
# ===============================
Write-Host "`n⚛️ INICIANDO FRONTEND NEXT.JS..." -ForegroundColor Yellow

# Cambiar al directorio del frontend
Set-Location "GostCAM - Frontend"

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias Node.js..." -ForegroundColor Cyan
    npm install
}

# Verificar .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️ Archivo .env.local no encontrado" -ForegroundColor Yellow
    Write-Host "💡 Asegúrate de tener la configuración correcta" -ForegroundColor Blue
}

# Iniciar Next.js con HTTPS (necesario para cámara en móvil)
Write-Host "🚀 Iniciando servidor Next.js en puerto 3000 (HTTPS)..." -ForegroundColor Green
try {
    Start-Process -FilePath "npm" -ArgumentList "run", "dev:https" -WindowStyle Normal
    Write-Host "✅ Frontend Next.js iniciado (HTTPS habilitado)" -ForegroundColor Green
    Start-Sleep -Seconds 2
} catch {
    Write-Host "❌ Error iniciando Frontend: $($_.Exception.Message)" -ForegroundColor Red
}

# Volver al directorio raíz
Set-Location ".."

# ===============================
# 3. INFORMACIÓN Y MONITOREO
# ===============================
Write-Host "`n🌐 SERVICIOS DISPONIBLES:" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Yellow
Write-Host "Frontend (Next.js): https://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend (FastAPI):  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs (Swagger): http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "API Redoc:          http://localhost:8000/redoc" -ForegroundColor Cyan
Write-Host "(Acepta el certificado autofirmado en el navegador)" -ForegroundColor DarkGray

Write-Host "`n📊 ESTADO DEL SISTEMA:" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Yellow

# Verificar que los servicios respondan
Write-Host "🔍 Verificando servicios..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend FastAPI: ACTIVO" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Backend FastAPI: RESPUESTA INESPERADA" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Backend FastAPI: NO RESPONDE" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "https://localhost:3000" -Method GET -TimeoutSec 10 -SkipCertificateCheck
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend Next.js: ACTIVO" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Frontend Next.js: RESPUESTA INESPERADA" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend Next.js: NO RESPONDE (puede estar compilando...)" -ForegroundColor Red
}

# ===============================
# 4. OPCIONES DE CONTROL
# ===============================
Write-Host "`n🎛️ OPCIONES:" -ForegroundColor Green
Write-Host "============" -ForegroundColor Yellow
Write-Host "1. Presiona CTRL+C para detener este script" -ForegroundColor Cyan
Write-Host "2. Los servicios seguirán ejecutándose en ventanas separadas" -ForegroundColor Cyan
Write-Host "3. Para detener todo: cierra las ventanas o usa TaskManager" -ForegroundColor Cyan

Write-Host "`n🚀 ¡GOSTCAM ESTÁ LISTO!" -ForegroundColor Green
Write-Host "Puedes acceder a la aplicación en: https://localhost:3000" -ForegroundColor Yellow
Write-Host "Desde móvil (misma red Wi-Fi): https://192.168.137.231:3000" -ForegroundColor Yellow

# Mantener el script activo para mostrar logs si es necesario
Write-Host "`nPresiona cualquier tecla para cerrar este monitor..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")