// Dùng chung req/qs từ http.js (không sửa http.js)
import { req, qs } from "./http.js";

const BASE = "/api/employees";

const EmployeesApi = {
  list: (params = {}) => req("GET", `${BASE}${qs({
    page: params.page,
    size: params.size,
    q: params.q,
    role: params.role,
  })}`),

  get: (id) => req("GET", `${BASE}/${id}`),

  create: (payload) => req("POST", BASE, payload),

  update: (id, payload) => req("PUT", `${BASE}/${id}`, payload),

  delete: (id) => req("DELETE", `${BASE}/${id}`),

  // Upload avatar (multipart) — req() hỗ trợ FormData, KHÔNG set Content-Type thủ công
  uploadAvatar: (id, file) => {
    const form = new FormData();
    form.append("file", file);
    return req("POST", `${BASE}/${id}/avatar`, form);
  },
};

export default EmployeesApi;
