// Stub temporal para useEquiposOptimized
'use client';
import { useState, useEffect } from 'react';

export function useEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const cargarEquipos = () => {
    setLoading(true);
    // Stub: no hace nada real
    setTimeout(() => {
      setLoading(false);
      setIsEmpty(true);
    }, 1000);
  };

  const refrescarEquipos = cargarEquipos;

  useEffect(() => {
    // cargarEquipos(); // Comentado para evitar llamadas innecesarias
  }, []);

  return {
    equipos,
    loading,
    error,
    isEmpty,
    cargarEquipos,
    refrescarEquipos
  };
}