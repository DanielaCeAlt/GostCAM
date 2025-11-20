module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52360,(e,t,a)=>{t.exports=e.x("mysql2/promise",()=>require("mysql2/promise"))},84168,e=>{"use strict";e.s(["executeQuery",()=>i,"getCatalogos",()=>p,"getConnection",()=>r,"getEquiposCompletos",()=>n,"getMovimientosDetallados",()=>c,"testConnection",()=>s]);var t=e.i(52360);let a={host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"3306"),user:process.env.DB_USER||"root",password:process.env.DB_PASSWORD||"",database:process.env.DB_NAME||"GostCAM",charset:"utf8mb4",timezone:"+00:00"},o=t.default.createPool({...a,waitForConnections:!0,connectionLimit:10,queueLimit:0}),r=async()=>{try{return await o.getConnection()}catch(e){throw console.error("Error connecting to the database:",e),Error("Failed to connect to database")}},i=async(e,t=[])=>{let a;try{a=await r();let[o]=await a.execute(e,t);return o}catch(a){throw console.error("Database query error:",a),console.error("Query:",e),console.error("Params:",t),a}finally{a&&a.release()}},s=async()=>{try{return(await i("SELECT 1 as test")).length>0}catch(e){return console.error("Database connection test failed:",e),!1}},n=async e=>u(e),u=async e=>{let t=`
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
  `,a=[],o=[];if(o.push("(e.eliminado IS NULL OR e.eliminado = 0)"),e&&(e.tipoEquipo&&(o.push("te.nombreTipo = ?"),a.push(e.tipoEquipo)),e.estatus&&(o.push("ee.estatus = ?"),a.push(e.estatus)),e.usuario&&(o.push("u.NombreUsuario LIKE ?"),a.push(`%${e.usuario}%`)),e.busqueda)){o.push(`(
        e.nombreEquipo LIKE ? OR 
        e.no_serie LIKE ? OR 
        e.numeroActivo LIKE ? OR
        e.modelo LIKE ? OR
        te.nombreTipo LIKE ? OR
        ee.estatus LIKE ? OR
        u.NombreUsuario LIKE ?
      )`);let t=`%${e.busqueda}%`;a.push(t,t,t,t,t,t,t)}return o.length>0&&(t+=" WHERE "+o.join(" AND ")),t+=" ORDER BY e.fechaAlta DESC",await i(t,a)},c=async e=>{let t="SELECT * FROM VistaMovimientosDetallados",a=[],o=[];return e&&(e.sucursalOrigen&&(o.push("SucursalOrigen = ?"),a.push(e.sucursalOrigen)),e.sucursalDestino&&(o.push("SucursalDestino = ?"),a.push(e.sucursalDestino)),e.tipoMovimiento&&(o.push("tipoMovimiento = ?"),a.push(e.tipoMovimiento)),e.estatusMovimiento&&(o.push("estatusMovimiento = ?"),a.push(e.estatusMovimiento)),e.fechaDesde&&(o.push("fecha >= ?"),a.push(e.fechaDesde)),e.fechaHasta&&(o.push("fecha <= ?"),a.push(e.fechaHasta))),o.length>0&&(t+=" WHERE "+o.join(" AND ")),i(t+=" ORDER BY fecha DESC",a)},p=async()=>{try{console.log("Obteniendo catálogos...");let e=async(e,t=[])=>{try{return await i(e)}catch(a){return console.warn(`Query failed: ${e}`,a),t}},t=await e("SELECT * FROM usuarios",[]),a=await e("SELECT * FROM tipoequipo",[]),o=await e("SELECT * FROM estatusequipo",[]),r=await e("SELECT * FROM posiciones",[{id:1,nombre:"Entrada Principal"},{id:2,nombre:"Recepción"},{id:3,nombre:"Oficina"}]),s=await e('SELECT DISTINCT SucursalActual as nombre, SucursalActual as id FROM equipos WHERE SucursalActual IS NOT NULL AND SucursalActual != ""',[{id:"SUC001",nombre:"Sucursal Principal"},{id:"SUC002",nombre:"Sucursal Norte"},{id:"SUC003",nombre:"Sucursal Sur"}]);return{tiposEquipo:a,estatusEquipos:o,usuarios:t,posiciones:r,sucursales:s,estados:[],municipios:[],zonas:[]}}catch(e){throw console.error("Error obteniendo catálogos:",e),e}}},20894,(e,t,a)=>{},52065,e=>{"use strict";e.s(["handler",()=>U,"patchFetch",()=>x,"routeModule",()=>v,"serverHooks",()=>S,"workAsyncStorage",()=>I,"workUnitAsyncStorage",()=>C],52065);var t=e.i(47909),a=e.i(74017),o=e.i(96250),r=e.i(59756),i=e.i(61916),s=e.i(69741),n=e.i(16795),u=e.i(87718),c=e.i(95169),p=e.i(47587),l=e.i(66012),E=e.i(70101),d=e.i(26937),T=e.i(10372),A=e.i(93695);e.i(52474);var R=e.i(220);e.s(["GET",()=>M,"POST",()=>O],45978);var m=e.i(89171),N=e.i(84168);async function M(){try{let e=[],t=await (0,N.executeQuery)(`
      SELECT COUNT(*) as count
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'gostcam' AND TABLE_NAME = 'estatusmovimiento'
    `);t[0]?.count===0?(await (0,N.executeQuery)(`
        CREATE TABLE IF NOT EXISTS estatusmovimiento (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(50) NOT NULL UNIQUE,
          descripcion TEXT,
          activo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `),await (0,N.executeQuery)(`
        INSERT INTO estatusmovimiento (nombre, descripcion) VALUES
        ('ABIERTO', 'Movimiento pendiente de completar'),
        ('EN_PROGRESO', 'Movimiento en proceso'),
        ('COMPLETADO', 'Movimiento finalizado exitosamente'),
        ('CANCELADO', 'Movimiento cancelado'),
        ('PAUSADO', 'Movimiento temporalmente pausado')
        ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion)
      `),e.push("✅ Tabla 'estatusmovimiento' creada con datos iniciales")):e.push("ℹ️ Tabla 'estatusmovimiento' ya existe");let a=await (0,N.executeQuery)(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'gostcam' AND TABLE_NAME = 'tipoequipo'
      ORDER BY ORDINAL_POSITION
    `);a.some(e=>"id"===e.COLUMN_NAME)?e.push("ℹ️ Tabla 'tipoequipo' ya tiene columna 'id'"):a.map(e=>e.COLUMN_NAME).includes("idTipoEquipo")?e.push("ℹ️ Tabla 'tipoequipo' usa 'idTipoEquipo' como ID principal"):(await (0,N.executeQuery)(`
          ALTER TABLE tipoequipo 
          ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST
        `),e.push("✅ Columna 'id' añadida a tabla 'tipoequipo'"));let o=(await (0,N.executeQuery)(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'gostcam' 
      AND TABLE_NAME IN ('tipomovimiento', 'estatusequipo', 'movimientoinventario')
      ORDER BY TABLE_NAME
    `)).map(e=>e.TABLE_NAME);for(let t of["tipomovimiento","estatusequipo","movimientoinventario"])o.includes(t)?e.push(`ℹ️ Tabla '${t}' existe`):e.push(`⚠️ Tabla '${t}' no encontrada - necesita ser creada`);return o.includes("tipomovimiento")||(await (0,N.executeQuery)(`
        CREATE TABLE IF NOT EXISTS tipomovimiento (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(50) NOT NULL UNIQUE,
          descripcion TEXT,
          activo BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `),await (0,N.executeQuery)(`
        INSERT INTO tipomovimiento (nombre, descripcion) VALUES
        ('MANTENIMIENTO', 'Movimiento para mantenimiento de equipos'),
        ('TRANSFERENCIA', 'Movimiento para transferencia entre ubicaciones'),
        ('ASIGNACION', 'Asignaci\xf3n de equipo a usuario'),
        ('RETIRO', 'Retiro de equipo del servicio')
        ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion)
      `),e.push("✅ Tabla 'tipomovimiento' creada con datos iniciales")),m.NextResponse.json({success:!0,message:"Estructura de base de datos verificada y reparada",fixes:e})}catch(e){return console.error("Error reparando base de datos:",e),m.NextResponse.json({success:!1,error:"Error al reparar la base de datos",details:e instanceof Error?e.message:"Error desconocido"},{status:500})}}async function O(){try{let e=[];return await (0,N.executeQuery)("DROP TABLE IF EXISTS estatusmovimiento"),await (0,N.executeQuery)(`
      CREATE TABLE estatusmovimiento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE,
        descripcion TEXT,
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `),await (0,N.executeQuery)(`
      INSERT INTO estatusmovimiento (nombre, descripcion) VALUES
      ('ABIERTO', 'Movimiento pendiente de completar'),
      ('EN_PROGRESO', 'Movimiento en proceso'),
      ('COMPLETADO', 'Movimiento finalizado exitosamente'),
      ('CANCELADO', 'Movimiento cancelado'),
      ('PAUSADO', 'Movimiento temporalmente pausado')
    `),e.push("🔄 Tabla 'estatusmovimiento' recreada completamente"),await (0,N.executeQuery)(`
      CREATE TABLE IF NOT EXISTS tipomovimiento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE,
        descripcion TEXT,
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `),await (0,N.executeQuery)(`
      INSERT INTO tipomovimiento (nombre, descripcion) VALUES
      ('MANTENIMIENTO', 'Movimiento para mantenimiento de equipos'),
      ('TRANSFERENCIA', 'Movimiento para transferencia entre ubicaciones'),
      ('ASIGNACION', 'Asignaci\xf3n de equipo a usuario'),
      ('RETIRO', 'Retiro de equipo del servicio')
      ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion)
    `),e.push("🔄 Tabla 'tipomovimiento' verificada y actualizada"),m.NextResponse.json({success:!0,message:"Base de datos reparada completamente",fixes:e})}catch(e){return console.error("Error en reparación forzada:",e),m.NextResponse.json({success:!1,error:"Error en la reparación forzada",details:e instanceof Error?e.message:"Error desconocido"},{status:500})}}var h=e.i(45978);let v=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/fix-database/route",pathname:"/api/fix-database",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/fix-database/route.ts",nextConfigOutput:"",userland:h}),{workAsyncStorage:I,workUnitAsyncStorage:C,serverHooks:S}=v;function x(){return(0,o.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:C})}async function U(e,t,o){var m;let N="/api/fix-database/route";N=N.replace(/\/index$/,"")||"/";let M=await v.prepare(e,t,{srcPage:N,multiZoneDraftMode:!1});if(!M)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:O,params:h,nextConfig:I,isDraftMode:C,prerenderManifest:S,routerServerContext:x,isOnDemandRevalidate:U,revalidateOnlyGenerated:L,resolvedPathname:b}=M,f=(0,s.normalizeAppPath)(N),y=!!(S.dynamicRoutes[f]||S.routes[b]);if(y&&!C){let e=!!S.routes[b],t=S.dynamicRoutes[f];if(t&&!1===t.fallback&&!e)throw new A.NoFallbackError}let P=null;!y||v.isDev||C||(P="/index"===(P=b)?"/":P);let D=!0===v.isDev||!y,g=y&&!D,_=e.method||"GET",w=(0,i.getTracer)(),q=w.getActiveScopeSpan(),F={params:h,prerenderManifest:S,renderOpts:{experimental:{cacheComponents:!!I.experimental.cacheComponents,authInterrupts:!!I.experimental.authInterrupts},supportsDynamicResponse:D,incrementalCache:(0,r.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(m=I.experimental)?void 0:m.cacheLife,isRevalidate:g,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,o)=>v.onRequestError(e,t,o,x)},sharedContext:{buildId:O}},B=new n.NodeNextRequest(e),H=new n.NodeNextResponse(t),j=u.NextRequestAdapter.fromNodeNextRequest(B,(0,u.signalFromNodeResponse)(t));try{let s=async a=>v.handle(j,F).finally(()=>{if(!a)return;a.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=w.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=o.get("next.route");if(r){let e=`${_} ${r}`;a.setAttributes({"next.route":r,"http.route":r,"next.span_name":e}),a.updateName(e)}else a.updateName(`${_} ${e.url}`)}),n=async i=>{var n,u;let c=async({previousCacheEntry:a})=>{try{if(!(0,r.getRequestMeta)(e,"minimalMode")&&U&&L&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(i);e.fetchMetrics=F.renderOpts.fetchMetrics;let u=F.renderOpts.pendingWaitUntil;u&&o.waitUntil&&(o.waitUntil(u),u=void 0);let c=F.renderOpts.collectedTags;if(!y)return await (0,l.sendResponse)(B,H,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(n.headers);c&&(t[T.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=T.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,o=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=T.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:o}}}}catch(t){throw(null==a?void 0:a.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isRevalidate:g,isOnDemandRevalidate:U})},x),t}},A=await v.handleResponse({req:e,nextConfig:I,cacheKey:P,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:U,revalidateOnlyGenerated:L,responseGenerator:c,waitUntil:o.waitUntil});if(!y)return null;if((null==A||null==(n=A.value)?void 0:n.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==A||null==(u=A.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,r.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",U?"REVALIDATED":A.isMiss?"MISS":A.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,E.fromNodeOutgoingHttpHeaders)(A.value.headers);return(0,r.getRequestMeta)(e,"minimalMode")&&y||m.delete(T.NEXT_CACHE_TAGS_HEADER),!A.cacheControl||t.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,d.getCacheControlHeader)(A.cacheControl)),await (0,l.sendResponse)(B,H,new Response(A.value.body,{headers:m,status:A.value.status||200})),null};q?await n(q):await w.withPropagatedContext(e.headers,()=>w.trace(c.BaseServerSpan.handleRequest,{spanName:`${_} ${e.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":_,"http.target":e.url}},n))}catch(t){if(t instanceof A.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isRevalidate:g,isOnDemandRevalidate:U})}),y)throw t;return await (0,l.sendResponse)(B,H,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__23c71a83._.js.map