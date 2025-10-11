// =============================================
// API: GESTIÓN DE MOVIMIENTOS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, getMovimientosDetallados } from '@/lib/database';
import { MovimientoCreateRequest, VistaMovimientoDetallado, ApiResponse } from '@/types/database';

// GET: Obtener movimientos con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      sucursalOrigen: searchParams.get('sucursalOrigen') || undefined,
      sucursalDestino: searchParams.get('sucursalDestino') || undefined,
      tipoMovimiento: searchParams.get('tipoMovimiento') || undefined,
      estatusMovimiento: searchParams.get('estatusMovimiento') || undefined,
      fechaDesde: searchParams.get('fechaDesde') || undefined,
      fechaHasta: searchParams.get('fechaHasta') || undefined
    };

    // Remover filtros vacíos
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters];
      }
    });

    const movimientos = await getMovimientosDetallados(filters);

    return NextResponse.json({
      success: true,
      data: movimientos,
      message: 'Movimientos obtenidos exitosamente'
    } as ApiResponse<VistaMovimientoDetallado[]>, { status: 200 });

  } catch (error) {
    console.error('Error obteniendo movimientos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<VistaMovimientoDetallado[]>, { status: 500 });
  }
}

// POST: Crear nuevo movimiento
export async function POST(request: NextRequest) {
  try {
    const body: MovimientoCreateRequest = await request.json();
    
    const { origen_idCentro, destino_idCentro, idTipoMov, equipos } = body;

    // Validar campos requeridos
    if (!origen_idCentro || !destino_idCentro || !idTipoMov || !equipos || equipos.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Todos los campos son requeridos y debe incluir al menos un equipo'
      } as ApiResponse<any>, { status: 400 });
    }

    // Verificar que las sucursales existen
    const sucursales = await executeQuery(
      'SELECT idCentro FROM Sucursales WHERE idCentro IN (?, ?)',
      [origen_idCentro, destino_idCentro]
    );

    if (sucursales.length !== 2) {
      return NextResponse.json({
        success: false,
        error: 'Una o ambas sucursales no existen'
      } as ApiResponse<any>, { status: 400 });
    }

    // Verificar que todos los equipos existen
    const equiposSeries = equipos.map(e => e.no_serie);
    const equiposExistentes = await executeQuery(
      `SELECT no_serie FROM Equipo WHERE no_serie IN (${equiposSeries.map(() => '?').join(',')})`,
      equiposSeries
    );

    if (equiposExistentes.length !== equipos.length) {
      return NextResponse.json({
        success: false,
        error: 'Uno o más equipos no existen'
      } as ApiResponse<any>, { status: 400 });
    }

    // Crear el movimiento
    const movimientoResult = await executeQuery(`
      INSERT INTO MovimientoInventario (origen_idCentro, destino_idCentro, idTipoMov, estatusMovimiento)
      VALUES (?, ?, ?, 'ABIERTO')
    `, [origen_idCentro, destino_idCentro, idTipoMov]);

    const movimientoId = (movimientoResult as any).insertId;

    // Crear los detalles del movimiento
    for (const equipo of equipos) {
      await executeQuery(`
        INSERT INTO DetMovimiento (idMovimientoInv, no_serie, cantidad)
        VALUES (?, ?, ?)
      `, [movimientoId, equipo.no_serie, equipo.cantidad]);
    }

    return NextResponse.json({
      success: true,
      data: { idMovimientoInv: movimientoId },
      message: 'Movimiento creado exitosamente'
    } as ApiResponse<any>, { status: 201 });

  } catch (error) {
    console.error('Error creando movimiento:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<any>, { status: 500 });
  }
}

// PUT: Actualizar estatus de movimiento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idMovimientoInv, estatusMovimiento, fechaFin } = body;

    // Validar campos requeridos
    if (!idMovimientoInv || !estatusMovimiento) {
      return NextResponse.json({
        success: false,
        error: 'ID de movimiento y estatus son requeridos'
      } as ApiResponse<any>, { status: 400 });
    }

    // Verificar que el movimiento existe
    const movimiento = await executeQuery(
      'SELECT idMovimientoInv FROM MovimientoInventario WHERE idMovimientoInv = ?',
      [idMovimientoInv]
    );

    if (movimiento.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Movimiento no encontrado'
      } as ApiResponse<any>, { status: 404 });
    }

    // Actualizar el movimiento
    let query = 'UPDATE MovimientoInventario SET estatusMovimiento = ?';
    const params = [estatusMovimiento];

    if (fechaFin) {
      query += ', fechaFin = ?';
      params.push(fechaFin);
    } else if (estatusMovimiento === 'CERRADO') {
      query += ', fechaFin = NOW()';
    }

    query += ' WHERE idMovimientoInv = ?';
    params.push(idMovimientoInv);

    await executeQuery(query, params);

    return NextResponse.json({
      success: true,
      message: 'Movimiento actualizado exitosamente'
    } as ApiResponse<any>, { status: 200 });

  } catch (error) {
    console.error('Error actualizando movimiento:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<any>, { status: 500 });
  }
}