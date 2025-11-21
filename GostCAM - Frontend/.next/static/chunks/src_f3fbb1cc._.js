(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/pythonApiClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// SERVICIO: CLIENTE API PYTHON
// =============================================
// Configuración para conectar con tu API Python existente
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "pythonApiClient",
    ()=>pythonApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8000") || 'http://localhost:8000';
class PythonApiClient {
    // Configurar token de autenticación
    setToken(token) {
        this.token = token;
    }
    // Método público para hacer requests
    async request(endpoint) {
        let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const url = "".concat(this.baseUrl).concat(endpoint);
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...this.token && {
                    'Authorization': "Bearer ".concat(this.token)
                },
                ...options.headers
            }
        };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error("API Error: ".concat(response.status, " ").concat(response.statusText));
            }
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }
    // Métodos de autenticación
    async login(correo, contraseña) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                correo,
                contraseña
            })
        });
    }
    // Métodos para dashboard
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }
    // Métodos para equipos
    async getEquipos(filters) {
        const params = new URLSearchParams(filters || {});
        return this.request("/equipos?".concat(params.toString()));
    }
    async createEquipo(equipoData) {
        return this.request('/equipos', {
            method: 'POST',
            body: JSON.stringify(equipoData)
        });
    }
    async updateEquipo(noSerie, equipoData) {
        return this.request("/equipos/".concat(noSerie), {
            method: 'PUT',
            body: JSON.stringify(equipoData)
        });
    }
    async deleteEquipo(noSerie) {
        return this.request("/equipos/".concat(noSerie), {
            method: 'DELETE'
        });
    }
    // Métodos para movimientos
    async getMovimientos(filters) {
        const params = new URLSearchParams(filters || {});
        return this.request("/movimientos?".concat(params.toString()));
    }
    async createMovimiento(movimientoData) {
        return this.request('/movimientos', {
            method: 'POST',
            body: JSON.stringify(movimientoData)
        });
    }
    async updateMovimiento(id, movimientoData) {
        return this.request("/movimientos/".concat(id), {
            method: 'PUT',
            body: JSON.stringify(movimientoData)
        });
    }
    // Métodos para catálogos
    async getCatalogos() {
        return this.request('/catalogos');
    }
    // Métodos para reportes
    async getReportes(tipo, filtros) {
        const params = new URLSearchParams(filtros || {});
        return this.request("/reportes/".concat(tipo, "?").concat(params.toString()));
    }
    // Método para exportar datos
    async exportData(tipo, formato, filtros) {
        const params = new URLSearchParams({
            formato,
            ...filtros
        });
        return this.request("/export/".concat(tipo, "?").concat(params.toString()), {
            headers: {
                'Accept': formato === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf'
            }
        });
    }
    constructor(baseUrl = API_BASE_URL){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "baseUrl", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "token", null);
        this.baseUrl = baseUrl;
    }
}
const pythonApiClient = new PythonApiClient();
const __TURBOPACK__default__export__ = pythonApiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/logger.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// SISTEMA DE LOGGING PROFESIONAL
// =============================================
__turbopack_context__.s([
    "logger",
    ()=>logger,
    "useLogger",
    ()=>useLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class Logger {
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const prefix = this.getLogPrefix(level);
        const contextStr = context ? " ".concat(JSON.stringify(context)) : '';
        return "".concat(prefix, " [").concat(timestamp, "] ").concat(message).concat(contextStr);
    }
    getLogPrefix(level) {
        const prefixes = {
            debug: '🔍',
            info: '📝',
            warn: '⚠️',
            error: '❌'
        };
        return prefixes[level];
    }
    shouldLog(level) {
        if (!this.isDevelopment && level === 'debug') return false;
        return true;
    }
    sendToExternalService(level, message, context) {
        if (this.isDevelopment || !this.isClient) return;
        // En producción, enviar a servicio de logging (ej: Sentry, LogRocket)
        // TODO: Implementar integración con servicio de logging
        try {
        // Example: Sentry.captureMessage(message, level as SeverityLevel);
        } catch (error) {
        // Evitar errores en el logging que rompan la app
        }
    }
    debug(message, context) {
        if (!this.shouldLog('debug')) return;
        const formatted = this.formatMessage('debug', message, context);
        if (this.isDevelopment) {
            console.debug(formatted);
        }
    }
    info(message, context) {
        if (!this.shouldLog('info')) return;
        const formatted = this.formatMessage('info', message, context);
        if (this.isDevelopment) {
            console.info(formatted);
        }
        this.sendToExternalService('info', message, context);
    }
    warn(message, context) {
        if (!this.shouldLog('warn')) return;
        const formatted = this.formatMessage('warn', message, context);
        console.warn(formatted);
        this.sendToExternalService('warn', message, context);
    }
    error(message, error, context) {
        const errorContext = {
            ...context,
            error: error === null || error === void 0 ? void 0 : error.message,
            stack: error === null || error === void 0 ? void 0 : error.stack
        };
        const formatted = this.formatMessage('error', message, errorContext);
        console.error(formatted);
        this.sendToExternalService('error', message, errorContext);
    }
    // Métodos específicos para el dominio de la aplicación
    apiRequest(method, url, status) {
        this.debug("API ".concat(method, " ").concat(url), {
            method,
            url,
            status
        });
    }
    apiError(method, url, error, status) {
        this.error("API ".concat(method, " ").concat(url, " failed"), error, {
            method,
            url,
            status
        });
    }
    userAction(action, userId, details) {
        this.info("User action: ".concat(action), {
            action,
            userId,
            ...details
        });
    }
    performance(operation, duration) {
        if (duration > 1000) {
            this.warn("Slow operation: ".concat(operation, " took ").concat(duration, "ms"), {
                operation,
                duration
            });
        } else {
            this.debug("Performance: ".concat(operation, " took ").concat(duration, "ms"), {
                operation,
                duration
            });
        }
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isDevelopment", ("TURBOPACK compile-time value", "development") === 'development');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isClient", "object" !== 'undefined');
    }
}
const logger = new Logger();
function useLogger() {
    return logger;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/apiService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// SERVICIO: UNIFIED API SERVICE OPTIMIZADO
// =============================================
__turbopack_context__.s([
    "apiService",
    ()=>apiService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/pythonApiClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/logger.ts [app-client] (ecmascript)");
;
;
;
class ApiService {
    // Configurar modo de API
    setMode(mode) {
        this.currentMode = mode;
        this.clearCache(); // Limpiar cache al cambiar modo
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].info("API Service mode changed to: ".concat(mode), {
            mode
        });
    }
    // Configurar token
    setToken(token) {
        this.token = token;
        if (token && this.currentMode === 'python') {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].setToken(token);
        }
    }
    // Cache management
    getCacheKey(url, params) {
        return "".concat(url, "_").concat(JSON.stringify(params || {}));
    }
    getFromCache(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    setCache(key, data) {
        let ttl = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 300000;
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }
    clearCache() {
        this.cache.clear();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug('API cache cleared');
    }
    // Request deduplication para evitar requests duplicados
    async requestWithDeduplication(key, requestFn) {
        if (this.requestQueue.has(key)) {
            return this.requestQueue.get(key);
        }
        const promise = requestFn().finally(()=>{
            this.requestQueue.delete(key);
        });
        this.requestQueue.set(key, promise);
        return promise;
    }
    // Retry logic para requests fallidos
    async withRetry(operation) {
        let maxRetries = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3, delay = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1000;
        let lastError = null;
        for(let attempt = 1; attempt <= maxRetries; attempt++){
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Request failed (attempt ".concat(attempt, "/").concat(maxRetries, ")"), lastError);
                if (attempt === maxRetries) break;
                await new Promise((resolve)=>setTimeout(resolve, delay * attempt));
            }
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Request failed after all retries', lastError);
        throw lastError;
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = "Bearer ".concat(this.token);
        }
        return headers;
    }
    // ========================
    // MÉTODOS GENÉRICOS OPTIMIZADOS
    // ========================
    async get(url) {
        let useCache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, cacheTtl = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 300000;
        const cacheKey = this.getCacheKey(url);
        // Verificar cache si está habilitado
        if (useCache) {
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Cache hit for ".concat(url));
                return cached;
            }
        }
        return this.requestWithDeduplication(cacheKey, async ()=>{
            const startTime = Date.now();
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this.getHeaders()
                });
                if (!response.ok) {
                    throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                }
                const result = await response.json();
                // Cache si es exitoso
                if (useCache && result.success) {
                    this.setCache(cacheKey, result, cacheTtl);
                }
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiRequest('GET', url, response.status);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("GET ".concat(url), duration);
                return result;
            } catch (error) {
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiError('GET', url, error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("GET ".concat(url, " (failed)"), duration);
                throw error;
            }
        });
    }
    // Los demás métodos se implementarán de forma similar...
    // [Continuaré en el siguiente archivo por limitaciones de espacio]
    getCurrentMode() {
        return this.currentMode;
    }
    isUsingNextjsApi() {
        return this.currentMode === 'nextjs';
    }
    getCacheKey(url, params) {
        return "".concat(url, "_").concat(JSON.stringify(params || {}));
    }
    getFromCache(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;
        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    setCache(key, data) {
        let ttl = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 300000;
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }
    clearCache() {
        this.cache.clear();
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug('API cache cleared');
    }
    // Request deduplication para evitar requests duplicados
    async requestWithDeduplication(key, requestFn) {
        if (this.requestQueue.has(key)) {
            return this.requestQueue.get(key);
        }
        const promise = requestFn().finally(()=>{
            this.requestQueue.delete(key);
        });
        this.requestQueue.set(key, promise);
        return promise;
    }
    // Retry logic para requests fallidos
    async withRetry(operation) {
        let maxRetries = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3, delay = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1000;
        let lastError = null;
        for(let attempt = 1; attempt <= maxRetries; attempt++){
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].warn("Request failed (attempt ".concat(attempt, "/").concat(maxRetries, ")"), lastError);
                if (attempt === maxRetries) break;
                await new Promise((resolve)=>setTimeout(resolve, delay * attempt));
            }
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].error('Request failed after all retries', lastError);
        throw lastError;
    }
    // ========================
    // MÉTODOS GENÉRICOS OPTIMIZADOS
    // ========================
    async get(url) {
        let useCache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, cacheTtl = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 300000;
        const cacheKey = this.getCacheKey(url);
        // Verificar cache si está habilitado
        if (useCache) {
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].debug("Cache hit for ".concat(url));
                return cached;
            }
        }
        return this.requestWithDeduplication(cacheKey, async ()=>{
            const startTime = Date.now();
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this.getHeaders()
                });
                if (!response.ok) {
                    throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                }
                const result = await response.json();
                // Cache si es exitoso
                if (useCache && result.success) {
                    this.setCache(cacheKey, result, cacheTtl);
                }
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiRequest('GET', url, response.status);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("GET ".concat(url), duration);
                return result;
            } catch (error) {
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiError('GET', url, error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("GET ".concat(url, " (failed)"), duration);
                throw error;
            }
        });
    }
    async post(url, data) {
        return this.withRetry(async ()=>{
            const startTime = Date.now();
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                }
                const result = await response.json();
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiRequest('POST', url, response.status);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("POST ".concat(url), duration);
                return result;
            } catch (error) {
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiError('POST', url, error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("POST ".concat(url, " (failed)"), duration);
                throw error;
            }
        });
    }
    async put(url, data) {
        return this.withRetry(async ()=>{
            const startTime = Date.now();
            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: this.getHeaders(),
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                }
                const result = await response.json();
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiRequest('PUT', url, response.status);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("PUT ".concat(url), duration);
                return result;
            } catch (error) {
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiError('PUT', url, error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("PUT ".concat(url, " (failed)"), duration);
                throw error;
            }
        });
    }
    async delete(url) {
        return this.withRetry(async ()=>{
            const startTime = Date.now();
            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers: this.getHeaders()
                });
                if (!response.ok) {
                    throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                }
                const result = await response.json();
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiRequest('DELETE', url, response.status);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("DELETE ".concat(url), duration);
                return result;
            } catch (error) {
                const duration = Date.now() - startTime;
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].apiError('DELETE', url, error);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logger"].performance("DELETE ".concat(url, " (failed)"), duration);
                throw error;
            }
        });
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = "Bearer ".concat(this.token);
        }
        return headers;
    }
    // ========================
    // AUTENTICACIÓN
    // ========================
    async login(correo, contraseña) {
        try {
            if (this.currentMode === 'python') {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].login(correo, contraseña);
                return response;
            } else {
                // Next.js API
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo,
                        contraseña
                    })
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Login error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    // ========================
    // DASHBOARD
    // ========================
    async getDashboardStats() {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].getDashboardStats();
            } else {
                // Next.js API
                const response = await fetch('/api/dashboard', {
                    headers: {
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    }
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Dashboard stats error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    // ========================
    // EQUIPOS
    // ========================
    async getEquipos(filters) {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].getEquipos(filters);
            } else {
                // Next.js API
                const queryParams = new URLSearchParams();
                if (filters) {
                    Object.keys(filters).forEach((key)=>{
                        const value = filters[key];
                        if (value) {
                            queryParams.append(key, value);
                        }
                    });
                }
                const response = await fetch("/api/equipos?".concat(queryParams.toString()), {
                    headers: {
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    }
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Equipos error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    async createEquipo(equipoData) {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].createEquipo(equipoData);
            } else {
                // Next.js API
                const response = await fetch('/api/equipos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    },
                    body: JSON.stringify(equipoData)
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Create equipo error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    async updateEquipo(noSerie, equipoData) {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].updateEquipo(noSerie, equipoData);
            } else {
                // Next.js API
                const response = await fetch("/api/equipos/".concat(noSerie), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    },
                    body: JSON.stringify(equipoData)
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Update equipo error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    async deleteEquipo(noSerie) {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].deleteEquipo(noSerie);
            } else {
                // Next.js API
                const response = await fetch("/api/equipos/".concat(noSerie), {
                    method: 'DELETE',
                    headers: {
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    }
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Delete equipo error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    // ========================
    // MOVIMIENTOS
    // ========================
    async getMovimientos(filters) {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].getMovimientos(filters);
            } else {
                // Next.js API
                const queryParams = new URLSearchParams();
                if (filters) {
                    Object.keys(filters).forEach((key)=>{
                        const value = filters[key];
                        if (value) {
                            queryParams.append(key, value);
                        }
                    });
                }
                const response = await fetch("/api/movimientos?".concat(queryParams.toString()), {
                    headers: {
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    }
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Movimientos error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    async createMovimiento(movimientoData) {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].createMovimiento(movimientoData);
            } else {
                // Next.js API
                const response = await fetch('/api/movimientos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    },
                    body: JSON.stringify(movimientoData)
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Create movimiento error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    // ========================
    // CATÁLOGOS
    // ========================
    async getCatalogos() {
        try {
            if (this.currentMode === 'python') {
                return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$pythonApiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pythonApiClient"].getCatalogos();
            } else {
                // Next.js API
                const response = await fetch('/api/catalogos', {
                    headers: {
                        ...this.token && {
                            'Authorization': "Bearer ".concat(this.token)
                        }
                    }
                });
                return await response.json();
            }
        } catch (error) {
            console.error("Catalogos error (".concat(this.currentMode, "):"), error);
            throw error;
        }
    }
    // ========================
    // UTILIDADES
    // ========================
    getCurrentMode() {
        return this.currentMode;
    }
    isUsingPythonApi() {
        return this.currentMode === 'python';
    }
    isUsingNextjsApi() {
        return this.currentMode === 'nextjs';
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "currentMode", 'nextjs');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "token", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cache", new Map());
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "requestQueue", new Map());
    }
}
const apiService = new ApiService();
const __TURBOPACK__default__export__ = apiService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/messages.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ===== SISTEMA DE MENSAJES GOSTCAM =====
__turbopack_context__.s([
    "MESSAGES",
    ()=>MESSAGES,
    "formatMessage",
    ()=>formatMessage,
    "getLoadingMessage",
    ()=>getLoadingMessage,
    "getStatusMessage",
    ()=>getStatusMessage
]);
const MESSAGES = {
    // ===== TEXTOS DE CARGA =====
    loading: {
        dashboard: 'Preparando tu panel de control...',
        equipos: 'Cargando equipos de seguridad...',
        sucursales: 'Actualizando información de sucursales...',
        statistics: 'Calculando estadísticas en tiempo real...',
        login: 'Verificando credenciales...',
        search: 'Buscando en tu red de seguridad...',
        upload: 'Subiendo información...',
        delete: 'Procesando solicitud...',
        export: 'Generando reporte...'
    },
    // ===== MENSAJES DE ÉXITO =====
    success: {
        login: '¡Bienvenido a GostCAM! 📹',
        equipoCreated: 'Equipo registrado correctamente en tu red',
        equipoUpdated: 'Información del equipo actualizada',
        equipoDeleted: 'Equipo removido de tu sistema',
        traslado: 'Equipo trasladado exitosamente',
        mantenimiento: 'Mantenimiento programado correctamente',
        export: 'Reporte generado y descargado',
        settings: 'Configuración guardada'
    },
    // ===== MENSAJES DE ERROR (EMPÁTICOS) =====
    error: {
        connection: 'Hmm, parece que hay un problema de conexión. Verificando...',
        login: 'Credenciales incorrectas. ¿Necesitas ayuda?',
        notFound: 'No encontramos ese equipo. ¿Quizás lo buscas con otro nombre?',
        server: 'Nuestros servidores están ocupados. Intenta en un momento',
        permission: 'No tienes permisos para esta acción. Contacta a tu administrador',
        validation: 'Algunos campos necesitan tu atención',
        upload: 'Error al subir archivo. Verifica el formato',
        timeout: 'La operación está tomando más tiempo del esperado'
    },
    // ===== CONFIRMACIONES =====
    confirm: {
        delete: '¿Estás seguro de eliminar este equipo de tu red?',
        deleteMultiple: '¿Eliminar {count} equipos seleccionados?',
        logout: '¿Cerrar sesión en GostCAM?',
        reset: '¿Restaurar configuración por defecto?',
        transfer: '¿Trasladar este equipo a otra ubicación?'
    },
    // ===== ESTADOS DE EQUIPOS =====
    equipmentStatus: {
        connected: 'Conectado y funcionando',
        disconnected: 'Sin conexión - Verificar red',
        error: 'Requiere atención técnica',
        maintenance: 'En mantenimiento programado',
        installing: 'Instalándose...'
    },
    // ===== PLACEHOLDERS ÚTILES =====
    placeholders: {
        search: 'Buscar por nombre, número de serie o ubicación...',
        email: 'usuario@empresa.com',
        password: 'Tu contraseña segura',
        equipName: 'Ej: Cámara Principal Entrada',
        location: 'Ej: Recepción - Planta Baja'
    },
    // ===== TEXTOS DE BOTONES =====
    buttons: {
        login: 'Iniciar Sesión',
        logout: 'Cerrar Sesión',
        save: 'Guardar Cambios',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        view: 'Ver Detalles',
        add: 'Agregar Equipo',
        search: 'Buscar',
        filter: 'Filtrar',
        export: 'Exportar Datos',
        transfer: 'Trasladar',
        maintenance: 'Mantenimiento',
        retry: 'Reintentar',
        continue: 'Continuar',
        back: 'Regresar'
    },
    // ===== TÍTULOS Y SECCIONES =====
    titles: {
        dashboard: 'Panel de Control',
        equipments: 'Mis Equipos',
        branches: 'Red de Sucursales',
        settings: 'Configuración',
        profile: 'Mi Perfil',
        reports: 'Reportes y Análisis'
    },
    // ===== ESTADOS VACÍOS =====
    empty: {
        equipos: '¡Tu primera red de seguridad te está esperando!',
        search: 'No encontramos equipos con esos criterios',
        sucursales: 'Agrega tu primera sucursal para comenzar',
        notifications: 'Todo tranquilo por aquí 😊'
    },
    // ===== TOOLTIPS ÚTILES =====
    tooltips: {
        refresh: 'Actualizar información',
        filter: 'Filtrar equipos',
        sort: 'Ordenar lista',
        view: 'Cambiar vista',
        help: 'Ayuda y soporte',
        settings: 'Configuración',
        notifications: 'Notificaciones'
    }
};
const formatMessage = (template, params)=>{
    return template.replace(/{(\w+)}/g, (match, key)=>{
        var _params_key;
        return ((_params_key = params[key]) === null || _params_key === void 0 ? void 0 : _params_key.toString()) || match;
    });
};
const getStatusMessage = (status)=>{
    return MESSAGES.equipmentStatus[status] || status;
};
const getLoadingMessage = (context)=>{
    return MESSAGES.loading[context] || 'Cargando...';
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AppContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =============================================
// CONTEXTO GLOBAL DE LA APLICACIÓN GOSTCAM
// =============================================
__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// ========================
// ESTADO INICIAL
// ========================
const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null,
    currentSection: 'dashboard',
    dashboardStats: null,
    equipos: [],
    movimientos: [],
    catalogos: null,
    apiMode: 'nextjs'
};
// ========================
// REDUCER
// ========================
function appReducer(state, action) {
    switch(action.type){
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
                isLoading: false
            };
        case 'LOGOUT':
            return {
                ...initialState
            };
        case 'SET_SECTION':
            return {
                ...state,
                currentSection: action.payload
            };
        case 'SET_DASHBOARD_STATS':
            return {
                ...state,
                dashboardStats: action.payload
            };
        case 'SET_EQUIPOS':
            return {
                ...state,
                equipos: action.payload
            };
        case 'SET_MOVIMIENTOS':
            return {
                ...state,
                movimientos: action.payload
            };
        case 'SET_CATALOGOS':
            return {
                ...state,
                catalogos: action.payload
            };
        case 'SET_API_MODE':
            return {
                ...state,
                apiMode: action.payload
            };
        default:
            return state;
    }
}
// ========================
// CONTEXTO
// ========================
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AppProvider(param) {
    let { children } = param;
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(appReducer, initialState);
    // Cargar token desde localStorage al inicializar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            const savedToken = localStorage.getItem('gostcam_token');
            const savedUser = localStorage.getItem('gostcam_user');
            if (savedToken && savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user,
                            token: savedToken
                        }
                    });
                } catch (error) {
                    console.error('Error parsing saved user data:', error);
                    localStorage.removeItem('gostcam_token');
                    localStorage.removeItem('gostcam_user');
                }
            }
        }
    }["AppProvider.useEffect"], []);
    // Sincronizar apiService cuando cambie el modo o token
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setMode(state.apiMode);
            if (state.token) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setToken(state.token);
            }
        }
    }["AppProvider.useEffect"], [
        state.apiMode,
        state.token
    ]);
    // ========================
    // FUNCIONES DE AUTENTICACIÓN
    // ========================
    const login = async (correo, contraseña)=>{
        dispatch({
            type: 'SET_LOADING',
            payload: true
        });
        dispatch({
            type: 'SET_ERROR',
            payload: null
        });
        try {
            // Configurar el modo de API antes de hacer la petición
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setMode(state.apiMode);
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].login(correo, contraseña);
            if (data.success && data.user && data.token) {
                // Configurar token en el apiService
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setToken(data.token);
                // Guardar en localStorage
                localStorage.setItem('gostcam_token', data.token);
                localStorage.setItem('gostcam_user', JSON.stringify(data.user));
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        user: data.user,
                        token: data.token
                    }
                });
                return true;
            } else {
                dispatch({
                    type: 'SET_ERROR',
                    payload: data.message || 'Error de autenticación'
                });
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Error de conexión'
            });
            return false;
        }
    };
    const logout = ()=>{
        localStorage.removeItem('gostcam_token');
        localStorage.removeItem('gostcam_user');
        dispatch({
            type: 'LOGOUT'
        });
    };
    // ========================
    // FUNCIONES DE DATOS
    // ========================
    const loadDashboardStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[loadDashboardStats]": async ()=>{
            if (!state.token) return;
            try {
                dispatch({
                    type: 'SET_LOADING',
                    payload: true
                });
                // Configurar API service
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setMode(state.apiMode);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setToken(state.token);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].getDashboardStats();
                if (data.success && data.data) {
                    dispatch({
                        type: 'SET_DASHBOARD_STATS',
                        payload: data.data
                    });
                } else {
                    dispatch({
                        type: 'SET_ERROR',
                        payload: data.error || 'Error cargando dashboard'
                    });
                }
            } catch (error) {
                console.error('Error loading dashboard:', error);
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Error de conexión'
                });
            } finally{
                dispatch({
                    type: 'SET_LOADING',
                    payload: false
                });
            }
        }
    }["AppProvider.useCallback[loadDashboardStats]"], [
        state.token,
        state.apiMode
    ]);
    const loadEquipos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppProvider.useCallback[loadEquipos]": async (filters)=>{
            if (!state.token) return;
            try {
                dispatch({
                    type: 'SET_LOADING',
                    payload: true
                });
                // Configurar API service
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setMode(state.apiMode);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setToken(state.token);
                const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].getEquipos(filters);
                if (data.success && data.data) {
                    dispatch({
                        type: 'SET_EQUIPOS',
                        payload: data.data
                    });
                } else {
                    dispatch({
                        type: 'SET_ERROR',
                        payload: data.error || 'Error cargando equipos'
                    });
                }
            } catch (error) {
                console.error('Error loading equipos:', error);
                dispatch({
                    type: 'SET_ERROR',
                    payload: 'Error de conexión'
                });
            } finally{
                dispatch({
                    type: 'SET_LOADING',
                    payload: false
                });
            }
        }
    }["AppProvider.useCallback[loadEquipos]"], [
        state.token,
        state.apiMode
    ]);
    const loadMovimientos = async (filters)=>{
        if (!state.token) return;
        try {
            dispatch({
                type: 'SET_LOADING',
                payload: true
            });
            // Configurar API service
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setMode(state.apiMode);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setToken(state.token);
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].getMovimientos(filters);
            if (data.success && data.data) {
                dispatch({
                    type: 'SET_MOVIMIENTOS',
                    payload: data.data
                });
            } else {
                dispatch({
                    type: 'SET_ERROR',
                    payload: data.error || 'Error cargando movimientos'
                });
            }
        } catch (error) {
            console.error('Error loading movimientos:', error);
            dispatch({
                type: 'SET_ERROR',
                payload: 'Error de conexión'
            });
        } finally{
            dispatch({
                type: 'SET_LOADING',
                payload: false
            });
        }
    };
    const loadCatalogos = async ()=>{
        if (!state.token) return;
        try {
            // Configurar API service
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setMode(state.apiMode);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setToken(state.token);
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].getCatalogos();
            if (data.success) {
                dispatch({
                    type: 'SET_CATALOGOS',
                    payload: data.data
                });
            } else {
                dispatch({
                    type: 'SET_ERROR',
                    payload: data.error || 'Error cargando catálogos'
                });
            }
        } catch (error) {
            console.error('Error loading catalogos:', error);
        }
    };
    // ========================
    // FUNCIONES AUXILIARES
    // ========================
    const setSection = (section)=>{
        dispatch({
            type: 'SET_SECTION',
            payload: section
        });
    };
    const setApiMode = (mode)=>{
        dispatch({
            type: 'SET_API_MODE',
            payload: mode
        });
    };
    // Función de test para alta de equipos
    const testAltaEquipo = async ()=>{
        if (!state.token) {
            console.error('No hay token de autenticación');
            return false;
        }
        try {
            console.log('🧪 Iniciando test de alta de equipo...');
            // Configurar API service
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setMode(state.apiMode);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].setToken(state.token);
            const equipoTest = {
                no_serie: "TEST-".concat(Date.now()),
                nombreEquipo: "Equipo de Prueba ".concat(new Date().toLocaleString()),
                modelo: "Modelo Test v1.0",
                idTipoEquipo: 1,
                numeroActivo: "ACT-".concat(Date.now()),
                idUsuarios: 1,
                idPosicion: 1,
                idEstatus: 1
            };
            console.log('📦 Datos del equipo:', equipoTest);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].createEquipo(equipoTest);
            if (response.success) {
                console.log('✅ Equipo creado exitosamente:', response.message);
                // Recargar lista de equipos
                await loadEquipos();
                return true;
            } else {
                console.error('❌ Error creando equipo:', response.error);
                return false;
            }
        } catch (error) {
            console.error('💥 Error en test de alta:', error);
            return false;
        }
    };
    const getStatusColor = (status)=>{
        const colors = {
            'Disponible': 'bg-green-100 text-green-800',
            'En uso': 'bg-blue-100 text-blue-800',
            'Mantenimiento': 'bg-yellow-100 text-yellow-800',
            'En reparación': 'bg-yellow-100 text-yellow-800',
            'Baja': 'bg-gray-100 text-gray-800',
            'Extraviado': 'bg-red-100 text-red-800',
            'Dañado': 'bg-red-100 text-red-800',
            'Obsoleto': 'bg-gray-100 text-gray-800',
            'ABIERTO': 'bg-blue-100 text-blue-800',
            'CERRADO': 'bg-green-100 text-green-800',
            'CANCELADO': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    const getUserRoleColor = (level)=>{
        const colors = {
            1: 'bg-purple-100 text-purple-800',
            2: 'bg-blue-100 text-blue-800',
            3: 'bg-green-100 text-green-800',
            4: 'bg-yellow-100 text-yellow-800',
            5: 'bg-gray-100 text-gray-800' // Consulta
        };
        return colors[level] || 'bg-gray-100 text-gray-800';
    };
    const value = {
        state,
        login,
        logout,
        setSection,
        setApiMode,
        loadDashboardStats,
        loadEquipos,
        loadMovimientos,
        loadCatalogos,
        testAltaEquipo,
        getStatusColor,
        getUserRoleColor
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AppContext.tsx",
        lineNumber: 414,
        columnNumber: 5
    }, this);
}
_s(AppProvider, "38N05N4EL65NcttlBluPF2AC0yE=");
_c = AppProvider;
function useApp() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
_s1(useApp, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useAccessibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAriaAnnouncements",
    ()=>useAriaAnnouncements,
    "useContrastValidation",
    ()=>useContrastValidation,
    "useKeyboardNavigation",
    ()=>useKeyboardNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
function useKeyboardNavigation() {
    _s();
    const focusableElementsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentFocusIndexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(-1);
    // Selectores para elementos focuseables
    const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[role="button"]:not([disabled])',
        '[role="link"]',
        '[role="menuitem"]',
        '[role="tab"]'
    ].join(', ');
    // Actualizar lista de elementos focuseables
    const updateFocusableElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useKeyboardNavigation.useCallback[updateFocusableElements]": ()=>{
            focusableElementsRef.current = document.querySelectorAll(focusableSelectors);
        }
    }["useKeyboardNavigation.useCallback[updateFocusableElements]"], [
        focusableSelectors
    ]);
    // Navegar al siguiente elemento
    const focusNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useKeyboardNavigation.useCallback[focusNext]": ()=>{
            var _elements_nextIndex;
            updateFocusableElements();
            if (!focusableElementsRef.current) return;
            const elements = Array.from(focusableElementsRef.current);
            const currentIndex = elements.findIndex({
                "useKeyboardNavigation.useCallback[focusNext].currentIndex": (el)=>el === document.activeElement
            }["useKeyboardNavigation.useCallback[focusNext].currentIndex"]);
            const nextIndex = (currentIndex + 1) % elements.length;
            (_elements_nextIndex = elements[nextIndex]) === null || _elements_nextIndex === void 0 ? void 0 : _elements_nextIndex.focus();
            currentFocusIndexRef.current = nextIndex;
        }
    }["useKeyboardNavigation.useCallback[focusNext]"], [
        updateFocusableElements
    ]);
    // Navegar al elemento anterior
    const focusPrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useKeyboardNavigation.useCallback[focusPrevious]": ()=>{
            var _elements_prevIndex;
            updateFocusableElements();
            if (!focusableElementsRef.current) return;
            const elements = Array.from(focusableElementsRef.current);
            const currentIndex = elements.findIndex({
                "useKeyboardNavigation.useCallback[focusPrevious].currentIndex": (el)=>el === document.activeElement
            }["useKeyboardNavigation.useCallback[focusPrevious].currentIndex"]);
            const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
            (_elements_prevIndex = elements[prevIndex]) === null || _elements_prevIndex === void 0 ? void 0 : _elements_prevIndex.focus();
            currentFocusIndexRef.current = prevIndex;
        }
    }["useKeyboardNavigation.useCallback[focusPrevious]"], [
        updateFocusableElements
    ]);
    // Forzar focus en un elemento específico
    const focusElement = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useKeyboardNavigation.useCallback[focusElement]": (selector)=>{
            const element = document.querySelector(selector);
            element === null || element === void 0 ? void 0 : element.focus();
        }
    }["useKeyboardNavigation.useCallback[focusElement]"], []);
    // Manejar teclas de navegación
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useKeyboardNavigation.useCallback[handleKeyDown]": (event)=>{
            switch(event.key){
                case 'Tab':
                    // Tab ya maneja focus naturalmente, solo actualizamos la lista
                    updateFocusableElements();
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    // Solo si estamos en un contexto de navegación específico
                    if (event.target && event.target.getAttribute('role') === 'menubar') {
                        event.preventDefault();
                        focusNext();
                    }
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    if (event.target && event.target.getAttribute('role') === 'menubar') {
                        event.preventDefault();
                        focusPrevious();
                    }
                    break;
                case 'Home':
                    if (event.ctrlKey) {
                        var _focusableElementsRef_current_, _focusableElementsRef_current;
                        event.preventDefault();
                        updateFocusableElements();
                        (_focusableElementsRef_current = focusableElementsRef.current) === null || _focusableElementsRef_current === void 0 ? void 0 : (_focusableElementsRef_current_ = _focusableElementsRef_current[0]) === null || _focusableElementsRef_current_ === void 0 ? void 0 : _focusableElementsRef_current_.focus();
                    }
                    break;
                case 'End':
                    if (event.ctrlKey) {
                        var _elements_;
                        event.preventDefault();
                        updateFocusableElements();
                        const elements = focusableElementsRef.current;
                        elements === null || elements === void 0 ? void 0 : (_elements_ = elements[elements.length - 1]) === null || _elements_ === void 0 ? void 0 : _elements_.focus();
                    }
                    break;
            }
        }
    }["useKeyboardNavigation.useCallback[handleKeyDown]"], [
        updateFocusableElements,
        focusNext,
        focusPrevious
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useKeyboardNavigation.useEffect": ()=>{
            document.addEventListener('keydown', handleKeyDown);
            updateFocusableElements();
            return ({
                "useKeyboardNavigation.useEffect": ()=>{
                    document.removeEventListener('keydown', handleKeyDown);
                }
            })["useKeyboardNavigation.useEffect"];
        }
    }["useKeyboardNavigation.useEffect"], [
        handleKeyDown,
        updateFocusableElements
    ]);
    return {
        focusNext,
        focusPrevious,
        focusElement,
        updateFocusableElements
    };
}
_s(useKeyboardNavigation, "l/JqkV4g503kPHat43Ux5k6mHME=");
function useAriaAnnouncements() {
    _s1();
    const announceElementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Crear elemento para anuncios si no existe
    const createAnnouncer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAriaAnnouncements.useCallback[createAnnouncer]": ()=>{
            if (!announceElementRef.current) {
                const announcer = document.createElement('div');
                announcer.setAttribute('aria-live', 'polite');
                announcer.setAttribute('aria-atomic', 'true');
                announcer.setAttribute('role', 'status');
                announcer.style.position = 'absolute';
                announcer.style.left = '-10000px';
                announcer.style.width = '1px';
                announcer.style.height = '1px';
                announcer.style.overflow = 'hidden';
                document.body.appendChild(announcer);
                announceElementRef.current = announcer;
            }
            return announceElementRef.current;
        }
    }["useAriaAnnouncements.useCallback[createAnnouncer]"], []);
    // Anunciar mensaje para lectores de pantalla
    const announce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAriaAnnouncements.useCallback[announce]": function(message) {
            let priority = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'polite';
            const announcer = createAnnouncer();
            announcer.setAttribute('aria-live', priority);
            // Limpiar contenido anterior
            announcer.textContent = '';
            // Usar setTimeout para asegurar que el lector de pantalla detecte el cambio
            setTimeout({
                "useAriaAnnouncements.useCallback[announce]": ()=>{
                    announcer.textContent = message;
                }
            }["useAriaAnnouncements.useCallback[announce]"], 100);
            // Limpiar después de un tiempo
            setTimeout({
                "useAriaAnnouncements.useCallback[announce]": ()=>{
                    announcer.textContent = '';
                }
            }["useAriaAnnouncements.useCallback[announce]"], 3000);
        }
    }["useAriaAnnouncements.useCallback[announce]"], [
        createAnnouncer
    ]);
    // Anunciar cambios de página/sección
    const announcePageChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAriaAnnouncements.useCallback[announcePageChange]": (pageName, description)=>{
            const message = description ? "Navegado a ".concat(pageName, ". ").concat(description) : "Navegado a ".concat(pageName);
            announce(message, 'polite');
        }
    }["useAriaAnnouncements.useCallback[announcePageChange]"], [
        announce
    ]);
    // Anunciar errores
    const announceError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAriaAnnouncements.useCallback[announceError]": (errorMessage)=>{
            announce("Error: ".concat(errorMessage), 'assertive');
        }
    }["useAriaAnnouncements.useCallback[announceError]"], [
        announce
    ]);
    // Anunciar acciones completadas
    const announceSuccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAriaAnnouncements.useCallback[announceSuccess]": (successMessage)=>{
            announce("Completado: ".concat(successMessage), 'polite');
        }
    }["useAriaAnnouncements.useCallback[announceSuccess]"], [
        announce
    ]);
    // Anunciar loading states
    const announceLoading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAriaAnnouncements.useCallback[announceLoading]": (action)=>{
            announce("Cargando ".concat(action, "..."), 'polite');
        }
    }["useAriaAnnouncements.useCallback[announceLoading]"], [
        announce
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAriaAnnouncements.useEffect": ()=>{
            createAnnouncer();
            return ({
                "useAriaAnnouncements.useEffect": ()=>{
                    if (announceElementRef.current) {
                        document.body.removeChild(announceElementRef.current);
                        announceElementRef.current = null;
                    }
                }
            })["useAriaAnnouncements.useEffect"];
        }
    }["useAriaAnnouncements.useEffect"], [
        createAnnouncer
    ]);
    return {
        announce,
        announcePageChange,
        announceError,
        announceSuccess,
        announceLoading
    };
}
_s1(useAriaAnnouncements, "l7C6jrJYU7ax27F0e3wK96k93A0=");
function useContrastValidation() {
    _s2();
    // Función para calcular la luminancia relativa
    const calculateLuminance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useContrastValidation.useCallback[calculateLuminance]": (r, g, b)=>{
            const [rs, gs, bs] = [
                r,
                g,
                b
            ].map({
                "useContrastValidation.useCallback[calculateLuminance]": (component)=>{
                    component /= 255;
                    return component <= 0.03928 ? component / 12.92 : Math.pow((component + 0.055) / 1.055, 2.4);
                }
            }["useContrastValidation.useCallback[calculateLuminance]"]);
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        }
    }["useContrastValidation.useCallback[calculateLuminance]"], []);
    // Función para calcular el ratio de contraste
    const calculateContrastRatio = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useContrastValidation.useCallback[calculateContrastRatio]": (color1, color2)=>{
            const lum1 = calculateLuminance(...color1);
            const lum2 = calculateLuminance(...color2);
            const lighter = Math.max(lum1, lum2);
            const darker = Math.min(lum1, lum2);
            return (lighter + 0.05) / (darker + 0.05);
        }
    }["useContrastValidation.useCallback[calculateContrastRatio]"], [
        calculateLuminance
    ]);
    // Convertir color hex a RGB
    const hexToRgb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useContrastValidation.useCallback[hexToRgb]": (hex)=>{
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : null;
        }
    }["useContrastValidation.useCallback[hexToRgb]"], []);
    // Validar si cumple WCAG AA (4.5:1) o AAA (7:1)
    const validateContrast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useContrastValidation.useCallback[validateContrast]": (foreground, background)=>{
            const fgRgb = hexToRgb(foreground);
            const bgRgb = hexToRgb(background);
            if (!fgRgb || !bgRgb) {
                return {
                    ratio: 0,
                    aa: false,
                    aaa: false,
                    error: 'Invalid color format'
                };
            }
            const ratio = calculateContrastRatio(fgRgb, bgRgb);
            return {
                ratio: Math.round(ratio * 100) / 100,
                aa: ratio >= 4.5,
                aaa: ratio >= 7,
                error: null
            };
        }
    }["useContrastValidation.useCallback[validateContrast]"], [
        hexToRgb,
        calculateContrastRatio
    ]);
    // Auditar contrastes en la página
    const auditPageContrast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useContrastValidation.useCallback[auditPageContrast]": ()=>{
            const results = [];
            const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, button, a, label');
            textElements.forEach({
                "useContrastValidation.useCallback[auditPageContrast]": (element)=>{
                    const computedStyle = window.getComputedStyle(element);
                    const color = computedStyle.color;
                    const backgroundColor = computedStyle.backgroundColor;
                    // Convertir colores RGB a hex para la validación
                    // Esta es una simplificación - en producción usaríamos una librería más robusta
                    if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                        // Simplificación para demo - en producción necesitaríamos parsing RGB más robusto
                        console.debug('Contrast check needed for:', element.tagName, color, backgroundColor);
                    }
                }
            }["useContrastValidation.useCallback[auditPageContrast]"]);
            return results;
        }
    }["useContrastValidation.useCallback[auditPageContrast]"], []);
    return {
        validateContrast,
        auditPageContrast,
        calculateContrastRatio,
        calculateLuminance
    };
}
_s2(useContrastValidation, "uvMveEIxHqDg1m1+qyFmMcttgxY=");
const __TURBOPACK__default__export__ = useKeyboardNavigation;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useEquipos.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEquipos",
    ()=>useEquipos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiService.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useEquipos() {
    _s();
    const [equipos, setEquipos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [paginacion, setPaginacion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        paginaActual: 1,
        totalPaginas: 1,
        totalRegistros: 0,
        hayAnterior: false,
        haySiguiente: false
    });
    const [equipoSeleccionado, setEquipoSeleccionado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [detallesEquipo, setDetallesEquipo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const cargarEquipos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEquipos.useCallback[cargarEquipos]": async ()=>{
            setLoading(true);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get('/api/equipos');
                if (response.success) {
                    const equiposData = Array.isArray(response.data) ? response.data : [];
                    setEquipos(equiposData);
                    // Actualizar paginación si viene en la respuesta
                    if (response.pagination) {
                        setPaginacion(response.pagination);
                    }
                }
            } catch (error) {
                console.error('Error cargando equipos:', error);
                setEquipos([]);
            } finally{
                setLoading(false);
            }
        }
    }["useEquipos.useCallback[cargarEquipos]"], []); // Sin dependencias para evitar re-creaciones
    const buscarEquipos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEquipos.useCallback[buscarEquipos]": async (filtros)=>{
            setLoading(true);
            try {
                // Construir parámetros de query para la API existente
                const params = new URLSearchParams();
                if (filtros.texto && filtros.texto.trim() !== '') {
                    params.append('busqueda', filtros.texto.trim());
                }
                // Para tipo de equipo y estatus, necesitamos convertir el ID al nombre
                // Ya que la API espera nombres, no IDs
                if (filtros.tipoEquipo && filtros.tipoEquipo !== '') {
                    // Si es un número (ID), necesitamos obtener el nombre del catálogo
                    // Por ahora, asumimos que se envía el nombre directamente desde el componente
                    params.append('tipoEquipo', filtros.tipoEquipo);
                }
                if (filtros.estatus && filtros.estatus !== '') {
                    params.append('estatus', filtros.estatus);
                }
                if (filtros.sucursal && filtros.sucursal !== '') {
                    params.append('sucursal', filtros.sucursal);
                }
                if (filtros.usuarioAsignado && filtros.usuarioAsignado !== '') {
                    params.append('usuario', filtros.usuarioAsignado);
                }
                const queryString = params.toString();
                const url = queryString ? "/api/equipos?".concat(queryString) : '/api/equipos';
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get(url);
                if (response.success) {
                    const equiposData = Array.isArray(response.data) ? response.data : [];
                    setEquipos(equiposData);
                    // La API existente no devuelve paginación, usar valores por defecto
                    setPaginacion({
                        paginaActual: 1,
                        totalPaginas: 1,
                        totalRegistros: equiposData.length,
                        hayAnterior: false,
                        haySiguiente: false
                    });
                    return equiposData; // Devolver los resultados directamente
                } else {
                    setEquipos([]);
                    return [];
                }
            } catch (error) {
                console.error('Error en búsqueda:', error);
                setEquipos([]);
                return [];
            } finally{
                setLoading(false);
            }
        }
    }["useEquipos.useCallback[buscarEquipos]"], []);
    const verDetallesEquipo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEquipos.useCallback[verDetallesEquipo]": async (noSerie)=>{
            setLoading(true);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get("/api/equipos/".concat(noSerie));
                if (response.success) {
                    setDetallesEquipo(response.data);
                    setEquipoSeleccionado(noSerie);
                }
            } catch (error) {
                console.error('Error cargando detalles:', error);
            } finally{
                setLoading(false);
            }
        }
    }["useEquipos.useCallback[verDetallesEquipo]"], []);
    const crearEquipo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEquipos.useCallback[crearEquipo]": async (datosEquipo)=>{
            setLoading(true);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].post('/api/equipos', datosEquipo);
                if (response.success) {
                    await cargarEquipos(); // Recargar lista
                    return {
                        success: true,
                        message: response.message
                    };
                }
                return {
                    success: false,
                    message: response.error || 'Error creando equipo'
                };
            } catch (error) {
                console.error('Error creando equipo:', error);
                return {
                    success: false,
                    message: 'Error de conexión'
                };
            } finally{
                setLoading(false);
            }
        }
    }["useEquipos.useCallback[crearEquipo]"], [
        cargarEquipos
    ]);
    const actualizarEquipo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEquipos.useCallback[actualizarEquipo]": async (noSerie, datosEquipo)=>{
            setLoading(true);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].put("/api/equipos/".concat(noSerie), datosEquipo);
                if (response.success) {
                    await cargarEquipos(); // Recargar lista
                    return {
                        success: true,
                        message: response.message
                    };
                }
                return {
                    success: false,
                    message: response.error || 'Error actualizando equipo'
                };
            } catch (error) {
                console.error('Error actualizando equipo:', error);
                return {
                    success: false,
                    message: 'Error de conexión'
                };
            } finally{
                setLoading(false);
            }
        }
    }["useEquipos.useCallback[actualizarEquipo]"], [
        cargarEquipos
    ]);
    const eliminarEquipo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useEquipos.useCallback[eliminarEquipo]": async (noSerie)=>{
            setLoading(true);
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].delete("/api/equipos/".concat(noSerie));
                if (response.success) {
                    await cargarEquipos(); // Recargar lista
                    return {
                        success: true,
                        message: response.message
                    };
                }
                return {
                    success: false,
                    message: response.error || 'Error eliminando equipo'
                };
            } catch (error) {
                console.error('Error eliminando equipo:', error);
                return {
                    success: false,
                    message: 'Error de conexión'
                };
            } finally{
                setLoading(false);
            }
        }
    }["useEquipos.useCallback[eliminarEquipo]"], [
        cargarEquipos
    ]);
    return {
        equipos,
        loading,
        paginacion,
        equipoSeleccionado,
        detallesEquipo,
        cargarEquipos,
        buscarEquipos,
        verDetallesEquipo,
        crearEquipo,
        actualizarEquipo,
        eliminarEquipo,
        setEquipoSeleccionado,
        setDetallesEquipo
    };
}
_s(useEquipos, "6FwouaFWDdt6+YdDGfphEH4X+Bc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useCatalogos.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCatalogos",
    ()=>useCatalogos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiService.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useCatalogos() {
    _s();
    const [tiposEquipo, setTiposEquipo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sucursales, setSucursales] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [usuarios, setUsuarios] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [estatusEquipo, setEstatusEquipo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cargarTiposEquipo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogos.useCallback[cargarTiposEquipo]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get('/api/catalogos?tipo=tiposequipo');
                if (response.success && Array.isArray(response.data)) {
                    setTiposEquipo(response.data);
                }
            } catch (error) {
                console.error('Error cargando tipos de equipo:', error);
                setTiposEquipo([]);
            }
        }
    }["useCatalogos.useCallback[cargarTiposEquipo]"], []);
    const cargarSucursales = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogos.useCallback[cargarSucursales]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get('/api/catalogos?tipo=sucursales');
                if (response.success && Array.isArray(response.data)) {
                    setSucursales(response.data);
                }
            } catch (error) {
                console.error('Error cargando sucursales:', error);
                setSucursales([]);
            }
        }
    }["useCatalogos.useCallback[cargarSucursales]"], []);
    const cargarUsuarios = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogos.useCallback[cargarUsuarios]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get('/api/catalogos?tipo=usuarios');
                if (response.success && Array.isArray(response.data)) {
                    setUsuarios(response.data);
                }
            } catch (error) {
                console.error('Error cargando usuarios:', error);
                setUsuarios([]);
            }
        }
    }["useCatalogos.useCallback[cargarUsuarios]"], []);
    const cargarEstatusEquipo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogos.useCallback[cargarEstatusEquipo]": async ()=>{
            try {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].get('/api/catalogos?tipo=estatus');
                if (response.success && Array.isArray(response.data)) {
                    setEstatusEquipo(response.data);
                }
            } catch (error) {
                console.error('Error cargando estatus:', error);
                setEstatusEquipo([]);
            }
        }
    }["useCatalogos.useCallback[cargarEstatusEquipo]"], []);
    const cargarTodosCatalogos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCatalogos.useCallback[cargarTodosCatalogos]": async ()=>{
            setLoading(true);
            try {
                console.log('🔄 Cargando catálogos...');
                await Promise.all([
                    cargarTiposEquipo(),
                    cargarSucursales(),
                    cargarUsuarios(),
                    cargarEstatusEquipo()
                ]);
                console.log('✅ Catálogos cargados correctamente');
            } catch (error) {
                console.error('❌ Error cargando catálogos:', error);
            } finally{
                setLoading(false);
            }
        }
    }["useCatalogos.useCallback[cargarTodosCatalogos]"], [
        cargarTiposEquipo,
        cargarSucursales,
        cargarUsuarios,
        cargarEstatusEquipo
    ]);
    // Cargar catálogos al montar el hook
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCatalogos.useEffect": ()=>{
            cargarTodosCatalogos();
        }
    }["useCatalogos.useEffect"], [
        cargarTodosCatalogos
    ]);
    return {
        tiposEquipo,
        sucursales,
        usuarios,
        estatusEquipo,
        loading,
        cargarTiposEquipo,
        cargarSucursales,
        cargarUsuarios,
        cargarEstatusEquipo,
        cargarTodosCatalogos
    };
}
_s(useCatalogos, "syLKFvZ8mlbwMIe/7/B3awRUDL0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/hapticFeedback.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Utilidades para feedback háptico en dispositivos móviles
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useHapticFeedback",
    ()=>useHapticFeedback
]);
// Hook de React para usar feedback háptico
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
class HapticFeedback {
    static isSupported() {
        return 'vibrate' in navigator || 'hapticActuators' in navigator;
    }
    static hasVibrationAPI() {
        return 'vibrate' in navigator;
    }
    static hasHapticAPI() {
        return 'hapticActuators' in navigator;
    }
    /**
   * Proporciona feedback háptico según el tipo especificado
   */ static trigger() {
        let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (!this.isSupported()) {
            console.debug('Haptic feedback not supported on this device');
            return;
        }
        const { type = 'light', pattern } = options;
        // Si se especifica un patrón personalizado
        if (pattern && this.hasVibrationAPI()) {
            navigator.vibrate(pattern);
            return;
        }
        // Feedback predefinido según el tipo
        const feedbackPatterns = {
            light: [
                10
            ],
            medium: [
                20
            ],
            heavy: [
                40
            ],
            selection: [
                5
            ],
            impact: [
                15,
                10,
                15
            ],
            notification: [
                10,
                50,
                10
            ]
        };
        if (this.hasVibrationAPI() && feedbackPatterns[type]) {
            navigator.vibrate(feedbackPatterns[type]);
        }
    }
    /**
   * Feedback para botones y elementos interactivos
   */ static buttonPress() {
        let intensity = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'light';
        this.trigger({
            type: intensity
        });
    }
    /**
   * Feedback para navegación entre tabs/páginas
   */ static navigationChange() {
        this.trigger({
            type: 'selection'
        });
    }
    /**
   * Feedback para acciones exitosas
   */ static success() {
        this.trigger({
            type: 'notification'
        });
    }
    /**
   * Feedback para errores
   */ static error() {
        this.trigger({
            pattern: [
                100,
                50,
                100
            ]
        });
    }
    /**
   * Feedback para swipe gestures
   */ static swipeDetected() {
        this.trigger({
            type: 'light'
        });
    }
    /**
   * Feedback para pull-to-refresh
   */ static pullRefresh() {
        this.trigger({
            type: 'medium'
        });
    }
    /**
   * Detiene todas las vibraciones
   */ static stop() {
        if (this.hasVibrationAPI()) {
            navigator.vibrate(0);
        }
    }
}
;
function useHapticFeedback() {
    _s();
    const triggerHaptic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[triggerHaptic]": function() {
            let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            HapticFeedback.trigger(options);
        }
    }["useHapticFeedback.useCallback[triggerHaptic]"], []);
    const buttonPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[buttonPress]": function() {
            let intensity = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 'light';
            HapticFeedback.buttonPress(intensity);
        }
    }["useHapticFeedback.useCallback[buttonPress]"], []);
    const navigationChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[navigationChange]": ()=>{
            HapticFeedback.navigationChange();
        }
    }["useHapticFeedback.useCallback[navigationChange]"], []);
    const success = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[success]": ()=>{
            HapticFeedback.success();
        }
    }["useHapticFeedback.useCallback[success]"], []);
    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[error]": ()=>{
            HapticFeedback.error();
        }
    }["useHapticFeedback.useCallback[error]"], []);
    const swipeDetected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[swipeDetected]": ()=>{
            HapticFeedback.swipeDetected();
        }
    }["useHapticFeedback.useCallback[swipeDetected]"], []);
    const pullRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[pullRefresh]": ()=>{
            HapticFeedback.pullRefresh();
        }
    }["useHapticFeedback.useCallback[pullRefresh]"], []);
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useHapticFeedback.useCallback[stop]": ()=>{
            HapticFeedback.stop();
        }
    }["useHapticFeedback.useCallback[stop]"], []);
    return {
        triggerHaptic,
        buttonPress,
        navigationChange,
        success,
        error,
        swipeDetected,
        pullRefresh,
        stop,
        isSupported: HapticFeedback.isSupported()
    };
}
_s(useHapticFeedback, "aqDNq4g8W2sGBoU7sCV+lMUBb/c=");
const __TURBOPACK__default__export__ = HapticFeedback;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoginScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/LoginScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Dashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$equipos$2f$EquiposManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/equipos/EquiposManager.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sucursales$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Sucursales.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Fallas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Fallas.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ToastNotification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ToastNotification.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SkeletonLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/SkeletonLoader.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
// Componente interno que usa el contexto
function AppContent() {
    _s();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const { toasts, removeToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ToastNotification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    // Si no está autenticado, mostrar login
    if (!state.isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LoginScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 21,
            columnNumber: 12
        }, this);
    }
    // Mostrar skeleton mientras carga
    if (state.isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gostcam-bg-primary",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "flex-1 p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$SkeletonLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageSkeleton"], {
                        type: "dashboard"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this);
    }
    // Renderizar contenido basado en la sección actual
    const renderContent = ()=>{
        switch(state.currentSection){
            case 'dashboard':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 40,
                    columnNumber: 16
                }, this);
            case 'equipos':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$equipos$2f$EquiposManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 42,
                    columnNumber: 16
                }, this);
            case 'sucursales':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sucursales$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 44,
                    columnNumber: 16
                }, this);
            case 'fallas':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Fallas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 46,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 48,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-gostcam-bg-primary",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1",
                        children: renderContent()
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ToastNotification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastContainer"], {
                toasts: toasts,
                onRemoveToast: removeToast
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(AppContent, "iL96h+iXCQuqXmIz42/EfuAdEFQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ToastNotification$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = AppContent;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContent, {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_c1 = Home;
var _c, _c1;
__turbopack_context__.k.register(_c, "AppContent");
__turbopack_context__.k.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_f3fbb1cc._.js.map