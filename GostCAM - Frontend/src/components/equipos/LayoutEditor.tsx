'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Dispositivo {
  no_serie: string;
  nombreEquipo: string;
  TipoEquipo: string;
  EstatusEquipo: string;
  idPosicion: number;
  NombrePosicion: string;
  modelo: string;
  marca: string;
  pos_x: number | null;
  pos_y: number | null;
}

interface LayoutData {
  id: number;
  nombre: string;
  imagen_url: string | null;
  imagen_data: string | null;
  ancho: number;
  alto: number;
}

interface LayoutEditorProps {
  idCentro: string;
  nombreSucursal: string;
  onClose: () => void;
}

const ICON_SIZE = 36;

function getDeviceIcon(tipo: string) {
  const t = tipo.toLowerCase();
  if (t.includes('cámara') || t.includes('camara') || t.includes('camera')) return '📷';
  if (t.includes('sensor')) return '📡';
  if (t.includes('alarma') || t.includes('detector')) return '🚨';
  if (t.includes('control') || t.includes('acceso')) return '🔐';
  return '💻';
}

function getDeviceColor(tipo: string) {
  const t = tipo.toLowerCase();
  if (t.includes('cámara') || t.includes('camara') || t.includes('camera')) return '#3B82F6'; // blue
  if (t.includes('sensor')) return '#10B981'; // green
  if (t.includes('alarma') || t.includes('detector')) return '#EF4444'; // red
  return '#8B5CF6'; // purple
}

export default function LayoutEditor({ idCentro, nombreSucursal, onClose }: LayoutEditorProps) {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [esPDF, setEsPDF] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [dispositivoActivo, setDispositivoActivo] = useState<string | null>(null);
  const [posicionesPendientes, setPosicionesPendientes] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cargarLayout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sucursales/${encodeURIComponent(idCentro)}/layout`);
      const data = await res.json();
      if (data.success) {
        setLayout(data.data.layout);
        setDispositivos(data.data.dispositivos || []);
        const imgData: string | null = data.data.layout?.imagen_data || null;
        setEsPDF(!!imgData && imgData.startsWith('data:application/pdf'));
      }
    } catch (e) {
      console.error('Error cargando layout:', e);
    } finally {
      setLoading(false);
    }
  }, [idCentro]);

  useEffect(() => {
    cargarLayout();
  }, [cargarLayout]);

  // Subir imagen del plano o PDF
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;

      if (isPdf) {
        // PDF: no necesitamos dimensiones reales
        setSaving(true);
        try {
          const res = await fetch(`/api/sucursales/${encodeURIComponent(idCentro)}/layout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: 'Plano principal',
              imagen_data: base64,
              ancho: 800,
              alto: 600,
            }),
          });
          const data = await res.json();
          if (data.success) {
            setEsPDF(true);
            await cargarLayout();
            setMensaje({ tipo: 'ok', texto: 'Plano PDF guardado correctamente' });
          } else {
            setMensaje({ tipo: 'error', texto: data.error || 'Error al guardar PDF' });
          }
        } finally {
          setSaving(false);
        }
        return;
      }

      // Imagen: obtener dimensiones reales
      const img = new Image();
      img.onload = async () => {
        setSaving(true);
        try {
          const res = await fetch(`/api/sucursales/${encodeURIComponent(idCentro)}/layout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: 'Plano principal',
              imagen_data: base64,
              ancho: img.width,
              alto: img.height,
            }),
          });
          const data = await res.json();
          if (data.success) {
            await cargarLayout();
            setMensaje({ tipo: 'ok', texto: 'Plano guardado correctamente' });
          } else {
            setMensaje({ tipo: 'error', texto: data.error || 'Error al guardar plano' });
          }
        } finally {
          setSaving(false);
        }
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  // Guardar posiciones en la BD
  const guardarPosiciones = async () => {
    if (posicionesPendientes.size === 0) return;
    setSaving(true);
    try {
      const posiciones = Array.from(posicionesPendientes.entries()).map(([no_serie, pos]) => ({
        no_serie,
        pos_x: pos.x,
        pos_y: pos.y,
      }));
      const res = await fetch(`/api/sucursales/${encodeURIComponent(idCentro)}/layout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posiciones }),
      });
      const data = await res.json();
      if (data.success) {
        setPosicionesPendientes(new Map());
        setModoEdicion(false);
        setDispositivoActivo(null);
        await cargarLayout();
        setMensaje({ tipo: 'ok', texto: `${posiciones.length} posición(es) guardada(s) correctamente` });
      } else {
        setMensaje({ tipo: 'error', texto: data.error || 'Error al guardar' });
      }
    } finally {
      setSaving(false);
    }
  };

  // Calcular posición en % relativa al contenedor del canvas
  const calcularPosicion = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  };

  // Click en canvas para colocar dispositivo seleccionado
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!modoEdicion || !dispositivoActivo || dragging) return;
    const pos = calcularPosicion(e.clientX, e.clientY);
    if (!pos) return;

    setPosicionesPendientes(prev => new Map(prev).set(dispositivoActivo, pos));
    setDispositivos(prev => {
      const updated = prev.map(d => d.no_serie === dispositivoActivo ? { ...d, pos_x: pos.x, pos_y: pos.y } : d);
      // Auto-avanzar al siguiente sin colocar
      const sinColocarAhora = updated.filter(d => d.pos_x == null && d.pos_y == null);
      if (sinColocarAhora.length > 0) {
        setDispositivoActivo(sinColocarAhora[0].no_serie);
      } else {
        setDispositivoActivo(null);
      }
      return updated;
    });
  };

  // Drag & drop de dispositivos ya colocados
  const handleDragStart = (e: React.MouseEvent, no_serie: string) => {
    if (!modoEdicion) return;
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const disp = dispositivos.find(d => d.no_serie === no_serie);
    if (disp?.pos_x == null || disp?.pos_y == null) return;

    const iconX = (disp.pos_x / 100) * rect.width + rect.left;
    const iconY = (disp.pos_y / 100) * rect.height + rect.top;
    setDragOffset({ x: e.clientX - iconX, y: e.clientY - iconY });
    setDragging(no_serie);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(100, ((e.clientX - dragOffset.x - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - dragOffset.y - rect.top) / rect.height) * 100));
    setDispositivos(prev =>
      prev.map(d => d.no_serie === dragging ? { ...d, pos_x: x, pos_y: y } : d)
    );
  }, [dragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      const disp = dispositivos.find(d => d.no_serie === dragging);
      if (disp?.pos_x != null && disp?.pos_y != null) {
        setPosicionesPendientes(prev => new Map(prev).set(dragging, { x: disp.pos_x!, y: disp.pos_y! }));
      }
      setDragging(null);
    }
  }, [dragging, dispositivos]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Auto-ocultar mensaje
  useEffect(() => {
    if (mensaje) {
      const t = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(t);
    }
  }, [mensaje]);

  const imagenSrc = layout?.imagen_data || layout?.imagen_url || null;
  const esPDFActual = esPDF || (!!imagenSrc && imagenSrc.startsWith('data:application/pdf'));
  const colocados = dispositivos.filter(d => d.pos_x != null && d.pos_y != null);
  const sinColocar = dispositivos.filter(d => d.pos_x == null || d.pos_y == null);
  const tiposUnicos = ['Todos', ...Array.from(new Set(dispositivos.map(d => d.TipoEquipo))).sort()];
  const dispositivosFiltrados = filtroTipo === 'Todos' ? dispositivos : dispositivos.filter(d => d.TipoEquipo === filtroTipo);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <i className="fas fa-map text-blue-600 text-xl"></i>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Layout de Dispositivos</h2>
              <p className="text-sm text-gray-500">{nombreSucursal}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Subir plano */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={saving}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <i className="fas fa-upload"></i>
              <span>Subir plano</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleImageUpload} />

            {/* Toggle modo edición — solo disponible para imágenes, no PDFs */}
            {imagenSrc && !esPDFActual && (
              <button
                onClick={async () => {
                  if (modoEdicion && posicionesPendientes.size > 0) {
                    // Auto-guardar al salir del modo edición
                    await guardarPosiciones();
                  } else {
                    setModoEdicion(!modoEdicion);
                    setDispositivoActivo(null);
                  }
                }}
                disabled={saving}
                className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md disabled:opacity-50 ${
                  modoEdicion && posicionesPendientes.size > 0
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : modoEdicion
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {saving
                  ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  : <i className={`fas ${
                      modoEdicion && posicionesPendientes.size > 0
                        ? 'fa-save'
                        : modoEdicion ? 'fa-check' : 'fa-edit'
                    }`}></i>
                }
                <span>
                  {modoEdicion && posicionesPendientes.size > 0
                    ? `Guardar (${posicionesPendientes.size})`
                    : modoEdicion ? 'Finalizar edición' : 'Editar posiciones'}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                if (posicionesPendientes.size > 0) {
                  if (confirm('Tienes cambios sin guardar. ¿Deseas guardar antes de cerrar?')) {
                    guardarPosiciones().then(onClose);
                  } else {
                    onClose();
                  }
                } else {
                  onClose();
                }
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Mensaje flash */}
        {mensaje && (
          <div className={`mx-6 mt-3 px-4 py-2 rounded text-sm ${
            mensaje.tipo === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {mensaje.tipo === 'ok' ? '✓ ' : '✗ '}{mensaje.texto}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">

            {/* Panel lateral: lista de dispositivos */}
            <div className="w-72 border-r bg-gray-50 flex flex-col overflow-hidden">
              {/* Encabezado con contadores */}
              <div className="px-4 py-3 border-b bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dispositivos ({dispositivos.length})
                  </p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                      <span className="text-gray-500">{colocados.length}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
                      <span className="text-gray-500">{sinColocar.length}</span>
                    </span>
                  </div>
                </div>

                {/* Filtro por categoría */}
                {tiposUnicos.length > 2 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tiposUnicos.map(tipo => (
                      <button
                        key={tipo}
                        onClick={() => setFiltroTipo(tipo)}
                        className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                          filtroTipo === tipo
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {tipo === 'Todos' ? 'Todos' : `${getDeviceIcon(tipo)} ${tipo}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Instrucción modo edición */}
              {modoEdicion && (
                <div className="mx-3 mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  {dispositivoActivo
                    ? <>
                        <span className="font-semibold">Haz clic en el plano</span> para colocar el dispositivo seleccionado.
                        Los demás se colocarán automáticamente uno a uno.
                      </>
                    : sinColocar.length > 0
                      ? 'Selecciona un dispositivo de la lista para comenzar a colocarlo.'
                      : '✓ Todos los dispositivos están colocados.'}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {dispositivosFiltrados.length === 0 && (
                  <p className="text-xs text-gray-400 px-2 py-4 text-center">
                    No hay dispositivos en esta categoría
                  </p>
                )}

                {dispositivosFiltrados.map(d => {
                  const colocado = d.pos_x != null && d.pos_y != null;
                  const pendiente = posicionesPendientes.has(d.no_serie);
                  const activo = dispositivoActivo === d.no_serie;

                  return (
                    <button
                      key={d.no_serie}
                      onClick={() => modoEdicion && setDispositivoActivo(activo ? null : d.no_serie)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activo
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : colocado
                          ? 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                          : 'bg-white border border-dashed border-gray-300 hover:border-yellow-400'
                      } ${modoEdicion ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-xl leading-none mt-0.5">{getDeviceIcon(d.TipoEquipo)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate leading-tight ${activo ? 'text-white' : 'text-gray-900'}`}>
                            {d.nombreEquipo}
                          </p>
                          {/* Categoría */}
                          <p className={`text-xs truncate ${activo ? 'text-blue-100' : 'text-blue-600'} font-medium`}>
                            {d.TipoEquipo}
                          </p>
                          {/* Marca y Modelo */}
                          {(d.marca || d.modelo) && (
                            <p className={`text-xs truncate ${activo ? 'text-blue-200' : 'text-gray-500'}`}>
                              {[d.marca, d.modelo].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {/* Área */}
                          <p className={`text-xs truncate ${activo ? 'text-blue-200' : 'text-gray-400'}`}>
                            {d.NombrePosicion}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                          {pendiente && <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" title="Cambio pendiente"></span>}
                          {!pendiente && colocado && <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" title="Colocado"></span>}
                          {!colocado && !pendiente && <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" title="Sin colocar"></span>}
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            d.EstatusEquipo === 'Activo'
                              ? activo ? 'bg-green-400 text-white' : 'bg-green-100 text-green-700'
                              : activo ? 'bg-red-400 text-white' : 'bg-red-100 text-red-600'
                          }`}>
                            {d.EstatusEquipo}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Leyenda */}
              <div className="p-3 border-t bg-white">
                <p className="text-xs font-semibold text-gray-500 mb-2">Leyenda</p>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                    <span>Colocado</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
                    <span>Cambio pendiente</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span>
                    <span>Sin colocar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas del plano */}
            <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-4">
              {!imagenSrc ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-gray-400 rounded-xl p-16 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-white"
                >
                  <i className="fas fa-file-upload text-5xl text-gray-300 mb-4 block"></i>
                  <p className="text-gray-600 font-semibold text-lg mb-1">Sin plano cargado</p>
                  <p className="text-gray-400 text-sm">Haz clic para subir el plano de la sucursal</p>
                  <p className="text-gray-400 text-xs mt-2">PNG, JPG, SVG o PDF hasta 20MB</p>
                </div>
              ) : (
                <div
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`relative select-none ${modoEdicion && dispositivoActivo ? 'cursor-crosshair' : modoEdicion ? 'cursor-default' : 'cursor-default'}`}
                  style={{ display: 'inline-block' }}
                >
                  {/* Imagen o PDF del plano */}
                  {esPDFActual ? (
                    <iframe
                      src={imagenSrc!}
                      title="Plano PDF"
                      className="block rounded-lg shadow-lg bg-white"
                      style={{ width: '75vw', height: '65vh', border: 'none' }}
                    />
                  ) : (
                    <img
                      src={imagenSrc!}
                      alt="Plano de la sucursal"
                      className="max-w-full max-h-[65vh] block rounded-lg shadow-lg"
                      draggable={false}
                      style={{ userSelect: 'none' }}
                    />
                  )}

                  {/* Overlay de edición */}
                  {modoEdicion && (
                    <div className="absolute inset-0 rounded-lg ring-4 ring-blue-400 ring-opacity-60 pointer-events-none" />
                  )}

                  {/* Pines de dispositivos */}
                  {dispositivos.map(d => {
                    if (d.pos_x == null || d.pos_y == null) return null;
                    const color = getDeviceColor(d.TipoEquipo);
                    const activo = dispositivoActivo === d.no_serie;
                    const isDragging = dragging === d.no_serie;

                    return (
                      <div
                        key={d.no_serie}
                        onMouseDown={(e) => handleDragStart(e, d.no_serie)}
                        onClick={(e) => { e.stopPropagation(); if (!isDragging) setDispositivoActivo(activo ? null : d.no_serie); }}
                        className={`absolute group ${modoEdicion ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${isDragging ? 'z-50' : 'z-10'}`}
                        style={{
                          left: `${d.pos_x}%`,
                          top: `${d.pos_y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {/* Círculo del pin */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform ${
                            activo ? 'scale-125' : 'hover:scale-110'
                          } ${isDragging ? 'scale-125 shadow-2xl' : ''}`}
                          style={{ backgroundColor: color }}
                        >
                          <span className="text-lg leading-none">{getDeviceIcon(d.TipoEquipo)}</span>
                        </div>

                        {/* Tooltip */}
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-56 bg-gray-900 text-white text-xs rounded-lg px-2 py-1.5 pointer-events-none transition-opacity ${activo ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <p className="font-semibold">{d.nombreEquipo}</p>
                          <p className="text-blue-300">{d.TipoEquipo}</p>
                          {(d.marca || d.modelo) && (
                            <p className="text-gray-300">{[d.marca, d.modelo].filter(Boolean).join(' · ')}</p>
                          )}
                          <p className="text-gray-400">#{d.no_serie}</p>
                          <div className={`inline-flex mt-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                            d.EstatusEquipo === 'Activo' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'
                          }`}>
                            {d.EstatusEquipo}
                          </div>
                          {/* Flecha del tooltip */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer con instrucciones */}
        {modoEdicion && (
          <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200 text-xs text-yellow-800 flex items-center space-x-4">
            <i className="fas fa-info-circle"></i>
            <span>
              <strong>Modo edición:</strong> Selecciona un dispositivo del panel y haz clic en el plano para colocarlo.
              Puedes arrastrar los pines ya colocados. Presiona <strong>Guardar</strong> cuando termines.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
