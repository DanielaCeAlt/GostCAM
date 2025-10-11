// =============================================
// API: DETALLES COMPLETOS DE EQUIPO
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { ApiResponse } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { no_serie: string } }
) {
  try {
    const { no_serie } = params;

    if (!no_serie) {
      return NextResponse.json({
        success: false,
        error: 'Número de serie es requerido'
      } as ApiResponse<any>, { status: 400 });
    }

    // Consulta principal para obtener detalles del equipo
    const equipoQuery = `
      SELECT 
        e.no_serie,
        e.nombreEquipo,
        e.modelo,
        e.numeroActivo,
        e.fechaAlta,
        te.id as idTipoEquipo,
        te.nombre AS TipoEquipo,
        te.descripcion AS DescripcionTipo,
        ee.id as idEstatus,
        ee.nombre AS EstatusEquipo,
        u.id as idUsuario,
        u.nombre AS UsuarioAsignado,
        u.correo AS CorreoUsuario,
        u.nivel AS NivelUsuario,
        s.id as idSucursal,
        s.nombre AS SucursalActual,
        l.id as idLayout,
        l.nombre AS AreaActual,
        l.descripcion AS DescripcionArea,
        l.longitud,
        l.latitud,
        z.id as idZona,
        z.nombre AS ZonaSucursal,
        est.id as idEstado,
        est.nombre AS EstadoSucursal,
        m.id as idMunicipio,
        m.nombre AS MunicipioSucursal,
        -- Cálculos adicionales
        DATEDIFF(CURDATE(), e.fechaAlta) AS diasEnSistema,
        CASE 
          WHEN ee.nombre = 'Disponible' THEN 'success'
          WHEN ee.nombre = 'En uso' THEN 'info'
          WHEN ee.nombre = 'Mantenimiento' THEN 'warning'
          WHEN ee.nombre = 'Dañado' THEN 'danger'
          ELSE 'secondary'
        END AS colorEstatus
      FROM equipo e
      INNER JOIN tipoequipo te ON e.idTipoEquipo = te.id
      INNER JOIN estatusequipo ee ON e.idEstatus = ee.id
      INNER JOIN usuarios u ON e.idUsuarios = u.id
      INNER JOIN layout l ON e.idLayout = l.id
      INNER JOIN sucursales s ON l.centro = s.id
      INNER JOIN zonas z ON s.zona = z.id
      INNER JOIN estados est ON s.estado = est.id
      INNER JOIN municipios m ON s.municipio = m.id
      WHERE e.no_serie = ?
    `;

    const equipoResult = await executeQuery(equipoQuery, [no_serie]);

    if (equipoResult.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Equipo no encontrado'
      } as ApiResponse<any>, { status: 404 });
    }

    const equipo = equipoResult[0];

    // Obtener historial de movimientos del equipo
    const movimientosQuery = `
      SELECT 
        mi.id as idMovimiento,
        mi.fecha,
        mi.fechaFin,
        tm.nombre AS tipoMovimiento,
        em.nombre AS estatusMovimiento,
        s_origen.nombre AS sucursalOrigen,
        s_destino.nombre AS sucursalDestino,
        z_origen.nombre AS zonaOrigen,
        z_destino.nombre AS zonaDestino,
        u_mov.nombre AS usuarioMovimiento,
        CASE 
          WHEN mi.fechaFin IS NOT NULL 
          THEN DATEDIFF(mi.fechaFin, mi.fecha)
          ELSE DATEDIFF(CURDATE(), mi.fecha)
        END AS duracionDias,
        mi.observaciones
      FROM movimientoinventario mi
      INNER JOIN tipomovimiento tm ON mi.idTipoMov = tm.id
      INNER JOIN estatusmovimiento em ON mi.idEstatusMov = em.id
      INNER JOIN sucursales s_origen ON mi.origen_idCentro = s_origen.id
      INNER JOIN sucursales s_destino ON mi.destino_idCentro = s_destino.id
      INNER JOIN zonas z_origen ON s_origen.zona = z_origen.id
      INNER JOIN zonas z_destino ON s_destino.zona = z_destino.id
      INNER JOIN usuarios u_mov ON mi.idUsuarios = u_mov.id
      WHERE mi.no_serie = ?
      ORDER BY mi.fecha DESC
      LIMIT 10
    `;

    const movimientos = await executeQuery(movimientosQuery, [no_serie]);

    // Obtener estadísticas del equipo
    const estadisticasQuery = `
      SELECT 
        COUNT(*) as totalMovimientos,
        SUM(CASE WHEN tm.nombre = 'TRASLADO' THEN 1 ELSE 0 END) as totalTraslados,
        SUM(CASE WHEN tm.nombre = 'MANTENIMIENTO' THEN 1 ELSE 0 END) as totalMantenimientos,
        SUM(CASE WHEN tm.nombre = 'REPARACIÓN' THEN 1 ELSE 0 END) as totalReparaciones,
        SUM(CASE WHEN em.nombre = 'ABIERTO' THEN 1 ELSE 0 END) as movimientosAbiertos,
        AVG(CASE 
          WHEN mi.fechaFin IS NOT NULL 
          THEN DATEDIFF(mi.fechaFin, mi.fecha)
          ELSE NULL
        END) as promedioDiasMovimiento,
        MAX(mi.fecha) as ultimoMovimiento
      FROM movimientoinventario mi
      INNER JOIN tipomovimiento tm ON mi.idTipoMov = tm.id
      INNER JOIN estatusmovimiento em ON mi.idEstatusMov = em.id
      WHERE mi.no_serie = ?
    `;

    const estadisticas = await executeQuery(estadisticasQuery, [no_serie]);

    // Obtener equipos similares (mismo tipo y sucursal)
    const equiposSimilaresQuery = `
      SELECT 
        e.no_serie,
        e.nombreEquipo,
        e.modelo,
        ee.nombre AS estatus
      FROM equipo e
      INNER JOIN estatusequipo ee ON e.idEstatus = ee.id
      INNER JOIN layout l ON e.idLayout = l.id
      WHERE e.idTipoEquipo = ? 
        AND l.centro = (
          SELECT l2.centro 
          FROM equipo e2 
          INNER JOIN layout l2 ON e2.idLayout = l2.id 
          WHERE e2.no_serie = ?
        )
        AND e.no_serie != ?
      LIMIT 5
    `;

    const equiposSimilares = await executeQuery(equiposSimilaresQuery, [
      equipo.idTipoEquipo, 
      no_serie, 
      no_serie
    ]);

    // Compilar respuesta completa
    const response = {
      equipo: {
        ...equipo,
        fechaAlta: new Date(equipo.fechaAlta).toISOString(),
        ubicacion: {
          coordenadas: {
            latitud: equipo.latitud,
            longitud: equipo.longitud
          },
          jerarquia: {
            estado: equipo.EstadoSucursal,
            municipio: equipo.MunicipioSucursal,
            zona: equipo.ZonaSucursal,
            sucursal: equipo.SucursalActual,
            area: equipo.AreaActual
          }
        }
      },
      historial: movimientos.map(mov => ({
        ...mov,
        fecha: new Date(mov.fecha).toISOString(),
        fechaFin: mov.fechaFin ? new Date(mov.fechaFin).toISOString() : null
      })),
      estadisticas: {
        ...estadisticas[0],
        ultimoMovimiento: estadisticas[0].ultimoMovimiento 
          ? new Date(estadisticas[0].ultimoMovimiento).toISOString() 
          : null,
        promedioDiasMovimiento: Math.round(estadisticas[0].promedioDiasMovimiento || 0)
      },
      equiposSimilares,
      metadatos: {
        consultadoEn: new Date().toISOString(),
        version: '1.0'
      }
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: 'Detalles del equipo obtenidos exitosamente'
    } as ApiResponse<any>, { status: 200 });

  } catch (error) {
    console.error('Error obteniendo detalles del equipo:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<any>, { status: 500 });
  }
}