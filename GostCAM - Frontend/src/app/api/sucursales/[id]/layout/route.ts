import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// Permitir imágenes grandes (base64)
export const config = {
  api: { bodyParser: { sizeLimit: '20mb' } },
};

// Asegura que las tablas/columnas necesarias existan
async function ensureSchema() {
  // Crear tabla con idCentro VARCHAR
  await executeQuery(`
    CREATE TABLE IF NOT EXISTS GostCAM.layout_sucursal (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      idCentro    VARCHAR(50) NOT NULL,
      nombre      VARCHAR(255) NOT NULL DEFAULT 'Plano principal',
      imagen_url  VARCHAR(500) NULL,
      imagen_data LONGTEXT NULL,
      ancho       INT NOT NULL DEFAULT 800,
      alto        INT NOT NULL DEFAULT 600,
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, []);

  // Si la tabla ya existía con idCentro INT, convertirla a VARCHAR
  const idCentroType: any[] = await executeQuery(
    `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'GostCAM' AND TABLE_NAME = 'layout_sucursal'
       AND COLUMN_NAME = 'idCentro'`,
    []
  );
  if (idCentroType.length > 0 && idCentroType[0].DATA_TYPE === 'int') {
    await executeQuery(`ALTER TABLE GostCAM.layout_sucursal MODIFY COLUMN idCentro VARCHAR(50) NOT NULL`, []);
  }

  // Añadir pos_x / pos_y a posicionequipo si no existen
  const cols: any[] = await executeQuery(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = 'GostCAM' AND TABLE_NAME = 'posicionequipo'
       AND COLUMN_NAME IN ('pos_x','pos_y')`,
    []
  );
  const existingCols = cols.map((c: any) => c.COLUMN_NAME);
  if (!existingCols.includes('pos_x')) {
    await executeQuery(`ALTER TABLE GostCAM.posicionequipo ADD COLUMN pos_x FLOAT NULL`, []);
  }
  if (!existingCols.includes('pos_y')) {
    await executeQuery(`ALTER TABLE GostCAM.posicionequipo ADD COLUMN pos_y FLOAT NULL`, []);
  }
}

// GET /api/sucursales/[id]/layout — cargar layout + dispositivos con posiciones
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ensureSchema();

    // Layout de la sucursal
    const layoutRows: any[] = await executeQuery(
      `SELECT id, idCentro, nombre, imagen_url, imagen_data, ancho, alto
       FROM GostCAM.layout_sucursal
       WHERE idCentro = ?
       ORDER BY id DESC LIMIT 1`,
      [id]
    );

    // Dispositivos con posiciones
    const dispositivos: any[] = await executeQuery(
      `SELECT
         eq.no_serie,
         eq.nombreEquipo,
         eq.modelo,
         IFNULL(te.nombreTipo, 'Sin tipo')  AS TipoEquipo,
         IFNULL(es.estatus, 'Activo')        AS EstatusEquipo,
         IFNULL(mo.marca, '')                AS marca,
         p.idPosicion,
         p.NombrePosicion,
         p.TipoArea,
         p.pos_x,
         p.pos_y
       FROM equipo eq
       INNER JOIN posicionequipo p  ON eq.idPosicion    = p.idPosicion
       LEFT JOIN tipoequipo te      ON eq.idTipoEquipo  = te.idTipoEquipo
       LEFT JOIN estatusequipo es   ON eq.idEstatus     = es.idEstatus
       LEFT JOIN GostCAM.Modelo mo  ON mo.nombreModelo  = eq.modelo
                                   AND mo.idTipoEquipo  = eq.idTipoEquipo
       WHERE p.idCentro = ?
         AND (eq.eliminado IS NULL OR eq.eliminado = 0)
       ORDER BY te.nombreTipo, eq.nombreEquipo`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        layout: layoutRows[0] || null,
        dispositivos
      }
    });
  } catch (error: any) {
    console.error('Error GET layout:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Error al cargar layout' }, { status: 500 });
  }
}

// POST /api/sucursales/[id]/layout — guardar/actualizar imagen del plano
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ensureSchema();
    const body = await request.json();
    const { nombre, imagen_data, imagen_url, ancho, alto } = body;

    if (!imagen_data && !imagen_url) {
      return NextResponse.json({ success: false, error: 'Se requiere imagen_data o imagen_url' }, { status: 400 });
    }

    // Verificar si ya existe un layout
    const existing: any[] = await executeQuery(
      `SELECT id FROM GostCAM.layout_sucursal WHERE idCentro = ? LIMIT 1`,
      [id]
    );

    if (existing.length > 0) {
      await executeQuery(
        `UPDATE GostCAM.layout_sucursal
         SET nombre = ?, imagen_data = ?, imagen_url = ?, ancho = ?, alto = ?
         WHERE idCentro = ?`,
        [nombre || 'Plano principal', imagen_data || null, imagen_url || null, ancho || 800, alto || 600, id]
      );
    } else {
      await executeQuery(
        `INSERT INTO GostCAM.layout_sucursal (idCentro, nombre, imagen_data, imagen_url, ancho, alto)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, nombre || 'Plano principal', imagen_data || null, imagen_url || null, ancho || 800, alto || 600]
      );
    }

    return NextResponse.json({ success: true, message: 'Layout guardado correctamente' });
  } catch (error: any) {
    console.error('Error POST layout:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Error al guardar layout' }, { status: 500 });
  }
}

// PUT /api/sucursales/[id]/layout — guardar posiciones de dispositivos
// Body: { posiciones: [{ no_serie, pos_x, pos_y }] }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ensureSchema();
    const body = await request.json();
    const { posiciones } = body as { posiciones: { no_serie: string; pos_x: number; pos_y: number }[] };

    if (!Array.isArray(posiciones) || posiciones.length === 0) {
      return NextResponse.json({ success: false, error: 'posiciones es requerido' }, { status: 400 });
    }

    // Actualizar pos_x / pos_y en posicionequipo a través del equipo
    for (const p of posiciones) {
      await executeQuery(
        `UPDATE GostCAM.posicionequipo pe
         INNER JOIN equipo eq ON eq.idPosicion = pe.idPosicion
         SET pe.pos_x = ?, pe.pos_y = ?
         WHERE eq.no_serie = ? AND pe.idCentro = ?`,
        [p.pos_x, p.pos_y, p.no_serie, id]
      );
    }

    return NextResponse.json({ success: true, message: 'Posiciones guardadas correctamente' });
  } catch (error: any) {
    console.error('Error PUT posiciones:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Error al guardar posiciones' }, { status: 500 });
  }
}
