module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52360,(e,t,r)=>{t.exports=e.x("mysql2/promise",()=>require("mysql2/promise"))},84168,e=>{"use strict";e.s(["executeQuery",()=>n,"getCatalogos",()=>l,"getConnection",()=>i,"getEquiposCompletos",()=>a,"getMovimientosDetallados",()=>c,"testConnection",()=>s]);var t=e.i(52360);let r={host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"3306"),user:process.env.DB_USER||"root",password:process.env.DB_PASSWORD||"",database:process.env.DB_NAME||"GostCAM",charset:"utf8mb4",timezone:"+00:00"},o=t.default.createPool({...r,waitForConnections:!0,connectionLimit:10,queueLimit:0}),i=async()=>{try{return await o.getConnection()}catch(e){throw console.error("Error connecting to the database:",e),Error("Failed to connect to database")}},n=async(e,t=[])=>{let r;try{r=await i();let[o]=await r.execute(e,t);return o}catch(r){throw console.error("Database query error:",r),console.error("Query:",e),console.error("Params:",t),r}finally{r&&r.release()}},s=async()=>{try{return(await n("SELECT 1 as test")).length>0}catch(e){return console.error("Database connection test failed:",e),!1}},a=async e=>u(e),u=async e=>{let t=`
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
  `,r=[],o=[];if(o.push("(e.eliminado IS NULL OR e.eliminado = 0)"),e&&(e.tipoEquipo&&(o.push("te.nombreTipo = ?"),r.push(e.tipoEquipo)),e.estatus&&(o.push("ee.estatus = ?"),r.push(e.estatus)),e.usuario&&(o.push("u.NombreUsuario LIKE ?"),r.push(`%${e.usuario}%`)),e.busqueda)){o.push(`(
        e.nombreEquipo LIKE ? OR 
        e.no_serie LIKE ? OR 
        e.numeroActivo LIKE ? OR
        e.modelo LIKE ? OR
        te.nombreTipo LIKE ? OR
        ee.estatus LIKE ? OR
        u.NombreUsuario LIKE ?
      )`);let t=`%${e.busqueda}%`;r.push(t,t,t,t,t,t,t)}return o.length>0&&(t+=" WHERE "+o.join(" AND ")),t+=" ORDER BY e.fechaAlta DESC",await n(t,r)},c=async e=>{let t="SELECT * FROM VistaMovimientosDetallados",r=[],o=[];return e&&(e.sucursalOrigen&&(o.push("SucursalOrigen = ?"),r.push(e.sucursalOrigen)),e.sucursalDestino&&(o.push("SucursalDestino = ?"),r.push(e.sucursalDestino)),e.tipoMovimiento&&(o.push("tipoMovimiento = ?"),r.push(e.tipoMovimiento)),e.estatusMovimiento&&(o.push("estatusMovimiento = ?"),r.push(e.estatusMovimiento)),e.fechaDesde&&(o.push("fecha >= ?"),r.push(e.fechaDesde)),e.fechaHasta&&(o.push("fecha <= ?"),r.push(e.fechaHasta))),o.length>0&&(t+=" WHERE "+o.join(" AND ")),n(t+=" ORDER BY fecha DESC",r)},l=async()=>{try{console.log("Obteniendo catálogos...");let e=async(e,t=[])=>{try{return await n(e)}catch(r){return console.warn(`Query failed: ${e}`,r),t}},t=await e("SELECT * FROM usuarios",[]),r=await e("SELECT * FROM tipoequipo",[]),o=await e("SELECT * FROM estatusequipo",[]),i=await e("SELECT * FROM posiciones",[{id:1,nombre:"Entrada Principal"},{id:2,nombre:"Recepción"},{id:3,nombre:"Oficina"}]),s=await e('SELECT DISTINCT SucursalActual as nombre, SucursalActual as id FROM equipos WHERE SucursalActual IS NOT NULL AND SucursalActual != ""',[{id:"SUC001",nombre:"Sucursal Principal"},{id:"SUC002",nombre:"Sucursal Norte"},{id:"SUC003",nombre:"Sucursal Sur"}]);return{tiposEquipo:r,estatusEquipos:o,usuarios:t,posiciones:i,sucursales:s,estados:[],municipios:[],zonas:[]}}catch(e){throw console.error("Error obteniendo catálogos:",e),e}}},73805,(e,t,r)=>{},54119,e=>{"use strict";e.s(["handler",()=>b,"patchFetch",()=>C,"routeModule",()=>x,"serverHooks",()=>A,"workAsyncStorage",()=>f,"workUnitAsyncStorage",()=>I],54119);var t=e.i(47909),r=e.i(74017),o=e.i(96250),i=e.i(59756),n=e.i(61916),s=e.i(69741),a=e.i(16795),u=e.i(87718),c=e.i(95169),l=e.i(47587),p=e.i(66012),d=e.i(70101),m=e.i(26937),E=e.i(10372),h=e.i(93695);e.i(52474);var R=e.i(220);e.s(["GET",()=>v,"POST",()=>T],32976);var N=e.i(89171),O=e.i(84168);async function T(e){try{let{equipos:t,tipoMantenimiento:r,fechaProgramada:o,tecnicoAsignado:i,descripcion:n,prioridad:s="NORMAL",estimacionHoras:a=1,observaciones:u=""}=await e.json();if(!t||!Array.isArray(t)||0===t.length)return N.NextResponse.json({success:!1,error:"Debe especificar al menos un equipo para mantenimiento"},{status:400});if(!r||!["PREVENTIVO","CORRECTIVO","URGENTE"].includes(r))return N.NextResponse.json({success:!1,error:"Tipo de mantenimiento debe ser PREVENTIVO, CORRECTIVO o URGENTE"},{status:400});if(!o)return N.NextResponse.json({success:!1,error:"Fecha programada es requerida"},{status:400});if(!i)return N.NextResponse.json({success:!1,error:"Técnico asignado es requerido"},{status:400});let c=`
      SELECT id, nombre, nivel 
      FROM usuarios 
      WHERE id = ? AND nivel IN (2, 3)
    `,l=await (0,O.executeQuery)(c,[i]);if(0===l.length)return N.NextResponse.json({success:!1,error:"Técnico no encontrado o no tiene permisos para mantenimiento"},{status:400});let p=`
      SELECT 
        e.no_serie,
        e.nombreEquipo,
        ee.nombre as estatus,
        s.nombre as sucursal,
        l.nombre as area
      FROM equipo e
      INNER JOIN layout l ON e.idLayout = l.id
      INNER JOIN sucursales s ON l.centro = s.id
      INNER JOIN estatusequipo ee ON e.idEstatus = ee.id
      WHERE e.no_serie IN (${t.map(()=>"?").join(",")})
    `,d=await (0,O.executeQuery)(p,t);if(d.length!==t.length){let e=d.map(e=>e.no_serie),r=t.filter(t=>!e.includes(t));return N.NextResponse.json({success:!1,error:`Equipos no encontrados: ${r.join(", ")}`},{status:400})}let m=`
      SELECT mi.no_serie
      FROM movimientoinventario mi
      INNER JOIN tipomovimiento tm ON mi.idTipoMov = tm.id
      INNER JOIN estatusmovimiento em ON mi.idEstatusMov = em.id
      WHERE mi.no_serie IN (${t.map(()=>"?").join(",")})
        AND tm.nombre = 'MANTENIMIENTO'
        AND em.nombre = 'ABIERTO'
    `,E=await (0,O.executeQuery)(m,t);if(E.length>0)return N.NextResponse.json({success:!1,error:`Los siguientes equipos ya est\xe1n en mantenimiento: ${E.map(e=>e.no_serie).join(", ")}`},{status:400});let h=(await (0,O.executeQuery)("SELECT id FROM tipomovimiento WHERE nombre = 'MANTENIMIENTO'",[]))[0].id,R=(await (0,O.executeQuery)("SELECT id FROM estatusmovimiento WHERE nombre = 'ABIERTO'",[]))[0].id,T=[];for(let e of t)try{let t=`
          INSERT INTO movimientoinventario (
            fecha,
            idTipoMov,
            origen_idCentro,
            destino_idCentro,
            idEstatusMov,
            observaciones,
            idUsuarios,
            no_serie,
            tipo_mantenimiento,
            prioridad_mantenimiento,
            estimacion_horas,
            descripcion_trabajo
          ) VALUES (?, ?, 
            (SELECT l.centro FROM equipo e INNER JOIN layout l ON e.idLayout = l.id WHERE e.no_serie = ?),
            (SELECT l.centro FROM equipo e INNER JOIN layout l ON e.idLayout = l.id WHERE e.no_serie = ?),
            ?, ?, ?, ?, ?, ?, ?, ?)
        `,c=await (0,O.executeQuery)(t,[o,h,e,e,R,u,i,e,r,s,a,n]),p=`
          UPDATE equipo 
          SET idEstatus = (SELECT id FROM estatusequipo WHERE nombre = 'Mantenimiento')
          WHERE no_serie = ?
        `;await (0,O.executeQuery)(p,[e]),T.push({no_serie:e,idMantenimiento:c.insertId||Date.now(),fechaProgramada:o,tipo:r,prioridad:s,tecnico:l[0].nombre})}catch(t){console.error(`Error creando mantenimiento para equipo ${e}:`,t)}if(0===T.length)return N.NextResponse.json({success:!1,error:"No se pudo programar ningún mantenimiento"},{status:500});let v={totalEquipos:t.length,mantenimientosProgramados:T.length,tipoMantenimiento:r,fechaProgramada:o,tecnicoAsignado:l[0].nombre,estimacionTotalHoras:T.length*a,mantenimientos:T,equiposIncluidos:d.map(e=>({no_serie:e.no_serie,nombre:e.nombreEquipo,ubicacion:`${e.sucursal} - ${e.area}`}))};return N.NextResponse.json({success:!0,data:v,message:`Se programaron ${T.length} mantenimientos de ${t.length} equipos`},{status:201})}catch(e){return console.error("Error programando mantenimientos:",e),N.NextResponse.json({success:!1,error:"Error interno del servidor"},{status:500})}}async function v(e){try{let{searchParams:t}=new URL(e.url),r=t.get("sucursal"),o=t.get("tecnico"),i=t.get("tipo"),n=t.get("estatus")||"ABIERTO",s=t.get("fechaDesde"),a=t.get("fechaHasta"),u=["em.nombre = ?"],c=[n];r&&(u.push("s.id = ?"),c.push(r)),o&&(u.push("u.id = ?"),c.push(o)),i&&(u.push("mi.tipo_mantenimiento = ?"),c.push(i)),s&&(u.push("DATE(mi.fecha) >= ?"),c.push(s)),a&&(u.push("DATE(mi.fecha) <= ?"),c.push(a));let l=`
      SELECT 
        mi.id,
        mi.fecha,
        mi.fechaFin,
        mi.tipo_mantenimiento,
        mi.prioridad_mantenimiento,
        mi.estimacion_horas,
        mi.descripcion_trabajo,
        mi.observaciones,
        em.nombre AS estatus,
        e.no_serie,
        e.nombreEquipo,
        te.nombre AS tipoEquipo,
        s.nombre AS sucursal,
        l.nombre AS area,
        u.nombre AS tecnico,
        DATEDIFF(CURDATE(), mi.fecha) AS diasTranscurridos,
        CASE 
          WHEN mi.fechaFin IS NOT NULL 
          THEN TIMESTAMPDIFF(HOUR, mi.fecha, mi.fechaFin)
          ELSE NULL
        END AS horasReales
      FROM movimientoinventario mi
      INNER JOIN tipomovimiento tm ON mi.idTipoMov = tm.id
      INNER JOIN estatusmovimiento em ON mi.idEstatusMov = em.id
      INNER JOIN equipo e ON mi.no_serie = e.no_serie
      INNER JOIN tipoequipo te ON e.idTipoEquipo = te.id
      INNER JOIN layout l ON e.idLayout = l.id
      INNER JOIN sucursales s ON l.centro = s.id
      INNER JOIN usuarios u ON mi.idUsuarios = u.id
      WHERE tm.nombre = 'MANTENIMIENTO' AND ${u.join(" AND ")}
      ORDER BY 
        CASE mi.prioridad_mantenimiento 
          WHEN 'CRITICA' THEN 1
          WHEN 'ALTA' THEN 2
          WHEN 'NORMAL' THEN 3
          WHEN 'BAJA' THEN 4
        END,
        mi.fecha ASC
    `,p=await (0,O.executeQuery)(l,c),d=p.reduce((e,t)=>(e[t.tecnico]||(e[t.tecnico]={tecnico:t.tecnico,totalMantenimientos:0,horasEstimadas:0,horasReales:0,preventivos:0,correctivos:0,urgentes:0}),e[t.tecnico].totalMantenimientos++,e[t.tecnico].horasEstimadas+=t.estimacion_horas||0,e[t.tecnico].horasReales+=t.horasReales||0,"PREVENTIVO"===t.tipo_mantenimiento&&e[t.tecnico].preventivos++,"CORRECTIVO"===t.tipo_mantenimiento&&e[t.tecnico].correctivos++,"URGENTE"===t.tipo_mantenimiento&&e[t.tecnico].urgentes++,e),{});return N.NextResponse.json({success:!0,data:{mantenimientos:p,estadisticas:{total:p.length,porTecnico:Object.values(d),porTipo:{preventivos:p.filter(e=>"PREVENTIVO"===e.tipo_mantenimiento).length,correctivos:p.filter(e=>"CORRECTIVO"===e.tipo_mantenimiento).length,urgentes:p.filter(e=>"URGENTE"===e.tipo_mantenimiento).length},porPrioridad:{critica:p.filter(e=>"CRITICA"===e.prioridad_mantenimiento).length,alta:p.filter(e=>"ALTA"===e.prioridad_mantenimiento).length,normal:p.filter(e=>"NORMAL"===e.prioridad_mantenimiento).length,baja:p.filter(e=>"BAJA"===e.prioridad_mantenimiento).length}}},message:`Se encontraron ${p.length} mantenimientos`},{status:200})}catch(e){return console.error("Error obteniendo mantenimientos:",e),N.NextResponse.json({success:!1,error:"Error interno del servidor"},{status:500})}}var g=e.i(32976);let x=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/equipos/maintenance/route",pathname:"/api/equipos/maintenance",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/equipos/maintenance/route.ts",nextConfigOutput:"",userland:g}),{workAsyncStorage:f,workUnitAsyncStorage:I,serverHooks:A}=x;function C(){return(0,o.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:I})}async function b(e,t,o){var N;let O="/api/equipos/maintenance/route";O=O.replace(/\/index$/,"")||"/";let T=await x.prepare(e,t,{srcPage:O,multiZoneDraftMode:!1});if(!T)return t.statusCode=400,t.end("Bad Request"),null==o.waitUntil||o.waitUntil.call(o,Promise.resolve()),null;let{buildId:v,params:g,nextConfig:f,isDraftMode:I,prerenderManifest:A,routerServerContext:C,isOnDemandRevalidate:b,revalidateOnlyGenerated:y,resolvedPathname:S}=T,q=(0,s.normalizeAppPath)(O),w=!!(A.dynamicRoutes[q]||A.routes[S]);if(w&&!I){let e=!!A.routes[S],t=A.dynamicRoutes[q];if(t&&!1===t.fallback&&!e)throw new h.NoFallbackError}let _=null;!w||x.isDev||I||(_="/index"===(_=S)?"/":_);let M=!0===x.isDev||!w,L=w&&!M,D=e.method||"GET",H=(0,n.getTracer)(),j=H.getActiveScopeSpan(),U={params:g,prerenderManifest:A,renderOpts:{experimental:{cacheComponents:!!f.experimental.cacheComponents,authInterrupts:!!f.experimental.authInterrupts},supportsDynamicResponse:M,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(N=f.experimental)?void 0:N.cacheLife,isRevalidate:L,waitUntil:o.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,o)=>x.onRequestError(e,t,o,C)},sharedContext:{buildId:v}},P=new a.NodeNextRequest(e),F=new a.NodeNextResponse(t),$=u.NextRequestAdapter.fromNodeNextRequest(P,(0,u.signalFromNodeResponse)(t));try{let s=async r=>x.handle($,U).finally(()=>{if(!r)return;r.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=H.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=o.get("next.route");if(i){let e=`${D} ${i}`;r.setAttributes({"next.route":i,"http.route":i,"next.span_name":e}),r.updateName(e)}else r.updateName(`${D} ${e.url}`)}),a=async n=>{var a,u;let c=async({previousCacheEntry:r})=>{try{if(!(0,i.getRequestMeta)(e,"minimalMode")&&b&&y&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(n);e.fetchMetrics=U.renderOpts.fetchMetrics;let u=U.renderOpts.pendingWaitUntil;u&&o.waitUntil&&(o.waitUntil(u),u=void 0);let c=U.renderOpts.collectedTags;if(!w)return await (0,p.sendResponse)(P,F,a,U.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,d.toNodeOutgoingHttpHeaders)(a.headers);c&&(t[E.NEXT_CACHE_TAGS_HEADER]=c),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==U.renderOpts.collectedRevalidate&&!(U.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&U.renderOpts.collectedRevalidate,o=void 0===U.renderOpts.collectedExpire||U.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:U.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:o}}}}catch(t){throw(null==r?void 0:r.isStale)&&await x.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isRevalidate:L,isOnDemandRevalidate:b})},C),t}},h=await x.handleResponse({req:e,nextConfig:f,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:b,revalidateOnlyGenerated:y,responseGenerator:c,waitUntil:o.waitUntil});if(!w)return null;if((null==h||null==(a=h.value)?void 0:a.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==h||null==(u=h.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,i.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",b?"REVALIDATED":h.isMiss?"MISS":h.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,d.fromNodeOutgoingHttpHeaders)(h.value.headers);return(0,i.getRequestMeta)(e,"minimalMode")&&w||N.delete(E.NEXT_CACHE_TAGS_HEADER),!h.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,m.getCacheControlHeader)(h.cacheControl)),await (0,p.sendResponse)(P,F,new Response(h.value.body,{headers:N,status:h.value.status||200})),null};j?await a(j):await H.withPropagatedContext(e.headers,()=>H.trace(c.BaseServerSpan.handleRequest,{spanName:`${D} ${e.url}`,kind:n.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},a))}catch(t){if(t instanceof h.NoFallbackError||await x.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isRevalidate:L,isOnDemandRevalidate:b})}),w)throw t;return await (0,p.sendResponse)(P,F,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__f71d92c2._.js.map