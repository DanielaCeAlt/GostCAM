import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET() {
  try {
    // Consultar la tabla real de Sucursales
    const rows: any[] = await executeQuery(`
      SELECT s.idCentro, s.Sucursal, s.Direccion,
             z.Zona, e.Estado, m.Municipio,
             COUNT(DISTINCT pe.idPosicion) as posiciones,
             COUNT(DISTINCT eq.no_serie) as equiposAsignados
      FROM sucursales s
      LEFT JOIN zonas z ON z.idZona = s.idZona
      LEFT JOIN estados e ON e.idEstado = s.idEstado
      LEFT JOIN municipios m ON m.idMunicipios = s.idMunicipios
      LEFT JOIN posicionequipo pe ON pe.idCentro = s.idCentro
      LEFT JOIN equipo eq ON eq.idPosicion = pe.idPosicion AND (eq.eliminado IS NULL OR eq.eliminado = 0)
      GROUP BY s.idCentro, s.Sucursal, s.Direccion, z.Zona, e.Estado, m.Municipio
      ORDER BY s.Sucursal
    `);

    const sucursales = rows.map((r: any) => ({
      id: r.idCentro,
      nombre: r.Sucursal,
      direccion: r.Direccion || '',
      zona: r.Zona || '',
      estado: r.Estado || '',
      municipio: r.Municipio || '',
      posiciones: Number(r.posiciones) || 0,
      equiposAsignados: Number(r.equiposAsignados) || 0
    }));

    return NextResponse.json({
      success: true,
      data: sucursales
    });

  } catch (error) {
    console.error('Error obteniendo sucursales:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener sucursales',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}