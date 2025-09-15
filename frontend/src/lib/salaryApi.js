// src/lib/salaryApi.js
import { req, qs } from "./http.js"; // <-- dùng named exports từ http.js

export const SalaryApi = {
  list: (ky_luong_id) => req("GET", `/api/salary${qs({ ky_luong_id })}`),
  total: (ky_luong_id) => req("GET", `/api/salary/total${qs({ ky_luong_id })}`),

  commissions: {
    list: (ky_luong_id, nhan_vien_id) => req("GET", `/api/commissions${qs({ ky_luong_id, nhan_vien_id })}`),
    upsert: (body) => req("POST", `/api/commissions`, body),
    remove: (id, ky_luong_id, nhan_vien_id) => req("DELETE", `/api/commissions/${id}${qs({ ky_luong_id, nhan_vien_id })}`),
  },

  bonuses: {
    tiers: {
      list: (ky_luong_id, nhan_vien_id) => req("GET", `/api/bonuses/tiers${qs({ ky_luong_id, nhan_vien_id })}`),
      upsert: (body) => req("POST", `/api/bonuses/tiers`, body),
      remove: (id, ky_luong_id, nhan_vien_id) => req("DELETE", `/api/bonuses/tiers/${id}${qs({ ky_luong_id, nhan_vien_id })}`),
    },
    others: {
      list: (ky_luong_id, nhan_vien_id) => req("GET", `/api/bonuses/others${qs({ ky_luong_id, nhan_vien_id })}`),
      upsert: (body) => req("POST", `/api/bonuses/others`, body),
      remove: (id, ky_luong_id, nhan_vien_id) => req("DELETE", `/api/bonuses/others/${id}${qs({ ky_luong_id, nhan_vien_id })}`),
    },
  },

  shifts: {
    list: (ky_luong_id, nhan_vien_id) => req("GET", `/api/shifts${qs({ ky_luong_id, nhan_vien_id })}`),
    upsert: (body) => req("POST", `/api/shifts`, body),
    remove: (id, ky_luong_id, nhan_vien_id) => req("DELETE", `/api/shifts/${id}${qs({ ky_luong_id, nhan_vien_id })}`),
  },

  allowances: {
    list: (ky_luong_id, nhan_vien_id) => req("GET", `/api/allowances${qs({ ky_luong_id, nhan_vien_id })}`),
    upsert: (body) => req("POST", `/api/allowances`, body),
    remove: (id, ky_luong_id, nhan_vien_id) => req("DELETE", `/api/allowances/${id}${qs({ ky_luong_id, nhan_vien_id })}`),
  },

  deductions: {
    list: (ky_luong_id, nhan_vien_id) => req("GET", `/api/deductions${qs({ ky_luong_id, nhan_vien_id })}`),
    upsert: (body) => req("POST", `/api/deductions`, body),
    remove: (id, ky_luong_id, nhan_vien_id) => req("DELETE", `/api/deductions/${id}${qs({ ky_luong_id, nhan_vien_id })}`),
  },
};
