// Genera data/snapshot.json con el último cierre del Tablero (respaldo si el tablero está caído).
// Uso (Node 18+): node scripts/snapshot.mjs
import { writeFileSync, readFileSync } from "node:fs";
const T = "https://tablero.bymaeduca.com.ar";
const src = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const m = src.match(/\/\* ===== MERCADO[\s\S]*?(?=\/\* ===== UTILIDADES)/);
const run = new Function(m[0] + "; return loadMarketLive;");
const live = run();
const mkt = await live();
delete mkt.map;
writeFileSync(new URL("../data/snapshot.json", import.meta.url), JSON.stringify(mkt));
console.log("snapshot del", mkt.date, "con", mkt.items.length, "instrumentos");
