// =============================================
// API PROXY: EQUIPOS -> PYTHON API
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { VistaEquipoCompleto, ApiResponse } from '@/types/database';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

// GET: Obtener equipos desde API Python
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    
    // Construir URL para API Python
    const pythonUrl = `${PYTHON_API_URL}/equipos?${searchParams.toString()}`;
    
    const response = await fetch(pythonUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
    });

    if (!response.ok) {
      throw new Error(`Python API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Equipos obtenidos exitosamente'
    } as ApiResponse<VistaEquipoCompleto[]>, { status: 200 });

  } catch (error) {
    console.error('Error proxying to Python API:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<VistaEquipoCompleto[]>, { status: 500 });
  }
}

// POST: Crear equipo via API Python
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${PYTHON_API_URL}/equipos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        error: errorData.message || 'Error en API Python'
      } as ApiResponse<any>, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Equipo creado exitosamente'
    } as ApiResponse<any>, { status: 201 });

  } catch (error) {
    console.error('Error proxying POST to Python API:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<any>, { status: 500 });
  }
}

// PUT: Actualizar equipo via API Python
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    const response = await fetch(`${PYTHON_API_URL}/equipos/${body.no_serie}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        error: errorData.message || 'Error en API Python'
      } as ApiResponse<any>, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Equipo actualizado exitosamente'
    } as ApiResponse<any>, { status: 200 });

  } catch (error) {
    console.error('Error proxying PUT to Python API:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<any>, { status: 500 });
  }
}