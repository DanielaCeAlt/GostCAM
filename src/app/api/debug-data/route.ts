// =============================================
// API: ENDPOINT TEMPORAL PARA DEBUG DE DATOS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Consultando datos de referencia...');

    // Consultar sucursales
    const sucursales = await executeQuery('SELECT idCentro, nombreCentro FROM sucursales ORDER BY idCentro');
    
    // Consultar tipos de equipo
    const tiposEquipo = await executeQuery('SELECT idTipoEquipo, tipoEquipo FROM tipoequipo ORDER BY idTipoEquipo');
    
    // Consultar layouts
    const layouts = await executeQuery('SELECT idLayout, nombre FROM layout ORDER BY idLayout');
    
    // Consultar estatus
    const estatus = await executeQuery('SELECT idEstatus, nombreEstatus FROM estatus ORDER BY idEstatus');

    // Consultar usuarios
    const usuarios = await executeQuery('SELECT idUsuarios, NombreUsuario FROM Usuarios ORDER BY idUsuarios');

    const data = {
      sucursales: sucursales,
      tiposEquipo: tiposEquipo,
      layouts: layouts,
      estatus: estatus,
      usuarios: usuarios
    };

    console.log('📊 Datos encontrados:', {
      sucursales: sucursales.length,
      tiposEquipo: tiposEquipo.length,
      layouts: layouts.length,
      estatus: estatus.length,
      usuarios: usuarios.length
    });

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Datos de referencia obtenidos'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error consultando datos de referencia:', error);
    return NextResponse.json({
      success: false,
      error: 'Error consultando datos de referencia',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}