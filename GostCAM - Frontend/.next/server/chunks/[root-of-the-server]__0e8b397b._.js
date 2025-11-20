module.exports = [
"[project]/.next-internal/server/app/api/equipos/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/equipos/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// API: GESTIÓN DE EQUIPOS
// =============================================
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/database.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        console.log('API Equipos GET llamada');
        const { searchParams } = new URL(request.url);
        const filters = {
            sucursal: searchParams.get('sucursal') || undefined,
            tipoEquipo: searchParams.get('tipoEquipo') || undefined,
            estatus: searchParams.get('estatus') || undefined,
            usuario: searchParams.get('usuario') || undefined,
            busqueda: searchParams.get('busqueda') || undefined
        };
        // Remover filtros vacíos
        Object.keys(filters).forEach((key)=>{
            if (filters[key] === undefined) {
                delete filters[key];
            }
        });
        console.log('Filtros aplicados:', filters);
        const equipos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEquiposCompletos"])(filters);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: equipos,
            message: 'Equipos obtenidos exitosamente'
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error obteniendo equipos:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Error interno del servidor'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Normalizar nombres de campos para compatibilidad
        const noSerie = body.noSerie || body.no_serie;
        const idUsuarios = body.idUsuarios || body.usuarioAsignado;
        console.log('📦 Datos recibidos para crear equipo:', body);
        // Validar campos requeridos (usando valores normalizados)
        const camposRequeridos = [
            {
                campo: 'noSerie',
                valor: noSerie
            },
            {
                campo: 'nombreEquipo',
                valor: body.nombreEquipo
            },
            {
                campo: 'modelo',
                valor: body.modelo
            },
            {
                campo: 'idTipoEquipo',
                valor: body.idTipoEquipo
            },
            {
                campo: 'idEstatus',
                valor: body.idEstatus
            },
            {
                campo: 'idSucursal',
                valor: body.idSucursal
            }
        ];
        for (const { campo, valor } of camposRequeridos){
            if (!valor) {
                console.log(`❌ Campo faltante: ${campo}`, valor);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: `El campo ${campo} es requerido`,
                    message: 'Datos incompletos'
                }, {
                    status: 400
                });
            }
        }
        // Funciones de mapeo para convertir IDs a nombres
        const mapearTipoEquipo = async (id)=>{
            const tipos = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(`
        SELECT TipoEquipo 
        FROM (
          SELECT ROW_NUMBER() OVER (ORDER BY TipoEquipo) as rownum, TipoEquipo
          FROM (SELECT DISTINCT TipoEquipo FROM GostCAM.VistaEquiposCompletos WHERE TipoEquipo IS NOT NULL) tipos
        ) t 
        WHERE rownum = ?
      `, [
                id
            ]);
            return tipos.length > 0 ? tipos[0].TipoEquipo : '';
        };
        const mapearSucursal = async (idOCodigo)=>{
            console.log(`🔍 Mapeando sucursal ID/Código: ${idOCodigo} (tipo: ${typeof idOCodigo})`);
            if (!idOCodigo) {
                console.log('❌ ID de sucursal vacío, usando fallback');
                return 1;
            }
            try {
                let idCentro;
                // Si es un string, asumimos que es un código de centro (T008, T011, etc.)
                if (typeof idOCodigo === 'string') {
                    idCentro = idOCodigo;
                    console.log(`📍 Usando código de centro directamente: ${idCentro}`);
                } else {
                    // Si es un número, buscamos en el catálogo
                    const sucursales = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(`
            SELECT idCentro, Sucursal
            FROM (
              SELECT ROW_NUMBER() OVER (ORDER BY Sucursal) as rownum, idCentro, Sucursal
              FROM sucursales
            ) s 
            WHERE rownum = ?
          `, [
                        idOCodigo
                    ]);
                    if (sucursales.length === 0) {
                        console.log(`❌ No se encontró sucursal con ID ${idOCodigo}`);
                        return 1;
                    }
                    idCentro = sucursales[0].idCentro;
                    console.log(`📍 ID ${idOCodigo} mapeado a centro: ${idCentro}`);
                }
                // Obtener primera posición del centro
                const posicion = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(`
          SELECT p.idPosicion, p.NombrePosicion, s.Sucursal
          FROM posicionequipo p 
          JOIN sucursales s ON p.idCentro = s.idCentro
          WHERE p.idCentro = ?
          ORDER BY p.idPosicion
          LIMIT 1
        `, [
                    idCentro
                ]);
                if (posicion.length > 0) {
                    const idPosicionResult = posicion[0].idPosicion;
                    console.log(`✅ Posición asignada: ${idPosicionResult} (${posicion[0].NombrePosicion}) en ${posicion[0].Sucursal}`);
                    return idPosicionResult;
                }
                console.log('❌ No se encontró posición para el centro');
                return 1;
            } catch (error) {
                console.error('❌ Error en mapearSucursal:', error);
                return 1;
            }
        };
        const mapearUsuario = async (idONombre)=>{
            if (!idONombre) return 1; // Usuario por defecto
            // Si ya es un número, devolverlo directamente
            if (typeof idONombre === 'number') {
                console.log(`✅ Usuario ID recibido: ${idONombre}`);
                return idONombre;
            }
            // Si es string, buscar por nombre
            try {
                const usuarios = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(`
          SELECT ROW_NUMBER() OVER (ORDER BY UsuarioAsignado) as rownum, UsuarioAsignado
          FROM (
            SELECT DISTINCT UsuarioAsignado 
            FROM GostCAM.VistaEquiposCompletos 
            WHERE UsuarioAsignado IS NOT NULL AND UsuarioAsignado != ''
          ) usuarios
          ORDER BY UsuarioAsignado
        `);
                // Buscar usuario por nombre
                const usuarioEncontrado = usuarios.find((u)=>u.UsuarioAsignado.toLowerCase() === idONombre.toLowerCase());
                if (usuarioEncontrado) {
                    console.log(`✅ Usuario "${idONombre}" mapeado a ID: ${usuarioEncontrado.rownum}`);
                    return usuarioEncontrado.rownum;
                }
                console.log(`⚠️ Usuario "${idONombre}" no encontrado, usando ID por defecto`);
                return 1; // Usuario por defecto si no se encuentra
            } catch (error) {
                console.error('❌ Error en mapearUsuario:', error);
                return 1;
            }
        };
        const mapearEstatus = async (id)=>{
            const estatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(`
        SELECT EstatusEquipo 
        FROM (
          SELECT ROW_NUMBER() OVER (ORDER BY EstatusEquipo) as rownum, EstatusEquipo
          FROM (SELECT DISTINCT EstatusEquipo FROM GostCAM.VistaEquiposCompletos WHERE EstatusEquipo IS NOT NULL) estatus
        ) e 
        WHERE rownum = ?
      `, [
                id
            ]);
            return estatus.length > 0 ? estatus[0].EstatusEquipo : '';
        };
        // Convertir IDs a nombres reales
        console.log('📥 Datos recibidos - idSucursal:', body.idSucursal, 'tipo:', typeof body.idSucursal);
        const tipoEquipoNombre = await mapearTipoEquipo(parseInt(body.idTipoEquipo));
        // Mapear sucursal usando el código directamente
        const idPosicion = await mapearSucursal(body.idSucursal);
        const idUsuarioFinal = await mapearUsuario(idUsuarios);
        const estatusNombre = await mapearEstatus(parseInt(body.idEstatus));
        console.log('📊 Mapeos realizados:');
        console.log('- Tipo Equipo:', body.idTipoEquipo, '->', tipoEquipoNombre);
        console.log('- idPosicion calculada:', idPosicion);
        console.log('- Usuario:', idUsuarios, '->', idUsuarioFinal);
        console.log('- Estatus:', body.idEstatus, '->', estatusNombre);
        console.log('📦 Datos a insertar:');
        console.log('- No. Serie:', noSerie);
        console.log('- Nombre Equipo:', body.nombreEquipo);
        console.log('- Modelo:', body.modelo);
        console.log('- Tipo Equipo ID:', body.idTipoEquipo, '(', tipoEquipoNombre, ')');
        console.log('- Estatus ID:', body.idEstatus, '(', estatusNombre, ')');
        console.log('- Usuario ID:', idUsuarioFinal);
        console.log('- Posición ID:', idPosicion);
        // Verificar si el número de serie ya existe
        const equipoExistente = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])('SELECT no_serie FROM Equipo WHERE no_serie = ?', [
            noSerie
        ]);
        if (equipoExistente.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'El número de serie ya existe',
                message: 'No se puede crear el equipo'
            }, {
                status: 409
            });
        }
        // Insertar equipo en la base de datos
        const query = `
      INSERT INTO Equipo (
        no_serie, nombreEquipo, modelo, numeroActivo, 
        idTipoEquipo, idEstatus, idUsuarios, idPosicion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const valores = [
            noSerie,
            body.nombreEquipo,
            body.modelo,
            body.numeroActivo || noSerie,
            body.idTipoEquipo,
            body.idEstatus,
            idUsuarioFinal,
            idPosicion // ID de posición calculado para la sucursal
        ];
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(query, valores);
        console.log('✅ Equipo creado exitosamente');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                no_serie: noSerie,
                mensaje: 'Equipo insertado correctamente'
            },
            message: 'Equipo creado exitosamente'
        }, {
            status: 201
        });
    } catch (error) {
        console.error('💥 Error creando equipo:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : 'Error desconocido',
            message: 'No se pudo crear el equipo'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { no_serie } = body;
        // Validar campos requeridos
        if (!no_serie) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Número de serie es requerido'
            }, {
                status: 400
            });
        }
        // Verificar si el equipo existe
        const existingEquipo = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])('SELECT no_serie FROM Equipo WHERE no_serie = ?', [
            no_serie
        ]);
        if (existingEquipo.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Equipo no encontrado'
            }, {
                status: 404
            });
        }
        // Construir query de actualización dinámicamente
        const campos = [];
        const valores = [];
        if (body.nombreEquipo) {
            campos.push('nombreEquipo = ?');
            valores.push(body.nombreEquipo);
        }
        if (body.modelo) {
            campos.push('modelo = ?');
            valores.push(body.modelo);
        }
        if (body.idTipoEquipo) {
            campos.push('idTipoEquipo = ?');
            valores.push(parseInt(body.idTipoEquipo));
        }
        if (body.idEstatus) {
            campos.push('idEstatus = ?');
            valores.push(parseInt(body.idEstatus));
        }
        if (body.idSucursal) {
            campos.push('idSucursal = ?');
            valores.push(parseInt(body.idSucursal));
        }
        if (body.idUsuarios) {
            campos.push('idUsuarios = ?');
            valores.push(parseInt(body.idUsuarios));
        }
        if (campos.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'No hay campos para actualizar'
            }, {
                status: 400
            });
        }
        valores.push(no_serie);
        // Actualizar equipo
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(`
      UPDATE Equipos 
      SET ${campos.join(', ')}
      WHERE no_serie = ?
    `, valores);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Equipo actualizado exitosamente'
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error actualizando equipo:', error);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0e8b397b._.js.map