// =============================================
// API: CATÁLOGOS DEL SISTEMA
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { getCatalogos, executeQuery } from '@/lib/database';
import { ApiResponse } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    if (!tipo) {
      // Si no se especifica tipo, devolver todos los catálogos
      const catalogos = await getCatalogos();
      return NextResponse.json({
        success: true,
        data: catalogos,
        message: 'Catálogos obtenidos exitosamente'
      } as ApiResponse<any>, { status: 200 });
    }

    // Si se especifica un tipo, devolver solo ese catálogo
    let data: any[] = [];
    
    switch (tipo.toLowerCase()) {
      case 'tiposequipo':
        data = await executeQuery(`
          SELECT idTipoEquipo, nombreTipo as nombre, descripcion
          FROM GostCAM.TipoEquipo
          ORDER BY nombreTipo
        `);
        break;
      
      case 'sucursales':
        // Obtener sucursales con IDs reales de la tabla sucursales
        data = await executeQuery(`
          SELECT 
            ROW_NUMBER() OVER (ORDER BY Sucursal) as id,
            idCentro,
            Sucursal as nombre, 
            Direccion as direccion,
            idZona as zona,
            idEstado as estado,
            idMunicipios as municipio
          FROM sucursales
          ORDER BY Sucursal
        `);
        break;
      
      case 'usuarios':
        // Obtener usuarios con IDs numéricos
        data = await executeQuery(`
          SELECT idUsuarios, NombreUsuario, NivelUsuario, Correo
          FROM GostCAM.Usuarios
          ORDER BY NombreUsuario
        `);
        break;
      
      case 'estatus':
        // Obtener estatus con IDs numéricos
        data = await executeQuery(`
          SELECT idEstatus, estatus as nombre
          FROM GostCAM.EstatusEquipo
          ORDER BY estatus
        `);
        break;
      
      case 'modelos':
        data = await executeQuery(`
          SELECT 
            idModelo,
            nombreModelo as nombre,
            marca,
            idTipoEquipo
          FROM GostCAM.Modelo
          ORDER BY nombreModelo
        `);
        break;

      case 'tecnicos':
        data = await executeQuery(`
          SELECT idUsuarios as id, NombreUsuario as nombre
          FROM GostCAM.Usuarios
          WHERE NivelUsuario IN (1, 2, 3)
          ORDER BY NombreUsuario
        `);
        break;

      default:
        return NextResponse.json({
          success: false,
          error: `Tipo de catálogo no válido: ${tipo}`
        } as ApiResponse<any>, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: `Catálogo ${tipo} obtenido exitosamente`
    } as ApiResponse<any>, { status: 200 });

  } catch (error) {
    console.error('Error obteniendo catálogos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    } as ApiResponse<any>, { status: 500 });
  }
}