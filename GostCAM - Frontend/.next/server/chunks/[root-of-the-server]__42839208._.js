module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},24361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},85920,(e,t,r)=>{},42282,e=>{"use strict";e.s(["handler",()=>y,"patchFetch",()=>N,"routeModule",()=>O,"serverHooks",()=>f,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>w],42282);var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),o=e.i(61916),n=e.i(69741),i=e.i(16795),u=e.i(87718),l=e.i(95169),d=e.i(47587),p=e.i(66012),c=e.i(70101),E=e.i(26937),R=e.i(10372),x=e.i(93695);e.i(52474);var h=e.i(220);e.s(["GET",()=>m],71564);var g=e.i(89171),v=e.i(84168);async function m(e){try{let{searchParams:t}=new URL(e.url),r=t.get("tipo");if(!r){let e=await (0,v.getCatalogos)();return g.NextResponse.json({success:!0,data:e,message:"Catálogos obtenidos exitosamente"},{status:200})}let a=[];switch(r.toLowerCase()){case"tiposequipo":a=await (0,v.executeQuery)(`
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
        `);break;case"sucursales":a=await (0,v.executeQuery)(`
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
        `);break;case"usuarios":a=await (0,v.executeQuery)(`
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
        `);break;case"estatus":a=await (0,v.executeQuery)(`
          SELECT 
            ROW_NUMBER() OVER (ORDER BY EstatusEquipo) as idEstatus,
            EstatusEquipo as nombre 
          FROM (
            SELECT DISTINCT EstatusEquipo 
            FROM GostCAM.VistaEquiposCompletos 
            WHERE EstatusEquipo IS NOT NULL
          ) estatus
          ORDER BY EstatusEquipo
        `);break;default:return g.NextResponse.json({success:!1,error:`Tipo de cat\xe1logo no v\xe1lido: ${r}`},{status:400})}return g.NextResponse.json({success:!0,data:a,message:`Cat\xe1logo ${r} obtenido exitosamente`},{status:200})}catch(e){return console.error("Error obteniendo catálogos:",e),g.NextResponse.json({success:!1,error:"Error interno del servidor"},{status:500})}}var C=e.i(71564);let O=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/catalogos/route",pathname:"/api/catalogos",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/catalogos/route.ts",nextConfigOutput:"",userland:C}),{workAsyncStorage:T,workUnitAsyncStorage:w,serverHooks:f}=O;function N(){return(0,a.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:w})}async function y(e,t,a){var g;let v="/api/catalogos/route";v=v.replace(/\/index$/,"")||"/";let m=await O.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!m)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:C,params:T,nextConfig:w,isDraftMode:f,prerenderManifest:N,routerServerContext:y,isOnDemandRevalidate:A,revalidateOnlyGenerated:q,resolvedPathname:b}=m,S=(0,n.normalizeAppPath)(v),U=!!(N.dynamicRoutes[S]||N.routes[b]);if(U&&!f){let e=!!N.routes[b],t=N.dynamicRoutes[S];if(t&&!1===t.fallback&&!e)throw new x.NoFallbackError}let M=null;!U||O.isDev||f||(M="/index"===(M=b)?"/":M);let k=!0===O.isDev||!U,D=U&&!k,_=e.method||"GET",j=(0,o.getTracer)(),I=j.getActiveScopeSpan(),P={params:T,prerenderManifest:N,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:k,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(g=w.experimental)?void 0:g.cacheLife,isRevalidate:D,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>O.onRequestError(e,t,a,y)},sharedContext:{buildId:C}},H=new i.NodeNextRequest(e),L=new i.NodeNextResponse(t),B=u.NextRequestAdapter.fromNodeNextRequest(H,(0,u.signalFromNodeResponse)(t));try{let n=async r=>O.handle(B,P).finally(()=>{if(!r)return;r.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=a.get("next.route");if(s){let e=`${_} ${s}`;r.setAttributes({"next.route":s,"http.route":s,"next.span_name":e}),r.updateName(e)}else r.updateName(`${_} ${e.url}`)}),i=async o=>{var i,u;let l=async({previousCacheEntry:r})=>{try{if(!(0,s.getRequestMeta)(e,"minimalMode")&&A&&q&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await n(o);e.fetchMetrics=P.renderOpts.fetchMetrics;let u=P.renderOpts.pendingWaitUntil;u&&a.waitUntil&&(a.waitUntil(u),u=void 0);let l=P.renderOpts.collectedTags;if(!U)return await (0,p.sendResponse)(H,L,i,P.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==P.renderOpts.collectedRevalidate&&!(P.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&P.renderOpts.collectedRevalidate,a=void 0===P.renderOpts.collectedExpire||P.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:P.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isRevalidate:D,isOnDemandRevalidate:A})},y),t}},x=await O.handleResponse({req:e,nextConfig:w,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:N,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:q,responseGenerator:l,waitUntil:a.waitUntil});if(!U)return null;if((null==x||null==(i=x.value)?void 0:i.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==x||null==(u=x.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,s.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",A?"REVALIDATED":x.isMiss?"MISS":x.isStale?"STALE":"HIT"),f&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let g=(0,c.fromNodeOutgoingHttpHeaders)(x.value.headers);return(0,s.getRequestMeta)(e,"minimalMode")&&U||g.delete(R.NEXT_CACHE_TAGS_HEADER),!x.cacheControl||t.getHeader("Cache-Control")||g.get("Cache-Control")||g.set("Cache-Control",(0,E.getCacheControlHeader)(x.cacheControl)),await (0,p.sendResponse)(H,L,new Response(x.value.body,{headers:g,status:x.value.status||200})),null};I?await i(I):await j.withPropagatedContext(e.headers,()=>j.trace(l.BaseServerSpan.handleRequest,{spanName:`${_} ${e.url}`,kind:o.SpanKind.SERVER,attributes:{"http.method":_,"http.target":e.url}},i))}catch(t){if(t instanceof x.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isRevalidate:D,isOnDemandRevalidate:A})}),U)throw t;return await (0,p.sendResponse)(H,L,new Response(null,{status:500})),null}}}];

//# sourceMappingURL=%5Broot-of-the-server%5D__42839208._.js.map