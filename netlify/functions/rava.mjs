// Precios del día (demorados) leídos del servicio público de Rava Mercado.
// Devuelve instrumentos en pesos (ARS) y en dólares MEP (USD), con las puntas (mejor compra y venta),
// eligiendo el plazo más líquido (48hs > 24hs > CI).
const SRC = "https://mercado.rava.com/api/prices/arg";
const ORDER = [2, 1, 0];
let cache = null;

const resp = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=60",
      "netlify-cdn-cache-control": "public, max-age=90, stale-while-revalidate=300",
    },
  });
const num = (x) => { const n = Number(x); return Number.isFinite(n) ? n : 0; };

export default async () => {
  if (cache && Date.now() - cache.t < 90000) return resp(cache.body);
  try {
    const r = await fetch(SRC, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; SimuladorEducativo/1.0)",
        accept: "application/json",
        origin: "https://mercado.rava.com",
        referer: "https://mercado.rava.com/acciones-argentinas",
      },
    });
    if (!r.ok) throw new Error("http " + r.status);
    const j = await r.json();
    const best = {};
    for (const x of j.datos || []) {
      if ((x.moneda !== "ARS" && x.moneda !== "USD") || !x.simbolo) continue;
      const u = num(x.ultimo);
      if (!(u > 0)) continue;
      const rank = ORDER.indexOf(x.plazo);
      if (rank < 0) continue;
      const cur = best[x.simbolo];
      if (cur && cur.rank <= rank) continue;
      best[x.simbolo] = {
        rank, c: x.moneda, pc: num(x.preciocompra), qc: num(x.cantcompra), pv: num(x.precioventa), qv: num(x.cantventa), u, a: num(x.anterior), ap: num(x.apertura), mx: num(x.maximo), mn: num(x.minimo),
        v: num(x.variacion), nom: num(x.volnominal), vol: num(x.volefectivo), ops: num(x.operaciones),
        f: String(x.fecha).slice(0, 10), h: x.hora || "",
      };
    }
    for (const k in best) delete best[k].rank;
    const body = { t: Date.now(), n: Object.keys(best).length, delayed: true, items: best };
    cache = { t: Date.now(), body };
    return resp(body);
  } catch (e) {
    if (cache) return resp(cache.body);
    return resp({ error: String(e && e.message || e) }, 502);
  }
};

export const config = { path: "/api/rava" };
