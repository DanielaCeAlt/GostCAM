module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},52360,(e,t,r)=>{t.exports=e.x("mysql2/promise",()=>require("mysql2/promise"))},84168,e=>{"use strict";e.s(["executeQuery",()=>o,"getCatalogos",()=>c,"getConnection",()=>s,"getEquiposCompletos",()=>n,"getMovimientosDetallados",()=>l,"testConnection",()=>i]);var t=e.i(52360);let r={host:process.env.DB_HOST||"localhost",port:parseInt(process.env.DB_PORT||"3306"),user:process.env.DB_USER||"root",password:process.env.DB_PASSWORD||"",database:process.env.DB_NAME||"GostCAM",charset:"utf8mb4",timezone:"+00:00"},a=t.default.createPool({...r,waitForConnections:!0,connectionLimit:10,queueLimit:0}),s=async()=>{try{return await a.getConnection()}catch(e){throw console.error("Error connecting to the database:",e),Error("Failed to connect to database")}},o=async(e,t=[])=>{let r;try{r=await s();let[a]=await r.execute(e,t);return a}catch(r){throw console.error("Database query error:",r),console.error("Query:",e),console.error("Params:",t),r}finally{r&&r.release()}},i=async()=>{try{return(await o("SELECT 1 as test")).length>0}catch(e){return console.error("Database connection test failed:",e),!1}},n=async e=>u(e),u=async e=>{let t=`
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
  `,r=[],a=[];if(a.push("(e.eliminado IS NULL OR e.eliminado = 0)"),e&&(e.tipoEquipo&&(a.push("te.nombreTipo = ?"),r.push(e.tipoEquipo)),e.estatus&&(a.push("ee.estatus = ?"),r.push(e.estatus)),e.usuario&&(a.push("u.NombreUsuario LIKE ?"),r.push(`%${e.usuario}%`)),e.busqueda)){a.push(`(
        e.nombreEquipo LIKE ? OR 
        e.no_serie LIKE ? OR 
        e.numeroActivo LIKE ? OR
        e.modelo LIKE ? OR
        te.nombreTipo LIKE ? OR
        ee.estatus LIKE ? OR
        u.NombreUsuario LIKE ?
      )`);let t=`%${e.busqueda}%`;r.push(t,t,t,t,t,t,t)}return a.length>0&&(t+=" WHERE "+a.join(" AND ")),t+=" ORDER BY e.fechaAlta DESC",await o(t,r)},l=async e=>{let t="SELECT * FROM VistaMovimientosDetallados",r=[],a=[];return e&&(e.sucursalOrigen&&(a.push("SucursalOrigen = ?"),r.push(e.sucursalOrigen)),e.sucursalDestino&&(a.push("SucursalDestino = ?"),r.push(e.sucursalDestino)),e.tipoMovimiento&&(a.push("tipoMovimiento = ?"),r.push(e.tipoMovimiento)),e.estatusMovimiento&&(a.push("estatusMovimiento = ?"),r.push(e.estatusMovimiento)),e.fechaDesde&&(a.push("fecha >= ?"),r.push(e.fechaDesde)),e.fechaHasta&&(a.push("fecha <= ?"),r.push(e.fechaHasta))),a.length>0&&(t+=" WHERE "+a.join(" AND ")),o(t+=" ORDER BY fecha DESC",r)},c=async()=>{try{console.log("Obteniendo catálogos...");let e=async(e,t=[])=>{try{return await o(e)}catch(r){return console.warn(`Query failed: ${e}`,r),t}},t=await e("SELECT * FROM usuarios",[]),r=await e("SELECT * FROM tipoequipo",[]),a=await e("SELECT * FROM estatusequipo",[]),s=await e("SELECT * FROM posiciones",[{id:1,nombre:"Entrada Principal"},{id:2,nombre:"Recepción"},{id:3,nombre:"Oficina"}]),i=await e('SELECT DISTINCT SucursalActual as nombre, SucursalActual as id FROM equipos WHERE SucursalActual IS NOT NULL AND SucursalActual != ""',[{id:"SUC001",nombre:"Sucursal Principal"},{id:"SUC002",nombre:"Sucursal Norte"},{id:"SUC003",nombre:"Sucursal Sur"}]);return{tiposEquipo:r,estatusEquipos:a,usuarios:t,posiciones:s,sucursales:i,estados:[],municipios:[],zonas:[]}}catch(e){throw console.error("Error obteniendo catálogos:",e),e}}},85920,(e,t,r)=>{},42282,e=>{"use strict";e.s(["handler",()=>y,"patchFetch",()=>b,"routeModule",()=>v,"serverHooks",()=>w,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>S],42282);var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),o=e.i(61916),i=e.i(69741),n=e.i(16795),u=e.i(87718),l=e.i(95169),c=e.i(47587),p=e.i(66012),d=e.i(70101),E=e.i(26937),R=e.i(10372),h=e.i(93695);e.i(52474);var m=e.i(220);e.s(["GET",()=>C],71564);var x=e.i(89171),g=e.i(84168);async function C(e){try{let{searchParams:t}=new URL(e.url),r=t.get("tipo");if(!r){let e=await (0,g.getCatalogos)();return x.NextResponse.json({success:!0,data:e,message:"Catálogos obtenidos exitosamente"},{status:200})}let a=[];switch(r.toLowerCase()){case"tiposequipo":a=await (0,g.executeQuery)(`
          SELECT 
            ROW_NUMBER() OVER (ORDER BY TipoEquipo) as idTipoEquipo,
            TipoEquipo as nombre, 
            TipoEquipo as descripcion 
          FROM (
            SELECT DISTINCT TipoEquipo 
            FROM GostCAM.VistaEquiposCompletos 
            WHERE TipoEquipo IS NOT NULL
          ) tipos
          ORDER BY TipoEquipo
        `);break;case"sucursales":a=await (0,g.executeQuery)(`
          SELECT 
            ROW_NUMBER() OVER (ORDER BY Sucursal) as id,
            idCentro,
            Sucursal as nombre, 
            Direccion as direccion,
            idZona as zona,
            idEstado as estado,
            idMunicipios as municipio
          FROM sucursales
          ORDER BY Sucursal
        `);break;case"usuarios":a=await (0,g.executeQuery)(`
          SELECT 
            ROW_NUMBER() OVER (ORDER BY UsuarioAsignado) as idUsuarios,
            UsuarioAsignado as NombreUsuario,
            1 as NivelUsuario,
            '' as Correo 
          FROM (
            SELECT DISTINCT UsuarioAsignado 
            FROM GostCAM.VistaEquiposCompletos 
            WHERE UsuarioAsignado IS NOT NULL 
              AND UsuarioAsignado != ''
          ) usuarios
          ORDER BY UsuarioAsignado
        `);break;case"estatus":a=await (0,g.executeQuery)(`
          SELECT 
            ROW_NUMBER() OVER (ORDER BY EstatusEquipo) as idEstatus,
            EstatusEquipo as nombre 
          FROM (
            SELECT DISTINCT EstatusEquipo 
            FROM GostCAM.VistaEquiposCompletos 
            WHERE EstatusEquipo IS NOT NULL
          ) estatus
          ORDER BY EstatusEquipo
        `);break;default:return x.NextResponse.json({success:!1,error:`Tipo de cat\xe1logo no v\xe1lido: ${r}`},{status:400})}return x.NextResponse.json({success:!0,data:a,message:`Cat\xe1logo ${r} obtenido exitosamente`},{status:200})}catch(e){return console.error("Error obteniendo catálogos:",e),x.NextResponse.json({success:!1,error:"Error interno del servidor"},{status:500})}}var O=e.i(71564);let v=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/catalogos/route",pathname:"/api/catalogos",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/catalogos/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:T,workUnitAsyncStorage:S,serverHooks:w}=v;function b(){return(0,a.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:S})}async function y(e,t,a){var x;let g="/api/catalogos/route";g=g.replace(/\/index$/,"")||"/";let C=await v.prepare(e,t,{srcPage:g,multiZoneDraftMode:!1});if(!C)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:O,params:T,nextConfig:S,isDraftMode:w,prerenderManifest:b,routerServerContext:y,isOnDemandRevalidate:N,revalidateOnlyGenerated:f,resolvedPathname:q}=C,A=(0,i.normalizeAppPath)(g),D=!!(b.dynamicRoutes[A]||b.routes[q]);if(D&&!w){let e=!!b.routes[q],t=b.dynamicRoutes[A];if(t&&!1===t.fallback&&!e)throw new h.NoFallbackError}let M=null;!D||v.isDev||w||(M="/index"===(M=q)?"/":M);let L=!0===v.isDev||!D,U=D&&!L,I=e.method||"GET",_=(0,o.getTracer)(),P=_.getActiveScopeSpan(),F={params:T,prerenderManifest:b,renderOpts:{experimental:{cacheComponents:!!S.experimental.cacheComponents,authInterrupts:!!S.experimental.authInterrupts},supportsDynamicResponse:L,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(x=S.experimental)?void 0:x.cacheLife,isRevalidate:U,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>v.onRequestError(e,t,a,y)},sharedContext:{buildId:O}},H=new n.NodeNextRequest(e),j=new n.NodeNextResponse(t),k=u.NextRequestAdapter.fromNodeNextRequest(H,(0,u.signalFromNodeResponse)(t));try{let i=async r=>v.handle(k,F).finally(()=>{if(!r)return;r.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=_.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let e=`${I} ${s}`;r.setAttributes({"next.route":s,"http.route":s,"next.span_name":e}),r.updateName(e)}else r.updateName(`${I} ${e.url}`)}),n=async o=>{var n,u;let l=async({previousCacheEntry:r})=>{try{if(!(0,s.getRequestMeta)(e,"minimalMode")&&N&&f&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let u=F.renderOpts.pendingWaitUntil;u&&a.waitUntil&&(a.waitUntil(u),u=void 0);let l=F.renderOpts.collectedTags;if(!D)return await (0,p.sendResponse)(H,j,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,d.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,a=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:g,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:U,isOnDemandRevalidate:N})},y),t}},h=await v.handleResponse({req:e,nextConfig:S,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:b,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:f,responseGenerator:l,waitUntil:a.waitUntil});if(!D)return null;if((null==h||null==(n=h.value)?void 0:n.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==h||null==(u=h.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,s.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",N?"REVALIDATED":h.isMiss?"MISS":h.isStale?"STALE":"HIT"),w&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let x=(0,d.fromNodeOutgoingHttpHeaders)(h.value.headers);return(0,s.getRequestMeta)(e,"minimalMode")&&D||x.delete(R.NEXT_CACHE_TAGS_HEADER),!h.cacheControl||t.getHeader("Cache-Control")||x.get("Cache-Control")||x.set("Cache-Control",(0,E.getCacheControlHeader)(h.cacheControl)),await (0,p.sendResponse)(H,j,new Response(h.value.body,{headers:x,status:h.value.status||200})),null};P?await n(P):await _.withPropagatedContext(e.headers,()=>_.trace(l.BaseServerSpan.handleRequest,{spanName:`${I} ${e.url}`,kind:o.SpanKind.SERVER,attributes:{"http.method":I,"http.target":e.url}},n))}catch(t){if(t instanceof h.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:A,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:U,isOnDemandRevalidate:N})}),D)throw t;return await (0,p.sendResponse)(H,j,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__8bba870e._.js.map