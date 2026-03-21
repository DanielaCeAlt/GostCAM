// =============================================
// API: BÚSQUEDA AVANZADA DE EQUIPOS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { VistaEquipoCompleto, ApiResponse } from '@/types/database';

// Interfaces para tipado de búsqueda
interface CountResult {
  total: number;
}

// GET: Búsqueda rápida por query parameter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('🔍 Búsqueda rápida:', q || '(todos)');

    const baseSelect = `
      SELECT 
        e.no_serie,
        IFNULL(e.nombreEquipo, '') AS nombreEquipo,
        IFNULL(e.modelo, '') AS modelo,
        IFNULL(e.numeroActivo, '') AS numeroActivo,
        e.fechaAlta,
        IFNULL(te.nombreTipo, 'Sin Tipo') AS TipoEquipo,
        IFNULL(ee.estatus, 'ACTIVO') AS EstatusEquipo,
        IFNULL(s.Sucursal, 'Sin asignar') AS SucursalActual,
        IFNULL(p.NombrePosicion, 'Sin asignar') AS AreaActual,
        IFNULL(s.idCentro, '') AS idCentroActual,
        IFNULL(u.NombreUsuario, 'Sin Asignar') AS UsuarioAsignado
      FROM equipo e
      LEFT JOIN tipoequipo te ON e.idTipoEquipo = te.idTipoEquipo
      LEFT JOIN estatusequipo ee ON e.idEstatus = ee.idEstatus
      LEFT JOIN usuarios u ON e.idUsuarios = u.idUsuarios
      LEFT JOIN posicionequipo p ON e.idPosicion = p.idPosicion
      LEFT JOIN sucursales s ON p.idCentro = s.idCentro
      WHERE (e.eliminado = 0 OR e.eliminado IS NULL)
    `;

    let query: string;
    let params: (string | number)[];

    // Sanitize limit to safe integer (avoids mysql2 prepared-statement LIMIT issue)
    const safeLimit = Math.max(1, Math.min(500, Math.floor(limit) || 50));

    if (!q || q.trim() === '') {
      // Sin término: devolver todos los equipos ordenados por nombre
      query = baseSelect + ` ORDER BY e.nombreEquipo ASC LIMIT ${safeLimit}`;
      params = [];
    } else {
      // Con término: filtrar por LIKE
      const searchPattern = `%${q.trim().replace(/[%_\\]/g, '\\$&')}%`;
      query = baseSelect + `
        AND (
          e.no_serie LIKE ? OR 
          e.nombreEquipo LIKE ? OR 
          e.modelo LIKE ? OR 
          e.numeroActivo LIKE ?
        )
      ORDER BY e.fechaAlta DESC
      LIMIT ${safeLimit}`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }

    const equipos = await executeQuery<VistaEquipoCompleto>(query, params);

    console.log('✅ Equipos encontrados (búsqueda rápida):', equipos.length);

    return NextResponse.json({
      success: true,
      data: equipos,
      message: `${equipos.length} equipos encontrados`
    } as ApiResponse<VistaEquipoCompleto[]>, { status: 200 });

  } catch (error) {
    console.error('❌ Error en búsqueda rápida:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    } as ApiResponse<VistaEquipoCompleto[]>, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      texto,
      tipoEquipo,
      estatus,
      sucursal,
      fechaAltaDesde,
      fechaAltaHasta,
      limite = 50,
      pagina = 1
    } = body;

    console.log('🔍 Búsqueda de equipos con filtros:', body);

    const whereConditions = [];
    const queryParams = [];

    // Construcción dinámica de la consulta WHERE usando la vista existente
    if (texto && texto.trim() !== '') {
      whereConditions.push(`(
        no_serie LIKE ? OR 
        nombreEquipo LIKE ? OR 
        modelo LIKE ? OR 
        numeroActivo LIKE ?
      )`);
      const textoParam = `%${texto.trim()}%`;
      queryParams.push(textoParam, textoParam, textoParam, textoParam);
    }

    if (tipoEquipo && tipoEquipo !== '') {
      whereConditions.push('TipoEquipo = ?');
      queryParams.push(tipoEquipo);
    }

    if (estatus && estatus !== '') {
      whereConditions.push('EstatusEquipo = ?');
      queryParams.push(estatus);
    }

    if (sucursal && sucursal !== '') {
      whereConditions.push('SucursalActual = ?');
      queryParams.push(sucursal);
    }

    if (fechaAltaDesde) {
      whereConditions.push('DATE(fechaAlta) >= ?');
      queryParams.push(fechaAltaDesde);
    }

    if (fechaAltaHasta) {
      whereConditions.push('DATE(fechaAlta) <= ?');
      queryParams.push(fechaAltaHasta);
    }

    // Calcular offset para paginación
    const offset = (pagina - 1) * limite;

    // Construir la consulta base usando la vista existente
    const baseQuery = 'SELECT * FROM GostCAM.VistaEquiposCompletos';
    
    // Agregar condiciones WHERE si existen
    const whereClause = whereConditions.length > 0 
      ? ` WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Consulta de conteo para paginación
    const countQuery = `SELECT COUNT(*) as total FROM GostCAM.VistaEquiposCompletos${whereClause}`;

    // Consulta principal con paginación y ordenamiento
    const mainQuery = `${baseQuery}${whereClause} ORDER BY fechaAlta DESC LIMIT ? OFFSET ?`;

    console.log('📊 Ejecutando consulta de conteo:', countQuery);
    console.log('📊 Parámetros de conteo:', queryParams);

    // Ejecutar consulta de conteo
    const countResult = await executeQuery<CountResult>(countQuery, queryParams);
    const totalRegistros = countResult[0]?.total || 0;

    console.log('📊 Total de registros encontrados:', totalRegistros);

    // Ejecutar consulta principal
    const finalParams = [...queryParams, limite, offset];
    console.log('📋 Ejecutando consulta principal:', mainQuery);
    console.log('📋 Parámetros finales:', finalParams);

    const equipos = await executeQuery<VistaEquipoCompleto>(mainQuery, finalParams);

    console.log('✅ Equipos encontrados:', equipos.length);

    // Calcular datos de paginación
    const totalPaginas = Math.ceil(totalRegistros / limite);
    const paginaActual = pagina;

    const pagination = {
      paginaActual,
      totalPaginas,
      totalRegistros,
      hayAnterior: paginaActual > 1,
      haySiguiente: paginaActual < totalPaginas
    };

    return NextResponse.json({
      success: true,
      data: equipos,
      pagination,
      message: `Se encontraron ${equipos.length} equipos`
    } as ApiResponse<VistaEquipoCompleto[]>, { status: 200 });

  } catch (error) {
    console.error('❌ Error en búsqueda de equipos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    } as ApiResponse<VistaEquipoCompleto[]>, { status: 500 });
  }
}