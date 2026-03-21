'use client';

import React from 'react';

interface LandingPageProps {
  onAcceder: () => void;
}

export default function LandingPage({ onAcceder }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#c8ccd2] relative overflow-hidden">

      {/* Marca de agua / logo decorativo de fondo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-gostcam.png.png"
          alt=""
          className="w-[95vw] h-[95vh] object-contain opacity-10"
        />
      </div>

      {/* Contenido central */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">

        {/* Ícono / logo: fantasma Pac-Man */}
        <div className="mb-6">
          <div className="w-24 h-24 rounded-2xl bg-blue-800 flex items-center justify-center shadow-lg mx-auto p-3">
            <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M 10,70 L 10,45 Q 10,10 50,10 Q 90,10 90,45 L 90,70 Q 77,85 63,70 Q 50,55 37,70 Q 23,85 10,70 Z"
                fill="white"
              />
              <circle cx="34" cy="43" r="9" fill="#1e40af" />
              <circle cx="37" cy="46" r="5" fill="white" />
              <circle cx="66" cy="43" r="9" fill="#1e40af" />
              <circle cx="69" cy="46" r="5" fill="white" />
            </svg>
          </div>
        </div>

        {/* Nombre del sistema */}
        <h1 className="text-6xl font-extrabold text-blue-900 tracking-tight leading-none mb-2">
          GostCAM
        </h1>
        <div className="w-24 h-1 bg-blue-800 rounded-full mx-auto mb-5" />

        {/* Subtítulo */}
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          Sistema de Gestión de Equipos de Videovigilancia
        </h2>

        {/* Descripción */}
        <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg">
          Plataforma integral para el control, inventario y seguimiento de cámaras,
          equipos de alarma, sucursales y fallas de seguridad patrimonial.
        </p>

        {/* Botón */}
        <button
          onClick={onAcceder}
          className="inline-flex items-center gap-3 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          <i className="fas fa-lock text-sm" />
          Acceder al Sistema
        </button>
      </div>

      {/* Pie de página */}
      <p className="absolute bottom-6 text-xs text-gray-400 select-none">
        © {new Date().getFullYear()} GostCAM – Todos los derechos reservados
      </p>
    </div>
  );
}
