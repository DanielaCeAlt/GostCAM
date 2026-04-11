'use client';

import React, { useState, useEffect } from 'react';

interface Catalogo {
  idZona?: number;
  idEstado?: number;
  idMunicipios?: number;
  Zona?: string;
  Estado?: string;
  Municipio?: string;
}

interface SucursalData {
  idCentro: string;
  Sucursal: string;
  Direccion: string;
  idZona: number;
  idEstado: number;
  idMunicipios: number;
  Zona?: string;
  Estado?: string;
  Municipio?: string;
}

interface SucursalEditModalProps {
  sucursal: SucursalData;
  catalogos: {
    zonas: Catalogo[];
    estados: Catalogo[];
    municipios: Catalogo[];
  };
  onSave: (updated: SucursalData) => void;
  onClose: () => void;
}

export default function SucursalEditModal({
  sucursal,
  catalogos,
  onSave,
  onClose
}: SucursalEditModalProps) {
  const [form, setForm] = useState<SucursalData>({ ...sucursal });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof SucursalData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/sucursales/${sucursal.idCentro}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Sucursal: form.Sucursal,
          Direccion: form.Direccion,
          idZona: form.idZona,
          idEstado: form.idEstado,
          idMunicipios: form.idMunicipios,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSave(form);
      } else {
        setError(data.error || 'Error al guardar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center space-x-2">
            <i className="fas fa-building text-blue-600 text-xl"></i>
            <h3 className="text-lg font-semibold text-gray-900">
              Editar Sucursal — {sucursal.idCentro}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Sucursal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.Sucursal}
              onChange={e => handleChange('Sucursal', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre de la sucursal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={form.Direccion}
              onChange={e => handleChange('Direccion', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dirección completa"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zona <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.idZona}
                onChange={e => handleChange('idZona', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                {catalogos.zonas.map(z => (
                  <option key={z.idZona} value={z.idZona}>{z.Zona}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.idEstado}
                onChange={e => handleChange('idEstado', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                {catalogos.estados.map(e => (
                  <option key={e.idEstado} value={e.idEstado}>{e.Estado}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Municipio <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.idMunicipios}
                onChange={e => handleChange('idMunicipios', Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar</option>
                {catalogos.municipios.map(m => (
                  <option key={m.idMunicipios} value={m.idMunicipios}>{m.Municipio}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
