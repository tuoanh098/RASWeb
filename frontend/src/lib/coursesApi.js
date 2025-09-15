// src/lib/coursesApi.js
import { req, qs } from "./http.js";

const base = "/api/courses";

const CoursesApi = {
  search: (params = {}) => req("GET", `${base}${qs(params)}`),
  get: (id) => req("GET", `${base}/${id}`),
  create: (body) => req("POST", base, body),
  update: (id, body) => req("PUT", `${base}/${id}`, body),
  remove: (id) => req("DELETE", `${base}/${id}`),

  // tùy chọn
  pricing: (id, chi_nhanh_id) => req("GET", `${base}/${id}/pricing${qs({ chi_nhanh_id })}`),
};

export default CoursesApi;
