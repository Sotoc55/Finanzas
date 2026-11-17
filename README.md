# Simulador de inversiones (BYMA)

Plataforma para simular compra y venta de acciones, CEDEARs, ETF, bonos, letras y ONs con dinero virtual.
Lee los precios de cierre del **Tablero BYMA Educa** (https://tablero.bymaeduca.com.ar) directamente desde el navegador de cada alumno.

## Qué hace
- Paneles de cotizaciones por tipo de instrumento, con buscador y orden por columnas.
- Panel de cada instrumento: apertura, mínimo, máximo, volumen, gráfico de cierres (acciones/CEDEARs/ETF) o TIR, duration, paridad, cupón y flujos (bonos, letras y ONs).
- Órdenes de compra y venta, a mercado o limitadas, con comisión (editable, 0,5 % por defecto) y derechos de mercado (0,08 %).
- Tenencia con precio promedio de compra, valuación al último cierre y resultado en $ y %.
- Cuenta con **código personal**: el alumno vuelve días después con su código y ve su cartera valuada al cierre más nuevo.

## Cómo se ejecutan las órdenes
- Orden a mercado: se ejecuta al instante al último cierre.
- Orden limitada: se ejecuta si el último cierre alcanza el precio (compra: igual o menor; venta: igual o mayor). Si no, queda pendiente y se evalúa en cada ingreso con datos de un cierre posterior.
- No hay ventas en corto ni apalancamiento. Todo opera en pesos.

## Publicarlo (Netlify, recomendado)
Hace falta Netlify porque guarda las carteras por código (Netlify Functions + Blobs).
1. Subí esta carpeta a un repositorio de GitHub (o usá Netlify CLI: `npm i -g netlify-cli`, luego `netlify deploy --prod`).
2. En Netlify: *Add new site → Import from Git* y elegí el repo. No requiere configuración (`netlify.toml` ya está).
3. Listo: la URL pública es el simulador. Los alumnos crean su cuenta y reciben el código.

## GitHub Pages (solo estático)
Funciona sin sincronización en la nube: la cartera queda guardada en el navegador de cada alumno, con botón "Descargar respaldo" para llevarla a otro equipo.

## Respaldo si el Tablero está caído
El simulador guarda en el navegador el último mercado leído. Para tener además un respaldo propio:
`node scripts/snapshot.mjs` (Node 18+, con internet) genera `data/snapshot.json`; subilo al sitio y se usa solo si el Tablero no responde.

## Notas
- Los precios son de cierre (el tablero se actualiza una vez por rueda).
- El código personal es el único dato de acceso: no hay contraseña. No guardar datos sensibles.
- Probado con datos de prueba; la estructura de datos reales del Tablero se verificó contra el sitio al 16/11/2026.
