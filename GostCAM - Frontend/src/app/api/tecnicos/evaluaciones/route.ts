import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { ApiResponse } from '@/types/database';

// =============================================
// /api/tecnicos/evaluaciones – GET / POST
// =============================================

// GET – Listar evaluaciones (filtro por técnico o todas)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idTecnico = searchParams.get('id_tecnico');
    const fechaDesde = searchParams.get('fecha_desde');
    const fechaHasta = searchParams.get('fecha_hasta');

    let query = `
      SELECT
        e.*,
        u.NombreUsuario AS nombre_tecnico_bd
      FROM evaluaciones_tecnicos e
      LEFT JOIN Usuarios u ON e.id_tecnico = u.idUsuarios
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (idTecnico) { query += ` AND e.id_tecnico = ?`; params.push(Number(idTecnico)); }
    if (fechaDesde) { query += ` AND DATE(e.fecha_evaluacion) >= ?`; params.push(fechaDesde); }
    if (fechaHasta) { query += ` AND DATE(e.fecha_evaluacion) <= ?`; params.push(fechaHasta); }

    query += ` ORDER BY e.fecha_evaluacion DESC`;

    const evaluaciones = await executeQuery(query, params) as any[];

    // Estadísticas por técnico
    const statsQuery = `
      SELECT
        e.id_tecnico,
        e.nombre_tecnico,
        COUNT(*) AS total_evaluaciones,
        ROUND(AVG(e.calificacion_general), 2) AS promedio_calificacion,
        ROUND(AVG(e.nivel_conocimiento), 2) AS promedio_conocimiento,
        ROUND(AVG(e.porcentaje_trabajo), 2) AS promedio_trabajo,
        ROUND(AVG(e.tiempo_solucion_horas), 2) AS promedio_horas,
        SUM(e.realizo_trabajo_completo) AS trabajos_completos,
        SUM(e.realizo_pruebas_correctas) AS pruebas_correctas,
        SUM(e.cerro_antes_tiempo) AS cierres_anticipados,
        SUM(e.programo_visita) AS visitas_programadas,
        SUM(e.num_hammys_atendidos) AS total_hammys,
        SUM(e.entrego_reporte) AS reportes_entregados
      FROM evaluaciones_tecnicos e
      WHERE 1=1
      ${idTecnico ? 'AND e.id_tecnico = ?' : ''}
      GROUP BY e.id_tecnico, e.nombre_tecnico
      ORDER BY promedio_calificacion DESC
    `;
    const statsParams = idTecnico ? [Number(idTecnico)] : [];
    const estadisticas = await executeQuery(statsQuery, statsParams) as any[];

    return NextResponse.json({
      success: true,
      data: { evaluaciones, estadisticas }
    } as ApiResponse<any>);

  } catch (error) {
    console.error('Error consultando evaluaciones:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<any>,
      { status: 500 }
    );
  }
}

// POST – Registrar nueva evaluación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      id_tecnico,
      nombre_tecnico,
      evaluador,
      id_falla,
      no_serie_equipo,
      realizo_trabajo_completo,
      porcentaje_trabajo,
      tiempo_solucion_horas,
      cerro_antes_tiempo,
      nivel_conocimiento,
      realizo_pruebas_correctas,
      calidad_solucion,
      num_hammys_atendidos,
      programo_visita,
      visita_efectiva,
      seguimiento_correcto,
      entrego_reporte,
      comunico_avances,
      calificacion_general,
      observaciones,
    } = body;

    if (!id_tecnico || !nombre_tecnico || !evaluador) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: id_tecnico, nombre_tecnico, evaluador' } as ApiResponse<any>,
        { status: 400 }
      );
    }

    // Validar rangos
    const rating = (v: any, min = 1, max = 5) => Math.min(max, Math.max(min, Number(v) || min));
    const bool = (v: any) => (v ? 1 : 0);

    const result = await executeQuery(`
      INSERT INTO evaluaciones_tecnicos (
        id_tecnico, nombre_tecnico, evaluador,
        id_falla, no_serie_equipo,
        realizo_trabajo_completo, porcentaje_trabajo,
        tiempo_solucion_horas, cerro_antes_tiempo,
        nivel_conocimiento, realizo_pruebas_correctas, calidad_solucion,
        num_hammys_atendidos, programo_visita, visita_efectiva,
        seguimiento_correcto, entrego_reporte, comunico_avances,
        calificacion_general, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      Number(id_tecnico),
      String(nombre_tecnico).trim(),
      String(evaluador).trim(),
      id_falla ? Number(id_falla) : null,
      no_serie_equipo ? String(no_serie_equipo).trim() : null,
      bool(realizo_trabajo_completo),
      rating(porcentaje_trabajo, 0, 100),
      Number(tiempo_solucion_horas) || 0,
      bool(cerro_antes_tiempo),
      rating(nivel_conocimiento),
      bool(realizo_pruebas_correctas),
      rating(calidad_solucion),
      Number(num_hammys_atendidos) || 0,
      bool(programo_visita),
      bool(visita_efectiva),
      bool(seguimiento_correcto),
      bool(entrego_reporte),
      bool(comunico_avances),
      rating(calificacion_general),
      observaciones ? String(observaciones).trim() : null,
    ]) as any;

    return NextResponse.json({
      success: true,
      message: 'Evaluación registrada exitosamente',
      data: { id: result.insertId }
    } as ApiResponse<any>);

  } catch (error) {
    console.error('Error registrando evaluación:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<any>,
      { status: 500 }
    );
  }
}

// DELETE – Eliminar evaluación
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de evaluación requerido' } as ApiResponse<any>,
        { status: 400 }
      );
    }

    await executeQuery(`DELETE FROM evaluaciones_tecnicos WHERE id = ?`, [Number(id)]);

    return NextResponse.json({
      success: true,
      message: 'Evaluación eliminada exitosamente'
    } as ApiResponse<any>);

  } catch (error) {
    console.error('Error eliminando evaluación:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<any>,
      { status: 500 }
    );
  }
}
