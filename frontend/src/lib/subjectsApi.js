// src/lib/subjectsApi.js
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { Accept: "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
  });
  const data = await res.json().catch(() => (Array.isArray(options.fallback) ? [] : {}));
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  return data;
}

async function getAll() {
  const data = await request("/subjects", { fallback: [] });
  return Array.isArray(data) ? data : [];
}

async function get(id) { return request(`/subjects/${id}`); }
async function create(body) {
  return request("/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
async function remove(id) { await request(`/subjects/${id}`, { method: "DELETE" }); return true; }

export default {
  getAll,
  // get,
  // create,
  // remove,
};
