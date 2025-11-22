# 📝 ARCHIVOS MOVIDOS TEMPORALMENTE

## 🎯 PROPÓSITO
Estos archivos fueron movidos aquí temporalmente para resolver errores de ESLint que impedían el build en producción.

## 📁 ARCHIVOS INCLUIDOS

### `route_broken.ts`
- **Origen**: `src/app/api/equipos/route_broken.ts`
- **Motivo**: Errores de parsing de sintaxis
- **Estado**: Pendiente de corrección
- **Acción**: Revisar sintaxis y mover de vuelta cuando esté corregido

### `optimized.ts` 
- **Origen**: `src/types/optimized.ts`
- **Motivo**: Errores de parsing de sintaxis
- **Estado**: Pendiente de revisión
- **Acción**: Validar tipos y exportaciones

## 🛠️ CÓMO RESTAURAR

1. **Corregir errores de sintaxis en los archivos**
2. **Validar que no hay tipos duplicados o conflictos**
3. **Probar build local**: `npm run build`
4. **Mover archivos de vuelta a su ubicación original**
5. **Quitar de .eslintignore si ya no es necesario**

## 📅 CREADO
- Fecha: 2025-11-22
- Build que falló: Error ESLint en Vercel
- Solución temporal: Mover archivos + eslint.ignoreDuringBuilds
