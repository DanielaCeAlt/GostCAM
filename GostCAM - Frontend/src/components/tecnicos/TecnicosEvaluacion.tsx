'use client';

import React, { useState, useEffect, useCallback } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Tecnico {
  id: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  especialidad?: string;
  zona?: string;
  activo?: number;
}

const EMPTY_TECNICO = { nombre: '', telefono: '', correo: '', especialidad: '', zona: '' };

interface EvaluacionForm {
  id_tecnico: number | '';
  nombre_tecnico: string;
  evaluador: string;
  id_falla: string;
  no_serie_equipo: string;
  realizo_trabajo_completo: boolean;
  porcentaje_trabajo: number;
  tiempo_solucion_horas: number;
  cerro_antes_tiempo: boolean;
  nivel_conocimiento: number;
  realizo_pruebas_correctas: boolean;
  calidad_solucion: number;
  num_hammys_atendidos: number;
  programo_visita: boolean;
  visita_efectiva: boolean;
  seguimiento_correcto: boolean;
  entrego_reporte: boolean;
  comunico_avances: boolean;
  observaciones: string;
}

interface Evaluacion {
  id: number;
  id_tecnico: number;
  nombre_tecnico: string;
  evaluador: string;
  fecha_evaluacion: string;
  id_falla: number | null;
  no_serie_equipo: string | null;
  realizo_trabajo_completo: number;
  porcentaje_trabajo: number;
  tiempo_solucion_horas: number;
  cerro_antes_tiempo: number;
  nivel_conocimiento: number;
  realizo_pruebas_correctas: number;
  calidad_solucion: number;
  num_hammys_atendidos: number;
  programo_visita: number;
  visita_efectiva: number;
  seguimiento_correcto: number;
  entrego_reporte: number;
  comunico_avances: number;
  calificacion_general: number;
  observaciones: string | null;
}

interface EstadisticaTecnico {
  id_tecnico: number;
  nombre_tecnico: string;
  total_evaluaciones: number;
  promedio_calificacion: number;
  promedio_conocimiento: number;
  promedio_trabajo: number;
  promedio_horas: number;
  trabajos_completos: number;
  pruebas_correctas: number;
  cierres_anticipados: number;
  visitas_programadas: number;
  total_hammys: number;
  reportes_entregados: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: EvaluacionForm = {
  id_tecnico: '',
  nombre_tecnico: '',
  evaluador: '',
  id_falla: '',
  no_serie_equipo: '',
  realizo_trabajo_completo: false,
  porcentaje_trabajo: 100,
  tiempo_solucion_horas: 0,
  cerro_antes_tiempo: false,
  nivel_conocimiento: 3,
  realizo_pruebas_correctas: false,
  calidad_solucion: 3,
  num_hammys_atendidos: 0,
  programo_visita: false,
  visita_efectiva: false,
  seguimiento_correcto: false,
  entrego_reporte: false,
  comunico_avances: false,
  observaciones: '',
};

const ESTRELLAS = [1, 2, 3, 4, 5];

function Estrellas({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {ESTRELLAS.map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={`text-xl transition-colors ${
            n <= value ? 'text-yellow-400' : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-300'}`}
        >
          ★
        </button>
      ))}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-500 self-center">
          {['', 'Muy bajo', 'Bajo', 'Regular', 'Bueno', 'Excelente'][value]}
        </span>
      )}
    </div>
  );
}

function BoolBadge({ value }: { value: number | boolean }) {
  const ok = Boolean(value);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
        ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {ok ? '✓ Sí' : '✗ No'}
    </span>
  );
}

function CalifBadge({ value }: { value: number }) {
  const colors = [
    '',
    'bg-red-100 text-red-800',
    'bg-orange-100 text-orange-800',
    'bg-yellow-100 text-yellow-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
  ];
  const labels = ['', 'Muy bajo', 'Bajo', 'Regular', 'Bueno', 'Excelente'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colors[value] || ''}`}>
      {'★'.repeat(value)} {labels[value]}
    </span>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TecnicosEvaluacion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nueva' | 'historial' | 'estadisticas' | 'gestion'>('nueva');
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticaTecnico[]>([]);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState<EvaluacionForm>(EMPTY_FORM);
  const [filtroTecnico, setFiltroTecnico] = useState('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Estado para gestión de técnicos ──
  const [tecnicosGestion, setTecnicosGestion] = useState<Tecnico[]>([]);
  const [loadingGestion, setLoadingGestion] = useState(false);
  const [formTecnico, setFormTecnico] = useState(EMPTY_TECNICO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [gestionMsg, setGestionMsg] = useState('');
  const [gestionError, setGestionError] = useState('');

  // Calificación automática al cambiar campos
  const calcularCalificacion = useCallback((f: EvaluacionForm): number => {
    let puntos = 0;
    if (f.realizo_trabajo_completo) puntos += 25;
    else puntos += (f.porcentaje_trabajo / 100) * 25;
    puntos += ((f.nivel_conocimiento - 1) / 4) * 20;
    puntos += ((f.calidad_solucion - 1) / 4) * 15;
    if (f.realizo_pruebas_correctas) puntos += 15;
    if (f.seguimiento_correcto) puntos += 10;
    if (f.entrego_reporte) puntos += 10;
    if (f.cerro_antes_tiempo) puntos += 5;
    // convertir 0-100 → 1-5
    return Math.max(1, Math.min(5, Math.round(1 + (puntos / 100) * 4)));
  }, []);

  const cargarTecnicos = useCallback(async () => {
    try {
      const res = await fetch('/api/catalogos?tipo=tecnicos');
      const data = await res.json();
      if (data.success) setTecnicos(data.data || []);
    } catch {
      /* silencioso */
    }
  }, []);

  const cargarHistorial = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroTecnico) params.append('id_tecnico', filtroTecnico);
      if (filtroDesde) params.append('fecha_desde', filtroDesde);
      if (filtroHasta) params.append('fecha_hasta', filtroHasta);
      const res = await fetch(`/api/tecnicos/evaluaciones?${params}`);
      const data = await res.json();
      if (data.success) {
        setEvaluaciones(data.data.evaluaciones || []);
        setEstadisticas(data.data.estadisticas || []);
      }
    } catch {
      /* silencioso */
    }
    setLoading(false);
  }, [filtroTecnico, filtroDesde, filtroHasta]);

  useEffect(() => {
    cargarTecnicos();
  }, [cargarTecnicos]);

  useEffect(() => {
    if (activeTab === 'historial' || activeTab === 'estadisticas') {
      cargarHistorial();
    }
    if (activeTab === 'gestion') {
      cargarTecnicosGestion();
    }
  }, [activeTab, cargarHistorial]);

  const cargarTecnicosGestion = async () => {
    setLoadingGestion(true);
    try {
      const res = await fetch('/api/tecnicos?activos=false');
      const data = await res.json();
      if (data.success) setTecnicosGestion(data.data || []);
    } catch { /* silencioso */ }
    setLoadingGestion(false);
  };

  const guardarTecnico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTecnico.nombre.trim()) { setGestionError('El nombre es obligatorio.'); return; }
    setGestionError('');
    setGestionMsg('');
    try {
      const url = '/api/tecnicos';
      const method = editandoId ? 'PUT' : 'POST';
      const body = editandoId
        ? { id: editandoId, nombreTecnico: formTecnico.nombre, ...formTecnico }
        : { nombreTecnico: formTecnico.nombre, ...formTecnico };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setGestionMsg(editandoId ? '✅ Técnico actualizado.' : '✅ Técnico registrado.');
        setFormTecnico(EMPTY_TECNICO);
        setEditandoId(null);
        cargarTecnicosGestion();
        cargarTecnicos();
        setTimeout(() => setGestionMsg(''), 3000);
      } else {
        setGestionError(`❌ ${data.error}`);
      }
    } catch { setGestionError('Error de conexión.'); }
  };

  const editarTecnico = (t: Tecnico) => {
    setEditandoId(t.id);
    setFormTecnico({ nombre: t.nombre, telefono: t.telefono || '', correo: t.correo || '', especialidad: t.especialidad || '', zona: t.zona || '' });
  };

  const toggleActivoTecnico = async (t: Tecnico) => {
    try {
      const res = await fetch('/api/tecnicos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t.id, activo: t.activo === 1 ? 0 : 1 }),
      });
      const data = await res.json();
      if (data.success) { cargarTecnicosGestion(); cargarTecnicos(); }
    } catch { /* silencioso */ }
  };

  const handleTecnicoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const tec = tecnicos.find((t) => t.id === id);
    setForm((f) => ({ ...f, id_tecnico: id || '', nombre_tecnico: tec?.nombre || '' }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let parsed: string | number | boolean = value;
    if (type === 'checkbox') parsed = (e.target as HTMLInputElement).checked;
    else if (type === 'number') parsed = Number(value);
    setForm((f) => ({ ...f, [name]: parsed }));
  };

  const handleBoolChange = (name: keyof EvaluacionForm, val: boolean) => {
    setForm((f) => ({ ...f, [name]: val }));
  };

  const handleRating = (name: keyof EvaluacionForm, val: number) => {
    setForm((f) => ({ ...f, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_tecnico || !form.evaluador.trim()) {
      setErrorMsg('Debes seleccionar un técnico e ingresar tu nombre como evaluador.');
      return;
    }
    setEnviando(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = {
        ...form,
        calificacion_general: calcularCalificacion(form),
      };
      const res = await fetch('/api/tecnicos/evaluaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('✅ Evaluación registrada exitosamente.');
        setForm(EMPTY_FORM);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(`❌ Error: ${data.error}`);
      }
    } catch {
      setErrorMsg('❌ Error de conexión al guardar la evaluación.');
    }
    setEnviando(false);
  };

  // ── Renderear ──

  const tabs = [
    { id: 'nueva',        label: 'Nueva Evaluación', icon: 'fas fa-clipboard-check' },
    { id: 'historial',    label: 'Historial',         icon: 'fas fa-history' },
    { id: 'estadisticas', label: 'Estadísticas',      icon: 'fas fa-chart-bar' },
    { id: 'gestion',      label: 'Técnicos',          icon: 'fas fa-users-cog' },
  ] as const;

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center">
            <i className="fas fa-user-check text-2xl text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Evaluación de Técnicos</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-white bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <i className={`${tab.icon} mr-2`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-white shadow rounded-lg p-6">

        {/* ── TAB: NUEVA EVALUACIÓN ── */}
        {activeTab === 'nueva' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Sección 1 – Datos generales */}
            <section>
              <h2 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-500" /> Datos generales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Técnico *</label>
                  <select
                    value={form.id_tecnico}
                    onChange={handleTecnicoChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  >
                    <option value="">Selecciona un técnico</option>
                    {tecnicos.map((t) => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evaluado por *</label>
                  <input
                    type="text"
                    name="evaluador"
                    value={form.evaluador}
                    onChange={handleFormChange}
                    required
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. de Falla (opcional)</label>
                  <input
                    type="number"
                    name="id_falla"
                    value={form.id_falla}
                    onChange={handleFormChange}
                    placeholder="ID de la falla"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. de Serie del Equipo (opcional)</label>
                  <input
                    type="text"
                    name="no_serie_equipo"
                    value={form.no_serie_equipo}
                    onChange={handleFormChange}
                    placeholder="Ej. CAM001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Sección 2 – Trabajo realizado */}
            <section>
              <h2 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <i className="fas fa-tasks text-green-500" /> Trabajo realizado
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Realizó todo el trabajo completo?
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleBoolChange('realizo_trabajo_completo', true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.realizo_trabajo_completo
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                      }`}
                    >
                      ✓ Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBoolChange('realizo_trabajo_completo', false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        !form.realizo_trabajo_completo
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                      }`}
                    >
                      ✗ No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Porcentaje de trabajo completado: <strong>{form.porcentaje_trabajo}%</strong>
                  </label>
                  <input
                    type="range"
                    name="porcentaje_trabajo"
                    min={0}
                    max={100}
                    step={5}
                    value={form.porcentaje_trabajo}
                    onChange={handleFormChange}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo de solución (horas)
                  </label>
                  <input
                    type="number"
                    name="tiempo_solucion_horas"
                    min={0}
                    step={0.5}
                    value={form.tiempo_solucion_horas}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cerró antes del tiempo estimado?
                  </label>
                  <div className="flex gap-3">
                    {[true, false].map((v) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => handleBoolChange('cerro_antes_tiempo', v)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          form.cerro_antes_tiempo === v
                            ? v ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {v ? '✓ Sí' : '✗ No'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Hammys atendidos
                  </label>
                  <input
                    type="number"
                    name="num_hammys_atendidos"
                    min={0}
                    value={form.num_hammys_atendidos}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Cantidad de equipos / casos atendidos durante la intervención</p>
                </div>
              </div>
            </section>

            {/* Sección 3 – Conocimiento y calidad */}
            <section>
              <h2 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <i className="fas fa-brain text-purple-500" /> Conocimiento y calidad
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de conocimiento demostrado
                  </label>
                  <Estrellas
                    value={form.nivel_conocimiento}
                    onChange={(v) => handleRating('nivel_conocimiento', v)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calidad de la solución aplicada
                  </label>
                  <Estrellas
                    value={form.calidad_solucion}
                    onChange={(v) => handleRating('calidad_solucion', v)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Apoyó a realizar las pruebas correctas?
                  </label>
                  <div className="flex gap-3">
                    {[true, false].map((v) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => handleBoolChange('realizo_pruebas_correctas', v)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          form.realizo_pruebas_correctas === v
                            ? v ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {v ? '✓ Sí' : '✗ No'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 4 – Operativo y seguimiento */}
            <section>
              <h2 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <i className="fas fa-clipboard-list text-orange-500" /> Operativo y seguimiento
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(
                  [
                    { key: 'programo_visita', label: '¿Programó visita?' },
                    { key: 'visita_efectiva', label: '¿La visita fue efectiva?' },
                    { key: 'seguimiento_correcto', label: '¿Realizó el seguimiento correcto?' },
                    { key: 'entrego_reporte', label: '¿Entregó reporte?' },
                    { key: 'comunico_avances', label: '¿Comunicó avances al cliente/supervisor?' },
                  ] as { key: keyof EvaluacionForm; label: string }[]
                ).map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <div className="flex gap-3">
                      {[true, false].map((v) => (
                        <button
                          key={String(v)}
                          type="button"
                          onClick={() => handleBoolChange(key, v)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            (form[key] as boolean) === v
                              ? v ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600'
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {v ? '✓ Sí' : '✗ No'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 5 – Observaciones */}
            <section>
              <h2 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <i className="fas fa-comment-alt text-gray-500" /> Observaciones adicionales
              </h2>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleFormChange}
                rows={4}
                placeholder="Escribe cualquier comentario adicional sobre el desempeño del técnico..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              />
            </section>

            {/* Resumen de calificación calculada */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Calificación estimada</p>
                <Estrellas value={calcularCalificacion(form)} readonly />
              </div>
              <button
                type="submit"
                disabled={enviando}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {enviando ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-spinner animate-spin" /> Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-save" /> Guardar Evaluación
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── TAB: HISTORIAL ── */}
        {activeTab === 'historial' && (
          <div className="space-y-4">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Técnico</label>
                <select
                  value={filtroTecnico}
                  onChange={(e) => setFiltroTecnico(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                >
                  <option value="">Todos</option>
                  {tecnicos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input
                  type="date"
                  value={filtroDesde}
                  onChange={(e) => setFiltroDesde(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input
                  type="date"
                  value={filtroHasta}
                  onChange={(e) => setFiltroHasta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={cargarHistorial}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="fas fa-search" /> Buscar
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : evaluaciones.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <i className="fas fa-clipboard text-4xl mb-3" />
                <p>No hay evaluaciones registradas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Técnico', 'Evaluador', 'Fecha', 'Trabajo', '% Trabajo', 'Horas', 'Conocimiento', 'Pruebas', 'Hammys', 'Cerró antes', 'Reporte', 'Calificación'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {evaluaciones.map((ev) => (
                      <tr key={ev.id} className="hover:bg-gray-50 text-sm">
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{ev.nombre_tecnico}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{ev.evaluador}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {new Date(ev.fecha_evaluacion).toLocaleDateString('es-MX')}
                        </td>
                        <td className="px-4 py-3"><BoolBadge value={ev.realizo_trabajo_completo} /></td>
                        <td className="px-4 py-3 text-gray-700">{ev.porcentaje_trabajo}%</td>
                        <td className="px-4 py-3 text-gray-700">{ev.tiempo_solucion_horas}h</td>
                        <td className="px-4 py-3"><CalifBadge value={ev.nivel_conocimiento} /></td>
                        <td className="px-4 py-3"><BoolBadge value={ev.realizo_pruebas_correctas} /></td>
                        <td className="px-4 py-3 text-gray-700 text-center">{ev.num_hammys_atendidos}</td>
                        <td className="px-4 py-3"><BoolBadge value={ev.cerro_antes_tiempo} /></td>
                        <td className="px-4 py-3"><BoolBadge value={ev.entrego_reporte} /></td>
                        <td className="px-4 py-3"><CalifBadge value={ev.calificacion_general} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: ESTADÍSTICAS ── */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={cargarHistorial}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`} /> Actualizar
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : estadisticas.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <i className="fas fa-chart-bar text-4xl mb-3" />
                <p>No hay datos de estadísticas disponibles.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {estadisticas.map((est) => (
                  <div key={est.id_tecnico} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{est.nombre_tecnico}</h3>
                        <p className="text-sm text-gray-500">{est.total_evaluaciones} evaluación(es) registrada(s)</p>
                      </div>
                      <CalifBadge value={Math.round(est.promedio_calificacion)} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      <StatCard
                        icon="fas fa-star"
                        color="yellow"
                        label="Promedio general"
                        value={`${est.promedio_calificacion} / 5`}
                      />
                      <StatCard
                        icon="fas fa-brain"
                        color="purple"
                        label="Conocimiento"
                        value={`${est.promedio_conocimiento} / 5`}
                      />
                      <StatCard
                        icon="fas fa-tasks"
                        color="green"
                        label="% Trabajo prom."
                        value={`${est.promedio_trabajo}%`}
                      />
                      <StatCard
                        icon="fas fa-clock"
                        color="blue"
                        label="Prom. horas"
                        value={`${est.promedio_horas}h`}
                      />
                      <StatCard
                        icon="fas fa-check-circle"
                        color="green"
                        label="Trabajos completos"
                        value={`${est.trabajos_completos} / ${est.total_evaluaciones}`}
                      />
                      <StatCard
                        icon="fas fa-vial"
                        color="indigo"
                        label="Pruebas correctas"
                        value={`${est.pruebas_correctas} / ${est.total_evaluaciones}`}
                      />
                      <StatCard
                        icon="fas fa-bolt"
                        color="orange"
                        label="Cierres anticipados"
                        value={`${est.cierres_anticipados} / ${est.total_evaluaciones}`}
                      />
                      <StatCard
                        icon="fas fa-calendar-check"
                        color="teal"
                        label="Visitas programadas"
                        value={String(est.visitas_programadas)}
                      />
                      <StatCard
                        icon="fas fa-satellite-dish"
                        color="red"
                        label="Total Hammys"
                        value={String(est.total_hammys)}
                      />
                      <StatCard
                        icon="fas fa-file-alt"
                        color="gray"
                        label="Reportes entregados"
                        value={`${est.reportes_entregados} / ${est.total_evaluaciones}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: GESTIÓN DE TÉCNICOS ── */}
        {activeTab === 'gestion' && (
          <div className="space-y-6">
            {/* Formulario alta / edición */}
            <form onSubmit={guardarTecnico} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <i className={`fas ${editandoId ? 'fa-edit text-orange-500' : 'fa-user-plus text-green-500'}`} />
                {editandoId ? `Editando técnico #${editandoId}` : 'Registrar nuevo técnico'}
              </h2>

              {gestionMsg && (
                <div className="p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">{gestionMsg}</div>
              )}
              {gestionError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{gestionError}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    value={formTecnico.nombre}
                    onChange={(e) => setFormTecnico((f) => ({ ...f, nombre: e.target.value }))}
                    required
                    placeholder="Ej. Juan Pérez López"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formTecnico.telefono}
                    onChange={(e) => setFormTecnico((f) => ({ ...f, telefono: e.target.value }))}
                    placeholder="Ej. 33 1234 5678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={formTecnico.correo}
                    onChange={(e) => setFormTecnico((f) => ({ ...f, correo: e.target.value }))}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Especialidad</label>
                  <input
                    type="text"
                    value={formTecnico.especialidad}
                    onChange={(e) => setFormTecnico((f) => ({ ...f, especialidad: e.target.value }))}
                    placeholder="Ej. Cámaras, Redes, Alarmas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Zona / Región</label>
                  <input
                    type="text"
                    value={formTecnico.zona}
                    onChange={(e) => setFormTecnico((f) => ({ ...f, zona: e.target.value }))}
                    placeholder="Ej. Zona Norte"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className={`fas ${editandoId ? 'fa-save' : 'fa-plus'}`} />
                  {editandoId ? 'Guardar cambios' : 'Registrar técnico'}
                </button>
                {editandoId && (
                  <button
                    type="button"
                    onClick={() => { setEditandoId(null); setFormTecnico(EMPTY_TECNICO); setGestionError(''); }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {/* Lista de técnicos */}
            {loadingGestion ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : tecnicosGestion.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <i className="fas fa-users text-4xl mb-3" />
                <p>No hay técnicos registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['#', 'Nombre', 'Teléfono', 'Correo', 'Especialidad', 'Zona', 'Estatus', 'Acciones'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tecnicosGestion.map((t) => (
                      <tr key={t.id} className={`text-sm hover:bg-gray-50 ${t.activo === 0 ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3 text-gray-500">{t.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{t.nombre}</td>
                        <td className="px-4 py-3 text-gray-700">{t.telefono || '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{t.correo || '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{t.especialidad || '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{t.zona || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${t.activo === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {t.activo === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => editarTecnico(t)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              title="Editar"
                            >
                              <i className="fas fa-edit" /> Editar
                            </button>
                            <button
                              onClick={() => toggleActivoTecnico(t)}
                              className={`text-xs font-medium ${t.activo === 1 ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'}`}
                              title={t.activo === 1 ? 'Desactivar' : 'Activar'}
                            >
                              <i className={`fas ${t.activo === 1 ? 'fa-ban' : 'fa-check-circle'}`} />
                              {t.activo === 1 ? ' Desactivar' : ' Activar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── StatCard helper ──────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  yellow:  'bg-yellow-50 text-yellow-700',
  purple:  'bg-purple-50 text-purple-700',
  green:   'bg-green-50  text-green-700',
  blue:    'bg-blue-50   text-blue-700',
  indigo:  'bg-indigo-50 text-indigo-700',
  orange:  'bg-orange-50 text-orange-700',
  teal:    'bg-teal-50   text-teal-700',
  red:     'bg-red-50    text-red-700',
  gray:    'bg-gray-50   text-gray-700',
};

function StatCard({
  icon,
  color,
  label,
  value,
}: {
  icon: string;
  color: string;
  label: string;
  value: string;
}) {
  const cls = COLOR_MAP[color] || COLOR_MAP.gray;
  return (
    <div className={`rounded-lg p-3 ${cls}`}>
      <div className="flex items-center gap-2 mb-1">
        <i className={`${icon} text-sm`} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

export default TecnicosEvaluacion;
