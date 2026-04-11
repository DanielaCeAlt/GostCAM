'use client';

import React, { useState, useEffect } from 'react';

interface EquipoDisponible {
  no_serie: string;
  nombreEquipo: string;
  TipoEquipo: string;
  EstatusEquipo: string;
  SucursalActual: string;
}

interface AsignarEquipoModalProps {
  idCentro: string;
  nombreSucursal: string;
  onSave: () => void;
  onClose: () => void;
}

export default function AsignarEquipoModal({
  idCentro,
  nombreSucursal,
  onSave,
  onClose
}: AsignarEquipoModalProps) {
  const [busqueda, setBusqueda] = useState('');
  const [equipos, setEquipos] = useState<EquipoDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const buscarEquipos = async (termino: string) => {
    if (termino.length < 2) {
      setEquipos([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/equipos?search=${encodeURIComponent(termino)}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setEquipos(data.data?.equipos || data.data || []);
      }
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => buscarEquipos(busqueda), 300);
    return () => clearTimeout(t);
  }, [busqueda]);

  const handleAsignar = async () => {
    if (!seleccionado) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/sucursales/${idCentro}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ no_serie: seleccionado }),
      });
      const data = await res.json();
      if (data.success) {
        setExito(true);
        setTimeout(() => {
          onSave();
        }, 1000);
      } else {
        setError(data.error || 'Error al asignar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center space-x-2">
            <i className="fas fa-laptop text-green-600 text-xl"></i>
            <h3 className="text-lg font-semibold text-gray-900">
              Registrar Dispositivo en {nombreSucursal}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {exito ? (
            <div className="text-center py-8">
              <i className="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
              <p className="text-green-700 font-medium">Equipo asignado correctamente</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar equipo por nombre o No. Serie
                </label>
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={e => { setBusqueda(e.target.value); setSeleccionado(null); }}
                    className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Escribe al menos 2 caracteres..."
                    autoFocus
                  />
                  {loading && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                    </div>
                  )}
                </div>
              </div>

              {equipos.length > 0 && (
                <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
                  {equipos.map(eq => (
                    <button
                      key={eq.no_serie}
                      onClick={() => setSeleccionado(eq.no_serie)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${
                        seleccionado === eq.no_serie ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{eq.nombreEquipo}</p>
                          <p className="text-xs text-gray-500">
                            #{eq.no_serie} · {eq.TipoEquipo}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{eq.SucursalActual}</span>
                          {seleccionado === eq.no_serie && (
                            <i className="fas fa-check-circle text-green-500"></i>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {busqueda.length >= 2 && !loading && equipos.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No se encontraron equipos con ese criterio
                </p>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAsignar}
                  disabled={!seleccionado || saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  <span>{saving ? 'Asignando...' : 'Asignar Dispositivo'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
