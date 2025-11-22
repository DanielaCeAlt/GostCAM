'use client';

import React, { useEffect, useState } from 'react';
import SucursalesManagerHeader from './equipos/SucursalesManagerHeader';

interface Equipo {
  no_serie: string;
  nombreEquipo: string;
  TipoEquipo: string;
  marca: string;
  modelo: string;
  EstatusEquipo: string;
  AreaActual: string;
  fechaInstalacion: string;
  ultimoMantenimiento?: string;
  estadoConexion: 'Conectado' | 'Desconectado' | 'Error';
}

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: string;
  telefono?: string;
  email?: string;
  totalCamaras: number;
  totalSensores: number;
  camarasActivas: number;
  sensoresActivos: number;
  equiposTotal: number;
}

interface SucursalesStats {
  totalSucursales: number;
  totalCamaras: number;
  totalSensores: number;
  camarasActivas: number;
  sensoresActivos: number;
}

export default function Sucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalesFiltradas, setSucursalesFiltradas] = useState<Sucursal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vistaSucursales, setVistaSucursales] = useState<'tarjetas' | 'lista'>('tarjetas');
  const [stats, setStats] = useState<SucursalesStats>({
    totalSucursales: 0,
    totalCamaras: 0,
    totalSensores: 0,
    camarasActivas: 0,
    sensoresActivos: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Estados para vista de detalle
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null);
  const [equiposSucursal, setEquiposSucursal] = useState<Equipo[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [vistaActual, setVistaActual] = useState<'lista' | 'detalle'>('lista');

  useEffect(() => {
    cargarSucursales();
  }, []);

  useEffect(() => {
    filtrarSucursales();
  }, [searchTerm, sucursales]);

  const cargarSucursales = async () => {
    setLoading(true);
    try {
      console.log('🔄 Cargando sucursales desde API...');
      
      // Intentar cargar desde API real primero
      const response = await fetch('/api/sucursales');
      const data = await response.json();
      
      let sucursalesData: Sucursal[] = [];
      
      if (response.ok && data.success && data.data) {
        console.log('✅ Sucursales cargadas desde API:', data.data);
        
        // Mapear datos del API a la estructura esperada
        sucursalesData = data.data.map((sucursal: any, index: number) => ({
          id: sucursal.id || index + 1,
          nombre: sucursal.nombre || sucursal.Sucursal || `Sucursal ${index + 1}`,
          direccion: sucursal.direccion || sucursal.Direccion || 'Dirección no disponible',
          ciudad: sucursal.ciudad || 'Ciudad',
          estado: sucursal.estado || 'Estado',
          telefono: sucursal.telefono || undefined,
          email: sucursal.email || undefined,
          totalCamaras: sucursal.equiposAsignados || Math.floor(Math.random() * 30) + 10,
          totalSensores: Math.floor(Math.random() * 20) + 5,
          camarasActivas: Math.floor((sucursal.equiposAsignados || 20) * 0.9),
          sensoresActivos: Math.floor(Math.random() * 15) + 3,
          equiposTotal: sucursal.equiposAsignados || Math.floor(Math.random() * 50) + 20
        }));
      }
      
      // Si no hay datos del API o falla, usar datos mock
      if (sucursalesData.length === 0) {
        console.log('📦 Usando datos mock de respaldo...');
        sucursalesData = [
          {
            id: 1,
            nombre: "Centro Principal",
            direccion: "Av. Principal 123",
            ciudad: "Ciudad de México",
            estado: "CDMX",
            telefono: "55-1234-5678",
            email: "centro@gostcam.com",
            totalCamaras: Math.floor(Math.random() * 30) + 20,
            totalSensores: Math.floor(Math.random() * 20) + 10,
            camarasActivas: Math.floor(Math.random() * 25) + 18,
            sensoresActivos: Math.floor(Math.random() * 18) + 8,
            equiposTotal: Math.floor(Math.random() * 50) + 30
          },
          {
            id: 2,
            nombre: "Sucursal Norte",
            direccion: "Calle Norte 456",
            ciudad: "Monterrey",
            estado: "Nuevo León",
            telefono: "81-8765-4321",
            email: "norte@gostcam.com",
            totalCamaras: Math.floor(Math.random() * 25) + 15,
            totalSensores: Math.floor(Math.random() * 15) + 8,
            camarasActivas: Math.floor(Math.random() * 20) + 12,
            sensoresActivos: Math.floor(Math.random() * 12) + 6,
            equiposTotal: Math.floor(Math.random() * 40) + 20
          },
          {
            id: 3,
            nombre: "Sucursal Sur",
            direccion: "Blvd. Sur 789",
            ciudad: "Guadalajara",
            estado: "Jalisco",
            telefono: "33-2468-1357",
            email: "sur@gostcam.com",
            totalCamaras: Math.floor(Math.random() * 28) + 18,
            totalSensores: Math.floor(Math.random() * 22) + 12,
            camarasActivas: Math.floor(Math.random() * 25) + 15,
            sensoresActivos: Math.floor(Math.random() * 20) + 10,
            equiposTotal: Math.floor(Math.random() * 45) + 25
          },
          {
            id: 4,
            nombre: "Sucursal Oeste",
            direccion: "Av. Oeste 321",
            ciudad: "Tijuana",
            estado: "Baja California",
            telefono: "664-9876-5432",
            email: "oeste@gostcam.com",
            totalCamaras: Math.floor(Math.random() * 20) + 10,
            totalSensores: Math.floor(Math.random() * 15) + 5,
            camarasActivas: Math.floor(Math.random() * 18) + 8,
            sensoresActivos: Math.floor(Math.random() * 12) + 3,
            equiposTotal: Math.floor(Math.random() * 30) + 15
          }
        ];
      }

      setSucursales(sucursalesData);
      
      // Calcular estadísticas
      const statsCalculadas: SucursalesStats = {
        totalSucursales: sucursalesData.length,
        totalCamaras: sucursalesData.reduce((sum, s) => sum + s.totalCamaras, 0),
        totalSensores: sucursalesData.reduce((sum, s) => sum + s.totalSensores, 0),
        camarasActivas: sucursalesData.reduce((sum, s) => sum + s.camarasActivas, 0),
        sensoresActivos: sucursalesData.reduce((sum, s) => sum + s.sensoresActivos, 0)
      };
      setStats(statsCalculadas);
      
      console.log('✅ Sucursales cargadas exitosamente:', sucursalesData.length);
      
    } catch (error) {
      console.error('❌ Error cargando sucursales:', error);
      
      // En caso de error, usar datos mock como fallback
      const datosFallback: Sucursal[] = [
        {
          id: 1,
          nombre: "Centro Principal",
          direccion: "Av. Principal 123",
          ciudad: "Ciudad de México", 
          estado: "CDMX",
          telefono: "55-1234-5678",
          email: "centro@gostcam.com",
          totalCamaras: 25,
          totalSensores: 15,
          camarasActivas: 23,
          sensoresActivos: 14,
          equiposTotal: 40
        }
      ];
      setSucursales(datosFallback);
      setStats({
        totalSucursales: 1,
        totalCamaras: 25,
        totalSensores: 15,
        camarasActivas: 23,
        sensoresActivos: 14
      });
    }
    setLoading(false);
  };

  const cargarEquiposSucursal = async (sucursal: Sucursal) => {
    setLoadingEquipos(true);
    try {
      // Simulamos la carga de equipos por sucursal
      const equiposMock: Equipo[] = generarEquiposPorSucursal(sucursal);
      setEquiposSucursal(equiposMock);
      
    } catch (error) {
      console.error('Error cargando equipos de sucursal:', error);
      setEquiposSucursal([]);
    }
    setLoadingEquipos(false);
  };

  const generarEquiposPorSucursal = (sucursal: Sucursal): Equipo[] => {
    const equipos: Equipo[] = [];
    
    // Generar cámaras
    for (let i = 1; i <= sucursal.totalCamaras; i++) {
      equipos.push({
        no_serie: `CAM${sucursal.id}${i.toString().padStart(3, '0')}`,
        nombreEquipo: `Cámara ${i} - ${sucursal.nombre}`,
        TipoEquipo: 'Cámara',
        marca: i % 3 === 0 ? 'Hikvision' : i % 2 === 0 ? 'Dahua' : 'Axis',
        modelo: i % 3 === 0 ? 'DS-2CD2143G0-I' : i % 2 === 0 ? 'IPC-HFW4431R-Z' : 'M3045-V',
        EstatusEquipo: i <= sucursal.camarasActivas ? 'Activo' : 'Inactivo',
        AreaActual: i <= 5 ? 'Entrada' : i <= 10 ? 'Pasillo Principal' : i <= 15 ? 'Oficinas' : i <= 20 ? 'Almacén' : 'Exterior',
        fechaInstalacion: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        ultimoMantenimiento: Math.random() > 0.3 ? `2024-11-${Math.floor(Math.random() * 7) + 1}` : undefined,
        estadoConexion: i <= sucursal.camarasActivas ? (Math.random() > 0.1 ? 'Conectado' : 'Error') : 'Desconectado'
      });
    }
    
    // Generar sensores/dispositivos
    for (let i = 1; i <= sucursal.totalSensores; i++) {
      equipos.push({
        no_serie: `SEN${sucursal.id}${i.toString().padStart(3, '0')}`,
        nombreEquipo: `Sensor ${i} - ${sucursal.nombre}`,
        TipoEquipo: i % 4 === 0 ? 'Sensor de Movimiento' : i % 3 === 0 ? 'Sensor de Puerta' : i % 2 === 0 ? 'Detector de Humo' : 'Sensor de Temperatura',
        marca: i % 3 === 0 ? 'Honeywell' : i % 2 === 0 ? 'Bosch' : 'DSC',
        modelo: i % 3 === 0 ? 'PIR-312' : i % 2 === 0 ? 'ISC-BPR2-W12' : 'LC-100PI',
        EstatusEquipo: i <= sucursal.sensoresActivos ? 'Activo' : 'Inactivo',
        AreaActual: i <= 3 ? 'Entrada' : i <= 6 ? 'Pasillo Principal' : i <= 9 ? 'Oficinas' : i <= 12 ? 'Almacén' : 'Exterior',
        fechaInstalacion: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        ultimoMantenimiento: Math.random() > 0.4 ? `2024-11-${Math.floor(Math.random() * 7) + 1}` : undefined,
        estadoConexion: i <= sucursal.sensoresActivos ? (Math.random() > 0.05 ? 'Conectado' : 'Error') : 'Desconectado'
      });
    }
    
    return equipos;
  };

  const filtrarSucursales = () => {
    let filtradas = sucursales;

    if (searchTerm) {
      filtradas = filtradas.filter(sucursal =>
        sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sucursal.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sucursal.estado.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setSucursalesFiltradas(filtradas);
  };

  const verDetalleSucursal = async (sucursal: Sucursal) => {
    setSucursalSeleccionada(sucursal);
    setVistaActual('detalle');
    await cargarEquiposSucursal(sucursal);
  };

  const volverALista = () => {
    setVistaActual('lista');
    setSucursalSeleccionada(null);
    setEquiposSucursal([]);
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Inactivo': return 'bg-gray-100 text-gray-800';
      case 'Con Falla': return 'bg-red-100 text-red-800';
      case 'Mantenimiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConexionColor = (conexion: string) => {
    switch (conexion) {
      case 'Conectado': return 'bg-green-100 text-green-800';
      case 'Desconectado': return 'bg-gray-100 text-gray-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (vistaActual === 'detalle' && sucursalSeleccionada) {
    return (
      <div className="space-y-6">
        {/* Header Unificado */}
        <SucursalesManagerHeader
          vistaActual={vistaActual}
          vistaSucursales={vistaSucursales}
          sucursalSeleccionada={sucursalSeleccionada}
          searchTerm={searchTerm}
          onVistaChange={setVistaActual}
          onVistaSucursalesChange={setVistaSucursales}
          onSearchChange={setSearchTerm}
          onRefresh={cargarSucursales}
          loading={loading}
        />

        {/* Información adicional de la sucursal */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">
                {sucursalSeleccionada.direccion}, {sucursalSeleccionada.ciudad}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total de Equipos</div>
              <div className="text-2xl font-bold text-gray-900">
                {sucursalSeleccionada.equiposTotal}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de la Sucursal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Cámaras</p>
                <p className="text-2xl font-bold text-blue-900">
                  {sucursalSeleccionada.camarasActivas}/{sucursalSeleccionada.totalCamaras}
                </p>
              </div>
              <i className="fas fa-video text-2xl text-blue-600"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Sensores</p>
                <p className="text-2xl font-bold text-green-900">
                  {sucursalSeleccionada.sensoresActivos}/{sucursalSeleccionada.totalSensores}
                </p>
              </div>
              <i className="fas fa-broadcast-tower text-2xl text-green-600"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Activos</p>
                <p className="text-2xl font-bold text-purple-900">
                  {sucursalSeleccionada.camarasActivas + sucursalSeleccionada.sensoresActivos}
                </p>
              </div>
              <i className="fas fa-check-circle text-2xl text-purple-600"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">% Operativo</p>
                <p className="text-2xl font-bold text-orange-900">
                  {Math.round(((sucursalSeleccionada.camarasActivas + sucursalSeleccionada.sensoresActivos) / sucursalSeleccionada.equiposTotal) * 100)}%
                </p>
              </div>
              <i className="fas fa-chart-line text-2xl text-orange-600"></i>
            </div>
          </div>
        </div>

        {/* Lista de Equipos - Separada por tipo */}
        <div className="space-y-6">
          {loadingEquipos ? (
            <div className="bg-white shadow rounded-lg">
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Cargando equipos...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Sección de Cámaras */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-video text-2xl text-blue-600"></i>
                    <h3 className="text-lg font-medium text-gray-900">
                      Cámaras ({equiposSucursal.filter(e => e.TipoEquipo === 'Cámara').length})
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Número de Serie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Marca/Modelo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Conexión
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                          Último Mant.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {equiposSucursal.filter(equipo => equipo.TipoEquipo === 'Cámara').map((equipo) => (
                        <tr key={equipo.no_serie} className="hover:bg-blue-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {equipo.no_serie}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {equipo.nombreEquipo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{equipo.marca}</div>
                              <div className="text-gray-500">{equipo.modelo}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {equipo.AreaActual}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstatusColor(equipo.EstatusEquipo)}`}>
                              {equipo.EstatusEquipo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConexionColor(equipo.estadoConexion)}`}>
                              {equipo.estadoConexion}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {equipo.ultimoMantenimiento ? new Date(equipo.ultimoMantenimiento).toLocaleDateString() : 'Sin registro'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {equiposSucursal.filter(e => e.TipoEquipo === 'Cámara').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay cámaras registradas en esta sucursal
                    </div>
                  )}
                </div>
              </div>

              {/* Sección de Sensores y Dispositivos */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-broadcast-tower text-2xl text-green-600"></i>
                    <h3 className="text-lg font-medium text-gray-900">
                      Sensores y Dispositivos ({equiposSucursal.filter(e => e.TipoEquipo !== 'Cámara').length})
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                          Número de Serie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                          Nombre/Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                          Marca/Modelo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                          Conexión
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                          Último Mant.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {equiposSucursal.filter(equipo => equipo.TipoEquipo !== 'Cámara').map((equipo) => (
                        <tr key={equipo.no_serie} className="hover:bg-green-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {equipo.no_serie}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {equipo.nombreEquipo}
                              </div>
                              <div className="text-sm text-gray-500">
                                {equipo.TipoEquipo}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{equipo.marca}</div>
                              <div className="text-gray-500">{equipo.modelo}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {equipo.AreaActual}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstatusColor(equipo.EstatusEquipo)}`}>
                              {equipo.EstatusEquipo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConexionColor(equipo.estadoConexion)}`}>
                              {equipo.estadoConexion}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {equipo.ultimoMantenimiento ? new Date(equipo.ultimoMantenimiento).toLocaleDateString() : 'Sin registro'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {equiposSucursal.filter(e => e.TipoEquipo !== 'Cámara').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay sensores o dispositivos registrados en esta sucursal
                    </div>
                  )}
                </div>
              </div>

              {equiposSucursal.length === 0 && (
                <div className="bg-white shadow rounded-lg">
                  <div className="text-center py-8 text-gray-500">
                    No hay equipos registrados en esta sucursal
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header Unificado */}
      <SucursalesManagerHeader
        vistaActual={vistaActual}
        vistaSucursales={vistaSucursales}
        sucursalSeleccionada={sucursalSeleccionada}
        searchTerm={searchTerm}
        onVistaChange={setVistaActual}
        onVistaSucursalesChange={setVistaSucursales}
        onSearchChange={setSearchTerm}
        onRefresh={cargarSucursales}
        loading={loading}
      />

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Sucursales</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalSucursales}</p>
            </div>
            <i className="fas fa-building text-2xl text-blue-600"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Cámaras Totales</p>
              <p className="text-2xl font-bold text-green-900">{stats.totalCamaras}</p>
            </div>
            <i className="fas fa-video text-2xl text-green-600"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Sensores Totales</p>
              <p className="text-2xl font-bold text-purple-900">{stats.totalSensores}</p>
            </div>
            <i className="fas fa-broadcast-tower text-2xl text-purple-600"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Cámaras Activas</p>
              <p className="text-2xl font-bold text-orange-900">{stats.camarasActivas}</p>
            </div>
            <i className="fas fa-check-circle text-2xl text-orange-600"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Sensores Activos</p>
              <p className="text-2xl font-bold text-red-900">{stats.sensoresActivos}</p>
            </div>
            <i className="fas fa-shield-alt text-2xl text-red-600"></i>
          </div>
        </div>
      </div>

      {/* Lista de Sucursales */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Sucursales ({sucursalesFiltradas.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando sucursales...</span>
          </div>
        ) : vistaSucursales === 'tarjetas' ? (
          // Vista en Tarjetas
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {sucursalesFiltradas.map((sucursal) => {
              const porcentajeOperativo = Math.round(((sucursal.camarasActivas + sucursal.sensoresActivos) / sucursal.equiposTotal) * 100);
              
              return (
                <div
                  key={sucursal.id}
                  onClick={() => verDetalleSucursal(sucursal)}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${porcentajeOperativo >= 80 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {sucursal.nombre}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {sucursal.ciudad}, {sucursal.estado}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      porcentajeOperativo >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {porcentajeOperativo}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{sucursal.camarasActivas}</div>
                      <div className="text-xs text-gray-500">Cámaras</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{sucursal.sensoresActivos}</div>
                      <div className="text-xs text-gray-500">Sensores</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <div>{sucursal.direccion}</div>
                    {sucursal.telefono && <div>📞 {sucursal.telefono}</div>}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Total: {sucursal.equiposTotal} equipos
                    </span>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Vista en Lista
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Sucursal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Equipos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sucursalesFiltradas.map((sucursal) => {
                  const porcentajeOperativo = Math.round(((sucursal.camarasActivas + sucursal.sensoresActivos) / sucursal.equiposTotal) * 100);
                  
                  return (
                    <tr key={sucursal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${porcentajeOperativo >= 80 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {sucursal.nombre}
                            </div>
                            <div className="text-sm text-gray-700">
                              ID: {sucursal.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{sucursal.ciudad}, {sucursal.estado}</div>
                        <div className="text-sm text-gray-700">{sucursal.direccion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-blue-600">{sucursal.camarasActivas}</div>
                            <div className="text-xs text-gray-700">Cámaras</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-green-600">{sucursal.sensoresActivos}</div>
                            <div className="text-xs text-gray-700">Sensores</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">{sucursal.equiposTotal}</div>
                            <div className="text-xs text-gray-700">Total</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          porcentajeOperativo >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {porcentajeOperativo >= 80 ? 'Operativa' : 'Con Problemas'} ({porcentajeOperativo}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sucursal.telefono && (
                            <div className="flex items-center">
                              <i className="fas fa-phone text-gray-400 mr-1"></i>
                              {sucursal.telefono}
                            </div>
                          )}
                          {sucursal.email && (
                            <div className="flex items-center mt-1">
                              <i className="fas fa-envelope text-gray-400 mr-1"></i>
                              <span className="text-xs">{sucursal.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => verDetalleSucursal(sucursal)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Aquí se puede agregar funcionalidad de editar
                            console.log('Editar sucursal:', sucursal.id);
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && sucursalesFiltradas.length === 0 && (
          <div className="text-center py-8 text-gray-700">
            No se encontraron sucursales con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}