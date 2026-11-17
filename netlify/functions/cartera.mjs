import { getStore } from "@netlify/blobs";

const CODE = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req) => {
  const url = new URL(req.url);
  if (url.searchParams.get("ping")) return json({ ok: true });
  const code = (url.searchParams.get("code") || "").toUpperCase();
  if (!CODE.test(code)) return json({ error: "código inválido" }, 400);
  const store = getStore("carteras");

  if (req.method === "GET") {
    const state = await store.get(code, { type: "json" });
    return state ? json({ state }) : json({ error: "no existe" }, 404);
  }
  if (req.method === "PUT") {
    const text = await req.text();
    if (text.length > 400000) return json({ error: "demasiado grande" }, 413);
    let st;
    try { st = JSON.parse(text); } catch { return json({ error: "json inválido" }, 400); }
    if (!st || st.code !== code || !Array.isArray(st.orders)) return json({ error: "estado inválido" }, 400);
    const prev = await store.get(code, { type: "json" });
    if (prev && prev.updated > st.updated) return json({ state: prev, stale: true }, 409);
    await store.setJSON(code, st);
    return json({ ok: true });
  }
  return json({ error: "método no permitido" }, 405);
};

export const config = { path: "/api/cartera" };
