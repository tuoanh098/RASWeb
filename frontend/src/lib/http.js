// lib/http.js
const DEV = import.meta.env?.DEV;
const ENV_BASE = (import.meta.env?.VITE_API_BASE || "").replace(/\/+$/, "");
export const API_BASE = DEV ? "" : ENV_BASE;

export function qs(obj = {}) {
  const pairs = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "undefined")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return pairs.length ? `?${pairs.join("&")}` : "";
}

export async function req(method, url, body) {
  const opt = { method, headers: { "Content-Type": "application/json" } };
  if (body != null) opt.body = JSON.stringify(body);
  const res = await fetch(API_BASE + url, opt);
  if (!res.ok) {
    let text = "";
    try { text = await res.text(); } catch {}
    try { text = JSON.parse(text); } catch {}
    throw new Error(typeof text === "string" && text ? text : JSON.stringify(text || { status: res.status }));
  }
  return res.status === 204 ? null : await res.json();
}
