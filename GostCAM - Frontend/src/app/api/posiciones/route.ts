import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";

export async function GET() {
  try {
    const posiciones = await executeQuery(`
      SELECT 
        idPosicion as id,
        NombrePosicion as nombre,
        idCentro as sucursalId,
        COALESCE(Descripcion, '') as descripcion,
        TipoArea as tipo
      FROM GostCAM.PosicionEquipo
      ORDER BY idCentro, NombrePosicion
    `);

    return NextResponse.json({
      success: true,
      data: posiciones,
      message: 'Posiciones disponibles obtenidas'
    });

  } catch (error) {
    console.error('Error obteniendo posiciones:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}