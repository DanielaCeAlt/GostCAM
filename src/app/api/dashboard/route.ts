// =============================================
// API: DASHBOARD ESTADÍSTICAS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { DashboardStats, ApiResponse } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    // Obtener estadísticas básicas
    const statsQuery = `
      SELECT 
        COUNT(*) as totalEquipos,
        SUM(CASE WHEN idEstatus = 1 THEN 1 ELSE 0 END) as equiposDisponibles,
        SUM(CASE WHEN idEstatus = 2 THEN 1 ELSE 0 END) as equiposEnUso,
        SUM(CASE WHEN idEstatus IN (3, 7) THEN 1 ELSE 0 END) as equiposMantenimiento,
        SUM(CASE WHEN idEstatus = 6 THEN 1 ELSE 0 END) as equiposDañados
      FROM equipo
    `;

    const [stats] = await executeQuery(statsQuery);

    // Obtener movimientos abiertos
    const movimientosAbiertosQuery = `
      SELECT COUNT(*) as movimientosAbiertos
      FROM movimientoinventario 
      WHERE estatusMovimiento = 'ABIERTO'
    `;

    const [movimientosAbiertos] = await executeQuery(movimientosAbiertosQuery);

    // Obtener movimientos del mes actual
    const movimientosMesQuery = `
      SELECT COUNT(*) as movimientosMes
      FROM movimientoinventario 
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) 
      AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `;

    const [movimientosMes] = await executeQuery(movimientosMesQuery);

    // Obtener equipos por tipo
    const equiposPorTipoQuery = `
      SELECT 
        te.nombreTipo as tipo,
        COUNT(e.no_serie) as cantidad
      FROM tipoequipo te
      LEFT JOIN equipo e ON te.idTipoEquipo = e.idTipoEquipo
      GROUP BY te.idTipoEquipo, te.nombreTipo
      HAVING cantidad > 0
      ORDER BY cantidad DESC
      LIMIT 10
    `;

    const equiposPorTipo = await executeQuery(equiposPorTipoQuery);

    // Obtener movimientos por mes (últimos 6 meses)
    const movimientosPorMesQuery = `
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') as mes,
        COUNT(*) as cantidad
      FROM movimientoinventario 
      WHERE fecha >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(fecha, '%Y-%m')
      ORDER BY mes DESC
    `;

    const movimientosPorMes = await executeQuery(movimientosPorMesQuery);

    // Obtener porcentajes por estatus
    const estatusPorcentajesQuery = `
      SELECT 
        es.estatus,
        COUNT(e.no_serie) as cantidad,
        ROUND((COUNT(e.no_serie) * 100.0 / (SELECT COUNT(*) FROM equipo)), 2) as porcentaje
      FROM estatusequipo es
      LEFT JOIN equipo e ON es.idEstatus = e.idEstatus
      GROUP BY es.idEstatus, es.estatus
      HAVING cantidad > 0
      ORDER BY cantidad DESC
    `;

    const estatusData = await executeQuery(estatusPorcentajesQuery);

    // Definir colores para cada estatus
    const colores = {
      'Disponible': '#10B981',
      'En uso': '#3B82F6',
      'Mantenimiento': '#F59E0B',
      'En reparación': '#F59E0B',
      'Baja': '#6B7280',
      'Extraviado': '#EF4444',
      'Dañado': '#DC2626',
      'Obsoleto': '#6B7280'
    };

    const estatusPorcentajes = estatusData.map((item: any) => ({
      estatus: item.estatus,
      porcentaje: parseFloat(item.porcentaje),
      color: colores[item.estatus as keyof typeof colores] || '#6B7280'
    }));

    // Formatear movimientos por mes
    const movimientosFormateados = movimientosPorMes.map((item: any) => {
      const [year, month] = item.mes.split('-');
      const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];
      return {
        mes: `${monthNames[parseInt(month) - 1]} ${year}`,
        cantidad: item.cantidad
      };
    });

    const dashboardData: DashboardStats = {
      totalEquipos: stats.totalEquipos || 0,
      equiposDisponibles: stats.equiposDisponibles || 0,
      equiposEnUso: stats.equiposEnUso || 0,
      equiposMantenimiento: stats.equiposMantenimiento || 0,
      equiposDañados: stats.equiposDañados || 0,
      movimientosAbiertos: movimientosAbiertos.movimientosAbiertos || 0,
      movimientosMes: movimientosMes.movimientosMes || 0,
      equiposPorTipo: equiposPorTipo || [],
      movimientosPorMes: movimientosFormateados || [],
      estatusPorcentajes: estatusPorcentajes || []
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
      message: 'Dashboard cargado exitosamente'
    } as ApiResponse<DashboardStats>, { status: 200 });

  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<DashboardStats>, { status: 500 });
  }
}