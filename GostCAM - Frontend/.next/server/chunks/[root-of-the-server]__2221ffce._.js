module.exports = [
"[project]/.next-internal/server/app/api/dashboard/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mysql2/promise [external] (mysql2/promise, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mysql2/promise", () => require("mysql2/promise"));

module.exports = mod;
}),
"[project]/src/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// CONFIGURACIÓN DE BASE DE DATOS MYSQL
// =============================================
__turbopack_context__.s([
    "callStoredProcedure",
    ()=>callStoredProcedure,
    "closePool",
    ()=>closePool,
    "default",
    ()=>__TURBOPACK__default__export__,
    "executeQuery",
    ()=>executeQuery,
    "getCatalogos",
    ()=>getCatalogos,
    "getConnection",
    ()=>getConnection,
    "getEquiposCompletos",
    ()=>getEquiposCompletos,
    "getHistorialMovimientos",
    ()=>getHistorialMovimientos,
    "getInventarioPorEstatus",
    ()=>getInventarioPorEstatus,
    "getMovimientosDetallados",
    ()=>getMovimientosDetallados,
    "testConnection",
    ()=>testConnection
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mysql2/promise [external] (mysql2/promise, cjs)");
;
// Configuración de la conexión a la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'GostCAM',
    charset: 'utf8mb4',
    timezone: '+00:00'
};
// Pool de conexiones para mejor performance
const pool = __TURBOPACK__imported__module__$5b$externals$5d2f$mysql2$2f$promise__$5b$external$5d$__$28$mysql2$2f$promise$2c$__cjs$29$__["default"].createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const getConnection = async ()=>{
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw new Error('Failed to connect to database');
    }
};
const executeQuery = async (query, params = [])=>{
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        console.error('Query:', query);
        console.error('Params:', params);
        throw error;
    } finally{
        if (connection) {
            connection.release();
        }
    }
};
const callStoredProcedure = async (procedureName, params = [])=>{
    const placeholders = params.map(()=>'?').join(', ');
    const query = `CALL ${procedureName}(${placeholders})`;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(query, params);
        // Los procedimientos almacenados devuelven arrays anidados
        return Array.isArray(rows) && Array.isArray(rows[0]) ? rows[0] : rows;
    } catch (error) {
        console.error('Stored procedure error:', error);
        console.error('Procedure:', procedureName);
        console.error('Params:', params);
        throw error;
    } finally{
        if (connection) {
            connection.release();
        }
    }
};
const testConnection = async ()=>{
    try {
        const result = await executeQuery('SELECT 1 as test');
        return result.length > 0;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
};
const closePool = async ()=>{
    try {
        await pool.end();
        console.log('Database pool closed');
    } catch (error) {
        console.error('Error closing database pool:', error);
    }
};
const getEquiposCompletos = async (filters)=>{
    // Usar directamente la tabla equipo con una consulta simple
    return getEquiposFromTable(filters);
};
// Función fallback para consultar tabla equipos directamente
const getEquiposFromTable = async (filters)=>{
    let query = `
    SELECT 
      e.no_serie,
      e.nombreEquipo,
      e.numeroActivo,
      e.modelo,
      e.fechaAlta,
      e.idPosicion,
      te.nombreTipo as TipoEquipo,
      ee.estatus as EstatusEquipo,
      'Centro Principal' as SucursalActual,
      u.NombreUsuario as UsuarioAsignado
    FROM equipo e
    LEFT JOIN tipoequipo te ON e.idTipoEquipo = te.idTipoEquipo
    LEFT JOIN estatusequipo ee ON e.idEstatus = ee.idEstatus
    LEFT JOIN usuarios u ON e.idUsuarios = u.idUsuarios
  `;
    const params = [];
    const conditions = [];
    // ✅ Filtrar equipos eliminados lógicamente
    conditions.push('(e.eliminado IS NULL OR e.eliminado = 0)');
    if (filters) {
        if (filters.tipoEquipo) {
            conditions.push('te.nombreTipo = ?');
            params.push(filters.tipoEquipo);
        }
        if (filters.estatus) {
            conditions.push('ee.estatus = ?');
            params.push(filters.estatus);
        }
        if (filters.usuario) {
            conditions.push('u.NombreUsuario LIKE ?');
            params.push(`%${filters.usuario}%`);
        }
        if (filters.busqueda) {
            // Búsqueda global en todos los campos principales (función fallback)
            conditions.push(`(
        e.nombreEquipo LIKE ? OR 
        e.no_serie LIKE ? OR 
        e.numeroActivo LIKE ? OR
        e.modelo LIKE ? OR
        te.nombreTipo LIKE ? OR
        ee.estatus LIKE ? OR
        u.NombreUsuario LIKE ?
      )`);
            // Repetir el término de búsqueda para cada campo
            const termino = `%${filters.busqueda}%`;
            params.push(termino, termino, termino, termino, termino, termino, termino);
        }
    }
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY e.fechaAlta DESC';
    const result = await executeQuery(query, params);
    return result;
};
const getMovimientosDetallados = async (filters)=>{
    let query = 'SELECT * FROM VistaMovimientosDetallados';
    const params = [];
    const conditions = [];
    if (filters) {
        if (filters.sucursalOrigen) {
            conditions.push('SucursalOrigen = ?');
            params.push(filters.sucursalOrigen);
        }
        if (filters.sucursalDestino) {
            conditions.push('SucursalDestino = ?');
            params.push(filters.sucursalDestino);
        }
        if (filters.tipoMovimiento) {
            conditions.push('tipoMovimiento = ?');
            params.push(filters.tipoMovimiento);
        }
        if (filters.estatusMovimiento) {
            conditions.push('estatusMovimiento = ?');
            params.push(filters.estatusMovimiento);
        }
        if (filters.fechaDesde) {
            conditions.push('fecha >= ?');
            params.push(filters.fechaDesde);
        }
        if (filters.fechaHasta) {
            conditions.push('fecha <= ?');
            params.push(filters.fechaHasta);
        }
    }
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY fecha DESC';
    return executeQuery(query, params);
};
const getInventarioPorEstatus = async ()=>{
    return executeQuery('SELECT * FROM VistaInventarioPorEstatus ORDER BY estatus, TipoEquipo');
};
const getCatalogos = async ()=>{
    try {
        console.log('Obteniendo catálogos...');
        // Función auxiliar para ejecutar consultas con fallback
        const executeWithFallback = async (query, fallback = [])=>{
            try {
                return await executeQuery(query);
            } catch (error) {
                console.warn(`Query failed: ${query}`, error);
                return fallback;
            }
        };
        // Obtener catálogos básicos que probablemente existan
        const usuarios = await executeWithFallback('SELECT * FROM usuarios', []);
        // Para tipos de equipo, intentar múltiples variantes
        const tiposEquipo = await executeWithFallback('SELECT * FROM tipoequipo', []);
        // Para estatus, intentar múltiples variantes  
        const estatusEquipos = await executeWithFallback('SELECT * FROM estatusequipo', []);
        // Para posiciones, usar valores por defecto si no existe
        const posiciones = await executeWithFallback('SELECT * FROM posiciones', [
            {
                id: 1,
                nombre: 'Entrada Principal'
            },
            {
                id: 2,
                nombre: 'Recepción'
            },
            {
                id: 3,
                nombre: 'Oficina'
            }
        ]);
        // Para sucursales, intentar obtener de la tabla de equipos o crear por defecto
        const sucursales = await executeWithFallback('SELECT DISTINCT SucursalActual as nombre, SucursalActual as id FROM equipos WHERE SucursalActual IS NOT NULL AND SucursalActual != ""', [
            {
                id: 'SUC001',
                nombre: 'Sucursal Principal'
            },
            {
                id: 'SUC002',
                nombre: 'Sucursal Norte'
            },
            {
                id: 'SUC003',
                nombre: 'Sucursal Sur'
            }
        ]);
        return {
            tiposEquipo,
            estatusEquipos,
            usuarios,
            posiciones,
            sucursales,
            // Catálogos adicionales vacíos por ahora
            estados: [],
            municipios: [],
            zonas: []
        };
    } catch (error) {
        console.error('Error obteniendo catálogos:', error);
        throw error;
    }
};
const getHistorialMovimientos = async (no_serie)=>{
    if (no_serie) {
        return executeQuery('SELECT * FROM VistaHistorialMovimientos WHERE no_serie = ? ORDER BY fecha DESC', [
            no_serie
        ]);
    }
    return executeQuery('SELECT * FROM VistaHistorialMovimientos ORDER BY fecha DESC LIMIT 100');
};
const __TURBOPACK__default__export__ = pool;
}),
"[project]/src/app/api/dashboard/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// API: DASHBOARD ESTADÍSTICAS
// =============================================
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        // Obtener estadísticas básicas
        const statsQuery = `
      SELECT 
        COUNT(*) as totalEquipos,
        SUM(CASE WHEN idEstatus = 1 THEN 1 ELSE 0 END) as equiposDisponibles,
        SUM(CASE WHEN idEstatus = 2 THEN 1 ELSE 0 END) as equiposEnUso,
        SUM(CASE WHEN idEstatus IN (3, 7) THEN 1 ELSE 0 END) as equiposMantenimiento,
        SUM(CASE WHEN idEstatus = 6 THEN 1 ELSE 0 END) as equiposDañados
      FROM equipo
    `;
        const [stats] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(statsQuery);
        // Obtener movimientos abiertos
        const movimientosAbiertosQuery = `
      SELECT COUNT(*) as movimientosAbiertos
      FROM movimientoinventario 
      WHERE estatusMovimiento = 'ABIERTO'
    `;
        const [movimientosAbiertos] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(movimientosAbiertosQuery);
        // Obtener movimientos del mes actual
        const movimientosMesQuery = `
      SELECT COUNT(*) as movimientosMes
      FROM movimientoinventario 
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) 
      AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `;
        const [movimientosMes] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(movimientosMesQuery);
        // Obtener equipos por tipo
        const equiposPorTipoQuery = `
      SELECT 
        te.nombreTipo as tipo,
        COUNT(e.no_serie) as cantidad
      FROM tipoequipo te
      LEFT JOIN equipo e ON te.idTipoEquipo = e.idTipoEquipo
      GROUP BY te.idTipoEquipo, te.nombreTipo
      HAVING cantidad > 0
      ORDER BY cantidad DESC
      LIMIT 10
    `;
        const equiposPorTipo = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(equiposPorTipoQuery);
        // Obtener movimientos por mes (últimos 6 meses)
        const movimientosPorMesQuery = `
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') as mes,
        COUNT(*) as cantidad
      FROM movimientoinventario 
      WHERE fecha >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(fecha, '%Y-%m')
      ORDER BY mes DESC
    `;
        const movimientosPorMes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(movimientosPorMesQuery);
        // Obtener porcentajes por estatus
        const estatusPorcentajesQuery = `
      SELECT 
        es.estatus,
        COUNT(e.no_serie) as cantidad,
        ROUND((COUNT(e.no_serie) * 100.0 / (SELECT COUNT(*) FROM equipo)), 2) as porcentaje
      FROM estatusequipo es
      LEFT JOIN equipo e ON es.idEstatus = e.idEstatus
      GROUP BY es.idEstatus, es.estatus
      HAVING cantidad > 0
      ORDER BY cantidad DESC
    `;
        const estatusData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(estatusPorcentajesQuery);
        // Definir colores para cada estatus
        const colores = {
            'Disponible': '#10B981',
            'En uso': '#3B82F6',
            'Mantenimiento': '#F59E0B',
            'En reparación': '#F59E0B',
            'Baja': '#6B7280',
            'Extraviado': '#EF4444',
            'Dañado': '#DC2626',
            'Obsoleto': '#6B7280'
        };
        const estatusPorcentajes = estatusData.map((item)=>({
                estatus: item.estatus,
                porcentaje: typeof item.porcentaje === 'string' ? parseFloat(item.porcentaje) : item.porcentaje,
                color: colores[item.estatus] || '#6B7280'
            }));
        const movimientosFormateados = movimientosPorMes.map((item)=>{
            const [year, month] = item.mes.split('-');
            const monthNames = [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic'
            ];
            return {
                mes: `${monthNames[parseInt(month) - 1]} ${year}`,
                cantidad: item.cantidad
            };
        });
        const statsTyped = stats;
        const movAbiertosTyped = movimientosAbiertos;
        const movMesTyped = movimientosMes;
        const dashboardData = {
            totalEquipos: statsTyped.totalEquipos || 0,
            equiposDisponibles: statsTyped.equiposDisponibles || 0,
            equiposEnUso: statsTyped.equiposEnUso || 0,
            equiposMantenimiento: statsTyped.equiposMantenimiento || 0,
            equiposDañados: statsTyped.equiposDañados || 0,
            movimientosAbiertos: movAbiertosTyped.movimientosAbiertos || 0,
            movimientosMes: movMesTyped.movimientosMes || 0,
            equiposPorTipo: equiposPorTipo || [],
            movimientosPorMes: movimientosFormateados || [],
            estatusPorcentajes: estatusPorcentajes || []
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: dashboardData,
            message: 'Dashboard cargado exitosamente'
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error obteniendo datos del dashboard:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Error interno del servidor'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2221ffce._.js.map