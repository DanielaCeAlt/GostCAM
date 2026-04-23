import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { ApiResponse } from '@/types/database';

// =============================================
// /api/tecnicos  –  GET / POST / PUT / DELETE
// Tabla: GostCAM.Tecnicos
// =============================================

// GET – Listar técnicos (todos o solo activos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const soloActivos = searchParams.get('activos') !== 'false'; // default: true

    const tecnicos = await executeQuery(
      `SELECT idTecnico AS id, nombreTecnico AS nombre,
              telefono, correo, especialidad, zona, activo,
              created_at, updated_at
       FROM GostCAM.Tecnicos
       ${soloActivos ? 'WHERE activo = 1' : ''}
       ORDER BY nombreTecnico`,
      []
    );

    return NextResponse.json({ success: true, data: tecnicos } as ApiResponse<any>);
  } catch (error) {
    console.error('Error listando técnicos:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<any>,
      { status: 500 }
    );
  }
}

// POST – Crear técnico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombreTecnico, telefono, correo, especialidad, zona } = body;

    if (!nombreTecnico?.trim()) {
      return NextResponse.json(
        { success: false, error: 'El nombre del técnico es obligatorio' } as ApiResponse<any>,
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `INSERT INTO GostCAM.Tecnicos (nombreTecnico, telefono, correo, especialidad, zona)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombreTecnico.trim(),
        telefono?.trim() || null,
        correo?.trim() || null,
        especialidad?.trim() || null,
        zona?.trim() || null,
      ]
    ) as any;

    return NextResponse.json({
      success: true,
      message: 'Técnico registrado exitosamente',
      data: { id: result.insertId },
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error creando técnico:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<any>,
      { status: 500 }
    );
  }
}

// PUT – Actualizar técnico
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nombreTecnico, telefono, correo, especialidad, zona, activo } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del técnico requerido' } as ApiResponse<any>,
        { status: 400 }
      );
    }

    const sets: string[] = [];
    const params: any[] = [];

    if (nombreTecnico !== undefined) { sets.push('nombreTecnico = ?'); params.push(nombreTecnico.trim()); }
    if (telefono    !== undefined) { sets.push('telefono = ?');     params.push(telefono?.trim() || null); }
    if (correo      !== undefined) { sets.push('correo = ?');       params.push(correo?.trim() || null); }
    if (especialidad !== undefined){ sets.push('especialidad = ?'); params.push(especialidad?.trim() || null); }
    if (zona        !== undefined) { sets.push('zona = ?');         params.push(zona?.trim() || null); }
    if (activo      !== undefined) { sets.push('activo = ?');       params.push(activo ? 1 : 0); }

    if (sets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay campos para actualizar' } as ApiResponse<any>,
        { status: 400 }
      );
    }

    params.push(Number(id));
    await executeQuery(
      `UPDATE GostCAM.Tecnicos SET ${sets.join(', ')} WHERE idTecnico = ?`,
      params
    );

    return NextResponse.json({
      success: true,
      message: 'Técnico actualizado exitosamente',
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error actualizando técnico:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<any>,
      { status: 500 }
    );
  }
}

// DELETE – Desactivar (baja lógica) o eliminar técnico
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const fisico = searchParams.get('fisico') === 'true';

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del técnico requerido' } as ApiResponse<any>,
        { status: 400 }
      );
    }

    if (fisico) {
      await executeQuery('DELETE FROM GostCAM.Tecnicos WHERE idTecnico = ?', [Number(id)]);
    } else {
      // Baja lógica por defecto
      await executeQuery('UPDATE GostCAM.Tecnicos SET activo = 0 WHERE idTecnico = ?', [Number(id)]);
    }

    return NextResponse.json({
      success: true,
      message: fisico ? 'Técnico eliminado' : 'Técnico desactivado',
    } as ApiResponse<any>);
  } catch (error) {
    console.error('Error eliminando técnico:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<any>,
      { status: 500 }
    );
  }
}
