// =============================================
// API: ENDPOINT PARA VERIFICAR EQUIPOS CREADOS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificando equipos en la base de datos...');

    // Consultar equipos de prueba creados
    const equipos = await executeQuery(`
      SELECT e.*, 
             t.nombreTipo as tipoEquipo,
             est.estatus as nombreEstatus,
             u.NombreUsuario
      FROM equipo e
      LEFT JOIN tipoequipo t ON e.idTipoEquipo = t.idTipoEquipo
      LEFT JOIN estatusequipo est ON e.idEstatus = est.idEstatus
      LEFT JOIN usuarios u ON e.idUsuarios = u.idUsuarios
      WHERE e.no_serie LIKE 'TEST-%'
      ORDER BY e.no_serie DESC
      LIMIT 10
    `);

    console.log(`✅ Encontrados ${equipos.length} equipos de prueba`);

    // También obtener un resumen de todos los equipos
    const totalEquipos = await executeQuery(`
      SELECT COUNT(*) as total FROM equipo
    `);

    const equiposPorEstatus = await executeQuery(`
      SELECT 
        est.estatus,
        COUNT(*) as cantidad
      FROM equipo e
      LEFT JOIN estatusequipo est ON e.idEstatus = est.idEstatus
      GROUP BY est.estatus
    `);

    return NextResponse.json({
      success: true,
      data: {
        equiposTest: equipos,
        resumen: {
          totalEquipos: totalEquipos[0]?.total || 0,
          equiposPorEstatus: equiposPorEstatus
        }
      },
      message: `Verificación completada. ${equipos.length} equipos de prueba encontrados.`
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error verificando equipos:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error verificando equipos en la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}