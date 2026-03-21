// =============================================
// API: RESUMEN COMPLETO DEL SISTEMA GOSTCAM
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Generando resumen completo del sistema...');

    // Estado de tablas principales
    const tablas = {
      usuarios: await executeQuery('SELECT COUNT(*) as count FROM Usuarios'),
      equipos: await executeQuery('SELECT COUNT(*) as count FROM Equipo'),
      movimientos: await executeQuery('SELECT COUNT(*) as count FROM MovimientoInventario'),
      sucursales: await executeQuery('SELECT COUNT(*) as count FROM sucursales'),
      tiposEquipo: await executeQuery('SELECT COUNT(*) as count FROM tipoequipo'),
      layouts: await executeQuery('SELECT COUNT(*) as count FROM posicionequipo'),
      estatus: await executeQuery('SELECT COUNT(*) as count FROM estatusequipo')
    };

    // Equipos por estatus
    const equiposPorEstatus = await executeQuery(`
      SELECT est.estatus as nombreEstatus, COUNT(*) as cantidad
      FROM Equipo e
      LEFT JOIN estatusequipo est ON e.idEstatus = est.idEstatus
      GROUP BY e.idEstatus, est.estatus
      ORDER BY cantidad DESC
    `);

    // Equipos por tipo
    const equiposPorTipo = await executeQuery(`
      SELECT t.nombreTipo as tipoEquipo, COUNT(*) as cantidad
      FROM Equipo e
      LEFT JOIN tipoequipo t ON e.idTipoEquipo = t.idTipoEquipo
      GROUP BY e.idTipoEquipo, t.nombreTipo
      ORDER BY cantidad DESC
    `);

    // Equipos de prueba
    const equiposTest = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM Equipo 
      WHERE no_serie LIKE 'TEST-%'
    `);

    // Último movimiento
    const ultimoMovimiento = await executeQuery(`
      SELECT m.idMovimientoInv, m.fecha, m.estatusMovimiento, m.idTipoMov,
             e.nombreEquipo, e.no_serie
      FROM MovimientoInventario m
      LEFT JOIN detmovimiento dm ON dm.idMovimientoInv = m.idMovimientoInv
      LEFT JOIN Equipo e ON dm.no_serie = e.no_serie
      ORDER BY m.fecha DESC
      LIMIT 1
    `);

    const resumen = {
      estado_sistema: {
        base_datos_conectada: true,
        tablas_principales: Object.keys(tablas).map(tabla => ({
          tabla,
          registros: tablas[tabla as keyof typeof tablas][0].count
        }))
      },
      estadisticas: {
        total_usuarios: tablas.usuarios[0].count,
        total_equipos: tablas.equipos[0].count,
        equipos_test: equiposTest[0].count,
        total_movimientos: tablas.movimientos[0].count,
        total_sucursales: tablas.sucursales[0].count
      },
      distribucion: {
        equipos_por_estatus: equiposPorEstatus,
        equipos_por_tipo: equiposPorTipo
      },
      ultimo_movimiento: ultimoMovimiento[0] || null,
      apis_disponibles: [
        { endpoint: '/api/auth/login', metodo: 'POST', descripcion: 'Autenticación de usuarios' },
        { endpoint: '/api/dashboard', metodo: 'GET', descripcion: 'Estadísticas del dashboard' },
        { endpoint: '/api/equipos', metodo: 'GET/POST/PUT/DELETE', descripcion: 'CRUD de equipos' },
        { endpoint: '/api/movimientos', metodo: 'GET/POST', descripcion: 'Gestión de movimientos' },
        { endpoint: '/api/catalogos', metodo: 'GET', descripcion: 'Catálogos del sistema' },
        { endpoint: '/api/setup-data', metodo: 'POST', descripcion: 'Configuración inicial' },
        { endpoint: '/api/verify-equipos', metodo: 'GET', descripcion: 'Verificación de equipos' }
      ],
      funcionalidades_implementadas: [
        '✅ Autenticación JWT',
        '✅ Dashboard con gráficas',
        '✅ CRUD completo de equipos',
        '✅ Gestión de movimientos',
        '✅ API switching (Next.js/Python)',
        '✅ Base de datos MySQL integrada',
        '✅ Procedimientos almacenados',
        '✅ Validación de datos',
        '✅ Manejo de errores',
        '✅ Testing automatizado'
      ]
    };

    console.log('📈 Resumen generado exitosamente');

    return NextResponse.json({
      success: true,
      data: resumen,
      message: 'Resumen completo del sistema GostCAM generado',
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error generando resumen:', error);
    return NextResponse.json({
      success: false,
      error: 'Error generando resumen del sistema',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}