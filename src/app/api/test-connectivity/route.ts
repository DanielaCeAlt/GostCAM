// =============================================
// API: TEST DE CONECTIVIDAD PYTHON API
// =============================================

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const pythonApiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';

    // Intentar conectar a la API de Python
    try {
      const response = await fetch(`${pythonApiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 segundos timeout
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          message: 'Conexión exitosa con API Python',
          pythonApiStatus: 'online',
          pythonApiUrl: pythonApiUrl,
          pythonApiResponse: data
        }, { status: 200 });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (pythonError) {
      // Si no se puede conectar a Python API
      return NextResponse.json({
        success: true,
        message: 'API Python no disponible - usando solo Next.js API',
        pythonApiStatus: 'offline',
        pythonApiUrl: pythonApiUrl,
        pythonApiError: pythonError instanceof Error ? pythonError.message : 'Error desconocido',
        nextjsApiStatus: 'online'
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Error en test de conectividad:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}