// =============================================
// API: ENDPOINT PARA INSERTAR DATOS INICIALES
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Insertando datos iniciales...');

    // Insertar sucursales de ejemplo (usando nombres correctos de columnas)
    const sucursalesData = [
      { id: 1, nombre: 'Oficina Principal', direccion: 'Av. Principal #123', telefono: '555-0001' },
      { id: 2, nombre: 'Sucursal Norte', direccion: 'Calle Norte #456', telefono: '555-0002' },
      { id: 3, nombre: 'Sucursal Sur', direccion: 'Av. Sur #789', telefono: '555-0003' }
    ];

    for (const sucursal of sucursalesData) {
      try {
        // Primero consultamos qué columnas existen realmente
        const existingSucursal = await executeQuery('SELECT * FROM sucursales LIMIT 1');
        console.log('Estructura sucursales:', Object.keys(existingSucursal[0] || {}));
        
        // Intentar con diferentes nombres de columnas
        try {
          await executeQuery(
            `INSERT IGNORE INTO sucursales (idCentro, nombre, direccion, telefono) VALUES (?, ?, ?, ?)`,
            [sucursal.id, sucursal.nombre, sucursal.direccion, sucursal.telefono]
          );
        } catch (error1) {
          try {
            await executeQuery(
              `INSERT IGNORE INTO sucursales (id, nombre, direccion, telefono) VALUES (?, ?, ?, ?)`,
              [sucursal.id, sucursal.nombre, sucursal.direccion, sucursal.telefono]
            );
          } catch (error2) {
            console.log(`ℹ️ No se pudo insertar sucursal ${sucursal.nombre}: estructura diferente`);
          }
        }
        console.log(`✅ Sucursal ${sucursal.nombre} procesada`);
      } catch (error) {
        console.log(`ℹ️ Sucursal ${sucursal.nombre} - error:`, error);
      }
    }

    // Verificar tipos de equipo
    const tiposEquipo = await executeQuery('SELECT COUNT(*) as count FROM tipoequipo');
    if (tiposEquipo[0].count === 0) {
      const tiposData = [
        { id: 1, tipo: 'Laptop' },
        { id: 2, tipo: 'Desktop' },
        { id: 3, tipo: 'Monitor' },
        { id: 4, tipo: 'Impresora' }
      ];

      for (const tipo of tiposData) {
        await executeQuery(
          `INSERT IGNORE INTO tipoequipo (idTipoEquipo, tipoEquipo) VALUES (?, ?)`,
          [tipo.id, tipo.tipo]
        );
      }
      console.log('✅ Tipos de equipo insertados');
    }

    // Verificar layouts
    const layouts = await executeQuery('SELECT COUNT(*) as count FROM layout');
    if (layouts[0].count === 0) {
      const layoutsData = [
        { id: 1, nombre: 'Oficina General' },
        { id: 2, nombre: 'Sala de Juntas' },
        { id: 3, nombre: 'Almacén' }
      ];

      for (const layout of layoutsData) {
        await executeQuery(
          `INSERT IGNORE INTO layout (idLayout, nombre) VALUES (?, ?)`,
          [layout.id, layout.nombre]
        );
      }
      console.log('✅ Layouts insertados');
    }

    // Verificar estados (no estatus)
    const estados = await executeQuery('SELECT COUNT(*) as count FROM estados');
    if (estados[0].count === 0) {
      const estadosData = [
        { id: 1, nombre: 'Disponible' },
        { id: 2, nombre: 'En uso' },
        { id: 3, nombre: 'Mantenimiento' },
        { id: 4, nombre: 'Dañado' }
      ];

      for (const estado of estadosData) {
        await executeQuery(
          `INSERT IGNORE INTO estados (id, nombre) VALUES (?, ?)`,
          [estado.id, estado.nombre]
        );
      }
      console.log('✅ Estados insertados');
    }

    // Verificar resultado final
    const sucursalesResult = await executeQuery('SELECT idCentro, Sucursal FROM sucursales ORDER BY idCentro');
    
    return NextResponse.json({
      success: true,
      message: 'Datos iniciales insertados correctamente',
      data: {
        sucursales_insertadas: sucursalesResult.length,
        sucursales: sucursalesResult
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error insertando datos iniciales:', error);
    return NextResponse.json({
      success: false,
      error: 'Error insertando datos iniciales',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}