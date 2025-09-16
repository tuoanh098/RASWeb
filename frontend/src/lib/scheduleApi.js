// src/lib/scheduleApi.js
import { req, qs } from "./http.js";

const ScheduleApi = {
  list({ branchId, weekStart }) {
    return req("GET", `/api/xep-lop${qs({ branchId, weekStart })}`);
  },
  create(payload) {
    return req("POST", `/api/xep-lop`, payload);
  },
};

export default ScheduleApi;
