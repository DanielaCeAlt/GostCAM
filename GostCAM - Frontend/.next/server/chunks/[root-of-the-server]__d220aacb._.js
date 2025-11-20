module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52360,(e,t,a)=>{t.exports=e.x("mysql2/promise",()=>require("mysql2/promise"))},84168,e=>{"use strict";e.s(["executeQuery",()=>s,"getCatalogos",()=>p,"getConnection",()=>o,"getEquiposCompletos",()=>n,"getMovimientosDetallados",()=>l,"testConnection",()=>i]);var t=e.i(52360);let a={host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"3306"),user:process.env.DB_USER||"root",password:process.env.DB_PASSWORD||"",database:process.env.DB_NAME||"GostCAM",charset:"utf8mb4",timezone:"+00:00"},r=t.default.createPool({...a,waitForConnections:!0,connectionLimit:10,queueLimit:0}),o=async()=>{try{return await r.getConnection()}catch(e){throw console.error("Error connecting to the database:",e),Error("Failed to connect to database")}},s=async(e,t=[])=>{let a;try{a=await o();let[r]=await a.execute(e,t);return r}catch(a){throw console.error("Database query error:",a),console.error("Query:",e),console.error("Params:",t),a}finally{a&&a.release()}},i=async()=>{try{return(await s("SELECT 1 as test")).length>0}catch(e){return console.error("Database connection test failed:",e),!1}},n=async e=>u(e),u=async e=>{let t=`
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
  `,a=[],r=[];if(r.push("(e.eliminado IS NULL OR e.eliminado = 0)"),e&&(e.tipoEquipo&&(r.push("te.nombreTipo = ?"),a.push(e.tipoEquipo)),e.estatus&&(r.push("ee.estatus = ?"),a.push(e.estatus)),e.usuario&&(r.push("u.NombreUsuario LIKE ?"),a.push(`%${e.usuario}%`)),e.busqueda)){r.push(`(
        e.nombreEquipo LIKE ? OR 
        e.no_serie LIKE ? OR 
        e.numeroActivo LIKE ? OR
        e.modelo LIKE ? OR
        te.nombreTipo LIKE ? OR
        ee.estatus LIKE ? OR
        u.NombreUsuario LIKE ?
      )`);let t=`%${e.busqueda}%`;a.push(t,t,t,t,t,t,t)}return r.length>0&&(t+=" WHERE "+r.join(" AND ")),t+=" ORDER BY e.fechaAlta DESC",await s(t,a)},l=async e=>{let t="SELECT * FROM VistaMovimientosDetallados",a=[],r=[];return e&&(e.sucursalOrigen&&(r.push("SucursalOrigen = ?"),a.push(e.sucursalOrigen)),e.sucursalDestino&&(r.push("SucursalDestino = ?"),a.push(e.sucursalDestino)),e.tipoMovimiento&&(r.push("tipoMovimiento = ?"),a.push(e.tipoMovimiento)),e.estatusMovimiento&&(r.push("estatusMovimiento = ?"),a.push(e.estatusMovimiento)),e.fechaDesde&&(r.push("fecha >= ?"),a.push(e.fechaDesde)),e.fechaHasta&&(r.push("fecha <= ?"),a.push(e.fechaHasta))),r.length>0&&(t+=" WHERE "+r.join(" AND ")),s(t+=" ORDER BY fecha DESC",a)},p=async()=>{try{console.log("Obteniendo catálogos...");let e=async(e,t=[])=>{try{return await s(e)}catch(a){return console.warn(`Query failed: ${e}`,a),t}},t=await e("SELECT * FROM usuarios",[]),a=await e("SELECT * FROM tipoequipo",[]),r=await e("SELECT * FROM estatusequipo",[]),o=await e("SELECT * FROM posiciones",[{id:1,nombre:"Entrada Principal"},{id:2,nombre:"Recepción"},{id:3,nombre:"Oficina"}]),i=await e('SELECT DISTINCT SucursalActual as nombre, SucursalActual as id FROM equipos WHERE SucursalActual IS NOT NULL AND SucursalActual != ""',[{id:"SUC001",nombre:"Sucursal Principal"},{id:"SUC002",nombre:"Sucursal Norte"},{id:"SUC003",nombre:"Sucursal Sur"}]);return{tiposEquipo:a,estatusEquipos:r,usuarios:t,posiciones:o,sucursales:i,estados:[],municipios:[],zonas:[]}}catch(e){throw console.error("Error obteniendo catálogos:",e),e}}},48133,(e,t,a)=>{},60626,e=>{"use strict";e.s(["handler",()=>q,"patchFetch",()=>A,"routeModule",()=>C,"serverHooks",()=>b,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>S],60626);var t=e.i(47909),a=e.i(74017),r=e.i(96250),o=e.i(59756),s=e.i(61916),i=e.i(69741),n=e.i(16795),u=e.i(87718),l=e.i(95169),p=e.i(47587),c=e.i(66012),d=e.i(70101),E=e.i(26937),m=e.i(10372),h=e.i(93695);e.i(52474);var R=e.i(220);e.s(["GET",()=>x],32933);var T=e.i(89171),v=e.i(84168);async function x(e){try{let e=`
      SELECT 
        COUNT(*) as totalEquipos,
        SUM(CASE WHEN idEstatus = 1 THEN 1 ELSE 0 END) as equiposDisponibles,
        SUM(CASE WHEN idEstatus = 2 THEN 1 ELSE 0 END) as equiposEnUso,
        SUM(CASE WHEN idEstatus IN (3, 7) THEN 1 ELSE 0 END) as equiposMantenimiento,
        SUM(CASE WHEN idEstatus = 6 THEN 1 ELSE 0 END) as equiposDa\xf1ados
      FROM equipo
    `,[t]=await (0,v.executeQuery)(e),a=`
      SELECT COUNT(*) as movimientosAbiertos
      FROM movimientoinventario 
      WHERE estatusMovimiento = 'ABIERTO'
    `,[r]=await (0,v.executeQuery)(a),o=`
      SELECT COUNT(*) as movimientosMes
      FROM movimientoinventario 
      WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) 
      AND YEAR(fecha) = YEAR(CURRENT_DATE())
    `,[s]=await (0,v.executeQuery)(o),i=`
      SELECT 
        te.nombreTipo as tipo,
        COUNT(e.no_serie) as cantidad
      FROM tipoequipo te
      LEFT JOIN equipo e ON te.idTipoEquipo = e.idTipoEquipo
      GROUP BY te.idTipoEquipo, te.nombreTipo
      HAVING cantidad > 0
      ORDER BY cantidad DESC
      LIMIT 10
    `,n=await (0,v.executeQuery)(i),u=`
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') as mes,
        COUNT(*) as cantidad
      FROM movimientoinventario 
      WHERE fecha >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(fecha, '%Y-%m')
      ORDER BY mes DESC
    `,l=await (0,v.executeQuery)(u),p=`
      SELECT 
        es.estatus,
        COUNT(e.no_serie) as cantidad,
        ROUND((COUNT(e.no_serie) * 100.0 / (SELECT COUNT(*) FROM equipo)), 2) as porcentaje
      FROM estatusequipo es
      LEFT JOIN equipo e ON es.idEstatus = e.idEstatus
      GROUP BY es.idEstatus, es.estatus
      HAVING cantidad > 0
      ORDER BY cantidad DESC
    `,c=await (0,v.executeQuery)(p),d={Disponible:"#10B981","En uso":"#3B82F6",Mantenimiento:"#F59E0B","En reparación":"#F59E0B",Baja:"#6B7280",Extraviado:"#EF4444",Dañado:"#DC2626",Obsoleto:"#6B7280"},E=c.map(e=>({estatus:e.estatus,porcentaje:"string"==typeof e.porcentaje?parseFloat(e.porcentaje):e.porcentaje,color:d[e.estatus]||"#6B7280"})),m=l.map(e=>{let[t,a]=e.mes.split("-");return{mes:`${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][parseInt(a)-1]} ${t}`,cantidad:e.cantidad}}),h={totalEquipos:t.totalEquipos||0,equiposDisponibles:t.equiposDisponibles||0,equiposEnUso:t.equiposEnUso||0,equiposMantenimiento:t.equiposMantenimiento||0,equiposDañados:t.equiposDañados||0,movimientosAbiertos:r.movimientosAbiertos||0,movimientosMes:s.movimientosMes||0,equiposPorTipo:n||[],movimientosPorMes:m||[],estatusPorcentajes:E||[]};return T.NextResponse.json({success:!0,data:h,message:"Dashboard cargado exitosamente"},{status:200})}catch(e){return console.error("Error obteniendo datos del dashboard:",e),T.NextResponse.json({success:!1,error:"Error interno del servidor"},{status:500})}}var O=e.i(32933);let C=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/dashboard/route",pathname:"/api/dashboard",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/dashboard/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:N,workUnitAsyncStorage:S,serverHooks:b}=C;function A(){return(0,r.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:S})}async function q(e,t,r){var T;let v="/api/dashboard/route";v=v.replace(/\/index$/,"")||"/";let x=await C.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!x)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:O,params:N,nextConfig:S,isDraftMode:b,prerenderManifest:A,routerServerContext:q,isOnDemandRevalidate:f,revalidateOnlyGenerated:g,resolvedPathname:y}=x,D=(0,i.normalizeAppPath)(v),w=!!(A.dynamicRoutes[D]||A.routes[y]);if(w&&!b){let e=!!A.routes[y],t=A.dynamicRoutes[D];if(t&&!1===t.fallback&&!e)throw new h.NoFallbackError}let M=null;!w||C.isDev||b||(M="/index"===(M=y)?"/":M);let U=!0===C.isDev||!w,L=w&&!U,I=e.method||"GET",H=(0,s.getTracer)(),F=H.getActiveScopeSpan(),P={params:N,prerenderManifest:A,renderOpts:{experimental:{cacheComponents:!!S.experimental.cacheComponents,authInterrupts:!!S.experimental.authInterrupts},supportsDynamicResponse:U,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(T=S.experimental)?void 0:T.cacheLife,isRevalidate:L,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>C.onRequestError(e,t,r,q)},sharedContext:{buildId:O}},_=new n.NodeNextRequest(e),j=new n.NodeNextResponse(t),B=u.NextRequestAdapter.fromNodeNextRequest(_,(0,u.signalFromNodeResponse)(t));try{let i=async a=>C.handle(B,P).finally(()=>{if(!a)return;a.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=H.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let o=r.get("next.route");if(o){let e=`${I} ${o}`;a.setAttributes({"next.route":o,"http.route":o,"next.span_name":e}),a.updateName(e)}else a.updateName(`${I} ${e.url}`)}),n=async s=>{var n,u;let l=async({previousCacheEntry:a})=>{try{if(!(0,o.getRequestMeta)(e,"minimalMode")&&f&&g&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(s);e.fetchMetrics=P.renderOpts.fetchMetrics;let u=P.renderOpts.pendingWaitUntil;u&&r.waitUntil&&(r.waitUntil(u),u=void 0);let l=P.renderOpts.collectedTags;if(!w)return await (0,c.sendResponse)(_,j,n,P.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,d.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[m.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==P.renderOpts.collectedRevalidate&&!(P.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&P.renderOpts.collectedRevalidate,r=void 0===P.renderOpts.collectedExpire||P.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:P.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isRevalidate:L,isOnDemandRevalidate:f})},q),t}},h=await C.handleResponse({req:e,nextConfig:S,cacheKey:M,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:f,revalidateOnlyGenerated:g,responseGenerator:l,waitUntil:r.waitUntil});if(!w)return null;if((null==h||null==(n=h.value)?void 0:n.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==h||null==(u=h.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,o.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",f?"REVALIDATED":h.isMiss?"MISS":h.isStale?"STALE":"HIT"),b&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let T=(0,d.fromNodeOutgoingHttpHeaders)(h.value.headers);return(0,o.getRequestMeta)(e,"minimalMode")&&w||T.delete(m.NEXT_CACHE_TAGS_HEADER),!h.cacheControl||t.getHeader("Cache-Control")||T.get("Cache-Control")||T.set("Cache-Control",(0,E.getCacheControlHeader)(h.cacheControl)),await (0,c.sendResponse)(_,j,new Response(h.value.body,{headers:T,status:h.value.status||200})),null};F?await n(F):await H.withPropagatedContext(e.headers,()=>H.trace(l.BaseServerSpan.handleRequest,{spanName:`${I} ${e.url}`,kind:s.SpanKind.SERVER,attributes:{"http.method":I,"http.target":e.url}},n))}catch(t){if(t instanceof h.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isRevalidate:L,isOnDemandRevalidate:f})}),w)throw t;return await (0,c.sendResponse)(_,j,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__d220aacb._.js.map