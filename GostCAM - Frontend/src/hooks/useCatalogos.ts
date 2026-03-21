'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiService } from '@/lib/apiService';

interface TipoEquipo {
  idTipoEquipo: number;
  nombre: string;
  descripcion: string;
}

interface Sucursal {
  idCentro: string;
  nombre: string;
  direccion: string;
  zona: string;
  estado: string;
  municipio: string;
}

interface Usuario {
  idUsuarios: number;
  NombreUsuario: string;
  NivelUsuario: number;
  Correo: string;
}

interface EstatusEquipo {
  idEstatus: number;
  nombre: string;
}

interface Modelo {
  idModelo: number;
  nombre: string;
  marca: string | null;
  idTipoEquipo: number | null;
}

export function useCatalogos() {
  const [tiposEquipo, setTiposEquipo] = useState<TipoEquipo[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [estatusEquipo, setEstatusEquipo] = useState<EstatusEquipo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarTiposEquipo = useCallback(async () => {
    try {
      const response = await apiService.get('/api/catalogos?tipo=tiposequipo');
      if (response.success && Array.isArray(response.data)) {
        setTiposEquipo(response.data);
      }
    } catch (error) {
      console.error('Error cargando tipos de equipo:', error);
      setTiposEquipo([]);
    }
  }, []);

  const cargarSucursales = useCallback(async () => {
    try {
      const response = await apiService.get('/api/catalogos?tipo=sucursales');
      if (response.success && Array.isArray(response.data)) {
        setSucursales(response.data);
      }
    } catch (error) {
      console.error('Error cargando sucursales:', error);
      setSucursales([]);
    }
  }, []);

  const cargarUsuarios = useCallback(async () => {
    try {
      const response = await apiService.get('/api/catalogos?tipo=usuarios');
      if (response.success && Array.isArray(response.data)) {
        setUsuarios(response.data);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsuarios([]);
    }
  }, []);

  const cargarEstatusEquipo = useCallback(async () => {
    try {
      const response = await apiService.get('/api/catalogos?tipo=estatus');
      if (response.success && Array.isArray(response.data)) {
        setEstatusEquipo(response.data);
      }
    } catch (error) {
      console.error('Error cargando estatus:', error);
      setEstatusEquipo([]);
    }
  }, []);

  const cargarModelos = useCallback(async () => {
    try {
      const response = await apiService.get('/api/catalogos?tipo=modelos');
      if (response.success && Array.isArray(response.data)) {
        setModelos(response.data);
      }
    } catch (error) {
      console.error('Error cargando modelos:', error);
      setModelos([]);
    }
  }, []);

  const cargarTodosCatalogos = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Cargando catálogos...');
      await Promise.all([
        cargarTiposEquipo(),
        cargarSucursales(),
        cargarUsuarios(),
        cargarEstatusEquipo(),
        cargarModelos()
      ]);
      console.log('✅ Catálogos cargados correctamente');
    } catch (error) {
      console.error('❌ Error cargando catálogos:', error);
    } finally {
      setLoading(false);
    }
  }, [cargarTiposEquipo, cargarSucursales, cargarUsuarios, cargarEstatusEquipo, cargarModelos]);

  // Cargar catálogos al montar el hook
  useEffect(() => {
    cargarTodosCatalogos();
  }, [cargarTodosCatalogos]);

  return {
    tiposEquipo,
    sucursales,
    usuarios,
    estatusEquipo,
    modelos,
    loading,
    cargarTiposEquipo,
    cargarSucursales,
    cargarUsuarios,
    cargarEstatusEquipo,
    cargarModelos,
    cargarTodosCatalogos
  };
}