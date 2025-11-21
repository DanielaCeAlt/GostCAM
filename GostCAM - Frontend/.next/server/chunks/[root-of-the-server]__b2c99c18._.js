module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},73805,(e,t,r)=>{},54119,e=>{"use strict";e.s(["handler",()=>y,"patchFetch",()=>C,"routeModule",()=>T,"serverHooks",()=>A,"workAsyncStorage",()=>f,"workUnitAsyncStorage",()=>I],54119);var t=e.i(47909),r=e.i(74017),n=e.i(96250),i=e.i(59756),o=e.i(61916),a=e.i(69741),s=e.i(16795),u=e.i(87718),l=e.i(95169),c=e.i(47587),d=e.i(66012),p=e.i(70101),m=e.i(26937),E=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220);e.s(["GET",()=>g,"POST",()=>v],32976);var h=e.i(89171),x=e.i(84168);async function v(e){try{let{equipos:t,tipoMantenimiento:r,fechaProgramada:n,tecnicoAsignado:i,descripcion:o,prioridad:a="NORMAL",estimacionHoras:s=1,observaciones:u=""}=await e.json();if(!t||!Array.isArray(t)||0===t.length)return h.NextResponse.json({success:!1,error:"Debe especificar al menos un equipo para mantenimiento"},{status:400});if(!r||!["PREVENTIVO","CORRECTIVO","URGENTE"].includes(r))return h.NextResponse.json({success:!1,error:"Tipo de mantenimiento debe ser PREVENTIVO, CORRECTIVO o URGENTE"},{status:400});if(!n)return h.NextResponse.json({success:!1,error:"Fecha programada es requerida"},{status:400});if(!i)return h.NextResponse.json({success:!1,error:"Técnico asignado es requerido"},{status:400});let l=`
      SELECT id, nombre, nivel 
      FROM usuarios 
      WHERE id = ? AND nivel IN (2, 3)
    `,c=await (0,x.executeQuery)(l,[i]);if(0===c.length)return h.NextResponse.json({success:!1,error:"Técnico no encontrado o no tiene permisos para mantenimiento"},{status:400});let d=`
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
    `,p=await (0,x.executeQuery)(d,t);if(p.length!==t.length){let e=p.map(e=>e.no_serie),r=t.filter(t=>!e.includes(t));return h.NextResponse.json({success:!1,error:`Equipos no encontrados: ${r.join(", ")}`},{status:400})}let m=`
      SELECT mi.no_serie
      FROM movimientoinventario mi
      INNER JOIN tipomovimiento tm ON mi.idTipoMov = tm.id
      INNER JOIN estatusmovimiento em ON mi.idEstatusMov = em.id
      WHERE mi.no_serie IN (${t.map(()=>"?").join(",")})
        AND tm.nombre = 'MANTENIMIENTO'
        AND em.nombre = 'ABIERTO'
    `,E=await (0,x.executeQuery)(m,t);if(E.length>0)return h.NextResponse.json({success:!1,error:`Los siguientes equipos ya est\xe1n en mantenimiento: ${E.map(e=>e.no_serie).join(", ")}`},{status:400});let N=(await (0,x.executeQuery)("SELECT id FROM tipomovimiento WHERE nombre = 'MANTENIMIENTO'",[]))[0].id,R=(await (0,x.executeQuery)("SELECT id FROM estatusmovimiento WHERE nombre = 'ABIERTO'",[]))[0].id,v=[];for(let e of t)try{let t=`
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
        `,l=await (0,x.executeQuery)(t,[n,N,e,e,R,u,i,e,r,a,s,o]),d=`
          UPDATE equipo 
          SET idEstatus = (SELECT id FROM estatusequipo WHERE nombre = 'Mantenimiento')
          WHERE no_serie = ?
        `;await (0,x.executeQuery)(d,[e]),v.push({no_serie:e,idMantenimiento:l.insertId||Date.now(),fechaProgramada:n,tipo:r,prioridad:a,tecnico:c[0].nombre})}catch(t){console.error(`Error creando mantenimiento para equipo ${e}:`,t)}if(0===v.length)return h.NextResponse.json({success:!1,error:"No se pudo programar ningún mantenimiento"},{status:500});let g={totalEquipos:t.length,mantenimientosProgramados:v.length,tipoMantenimiento:r,fechaProgramada:n,tecnicoAsignado:c[0].nombre,estimacionTotalHoras:v.length*s,mantenimientos:v,equiposIncluidos:p.map(e=>({no_serie:e.no_serie,nombre:e.nombreEquipo,ubicacion:`${e.sucursal} - ${e.area}`}))};return h.NextResponse.json({success:!0,data:g,message:`Se programaron ${v.length} mantenimientos de ${t.length} equipos`},{status:201})}catch(e){return console.error("Error programando mantenimientos:",e),h.NextResponse.json({success:!1,error:"Error interno del servidor"},{status:500})}}async function g(e){try{let{searchParams:t}=new URL(e.url),r=t.get("sucursal"),n=t.get("tecnico"),i=t.get("tipo"),o=t.get("estatus")||"ABIERTO",a=t.get("fechaDesde"),s=t.get("fechaHasta"),u=["em.nombre = ?"],l=[o];r&&(u.push("s.id = ?"),l.push(r)),n&&(u.push("u.id = ?"),l.push(n)),i&&(u.push("mi.tipo_mantenimiento = ?"),l.push(i)),a&&(u.push("DATE(mi.fecha) >= ?"),l.push(a)),s&&(u.push("DATE(mi.fecha) <= ?"),l.push(s));let c=`
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
    `,d=await (0,x.executeQuery)(c,l),p=d.reduce((e,t)=>(e[t.tecnico]||(e[t.tecnico]={tecnico:t.tecnico,totalMantenimientos:0,horasEstimadas:0,horasReales:0,preventivos:0,correctivos:0,urgentes:0}),e[t.tecnico].totalMantenimientos++,e[t.tecnico].horasEstimadas+=t.estimacion_horas||0,e[t.tecnico].horasReales+=t.horasReales||0,"PREVENTIVO"===t.tipo_mantenimiento&&e[t.tecnico].preventivos++,"CORRECTIVO"===t.tipo_mantenimiento&&e[t.tecnico].correctivos++,"URGENTE"===t.tipo_mantenimiento&&e[t.tecnico].urgentes++,e),{});return h.NextResponse.json({success:!0,data:{mantenimientos:d,estadisticas:{total:d.length,porTecnico:Object.values(p),porTipo:{preventivos:d.filter(e=>"PREVENTIVO"===e.tipo_mantenimiento).length,correctivos:d.filter(e=>"CORRECTIVO"===e.tipo_mantenimiento).length,urgentes:d.filter(e=>"URGENTE"===e.tipo_mantenimiento).length},porPrioridad:{critica:d.filter(e=>"CRITICA"===e.prioridad_mantenimiento).length,alta:d.filter(e=>"ALTA"===e.prioridad_mantenimiento).length,normal:d.filter(e=>"NORMAL"===e.prioridad_mantenimiento).length,baja:d.filter(e=>"BAJA"===e.prioridad_mantenimiento).length}}},message:`Se encontraron ${d.length} mantenimientos`},{status:200})}catch(e){return console.error("Error obteniendo mantenimientos:",e),h.NextResponse.json({success:!1,error:"Error interno del servidor"},{status:500})}}var O=e.i(32976);let T=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/equipos/maintenance/route",pathname:"/api/equipos/maintenance",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/equipos/maintenance/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:f,workUnitAsyncStorage:I,serverHooks:A}=T;function C(){return(0,n.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:I})}async function y(e,t,n){var h;let x="/api/equipos/maintenance/route";x=x.replace(/\/index$/,"")||"/";let v=await T.prepare(e,t,{srcPage:x,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:g,params:O,nextConfig:f,isDraftMode:I,prerenderManifest:A,routerServerContext:C,isOnDemandRevalidate:y,revalidateOnlyGenerated:_,resolvedPathname:b}=v,w=(0,a.normalizeAppPath)(x),q=!!(A.dynamicRoutes[w]||A.routes[b]);if(q&&!I){let e=!!A.routes[b],t=A.dynamicRoutes[w];if(t&&!1===t.fallback&&!e)throw new N.NoFallbackError}let S=null;!q||T.isDev||I||(S="/index"===(S=b)?"/":S);let M=!0===T.isDev||!q,j=q&&!M,H=e.method||"GET",L=(0,o.getTracer)(),P=L.getActiveScopeSpan(),D={params:O,prerenderManifest:A,renderOpts:{experimental:{cacheComponents:!!f.experimental.cacheComponents,authInterrupts:!!f.experimental.authInterrupts},supportsDynamicResponse:M,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(h=f.experimental)?void 0:h.cacheLife,isRevalidate:j,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n)=>T.onRequestError(e,t,n,C)},sharedContext:{buildId:g}},U=new s.NodeNextRequest(e),F=new s.NodeNextResponse(t),k=u.NextRequestAdapter.fromNodeNextRequest(U,(0,u.signalFromNodeResponse)(t));try{let a=async r=>T.handle(k,D).finally(()=>{if(!r)return;r.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=L.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=n.get("next.route");if(i){let e=`${H} ${i}`;r.setAttributes({"next.route":i,"http.route":i,"next.span_name":e}),r.updateName(e)}else r.updateName(`${H} ${e.url}`)}),s=async o=>{var s,u;let l=async({previousCacheEntry:r})=>{try{if(!(0,i.getRequestMeta)(e,"minimalMode")&&y&&_&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await a(o);e.fetchMetrics=D.renderOpts.fetchMetrics;let u=D.renderOpts.pendingWaitUntil;u&&n.waitUntil&&(n.waitUntil(u),u=void 0);let l=D.renderOpts.collectedTags;if(!q)return await (0,d.sendResponse)(U,F,s,D.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[E.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==D.renderOpts.collectedRevalidate&&!(D.renderOpts.collectedRevalidate>=E.INFINITE_CACHE)&&D.renderOpts.collectedRevalidate,n=void 0===D.renderOpts.collectedExpire||D.renderOpts.collectedExpire>=E.INFINITE_CACHE?void 0:D.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:j,isOnDemandRevalidate:y})},C),t}},N=await T.handleResponse({req:e,nextConfig:f,cacheKey:S,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:_,responseGenerator:l,waitUntil:n.waitUntil});if(!q)return null;if((null==N||null==(s=N.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==N||null==(u=N.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,i.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",y?"REVALIDATED":N.isMiss?"MISS":N.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let h=(0,p.fromNodeOutgoingHttpHeaders)(N.value.headers);return(0,i.getRequestMeta)(e,"minimalMode")&&q||h.delete(E.NEXT_CACHE_TAGS_HEADER),!N.cacheControl||t.getHeader("Cache-Control")||h.get("Cache-Control")||h.set("Cache-Control",(0,m.getCacheControlHeader)(N.cacheControl)),await (0,d.sendResponse)(U,F,new Response(N.value.body,{headers:h,status:N.value.status||200})),null};P?await s(P):await L.withPropagatedContext(e.headers,()=>L.trace(l.BaseServerSpan.handleRequest,{spanName:`${H} ${e.url}`,kind:o.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},s))}catch(t){if(t instanceof N.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:j,isOnDemandRevalidate:y})}),q)throw t;return await (0,d.sendResponse)(U,F,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b2c99c18._.js.map