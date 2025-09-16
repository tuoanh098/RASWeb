// src/lib/signupsApi.js
import { req, qs } from "./http.js";

const SignupsApi = {
  create: (payload) => req("POST", "/api/signups/signup", payload),

  listByStudent: (hocVienId) =>
    req("GET", `/api/signups/student/${Number(hocVienId)}`),

  summary: (yyyyMM) =>
    req("GET", `/api/signups/summary${qs({ yyyyMM })}`),
};

export default SignupsApi;
