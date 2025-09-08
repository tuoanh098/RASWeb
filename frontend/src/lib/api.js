// frontend/src/lib/api.js
const DEV =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.DEV;

const VITE_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  null;

const DEFAULT_DEV_BASE =
  typeof window !== "undefined" &&
  window.location &&
  window.location.port === "5173"
    ? "http://localhost:8080"
    : "";

// Base URL cho mọi API call
export const API_BASE = VITE_BASE ?? (DEV ? DEFAULT_DEV_BASE : "");

export function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) =>
      v !== undefined && v !== null && v !== "" && v !== "undefined"
  );
  const qs = new URLSearchParams(entries).toString();
  return qs ? `?${qs}` : "";
}

// --- fetch helpers ---
async function get(path, params) {
  const res = await fetch(API_BASE + path + buildQuery(params), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const _txt = await res.text();
    console.error("BAD_RESPONSE_200", _txt);
    throw new Error("BAD_RESPONSE_200: Response is not JSON");
  }
  return res.json();
}

async function post(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  const ct = res.headers.get("content-type") || "";
  const payload =
    ct.includes("application/json")
      ? await res.json().catch(() => ({}))
      : {};
  if (!res.ok) {
    const msg =
      (payload && (payload.message || payload.error)) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return payload;
}

async function del(path, params) {
  const res = await fetch(API_BASE + path + buildQuery(params), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json")
    ? res.json().catch(() => ({}))
    : {};
}

// Unwrap nếu backend trả { success, data }
export const unwrap = (body) =>
  body && Object.prototype.hasOwnProperty.call(body, "data")
    ? body.data
    : body;

// Ensure array an toàn
export const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// --- chuẩn hóa page: input có thể là array, {items,...} hoặc Spring Page {content,...}
function normalizePage(payload, mapItem) {
  const map = (arr) => (mapItem ? arr.map(mapItem) : arr);

  // TH: payload là mảng
  if (Array.isArray(payload)) {
    const items = map(payload);
    return {
      items,
      page: 0,
      size: items.length,
      totalElements: items.length,
      totalPages: 1,
    };
  }

  if (!payload || typeof payload !== "object") {
    return { items: [], page: 0, size: 0, totalElements: 0, totalPages: 1 };
  }

  // TH: Spring Page
  if (Array.isArray(payload.content)) {
    const items = map(payload.content);
    return {
      items,
      page: Number.isFinite(payload.number) ? payload.number : 0,
      size: Number.isFinite(payload.size) ? payload.size : items.length,
      totalElements: Number.isFinite(payload.totalElements)
        ? payload.totalElements
        : items.length,
      totalPages: Number.isFinite(payload.totalPages)
        ? payload.totalPages
        : 1,
    };
  }

  // TH: {items, ...}
  if (Array.isArray(payload.items)) {
    const items = map(payload.items);
    return {
      items,
      page: Number.isFinite(payload.page) ? payload.page : 0,
      size: Number.isFinite(payload.size) ? payload.size : items.length,
      totalElements: Number.isFinite(payload.totalElements)
        ? payload.totalElements
        : items.length,
      totalPages: Number.isFinite(payload.totalPages)
        ? payload.totalPages
        : 1,
    };
  }

  // TH: {list, ...}
  if (Array.isArray(payload.list)) {
    const items = map(payload.list);
    return {
      items,
      page: Number.isFinite(payload.page) ? payload.page : 0,
      size: Number.isFinite(payload.size) ? payload.size : items.length,
      totalElements: Number.isFinite(payload.total) ? payload.total : items.length,
      totalPages: Number.isFinite(payload.pages) ? payload.pages : 1,
    };
  }

  // Fallback
  return { items: [], page: 0, size: 0, totalElements: 0, totalPages: 1 };
}

// --- mappers để khớp field Staff.jsx đang dùng ---
function mapTeacherItem(o = {}) {
  return {
    id: o.id ?? o.giao_vien_id ?? o.teacher_id ?? null,
    hoTen: o.hoTen ?? o.ho_ten ?? o.ten_giao_vien ?? o.name ?? "",
    soDienThoai: o.soDienThoai ?? o.so_dien_thoai ?? o.phone ?? "",
    email: o.email ?? "",
    chuyenMon: o.chuyenMon ?? o.chuyen_mon ?? o.specialty ?? "",
    soLopDangDay: o.soLopDangDay ?? o.so_lop_dang_day ?? o.class_count ?? 0,
  };
}

function mapEmployeeItem(o = {}) {
  return {
    id: o.id ?? o.nhan_vien_id ?? null,
    hoTen: o.hoTen ?? o.ho_ten ?? o.ten_nhan_vien ?? "",
    soDienThoai: o.soDienThoai ?? o.so_dien_thoai ?? o.phone ?? "",
    email: o.email ?? "",
    chucVu: o.chucVu ?? o.chuc_vu ?? o.chuc_danh ?? o.role ?? "",
    chuc_danh: o.chuc_danh ?? o.chucVu ?? o.chuc_vu ?? o.role ?? "",
  };
}

export const Api = {
  __get: get,
  __post: post,
  __del: del,

  // --- Students ---
  students: {
    async list({ page = 0, size = 10, branchId, q } = {}) {
      return unwrap(await get("/api/students", { page, size, branchId, q }));
    },
    async search({ q = "", limit = 10 } = {}) {
      const data = await get("/api/hoc-vien/search", { q, limit });
      return unwrap(data) ?? [];
    },
  },

  // --- Classes (keys VN: {id, ten_lop, chi_nhanh_id}) ---
  classes: {
    async list({ page = 0, size = 100, branchId, q } = {}) {
      return unwrap(await get("/api/classes", { page, size, branchId, q }));
    },
  },

  // --- Teachers ---
  teachers: {
    async list({ page = 0, size = 100, q } = {}) {
      return unwrap(await get("/api/teachers", { page, size, q }));
    },
    async search({ kw = "", page = 0, size = 10 } = {}) {
      const raw = unwrap(await get("/api/teachers", { q: kw, page, size }));
      return normalizePage(raw, mapTeacherItem);
    },
  },

  // --- Employees / Staff ---
  employees: {
    async search({ kw = "", page = 0, size = 10 } = {}) {
      const raw = unwrap(await get("/api/employees", { q: kw, page, size }));
      return normalizePage(raw, mapEmployeeItem);
    },
  },

  // --- Rooms theo chi nhánh ({id, ten}) ---
  rooms: {
    async byBranch(chi_nhanh_id) {
      if (!chi_nhanh_id) return [];
      const data = await get("/api/phong-hoc", { chi_nhanh_id });
      return unwrap(data) ?? [];
    },
  },

  // --- Lessons ---
  lessons: {
    async week({ start }) {
      const data = await get("/api/lessons/week", { start });
      return unwrap(data) ?? [];
    },
    async batch({ items }) {
      return await post("/api/buoi-hoc/batch", { items: items ?? [] });
    },
    async removeOne(id) {
      return await del(`/api/lessons/${id}`);
    },
    async removeRecurring({ group_id, from }) {
      return await del(`/api/lessons/recurring`, { group_id, from });
    },
  },

  // --- Attendance (điểm danh) ---
  // Backend hiện dùng base path: /api/attendances (số nhiều)
  // GET:  /api/attendances?type=teacher&weekStart=YYYY-MM-DD&branchId=&q=
  // POST: /api/attendances  { type, weekStart, items:[{id,codes:[]}] }
  attendance: {
    async load({ type = "teacher", weekStart, branchId, q } = {}) {
      const body = await get("/api/attendances", {
        type,
        weekStart,
        branchId,
        q,
      });
      // Hỗ trợ mọi kiểu bọc: {success,data} | {items} | {list} | array thuần
      const payload = unwrap(body);
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.items)) return payload.items;
      if (Array.isArray(payload?.list)) return payload.list;
      return []; // fallback an toàn
    },
    async save({ type = "teacher", weekStart, items } = {}) {
      return await post("/api/attendances", { type, weekStart, items });
    },
  },

  // --- Views (array, bọc trong {success,data}) ---
  views: {
    async todayLessons(branchId) {
      return unwrap(await get("/api/views/today-lessons", { branchId }));
    },
    async staffDutyToday(branchId) {
      return unwrap(await get("/api/views/staff-duty-today", { branchId }));
    },
  },
};

export const apiSearchTeachers = (args) => Api.teachers.search(args);