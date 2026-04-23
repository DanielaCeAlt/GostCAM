'use client';

import React, { useState, useCallback } from 'react';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FallaParaEvaluar {
  id: number;
  no_serie: string;
  tecnico_asignado?: string;
  tiempo_solucion_horas?: number;
}

interface ModalEvaluacionTecnicoProps {
  falla: FallaParaEvaluar;
  tecnicos: { id: number; nombre: string }[];
  onClose: () => void;      // omitir / cerrar
  onGuardado: () => void;   // evaluación enviada
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BOOL_KEYS = [
  'realizo_trabajo_completo',
  'cerro_antes_tiempo',
  'realizo_pruebas_correctas',
  'programo_visita',
  'visita_efectiva',
  'seguimiento_correcto',
  'entrego_reporte',
  'comunico_avances',
] as const;

type BoolKey = typeof BOOL_KEYS[number];

interface EvalForm {
  id_tecnico: number | '';
  nombre_tecnico: string;
  evaluador: string;
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

const LABELS: Record<BoolKey, string> = {
  realizo_trabajo_completo:  '¿Realizó el trabajo completo?',
  cerro_antes_tiempo:        '¿Cerró antes del tiempo estimado?',
  realizo_pruebas_correctas: '¿Realizó las pruebas correctas?',
  programo_visita:           '¿Programó visita previa?',
  visita_efectiva:           '¿La visita fue efectiva?',
  seguimiento_correcto:      '¿Realizó seguimiento correcto?',
  entrego_reporte:           '¿Entregó reporte?',
  comunico_avances:          '¿Comunicó avances al supervisor?',
};

function Estrellas({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ['', 'Muy bajo', 'Bajo', 'Regular', 'Bueno', 'Excelente'];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl transition-colors ${n <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-300`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-xs text-gray-500">{labels[value]}</span>
    </div>
  );
}

function BoolToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
          value ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
        }`}
      >
        ✓ Sí
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
          !value ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-red-50'
        }`}
      >
        ✗ No
      </button>
    </div>
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ModalEvaluacionTecnico({
  falla,
  tecnicos,
  onClose,
  onGuardado,
}: ModalEvaluacionTecnicoProps) {
  // Pre-llenar con datos de la falla
  const tecnicoCoincide = tecnicos.find(
    (t) => t.nombre.toLowerCase() === (falla.tecnico_asignado ?? '').toLowerCase()
  );

  const [form, setForm] = useState<EvalForm>({
    id_tecnico: tecnicoCoincide?.id ?? '',
    nombre_tecnico: falla.tecnico_asignado ?? '',
    evaluador: '',
    realizo_trabajo_completo: false,
    porcentaje_trabajo: 100,
    tiempo_solucion_horas: falla.tiempo_solucion_horas ?? 0,
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
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const calcCalif = useCallback((f: EvalForm) => {
    let p = 0;
    if (f.realizo_trabajo_completo) p += 25;
    else p += (f.porcentaje_trabajo / 100) * 25;
    p += ((f.nivel_conocimiento - 1) / 4) * 20;
    p += ((f.calidad_solucion - 1) / 4) * 15;
    if (f.realizo_pruebas_correctas) p += 15;
    if (f.seguimiento_correcto) p += 10;
    if (f.entrego_reporte) p += 10;
    if (f.cerro_antes_tiempo) p += 5;
    return Math.max(1, Math.min(5, Math.round(1 + (p / 100) * 4)));
  }, []);

  const set = (key: keyof EvalForm, val: EvalForm[keyof EvalForm]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleTecnicoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const t = tecnicos.find((x) => x.id === id);
    setForm((f) => ({ ...f, id_tecnico: id || '', nombre_tecnico: t?.nombre ?? '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_tecnico || !form.evaluador.trim()) {
      setError('Selecciona el técnico e ingresa tu nombre como evaluador.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      const res = await fetch('/api/tecnicos/evaluaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          id_falla: falla.id,
          no_serie_equipo: falla.no_serie,
          calificacion_general: calcCalif(form),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onGuardado();
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch {
      setError('Error de conexión al guardar.');
    }
    setEnviando(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-600 rounded-t-xl">
          <div className="flex items-center gap-3">
            <i className="fas fa-user-check text-white text-xl" />
            <div>
              <h2 className="text-white font-bold text-base">Evaluación del Técnico</h2>
              <p className="text-blue-100 text-xs">Falla #{falla.id} — {falla.no_serie}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white transition-colors text-lg"
            title="Omitir evaluación"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Body scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
          )}

          {/* Técnico y evaluador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Técnico *</label>
              <select
                value={form.id_tecnico}
                onChange={handleTecnicoChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              >
                <option value="">Selecciona técnico</option>
                {tecnicos.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Evaluado por *</label>
              <input
                type="text"
                value={form.evaluador}
                onChange={(e) => set('evaluador', e.target.value)}
                required
                placeholder="Tu nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              />
            </div>
          </div>

          {/* Trabajo y tiempo */}
          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
            <legend className="text-xs font-bold text-gray-600 px-1 uppercase tracking-wide">
              Trabajo realizado
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">¿Realizó el trabajo completo?</p>
                <BoolToggle
                  value={form.realizo_trabajo_completo}
                  onChange={(v) => set('realizo_trabajo_completo', v)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  % Completado: <strong>{form.porcentaje_trabajo}%</strong>
                </label>
                <input
                  type="range"
                  min={0} max={100} step={5}
                  value={form.porcentaje_trabajo}
                  onChange={(e) => set('porcentaje_trabajo', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tiempo de solución (horas)</label>
                <input
                  type="number"
                  min={0} step={0.5}
                  value={form.tiempo_solucion_horas}
                  onChange={(e) => set('tiempo_solucion_horas', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nº de Hammys atendidos</label>
                <input
                  type="number"
                  min={0}
                  value={form.num_hammys_atendidos}
                  onChange={(e) => set('num_hammys_atendidos', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                />
              </div>
            </div>
          </fieldset>

          {/* Calidad */}
          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
            <legend className="text-xs font-bold text-gray-600 px-1 uppercase tracking-wide">
              Conocimiento y calidad
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Nivel de conocimiento</p>
                <Estrellas value={form.nivel_conocimiento} onChange={(v) => set('nivel_conocimiento', v)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Calidad de la solución</p>
                <Estrellas value={form.calidad_solucion} onChange={(v) => set('calidad_solucion', v)} />
              </div>
            </div>
          </fieldset>

          {/* Checks booleanos */}
          <fieldset className="border border-gray-200 rounded-lg p-4">
            <legend className="text-xs font-bold text-gray-600 px-1 uppercase tracking-wide">
              Operativo y seguimiento
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {BOOL_KEYS.map((key) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-700">{LABELS[key]}</span>
                  <BoolToggle
                    value={form[key] as boolean}
                    onChange={(v) => set(key, v)}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Observaciones adicionales</label>
            <textarea
              rows={3}
              value={form.observaciones}
              onChange={(e) => set('observaciones', e.target.value)}
              placeholder="Comentarios sobre el desempeño del técnico..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
            />
          </div>

          {/* Calificación estimada */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-blue-800">Calificación estimada:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={`text-xl ${n <= calcCalif(form) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
          >
            Omitir
          </button>
          <button
            type="submit"
            form=""
            disabled={enviando}
            onClick={handleSubmit}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {enviando ? (
              <><i className="fas fa-spinner animate-spin" /> Guardando...</>
            ) : (
              <><i className="fas fa-save" /> Guardar Evaluación</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
