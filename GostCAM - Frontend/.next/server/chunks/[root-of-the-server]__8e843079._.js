module.exports=[18622,(e,r,t)=>{r.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,r,t)=>{r.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,r,t)=>{r.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,r,t)=>{r.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52360,(e,r,t)=>{r.exports=e.x("mysql2/promise",()=>require("mysql2/promise"))},84168,e=>{"use strict";e.s(["executeQuery",()=>a,"getCatalogos",()=>c,"getConnection",()=>o,"getEquiposCompletos",()=>n,"getMovimientosDetallados",()=>p,"testConnection",()=>i]);var r=e.i(52360);let t={host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"3306"),user:process.env.DB_USER||"root",password:process.env.DB_PASSWORD||"",database:process.env.DB_NAME||"GostCAM",charset:"utf8mb4",timezone:"+00:00"},s=r.default.createPool({...t,waitForConnections:!0,connectionLimit:10,queueLimit:0}),o=async()=>{try{return await s.getConnection()}catch(e){throw console.error("Error connecting to the database:",e),Error("Failed to connect to database")}},a=async(e,r=[])=>{let t;try{t=await o();let[s]=await t.execute(e,r);return s}catch(t){throw console.error("Database query error:",t),console.error("Query:",e),console.error("Params:",r),t}finally{t&&t.release()}},i=async()=>{try{return(await a("SELECT 1 as test")).length>0}catch(e){return console.error("Database connection test failed:",e),!1}},n=async e=>u(e),u=async e=>{let r=`
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
  `,t=[],s=[];if(s.push("(e.eliminado IS NULL OR e.eliminado = 0)"),e&&(e.tipoEquipo&&(s.push("te.nombreTipo = ?"),t.push(e.tipoEquipo)),e.estatus&&(s.push("ee.estatus = ?"),t.push(e.estatus)),e.usuario&&(s.push("u.NombreUsuario LIKE ?"),t.push(`%${e.usuario}%`)),e.busqueda)){s.push(`(
        e.nombreEquipo LIKE ? OR 
        e.no_serie LIKE ? OR 
        e.numeroActivo LIKE ? OR
        e.modelo LIKE ? OR
        te.nombreTipo LIKE ? OR
        ee.estatus LIKE ? OR
        u.NombreUsuario LIKE ?
      )`);let r=`%${e.busqueda}%`;t.push(r,r,r,r,r,r,r)}return s.length>0&&(r+=" WHERE "+s.join(" AND ")),r+=" ORDER BY e.fechaAlta DESC",await a(r,t)},p=async e=>{let r="SELECT * FROM VistaMovimientosDetallados",t=[],s=[];return e&&(e.sucursalOrigen&&(s.push("SucursalOrigen = ?"),t.push(e.sucursalOrigen)),e.sucursalDestino&&(s.push("SucursalDestino = ?"),t.push(e.sucursalDestino)),e.tipoMovimiento&&(s.push("tipoMovimiento = ?"),t.push(e.tipoMovimiento)),e.estatusMovimiento&&(s.push("estatusMovimiento = ?"),t.push(e.estatusMovimiento)),e.fechaDesde&&(s.push("fecha >= ?"),t.push(e.fechaDesde)),e.fechaHasta&&(s.push("fecha <= ?"),t.push(e.fechaHasta))),s.length>0&&(r+=" WHERE "+s.join(" AND ")),a(r+=" ORDER BY fecha DESC",t)},c=async()=>{try{console.log("Obteniendo catálogos...");let e=async(e,r=[])=>{try{return await a(e)}catch(t){return console.warn(`Query failed: ${e}`,t),r}},r=await e("SELECT * FROM usuarios",[]),t=await e("SELECT * FROM tipoequipo",[]),s=await e("SELECT * FROM estatusequipo",[]),o=await e("SELECT * FROM posiciones",[{id:1,nombre:"Entrada Principal"},{id:2,nombre:"Recepción"},{id:3,nombre:"Oficina"}]),i=await e('SELECT DISTINCT SucursalActual as nombre, SucursalActual as id FROM equipos WHERE SucursalActual IS NOT NULL AND SucursalActual != ""',[{id:"SUC001",nombre:"Sucursal Principal"},{id:"SUC002",nombre:"Sucursal Norte"},{id:"SUC003",nombre:"Sucursal Sur"}]);return{tiposEquipo:t,estatusEquipos:s,usuarios:r,posiciones:o,sucursales:i,estados:[],municipios:[],zonas:[]}}catch(e){throw console.error("Error obteniendo catálogos:",e),e}}},59061,(e,r,t)=>{}];

//# sourceMappingURL=%5Broot-of-the-server%5D__8e843079._.js.map