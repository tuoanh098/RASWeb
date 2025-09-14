// lib/studentsApi.js
import { req, qs } from "./http.js";

const StudentsApi = {
  list({ page = 0, size = 10, q, branchId } = {}) {
    return req("GET", `/api/students${qs({ page, size, q, branchId })}`);
  },
  get(id) {
    if (id == null) throw new Error("Thiếu ID học viên");
    return req("GET", `/api/students/${id}`);
  },
  create(payload) {
    return req("POST", `/api/students`, payload);
  },
  update(id, payload) {
    if (id == null) throw new Error("Thiếu ID học viên để cập nhật");
    return req("PUT", `/api/students/${id}`, payload);
  },
  delete(id) {
    if (id == null) throw new Error("Thiếu ID học viên để xoá");
    return req("DELETE", `/api/students/${id}`);
  },
};
export default StudentsApi;
