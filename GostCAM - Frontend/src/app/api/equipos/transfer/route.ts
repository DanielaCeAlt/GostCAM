import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { ApiResponse } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      equipos,
      sucursalOrigen,
      sucursalDestino,
      posicionDestino,
      tipoMovimiento = 'TRASLADO',
      observaciones = '',
      responsableTraslado,
      motivo = ''
    } = body;

    console.log('Datos de transferencia recibidos:', { equipos, sucursalDestino, responsableTraslado });

    if (!equipos || !Array.isArray(equipos) || equipos.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Debe especificar al menos un equipo para transferir'
      } as ApiResponse<any>, { status: 400 });
    }

    if (!sucursalDestino) {
      return NextResponse.json({
        success: false,
        error: 'Sucursal destino es requerida'
      } as ApiResponse<any>, { status: 400 });
    }

    if (!responsableTraslado) {
      return NextResponse.json({
        success: false,
        error: 'Responsable del traslado es requerido'
      } as ApiResponse<any>, { status: 400 });
    }

    const equiposStr = equipos.map(() => '?').join(',');
    const equiposQuery = `
      SELECT e.no_serie, e.nombreEquipo, e.idPosicion, COALESCE(p.idCentro, ?) as origenIdCentro
      FROM equipo e
      LEFT JOIN posicionequipo p ON e.idPosicion = p.idPosicion
      WHERE e.no_serie IN (${equiposStr})
    `;
    
    const equiposResult = await executeQuery(equiposQuery, [sucursalDestino, ...equipos]) as any[];
    
    if (equiposResult.length !== equipos.length) {
      return NextResponse.json({
        success: false,
        error: 'Algunos equipos no fueron encontrados'
      } as ApiResponse<any>, { status: 400 });
    }

    // Determinar idTipoMov según tipoMovimiento
    const tipoMovMap: Record<string, number> = {
      'TRASLADO': 3, 'REASIGNACION': 3, 'MANTENIMIENTO': 4, 'REPARACION': 5, 'REPARACIÓN': 5
    };
    const idTipoMov = tipoMovMap[tipoMovimiento.toUpperCase()] ?? 3;

    // Origen: usar el idCentro del primer equipo
    const origenIdCentro = equiposResult[0]?.origenIdCentro || sucursalDestino;

    // Insertar un registro de movimiento de inventario
    const movInvResult = await executeQuery(
      `INSERT INTO movimientoinventario (origen_idCentro, destino_idCentro, idTipoMov, fecha, estatusMovimiento) VALUES (?, ?, ?, NOW(), 'CERRADO')`,
      [origenIdCentro, sucursalDestino, idTipoMov]
    ) as any;
    const idMovimientoInv = movInvResult.insertId;

    const transferenciasRealizadas = [];
    
    for (const equipo of equiposResult) {
      try {
        // Registrar detalle del movimiento
        if (idMovimientoInv) {
          await executeQuery(
            `INSERT INTO detmovimiento (idMovimientoInv, no_serie) VALUES (?, ?)`,
            [idMovimientoInv, equipo.no_serie]
          );
        }

        // Actualizar la posición del equipo
        await executeQuery(
          `UPDATE equipo SET idPosicion = ? WHERE no_serie = ?`,
          [posicionDestino || 1, equipo.no_serie]
        );

        transferenciasRealizadas.push({
          no_serie: equipo.no_serie,
          nombreEquipo: equipo.nombreEquipo,
          sucursalNueva: sucursalDestino,
          areaNueva: posicionDestino
        });

      } catch (error) {
        console.error('Error actualizando equipo:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${transferenciasRealizadas.length} equipo(s) transferido(s) exitosamente`,
      data: { transferenciasRealizadas, transferId: idMovimientoInv }
    } as ApiResponse<any>);

  } catch (error) {
    console.error('Error en transferencia:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<any>, { status: 500 });
  }
}
