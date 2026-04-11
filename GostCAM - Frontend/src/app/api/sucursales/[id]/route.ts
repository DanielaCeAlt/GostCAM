import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET /api/sucursales/[id] — datos de la sucursal + equipos asignados
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Datos de la sucursal
    const sucursalRows: any[] = await executeQuery(`
      SELECT s.idCentro, s.Sucursal, s.Direccion,
             z.idZona, z.Zona,
             e.idEstado, e.Estado,
             m.idMunicipios, m.Municipio
      FROM sucursales s
      LEFT JOIN zonas z ON z.idZona = s.idZona
      LEFT JOIN estados e ON e.idEstado = s.idEstado
      LEFT JOIN municipios m ON m.idMunicipios = s.idMunicipios
      WHERE s.idCentro = ?
    `, [id]);

    if (sucursalRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Sucursal no encontrada' }, { status: 404 });
    }

    const suc = sucursalRows[0];

    // Equipos de la sucursal (via posicionequipo)
    const equipos: any[] = await executeQuery(`
      SELECT
        eq.no_serie,
        eq.nombreEquipo,
        IFNULL(te.nombreTipo, 'Sin tipo') AS TipoEquipo,
        IFNULL(es.estatus, 'Sin estatus') AS EstatusEquipo,
        IFNULL(p.NombrePosicion, 'Sin posición') AS AreaActual,
        eq.fechaAlta,
        IFNULL(mo.marca, '') AS marca,
        IFNULL(mo.nombreModelo, '') AS modelo
      FROM equipo eq
      INNER JOIN posicionequipo p ON eq.idPosicion = p.idPosicion
      LEFT JOIN tipoequipo te ON eq.idTipoEquipo = te.idTipoEquipo
      LEFT JOIN estatusequipo es ON eq.idEstatus = es.idEstatus
      LEFT JOIN modelo mo ON eq.idModelo = mo.idModelo
      WHERE p.idCentro = ?
        AND (eq.eliminado IS NULL OR eq.eliminado = 0)
      ORDER BY eq.nombreEquipo
    `, [id]);

    // Catálogos para edición
    const zonas: any[] = await executeQuery(`SELECT idZona, Zona FROM zonas ORDER BY Zona`);
    const estados: any[] = await executeQuery(`SELECT idEstado, Estado FROM estados ORDER BY Estado`);
    const municipios: any[] = await executeQuery(`SELECT idMunicipios, Municipio FROM municipios ORDER BY Municipio`);

    return NextResponse.json({
      success: true,
      data: {
        sucursal: {
          idCentro: suc.idCentro,
          Sucursal: suc.Sucursal,
          Direccion: suc.Direccion || '',
          idZona: suc.idZona,
          Zona: suc.Zona || '',
          idEstado: suc.idEstado,
          Estado: suc.Estado || '',
          idMunicipios: suc.idMunicipios,
          Municipio: suc.Municipio || '',
        },
        equipos,
        catalogos: { zonas, estados, municipios }
      }
    });
  } catch (error) {
    console.error('Error GET sucursal:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener sucursal' }, { status: 500 });
  }
}

// PUT /api/sucursales/[id] — editar datos de la sucursal
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { Sucursal, Direccion, idZona, idEstado, idMunicipios } = body;

    if (!Sucursal || !idZona || !idEstado || !idMunicipios) {
      return NextResponse.json({ success: false, error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    await executeQuery(`
      UPDATE sucursales
      SET Sucursal = ?, Direccion = ?, idZona = ?, idEstado = ?, idMunicipios = ?
      WHERE idCentro = ?
    `, [Sucursal, Direccion || '', idZona, idEstado, idMunicipios, id]);

    return NextResponse.json({ success: true, message: 'Sucursal actualizada correctamente' });
  } catch (error) {
    console.error('Error PUT sucursal:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar sucursal' }, { status: 500 });
  }
}

// POST /api/sucursales/[id] — asignar equipo existente a esta sucursal
// Body: { no_serie: string, idPosicion?: number }
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { no_serie, idPosicion } = body;

    if (!no_serie) {
      return NextResponse.json({ success: false, error: 'no_serie es requerido' }, { status: 400 });
    }

    // Verificar que el equipo existe
    const equipoRows: any[] = await executeQuery(
      `SELECT no_serie, nombreEquipo FROM equipo WHERE no_serie = ? AND (eliminado IS NULL OR eliminado = 0)`,
      [no_serie]
    );
    if (equipoRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Equipo no encontrado' }, { status: 404 });
    }

    let targetPosicion = idPosicion;

    if (!targetPosicion) {
      // Buscar cualquier posición existente de la sucursal
      const posRows: any[] = await executeQuery(
        `SELECT idPosicion FROM posicionequipo WHERE idCentro = ? LIMIT 1`,
        [id]
      );

      if (posRows.length === 0) {
        // Crear posición genérica para la sucursal
        const result: any = await executeQuery(
          `INSERT INTO posicionequipo (NombrePosicion, idCentro) VALUES ('General', ?)`,
          [id]
        );
        targetPosicion = result.insertId;
      } else {
        targetPosicion = posRows[0].idPosicion;
      }
    }

    // Asignar el equipo a esa posición
    await executeQuery(
      `UPDATE equipo SET idPosicion = ? WHERE no_serie = ?`,
      [targetPosicion, no_serie]
    );

    return NextResponse.json({
      success: true,
      message: `Equipo ${no_serie} asignado a la sucursal correctamente`
    });
  } catch (error) {
    console.error('Error POST asignar equipo a sucursal:', error);
    return NextResponse.json({ success: false, error: 'Error al asignar equipo' }, { status: 500 });
  }
}
