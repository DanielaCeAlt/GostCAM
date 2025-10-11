// =============================================
// API: INSPECCIONAR ESTRUCTURA DE BASE DE DATOS
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Inspeccionando estructura de la base de datos...');

    // Obtener lista de todas las tablas
    const tablas = await executeQuery(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'GostCAM'
      ORDER BY TABLE_NAME
    `);

    const estructuraCompleta: any = {};

    // Para cada tabla, obtener su estructura
    for (const tabla of tablas as any[]) {
      const nombreTabla = tabla.TABLE_NAME;
      
      try {
        // Obtener columnas de la tabla
        const columnas = await executeQuery(`
          SELECT 
            COLUMN_NAME,
            DATA_TYPE,
            IS_NULLABLE,
            COLUMN_DEFAULT,
            COLUMN_KEY
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = 'GostCAM' 
            AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [nombreTabla]);

        // Contar registros en la tabla
        const count = await executeQuery(`SELECT COUNT(*) as count FROM \`${nombreTabla}\``);

        estructuraCompleta[nombreTabla] = {
          columnas: columnas,
          total_registros: count[0].count
        };

      } catch (error) {
        estructuraCompleta[nombreTabla] = {
          error: `No se pudo acceder a la tabla: ${error}`
        };
      }
    }

    // Información específica que necesitamos
    const infoEspecifica: any = {
      tablas_encontradas: tablas.map((t: any) => t.TABLE_NAME),
      total_tablas: tablas.length,
      sucursales_existe: tablas.some((t: any) => t.TABLE_NAME.toLowerCase() === 'sucursales'),
      estatus_existe: tablas.some((t: any) => t.TABLE_NAME.toLowerCase() === 'estatus')
    };

    // Si existe sucursales, obtener su estructura exacta
    if (infoEspecifica.sucursales_existe) {
      try {
        const datosSucursales = await executeQuery('SELECT * FROM sucursales LIMIT 3');
        infoEspecifica['datos_sucursales_ejemplo'] = datosSucursales;
      } catch (error) {
        infoEspecifica['error_sucursales'] = `Error leyendo sucursales: ${error}`;
      }
    }

    console.log('📋 Inspección completada. Tablas encontradas:', infoEspecifica.tablas_encontradas);

    return NextResponse.json({
      success: true,
      data: {
        resumen: infoEspecifica,
        estructura_completa: estructuraCompleta
      },
      message: `Inspección completada. ${tablas.length} tablas encontradas.`
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error inspeccionando base de datos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error inspeccionando estructura de la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}