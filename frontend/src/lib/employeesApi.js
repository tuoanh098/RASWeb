const BASE = '/api/employees';

async function http(method, url, body, headers = {}) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || res.statusText);
  }
  return res.status !== 204 ? res.json() : null;
}

const EmployeesApi = {
  list: (params={}) => {
    const q = new URLSearchParams();
    if (params.page != null) q.set('page', params.page);
    if (params.size != null) q.set('size', params.size);
    if (params.q) q.set('q', params.q);
    if (params.role) q.set('role', params.role);
    return http('GET', `${BASE}?${q.toString()}`);
  },
  get: (id) => http('GET', `${BASE}/${id}`),
  create: (payload) => http('POST', BASE, payload),
  update: (id, payload) => http('PUT', `${BASE}/${id}`, payload),
  delete: (id) => http('DELETE', `${BASE}/${id}`),

  // NEW: upload avatar (multipart). Backend handle at POST /api/employees/{id}/avatar
  uploadAvatar: async (id, file) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/${id}/avatar`, {
      method: 'POST',
      body: form,
      // IMPORTANT: *không* tự set Content-Type khi dùng FormData
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || res.statusText);
    }
    return res.json(); // giả sử server trả { avatar_url: "..." }
  },
};

export default EmployeesApi;
