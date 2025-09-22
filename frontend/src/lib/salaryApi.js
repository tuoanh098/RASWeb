// src/lib/salaryApi.js
import { req } from "./http.js";

export const SalaryApi = {
  periods: {
    list: () => req("GET", "/api/payroll/periods"),
    create: (yyyyMM) => req("POST", "/api/payroll/periods", { thang_ky: yyyyMM }),
  },

  list: (kyLuongId) =>
    req("GET", `/api/payroll/salaries?ky_luong_id=${encodeURIComponent(kyLuongId)}`),

  salaries: {
    /**
     * Cập nhật các khoản tổng cho 1 nhân viên trong kỳ lương.
     * Tự thử theo nhiều “phương án” để khớp controller hiện tại:
     *  - PATCH/PUT/POST + query (?ky_luong_id=&nhan_vien_id=)
     *  - PATCH/PUT/POST + body ({ky_luong_id, nhan_vien_id, ...})
     *  - POST /api/payroll/salaries/update (một số controller đặt route riêng)
     */
    update: async (p) => {
      const ky = Number(p.ky_luong_id);
      const nv = Number(p.nhan_vien_id);
      if (!ky || !nv) throw new Error("Thiếu ky_luong_id / nhan_vien_id");

      const body = {
        luong_cung: Number(p.luong_cung ?? 0),
        tong_hoa_hong: Number(p.tong_hoa_hong ?? 0),
        tong_thuong: Number(p.tong_thuong ?? 0),
        tong_truc: Number(p.tong_truc ?? 0),
        tong_phu_cap_khac: Number(p.tong_phu_cap_khac ?? 0),
        tong_phat: Number(p.tong_phat ?? 0),
      };

      const attempts = [
        // 1) query-string
        { method: "PATCH", url: `/api/payroll/salaries?ky_luong_id=${ky}&nhan_vien_id=${nv}`, data: body },
        { method: "PUT",   url: `/api/payroll/salaries?ky_luong_id=${ky}&nhan_vien_id=${nv}`, data: body },
        { method: "POST",  url: `/api/payroll/salaries?ky_luong_id=${ky}&nhan_vien_id=${nv}`, data: body },

        // 2) ids trong body
        { method: "PATCH", url: `/api/payroll/salaries`, data: { ...body, ky_luong_id: ky, nhan_vien_id: nv } },
        { method: "PUT",   url: `/api/payroll/salaries`, data: { ...body, ky_luong_id: ky, nhan_vien_id: nv } },
        { method: "POST",  url: `/api/payroll/salaries`, data: { ...body, ky_luong_id: ky, nhan_vien_id: nv } },

        // 3) route /update
        { method: "POST",  url: `/api/payroll/salaries/update`, data: { ...body, ky_luong_id: ky, nhan_vien_id: nv } },
      ];

      let lastErr;
      for (const a of attempts) {
        try {
          return await req(a.method, a.url, a.data);
        } catch (e) {
          lastErr = e;
          // tiếp tục thử phương án tiếp theo
        }
      }
      throw lastErr || new Error("Không gọi được API cập nhật bảng lương.");
    },
  },

  commissions: {
    list: (kyLuongId, nhanVienId) =>
      req(
        "GET",
        `/api/payroll/commissions?ky_luong_id=${encodeURIComponent(
          kyLuongId
        )}&nhan_vien_id=${encodeURIComponent(nhanVienId)}`
      ),
    upsert: (body) => req("POST", "/api/payroll/commissions", body),
    remove: (id) => req("DELETE", `/api/payroll/commissions/${id}`),
    updatePercent: (id, percent, recalc = false) =>
      req(
        "PATCH",
        `/api/payroll/commissions/${id}/percent?value=${encodeURIComponent(
          percent
        )}&recalc=${recalc ? "true" : "false"}`
      ),
  },
};

export default SalaryApi;
