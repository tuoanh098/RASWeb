const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function httpGet(url, params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => (v ?? v === 0) && usp.append(k, v));
  const res = await fetch(`${API_BASE}/courses${url}?${usp.toString()}`, { headers: { Accept: "application/json" }, credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  return data;
}

async function httpSend(method, url, body) {
  const res = await fetch(`${API_BASE}/courses${url}`, {
    method, credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  return data;
}

const CoursesApi = {
  async search({ q, mon_hoc_id, loai_lop, page = 0, size = 50, sort } = {}) {
    const resp = await httpGet("", { q, mon_hoc_id, loai_lop, page, size, sort });
    return Array.isArray(resp) ? resp : (resp?.items || []); // <- luôn trả mảng
  },
  get: (id) => httpGet(`/${id}`),
  create: (body) => httpSend("POST", "", body),
  update: (id, body) => httpSend("PUT", `/${id}`, body),
  remove: (id) => httpSend("DELETE", `/${id}`),
};
export default CoursesApi;
