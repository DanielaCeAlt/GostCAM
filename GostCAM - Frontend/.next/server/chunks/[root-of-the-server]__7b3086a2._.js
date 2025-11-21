module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},24361,(e,t,a)=>{t.exports=e.x("util",()=>require("util"))},20894,(e,t,a)=>{},52065,e=>{"use strict";e.s(["handler",()=>h,"patchFetch",()=>S,"routeModule",()=>I,"serverHooks",()=>U,"workAsyncStorage",()=>O,"workUnitAsyncStorage",()=>C],52065);var t=e.i(47909),a=e.i(74017),r=e.i(96250),i=e.i(59756),o=e.i(61916),n=e.i(69741),s=e.i(16795),d=e.i(87718),u=e.i(95169),c=e.i(47587),E=e.i(66012),p=e.i(70101),l=e.i(26937),T=e.i(10372),A=e.i(93695);e.i(52474);var R=e.i(220);e.s(["GET",()=>M,"POST",()=>x],45978);var m=e.i(89171),N=e.i(84168);async function M(){try{let e=[],t=await (0,N.executeQuery)(`
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
        `),e.push("✅ Columna 'id' añadida a tabla 'tipoequipo'"));let r=(await (0,N.executeQuery)(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'gostcam' 
      AND TABLE_NAME IN ('tipomovimiento', 'estatusequipo', 'movimientoinventario')
      ORDER BY TABLE_NAME
    `)).map(e=>e.TABLE_NAME);for(let t of["tipomovimiento","estatusequipo","movimientoinventario"])r.includes(t)?e.push(`ℹ️ Tabla '${t}' existe`):e.push(`⚠️ Tabla '${t}' no encontrada - necesita ser creada`);return r.includes("tipomovimiento")||(await (0,N.executeQuery)(`
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
      `),e.push("✅ Tabla 'tipomovimiento' creada con datos iniciales")),m.NextResponse.json({success:!0,message:"Estructura de base de datos verificada y reparada",fixes:e})}catch(e){return console.error("Error reparando base de datos:",e),m.NextResponse.json({success:!1,error:"Error al reparar la base de datos",details:e instanceof Error?e.message:"Error desconocido"},{status:500})}}async function x(){try{let e=[];return await (0,N.executeQuery)("DROP TABLE IF EXISTS estatusmovimiento"),await (0,N.executeQuery)(`
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
    `),e.push("🔄 Tabla 'tipomovimiento' verificada y actualizada"),m.NextResponse.json({success:!0,message:"Base de datos reparada completamente",fixes:e})}catch(e){return console.error("Error en reparación forzada:",e),m.NextResponse.json({success:!1,error:"Error en la reparación forzada",details:e instanceof Error?e.message:"Error desconocido"},{status:500})}}var v=e.i(45978);let I=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/fix-database/route",pathname:"/api/fix-database",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/fix-database/route.ts",nextConfigOutput:"",userland:v}),{workAsyncStorage:O,workUnitAsyncStorage:C,serverHooks:U}=I;function S(){return(0,r.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:C})}async function h(e,t,r){var m;let N="/api/fix-database/route";N=N.replace(/\/index$/,"")||"/";let M=await I.prepare(e,t,{srcPage:N,multiZoneDraftMode:!1});if(!M)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:x,params:v,nextConfig:O,isDraftMode:C,prerenderManifest:U,routerServerContext:S,isOnDemandRevalidate:h,revalidateOnlyGenerated:L,resolvedPathname:P}=M,_=(0,n.normalizeAppPath)(N),f=!!(U.dynamicRoutes[_]||U.routes[P]);if(f&&!C){let e=!!U.routes[P],t=U.dynamicRoutes[_];if(t&&!1===t.fallback&&!e)throw new A.NoFallbackError}let y=null;!f||I.isDev||C||(y="/index"===(y=P)?"/":y);let g=!0===I.isDev||!f,b=f&&!g,w=e.method||"GET",D=(0,o.getTracer)(),q=D.getActiveScopeSpan(),F={params:v,prerenderManifest:U,renderOpts:{experimental:{cacheComponents:!!O.experimental.cacheComponents,authInterrupts:!!O.experimental.authInterrupts},supportsDynamicResponse:g,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(m=O.experimental)?void 0:m.cacheLife,isRevalidate:b,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>I.onRequestError(e,t,r,S)},sharedContext:{buildId:x}},B=new s.NodeNextRequest(e),H=new s.NodeNextResponse(t),j=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let n=async a=>I.handle(j,F).finally(()=>{if(!a)return;a.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=D.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let i=r.get("next.route");if(i){let e=`${w} ${i}`;a.setAttributes({"next.route":i,"http.route":i,"next.span_name":e}),a.updateName(e)}else a.updateName(`${w} ${e.url}`)}),s=async o=>{var s,d;let u=async({previousCacheEntry:a})=>{try{if(!(0,i.getRequestMeta)(e,"minimalMode")&&h&&L&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await n(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let d=F.renderOpts.pendingWaitUntil;d&&r.waitUntil&&(r.waitUntil(d),d=void 0);let u=F.renderOpts.collectedTags;if(!f)return await (0,E.sendResponse)(B,H,s,F.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(s.headers);u&&(t[T.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=T.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,r=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=T.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==a?void 0:a.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:b,isOnDemandRevalidate:h})},S),t}},A=await I.handleResponse({req:e,nextConfig:O,cacheKey:y,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:U,isRoutePPREnabled:!1,isOnDemandRevalidate:h,revalidateOnlyGenerated:L,responseGenerator:u,waitUntil:r.waitUntil});if(!f)return null;if((null==A||null==(s=A.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==A||null==(d=A.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,i.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",h?"REVALIDATED":A.isMiss?"MISS":A.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(A.value.headers);return(0,i.getRequestMeta)(e,"minimalMode")&&f||m.delete(T.NEXT_CACHE_TAGS_HEADER),!A.cacheControl||t.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,l.getCacheControlHeader)(A.cacheControl)),await (0,E.sendResponse)(B,H,new Response(A.value.body,{headers:m,status:A.value.status||200})),null};q?await s(q):await D.withPropagatedContext(e.headers,()=>D.trace(u.BaseServerSpan.handleRequest,{spanName:`${w} ${e.url}`,kind:o.SpanKind.SERVER,attributes:{"http.method":w,"http.target":e.url}},s))}catch(t){if(t instanceof A.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:b,isOnDemandRevalidate:h})}),f)throw t;return await (0,E.sendResponse)(B,H,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__7b3086a2._.js.map