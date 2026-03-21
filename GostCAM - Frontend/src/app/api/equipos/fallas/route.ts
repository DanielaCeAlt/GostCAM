import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { ApiResponse } from '@/types/database';

// =============================================
// /api/equipos/fallas â€” GET / POST / PUT
// Tabla real: fallas_equipos
// =============================================

interface FallaData {
  id?: number;
  no_serie: string;
  tipo_falla: 'HARDWARE' | 'SOFTWARE' | 'CONECTIVIDAD' | 'SUMINISTROS' | 'MECANICA' | 'ELECTRICA' | 'OTRA';
  descripcion_problema: string;
  sintomas: string;
  prioridad: 'BAJA' | 'NORMAL' | 'ALTA' | 'CRITICA';
  usuario_reporta: string;
  fecha_reporte: string;
  fecha_solucion?: string;
  tecnico_asignado?: string;
  solucion_aplicada?: string;
  estatus: 'ABIERTA' | 'EN_PROCESO' | 'RESUELTA' | 'CANCELADA';
  tiempo_solucion_horas?: number;
  observaciones?: string;
  ubicacion_falla: string;
  impacto: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  requiere_repuestos: boolean;
  repuestos_utilizados?: string;
  costo_reparacion?: number;
}

interface FallaResult extends FallaData {
  nombreEquipo: string;
  tipoEquipo: string;
  sucursal: string;
  diasAbierta: number;
}

interface EstadisticasFallas {
  total: number;
  abiertas: number;
  en_proceso: number;
  resueltas: number;
  promedio_solucion_horas: number;
  por_tipo: {
    hardware: number;
    software: number;
    conectividad: number;
    suministros: number;
    mecanica: number;
    electrica: number;
    otra: number;
  };
  por_prioridad: {
    baja: number;
    normal: number;
    alta: number;
    critica: number;
  };
  por_tecnico: Array<{
    tecnico: string;
    total_asignadas: number;
    resueltas: number;
    en_proceso: number;
    promedio_horas: number;
  }>;
}

// GET - Consultar fallas con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estatus = searchParams.get('estatus');
    const prioridad = searchParams.get('prioridad');
    const tipo_falla = searchParams.get('tipo_falla');
    const tecnico = searchParams.get('tecnico_asignado');

    let query = `
      SELECT
        f.id,
        f.no_serie,
        f.tipo_falla,
        f.descripcion_problema,
        f.sintomas,
        f.prioridad,
        f.usuario_reporta,
        f.fecha_reporte,
        f.fecha_solucion,
        f.tecnico_asignado,
        f.solucion_aplicada,
        f.estatus,
        f.tiempo_solucion_horas,
        f.observaciones,
        f.ubicacion_falla,
        f.impacto,
        f.requiere_repuestos,
        f.repuestos_utilizados,
        f.costo_reparacion,
        DATEDIFF(NOW(), f.fecha_reporte) AS diasAbierta,
        e.nombreEquipo,
        IFNULL(te.nombreTipo, 'Sin tipo') AS tipoEquipo,
        IFNULL(s.Sucursal, 'Sin asignar') AS sucursal
      FROM fallas_equipos f
      INNER JOIN equipo e ON f.no_serie = e.no_serie
      LEFT JOIN tipoequipo te ON e.idTipoEquipo = te.idTipoEquipo
      LEFT JOIN posicionequipo p ON e.idPosicion = p.idPosicion
      LEFT JOIN sucursales s ON p.idCentro = s.idCentro
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (estatus) { query += ` AND f.estatus = ?`; params.push(estatus); }
    if (prioridad) { query += ` AND f.prioridad = ?`; params.push(prioridad); }
    if (tipo_falla) { query += ` AND f.tipo_falla = ?`; params.push(tipo_falla); }
    if (tecnico) { query += ` AND f.tecnico_asignado LIKE ?`; params.push(`%${tecnico}%`); }

    query += ` ORDER BY f.fecha_reporte DESC`;

    const fallas = await executeQuery(query, params) as any[];

    // Calcular estadÃ­sticas
    const total = fallas.length;
    const estadisticas = {
      total,
      abiertas: fallas.filter(f => f.estatus === 'ABIERTA').length,
      en_proceso: fallas.filter(f => f.estatus === 'EN_PROCESO').length,
      resueltas: fallas.filter(f => f.estatus === 'RESUELTA').length,
      promedio_solucion_horas: 0,
      por_tipo: {
        hardware: fallas.filter(f => f.tipo_falla === 'HARDWARE').length,
        software: fallas.filter(f => f.tipo_falla === 'SOFTWARE').length,
        conectividad: fallas.filter(f => f.tipo_falla === 'CONECTIVIDAD').length,
        suministros: fallas.filter(f => f.tipo_falla === 'SUMINISTROS').length,
        mecanica: fallas.filter(f => f.tipo_falla === 'MECANICA').length,
        electrica: fallas.filter(f => f.tipo_falla === 'ELECTRICA').length,
        otra: fallas.filter(f => f.tipo_falla === 'OTRA').length,
      },
      por_prioridad: {
        baja: fallas.filter(f => f.prioridad === 'BAJA').length,
        normal: fallas.filter(f => f.prioridad === 'NORMAL').length,
        alta: fallas.filter(f => f.prioridad === 'ALTA').length,
        critica: fallas.filter(f => f.prioridad === 'CRITICA').length,
      },
      por_tecnico: [] as any[]
    };

    const resueltas = fallas.filter(f => f.estatus === 'RESUELTA' && f.tiempo_solucion_horas);
    if (resueltas.length > 0) {
      estadisticas.promedio_solucion_horas = Math.round(
        resueltas.reduce((s: number, f: any) => s + Number(f.tiempo_solucion_horas), 0) / resueltas.length * 100
      ) / 100;
    }

    const tecnicosMap = new Map<string, any>();
    fallas.forEach(f => {
      if (!f.tecnico_asignado) return;
      const t = tecnicosMap.get(f.tecnico_asignado) ?? { tecnico: f.tecnico_asignado, total_asignadas: 0, resueltas: 0, en_proceso: 0, _horas: 0 };
      t.total_asignadas++;
      if (f.estatus === 'RESUELTA') { t.resueltas++; t._horas += Number(f.tiempo_solucion_horas || 0); }
      if (f.estatus === 'EN_PROCESO') t.en_proceso++;
      tecnicosMap.set(f.tecnico_asignado, t);
    });
    estadisticas.por_tecnico = Array.from(tecnicosMap.values()).map(t => ({
      tecnico: t.tecnico, total_asignadas: t.total_asignadas, resueltas: t.resueltas,
      en_proceso: t.en_proceso,
      promedio_horas: t.resueltas > 0 ? Math.round((t._horas / t.resueltas) * 100) / 100 : 0
    }));

    return NextResponse.json({ success: true, data: { fallas, estadisticas } } as ApiResponse<any>);

  } catch (error) {
    console.error('Error consultando fallas:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' } as ApiResponse<any>, { status: 500 });
  }
}

// POST - Crear nueva falla
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      no_serie,
      tipo_falla,
      descripcion_problema,
      sintomas = '',
      prioridad = 'NORMAL',
      usuario_reporta,
      tecnico_asignado,
      ubicacion_falla,
      impacto = 'MEDIO',
      requiere_repuestos = false,
      observaciones = ''
    } = body;

    if (!no_serie || !tipo_falla || !descripcion_problema || !usuario_reporta) {
      return NextResponse.json({ success: false, error: 'Faltan campos requeridos: no_serie, tipo_falla, descripcion_problema, usuario_reporta' } as ApiResponse<any>, { status: 400 });
    }

    const equipoResult = await executeQuery(`SELECT no_serie FROM equipo WHERE no_serie = ?`, [no_serie]);
    if (equipoResult.length === 0) {
      return NextResponse.json({ success: false, error: 'Equipo no encontrado' } as ApiResponse<any>, { status: 404 });
    }

    const result = await executeQuery(`
      INSERT INTO fallas_equipos
        (no_serie, tipo_falla, descripcion_problema, sintomas, prioridad, usuario_reporta,
         tecnico_asignado, ubicacion_falla, impacto, requiere_repuestos, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      no_serie, tipo_falla, descripcion_problema, sintomas, prioridad, usuario_reporta,
      tecnico_asignado || null, ubicacion_falla || '', impacto, requiere_repuestos ? 1 : 0, observaciones
    ]);

    // Actualizar estatus del equipo segÃºn prioridad/impacto
    const idEstatusNuevo = (prioridad === 'CRITICA' || impacto === 'CRITICO') ? 6 : 7;
    await executeQuery(`UPDATE equipo SET idEstatus = ? WHERE no_serie = ?`, [idEstatusNuevo, no_serie]);

    return NextResponse.json({
      success: true,
      message: 'Falla registrada exitosamente',
      data: { fallaId: (result as any).insertId, no_serie, estatus: 'ABIERTA' }
    } as ApiResponse<any>);

  } catch (error) {
    console.error('Error creando falla:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' } as ApiResponse<any>, { status: 500 });
  }
}

// PUT - Actualizar falla existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, estatus, tecnico_asignado, solucion_aplicada, tiempo_solucion_horas, repuestos_utilizados, costo_reparacion, observaciones } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de falla requerido' } as ApiResponse<any>, { status: 400 });
    }

    const sets: string[] = [];
    const params: any[] = [];

    if (estatus !== undefined) {
      sets.push('estatus = ?'); params.push(estatus);
      if (estatus === 'RESUELTA') sets.push('fecha_solucion = NOW()');
    }
    if (tecnico_asignado !== undefined) {
      sets.push('tecnico_asignado = ?'); params.push(tecnico_asignado);
      if (tecnico_asignado && estatus !== 'RESUELTA') { sets.push('estatus = ?'); params.push('EN_PROCESO'); }
    }
    if (solucion_aplicada !== undefined) { sets.push('solucion_aplicada = ?'); params.push(solucion_aplicada); }
    if (tiempo_solucion_horas !== undefined) { sets.push('tiempo_solucion_horas = ?'); params.push(tiempo_solucion_horas); }
    if (repuestos_utilizados !== undefined) { sets.push('repuestos_utilizados = ?'); params.push(repuestos_utilizados); }
    if (costo_reparacion !== undefined) { sets.push('costo_reparacion = ?'); params.push(costo_reparacion); }
    if (observaciones !== undefined) { sets.push('observaciones = ?'); params.push(observaciones); }

    if (sets.length === 0) {
      return NextResponse.json({ success: false, error: 'No hay campos para actualizar' } as ApiResponse<any>, { status: 400 });
    }

    params.push(id);
    await executeQuery(`UPDATE fallas_equipos SET ${sets.join(', ')} WHERE id = ?`, params);

    // Si se resuelve, restaurar estatus del equipo si no tiene otras fallas abiertas
    if (estatus === 'RESUELTA') {
      const falla = await executeQuery(`SELECT no_serie FROM fallas_equipos WHERE id = ?`, [id]) as any[];
      if (falla.length > 0) {
        const no_serie = falla[0].no_serie;
        const otrasFallas = await executeQuery(
          `SELECT COUNT(*) as cnt FROM fallas_equipos WHERE no_serie = ? AND estatus IN ('ABIERTA','EN_PROCESO') AND id != ?`,
          [no_serie, id]
        ) as any[];
        if ((otrasFallas[0]?.cnt ?? 0) === 0) {
          await executeQuery(`UPDATE equipo SET idEstatus = 1 WHERE no_serie = ?`, [no_serie]);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Falla actualizada exitosamente' } as ApiResponse<any>);

  } catch (error) {
    console.error('Error actualizando falla:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' } as ApiResponse<any>, { status: 500 });
  }
}
